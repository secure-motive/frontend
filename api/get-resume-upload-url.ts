import {
  generatePresignedUploadUrl,
  validateResumeMetadata,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from '../src/server/s3-service.ts'
import {
  checkRateLimit,
  getClientIp,
  applyRateLimitHeaders,
} from '../src/server/rate-limiter.ts'
import { isHoneypotTriggered } from '../src/server/anti-spam.ts'

export { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE, validateResumeMetadata, generatePresignedUploadUrl }

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  // 1. Client IP and Persistent Rate Limiting
  const clientIp = getClientIp(req)
  const rateLimitResult = await checkRateLimit('uploadUrl', clientIp)
  applyRateLimitHeaders(res, rateLimitResult)

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      error: `Too many upload URL requests. Please try again in ${Math.ceil(rateLimitResult.retryAfterSeconds / 60)} minutes.`,
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

    const { fileName, fileType, fileSize } = body
    const result = await generatePresignedUploadUrl({ fileName, fileType, fileSize })
    return res.status(200).json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const isClientError =
      message.includes('Invalid') ||
      message.includes('required') ||
      message.includes('exceeds') ||
      message.includes('format')

    if (!isClientError) {
      console.error('[get-resume-upload-url server error]:', err)
    }

    return res.status(isClientError ? 400 : 500).json({
      error: isClientError ? message : 'Failed to generate secure upload credentials. Please try again later.',
    })
  }
}
