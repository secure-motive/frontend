import {
  generatePresignedDownloadUrl,
  verifyAdminAuthorization,
} from '../src/server/s3-service'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // 1. Authenticate administrator via Firebase ID token
    const authHeader = (req.headers?.authorization || req.headers?.Authorization) as string | undefined
    const queryToken = req.query?.token as string | undefined
    const idToken = authHeader?.replace(/^Bearer\s+/i, '').trim() || queryToken?.trim()

    const authCheck = await verifyAdminAuthorization(idToken)
    if (!authCheck.authorized) {
      return res.status(authCheck.status).json({
        error: authCheck.error || 'Unauthorized: Administrator authentication required.',
      })
    }

    // 2. Validate S3 object key
    const key = (req.query?.key || req.body?.key) as string
    const fileName = (req.query?.fileName || req.body?.fileName || 'resume.pdf') as string

    if (!key) {
      return res.status(400).json({ error: 'Missing S3 object key.' })
    }

    const result = await generatePresignedDownloadUrl({ key, fileName })
    return res.status(200).json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const isClientError = message.includes('Invalid') || message.includes('Missing')
    return res.status(isClientError ? 400 : 500).json({
      error: message,
    })
  }
}
