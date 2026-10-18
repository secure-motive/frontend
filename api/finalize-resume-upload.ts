import { verifyAndFinalizeResumeUpload } from '../src/server/s3-service.ts'
import {
  checkRateLimit,
  getClientIp,
  applyRateLimitHeaders,
} from '../src/server/rate-limiter.ts'
import { isHoneypotTriggered, isSubmissionTooFast } from '../src/server/anti-spam.ts'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  // 1. Rate limiting per client IP
  const clientIp = getClientIp(req)
  const rateLimitResult = await checkRateLimit('careerApplication', clientIp)
  applyRateLimitHeaders(res, rateLimitResult)

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      error: `Application rate limit exceeded. Please try again in ${Math.ceil(rateLimitResult.retryAfterSeconds / 60)} minutes.`,
      retryAfter: rateLimitResult.retryAfterSeconds,
    })
  }

  try {
    const rawBody = req.body
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody || {}

    // 2. Anti-spam honeypot detection
    if (isHoneypotTriggered(body._gotcha ?? body.honeypot ?? body.website)) {
      return res.status(400).json({ error: 'Invalid submission parameters.' })
    }

    // 3. Minimum submission timing check (if client provided timestamp)
    if (body._renderTime) {
      const timing = isSubmissionTooFast(body._renderTime)
      if (timing.tooFast) {
        return res.status(400).json({ error: 'Submission processed too quickly. Please submit normally.' })
      }
    }

    const { key, fileName } = body
    if (!key || typeof key !== 'string') {
      return res.status(400).json({ error: 'Missing resume object key.' })
    }

    // 4. Server-side validation, signature verification, and promotion
    const result = await verifyAndFinalizeResumeUpload({
      key,
      originalFileName: fileName,
    })

    return res.status(200).json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const isClientError =
      message.includes('Invalid') ||
      message.includes('not found') ||
      message.includes('exceeds') ||
      message.includes('signature') ||
      message.includes('empty')

    if (!isClientError) {
      console.error('[finalize-resume-upload server error]:', err)
    }

    return res.status(isClientError ? 400 : 500).json({
      error: isClientError ? message : 'Failed to finalize uploaded resume. Please try again.',
    })
  }
}
