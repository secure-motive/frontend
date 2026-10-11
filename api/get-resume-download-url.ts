import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function verifyAdminAuthorization(idToken: string | undefined): Promise<{
  authorized: boolean
  status: 200 | 401 | 403 | 500
  uid?: string
  error?: string
}> {
  if (!idToken || typeof idToken !== 'string' || !idToken.trim()) {
    return {
      authorized: false,
      status: 401,
      error: 'Authentication required. Missing Bearer token in Authorization header.',
    }
  }

  const apiKey =
    process.env.VITE_FIREBASE_API_KEY ||
    process.env.FIREBASE_API_KEY ||
    'AIzaSyC1TyVkbXbQVjBS8EN5koK8BekPzuZ0PlM'
  const designatedAdminUid =
    process.env.VITE_FIREBASE_ADMIN_UID ||
    process.env.FIREBASE_ADMIN_UID ||
    'C4Y2foGCBme6H1WUCbmUdu5ez1h1'

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: idToken.trim() }),
      },
    )

    if (!response.ok) {
      const errData = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
      const errMessage = errData?.error?.message || 'Invalid or expired Firebase ID token.'
      return {
        authorized: false,
        status: 401,
        error: `Authentication failed: ${errMessage}`,
      }
    }

    const data = (await response.json()) as { users?: Array<{ localId?: string }> }
    const authenticatedUid = data.users?.[0]?.localId

    if (!authenticatedUid) {
      return {
        authorized: false,
        status: 401,
        error: 'Authentication failed: User record not found for the provided token.',
      }
    }

    if (authenticatedUid !== designatedAdminUid) {
      return {
        authorized: false,
        status: 403,
        uid: authenticatedUid,
        error: `Forbidden: Authenticated UID "${authenticatedUid}" is not authorized as an administrator.`,
      }
    }

    return {
      authorized: true,
      status: 200,
      uid: authenticatedUid,
    }
  } catch (netErr) {
    return {
      authorized: false,
      status: 500,
      error: `Internal authentication verification error: ${netErr instanceof Error ? netErr.message : String(netErr)}`,
    }
  }
}

export async function generatePresignedDownloadUrl(params: {
  key: string
  fileName?: string
}): Promise<{
  success: boolean
  url: string
  fileName: string
  expiresIn: number
}> {
  const { key, fileName = 'resume.pdf' } = params

  if (!key || typeof key !== 'string' || !key.startsWith('resumes/')) {
    throw new Error('Invalid resume key. Access is restricted to objects in the resumes/ prefix.')
  }

  const region = process.env.AWS_REGION || 'ap-south-1'
  const bucketName =
    process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME || 'secure-motive-files'
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim()
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim()

  const missingKeys: string[] = []
  if (!accessKeyId) missingKeys.push('AWS_ACCESS_KEY_ID')
  if (!secretAccessKey) missingKeys.push('AWS_SECRET_ACCESS_KEY')

  if (missingKeys.length > 0) {
    throw new Error(
      `AWS credentials missing: [${missingKeys.join(', ')}]. Please configure server-side AWS credentials in Vercel Project Settings > Environment Variables.`,
    )
  }

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  })

  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
    ResponseContentDisposition: `inline; filename="${encodeURIComponent(fileName)}"`,
  })

  const presignedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 300 })

  return {
    success: true,
    url: presignedUrl,
    fileName,
    expiresIn: 300,
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

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
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : (rawBody || {})
    const key = (req.query?.key || body?.key) as string
    const fileName = (req.query?.fileName || body?.fileName || 'resume.pdf') as string

    if (!key) {
      return res.status(400).json({ error: 'Missing S3 object key.' })
    }

    const result = await generatePresignedDownloadUrl({ key, fileName })
    return res.status(200).json(result)
  } catch (err) {
    console.error('[get-resume-download-url error]:', err)
    const message = err instanceof Error ? err.message : String(err)
    const isClientError = message.includes('Invalid') || message.includes('Missing')
    return res.status(isClientError ? 400 : 500).json({
      error: message,
    })
  }
}
