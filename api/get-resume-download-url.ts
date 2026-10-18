import {
  verifyAdminAuthorization,
  generatePresignedDownloadUrl,
} from '../src/server/s3-service.ts'

export { verifyAdminAuthorization, generatePresignedDownloadUrl }

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // 1. Authenticate administrator via Firebase ID token
    const authHeader = (req.headers?.authorization || req.headers?.Authorization) as
      | string
      | undefined
    const queryToken = req.query?.token as string | undefined
    const idToken = authHeader?.replace(/^Bearer\s+/i, '').trim() || queryToken?.trim()

    const authCheck = await verifyAdminAuthorization(idToken)
    if (!authCheck.authorized) {
      return res.status(authCheck.status).json({
        error: authCheck.error || 'Unauthorized: Administrator authentication required.',
      })
    }

    // 2. Validate S3 object key
    const rawBody = req.body
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody || {}
    const key = (req.query?.key || body?.key) as string
    const fileName = (req.query?.fileName || body?.fileName || 'resume.pdf') as string

    if (!key || typeof key !== 'string') {
      return res.status(400).json({ error: 'Missing S3 object key.' })
    }

    if (!/^resumes\/[a-zA-Z0-9_./-]+$/.test(key) || key.includes('..')) {
      return res.status(400).json({
        error: 'Invalid resume key. Access is restricted to objects in the resumes/ prefix.',
      })
    }

    const result = await generatePresignedDownloadUrl({ key, fileName })
    return res.status(200).json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const isClientError =
      message.includes('Invalid') ||
      message.includes('Missing') ||
      message.includes('restricted')

    if (!isClientError) {
      console.error('[get-resume-download-url server error]:', err)
    }

    return res.status(isClientError ? 400 : 500).json({
      error: isClientError ? message : 'Failed to generate secure download authorization.',
    })
  }
}
