/**
 * Anti-Spam and Input Sanitization Module for SecureXmotive
 *
 * Implements:
 * 1. Honeypot field validation (bots filling hidden inputs are rejected)
 * 2. Minimum submission-time verification (fast automated submissions rejected)
 * 3. Duplicate submission & idempotency protection
 * 4. Stored XSS prevention via HTML entity escaping and control-character removal
 */
import crypto from 'node:crypto'

// Bounded in-memory store for recent submission fingerprints (prevents duplicate spam bursts)
const recentSubmissions = new Map<string, number>()
const MAX_RECENT_SUBMISSIONS = 5000

function pruneRecentSubmissions(now: number, maxAgeMs: number = 300000): void {
  if (recentSubmissions.size > MAX_RECENT_SUBMISSIONS) {
    for (const [hash, ts] of recentSubmissions.entries()) {
      if (now - ts > maxAgeMs) {
        recentSubmissions.delete(hash)
      }
    }
  }
}

/**
 * Checks whether the honeypot field was filled.
 * Returns true if bot behavior is detected.
 */
export function isHoneypotTriggered(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

/**
 * Validates that a minimum duration elapsed between form rendering and submission.
 * Human interaction typically requires at least 2 seconds to complete a form.
 */
export function isSubmissionTooFast(
  renderTime: unknown,
  minElapsedMs: number = 1500,
): { tooFast: boolean; elapsedMs: number } {
  if (!renderTime) return { tooFast: false, elapsedMs: 0 }
  const parsed = Number(renderTime)
  if (isNaN(parsed) || parsed <= 0) return { tooFast: false, elapsedMs: 0 }

  const now = Date.now()
  const elapsed = now - parsed
  return {
    tooFast: elapsed > 0 && elapsed < minElapsedMs,
    elapsedMs: elapsed,
  }
}

/**
 * Checks for duplicate submissions within a short window (idempotency protection).
 * Returns true if an identical submission was processed within the window.
 */
export function isDuplicateSubmission(
  fingerprint: string,
  windowMs: number = 300000, // 5 minutes
): boolean {
  const now = Date.now()
  pruneRecentSubmissions(now, windowMs)

  const previousTs = recentSubmissions.get(fingerprint)
  if (previousTs && now - previousTs < windowMs) {
    return true
  }

  recentSubmissions.set(fingerprint, now)
  return false
}

/**
 * Generates an SHA-256 fingerprint for idempotency tracking.
 */
export function generateFingerprint(fields: (string | undefined)[]): string {
  const normalized = fields
    .map((f) => (f || '').trim().toLowerCase())
    .join('::')
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

/**
 * Escapes HTML characters to prevent stored XSS attacks.
 * Also strips ASCII control characters.
 */
export function sanitizeString(val: unknown, maxLength?: number): string {
  if (val === null || val === undefined) return ''
  let str = String(val)

  // Remove control characters (except newline, tab, carriage return)
  // eslint-disable-next-line no-control-regex
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Escape HTML entities
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }

  str = str.replace(/[&<>"'/]/g, (match) => htmlEscapes[match] || match)
  str = str.trim()

  if (maxLength && str.length > maxLength) {
    return str.substring(0, maxLength)
  }

  return str
}

/**
 * Validates email format according to standard RFC 5322 pattern.
 */
export function isValidEmailFormat(email: unknown): boolean {
  if (typeof email !== 'string') return false
  const trimmed = email.trim()
  if (trimmed.length < 5 || trimmed.length > 255) return false
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)
}

/**
 * Clears duplicate submission cache (for tests).
 */
export function resetAntiSpamStore(): void {
  recentSubmissions.clear()
}
