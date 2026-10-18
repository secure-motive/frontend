/**
 * Server-Side Rate Limiter for SecureXmotive
 *
 * Implements persistent, Vercel serverless-compatible rate limiting.
 * Supports:
 * 1. Upstash Redis REST API (when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set)
 * 2. In-memory sliding window store with automatic expiration and LRU cleanup (bounded size)
 *
 * Enforces limits per client IP behind Vercel/edge proxies.
 */
import net from 'node:net'

export interface RateLimitConfig {
  max: number
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfterSeconds: number
}

// Default limits matching security audit requirements
export const RATE_LIMIT_CONFIGS = {
  uploadUrl: {
    max: Number(process.env.RATE_LIMIT_UPLOAD_URL_MAX) || 5,
    windowMs: Number(process.env.RATE_LIMIT_UPLOAD_URL_WINDOW_MS) || 15 * 60 * 1000, // 15 mins
  },
  careerApplication: {
    max: Number(process.env.RATE_LIMIT_APPLICATION_MAX) || 3,
    windowMs: Number(process.env.RATE_LIMIT_APPLICATION_WINDOW_MS) || 60 * 60 * 1000, // 1 hour
  },
  contactSubmission: {
    max: Number(process.env.RATE_LIMIT_CONTACT_MAX) || 5,
    windowMs: Number(process.env.RATE_LIMIT_CONTACT_WINDOW_MS) || 60 * 60 * 1000, // 1 hour
  },
} as const

/**
 * In-memory sliding window store with bounded entries to prevent memory exhaustion.
 */
interface MemoryWindowRecord {
  timestamps: number[]
  lastUpdated: number
}

const memoryStore = new Map<string, MemoryWindowRecord>()
const MAX_MEMORY_KEYS = 5000 // Upper bound to prevent unbounded growth

/**
 * Periodically or lazily evict expired entries from memory store.
 */
function pruneExpiredEntries(now: number, maxAgeMs: number = 3600000): void {
  if (memoryStore.size > MAX_MEMORY_KEYS) {
    for (const [key, record] of memoryStore.entries()) {
      if (now - record.lastUpdated > maxAgeMs) {
        memoryStore.delete(key)
      }
    }
    // If still oversized, drop oldest 1000
    if (memoryStore.size > MAX_MEMORY_KEYS) {
      const keysToDelete = Array.from(memoryStore.keys()).slice(0, 1000)
      for (const k of keysToDelete) {
        memoryStore.delete(k)
      }
    }
  }
}

/**
 * Extracts the real client IP from request headers using trusted proxy rules.
 * Handles Vercel edge proxies, Cloudflare, and RFC 7239 Forwarded headers.
 */
export function getClientIp(req: any): string {
  if (!req || !req.headers) return '127.0.0.1'

  // 1. Vercel trusted proxy headers
  const vercelForwarded = req.headers['x-vercel-forwarded-for']
  if (typeof vercelForwarded === 'string' && vercelForwarded.trim()) {
    const parts = vercelForwarded.split(',')
    const candidate = parts[0]?.trim() || ''
    if (candidate && isValidIp(candidate)) return cleanIp(candidate)
  }

  // 2. Real-IP header from trusted edge proxy
  const realIp = req.headers['x-real-ip']
  if (typeof realIp === 'string' && realIp.trim()) {
    const candidate = realIp.trim()
    if (candidate && isValidIp(candidate)) return cleanIp(candidate)
  }

  // 3. Standard X-Forwarded-For: Client IP is the leftmost entry
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    const parts = forwarded.split(',')
    const candidate = parts[0]?.trim() || ''
    if (candidate && isValidIp(candidate)) return cleanIp(candidate)
  }

  // 4. Fallback to socket remote address
  const remoteAddress = req.socket?.remoteAddress || req.connection?.remoteAddress
  if (typeof remoteAddress === 'string' && isValidIp(remoteAddress)) {
    return cleanIp(remoteAddress)
  }

  return '127.0.0.1'
}

function isValidIp(ip: string): boolean {
  const cleaned = cleanIp(ip)
  return net.isIP(cleaned) !== 0
}

function cleanIp(ip: string): string {
  // Strip IPv4-mapped IPv6 prefix (e.g. ::ffff:192.0.2.1)
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7)
  }
  return ip.trim()
}

/**
 * Check rate limit for a given key (IP + action).
 */
export async function checkRateLimit(
  action: 'uploadUrl' | 'careerApplication' | 'contactSubmission' | string,
  clientIp: string,
  customConfig?: RateLimitConfig,
): Promise<RateLimitResult> {
  const config =
    customConfig ||
    (RATE_LIMIT_CONFIGS as Record<string, RateLimitConfig>)[action] || {
      max: 10,
      windowMs: 60 * 1000,
    }

  const rateLimitKey = `ratelimit:${action}:${clientIp}`
  const now = Date.now()

  // 1. If Upstash Redis is configured, use atomic REST API
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (upstashUrl && upstashToken) {
    try {
      return await checkUpstashRateLimit(upstashUrl, upstashToken, rateLimitKey, config, now)
    } catch (err) {
      console.warn('[RateLimit] Upstash Redis check failed, falling back to in-memory store:', err)
    }
  }

  // 2. In-memory sliding window fallback
  pruneExpiredEntries(now, config.windowMs)

  let record = memoryStore.get(rateLimitKey)
  if (!record) {
    record = { timestamps: [], lastUpdated: now }
    memoryStore.set(rateLimitKey, record)
  }

  // Filter timestamps within current window
  const windowStart = now - config.windowMs
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart)
  record.lastUpdated = now

  if (record.timestamps.length >= config.max) {
    const oldest = record.timestamps[0] ?? now
    const resetTime = oldest + config.windowMs
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000))

    return {
      allowed: false,
      limit: config.max,
      remaining: 0,
      resetTime,
      retryAfterSeconds,
    }
  }

  record.timestamps.push(now)
  const remaining = config.max - record.timestamps.length
  const resetTime = now + config.windowMs

  return {
    allowed: true,
    limit: config.max,
    remaining,
    resetTime,
    retryAfterSeconds: 0,
  }
}

/**
 * Executes atomic rate limiting over Upstash Redis REST API.
 */
async function checkUpstashRateLimit(
  url: string,
  token: string,
  key: string,
  config: RateLimitConfig,
  now: number,
): Promise<RateLimitResult> {
  const windowSeconds = Math.ceil(config.windowMs / 1000)

  // Pipeline: INCR key, EXPIRE key windowSeconds NX
  const pipeline = [
    ['INCR', key],
    ['EXPIRE', key, windowSeconds, 'NX'],
    ['TTL', key],
  ]

  const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pipeline),
  })

  if (!response.ok) {
    throw new Error(`Upstash returned HTTP ${response.status}`)
  }

  const data = (await response.json()) as Array<{ result?: number }>
  const count = data[0]?.result || 1
  const ttl = data[2]?.result || windowSeconds

  const resetTime = now + (ttl > 0 ? ttl * 1000 : config.windowMs)
  const allowed = count <= config.max
  const remaining = Math.max(0, config.max - count)
  const retryAfterSeconds = allowed ? 0 : Math.max(1, ttl)

  return {
    allowed,
    limit: config.max,
    remaining,
    resetTime,
    retryAfterSeconds,
  }
}

/**
 * Applies standard rate-limiting headers to HTTP response.
 */
export function applyRateLimitHeaders(res: any, result: RateLimitResult): void {
  if (!res || !res.setHeader) return

  res.setHeader('X-RateLimit-Limit', String(result.limit))
  res.setHeader('X-RateLimit-Remaining', String(result.remaining))
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)))

  if (!result.allowed) {
    res.setHeader('Retry-After', String(result.retryAfterSeconds))
  }
}

/**
 * Reset memory store (useful for automated testing).
 */
export function resetRateLimits(): void {
  memoryStore.clear()
}
