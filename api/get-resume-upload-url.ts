import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'node:crypto'

export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export function validateResumeMetadata(
  fileName: unknown,
  fileType?: unknown,
  fileSize?: unknown,
): { valid: boolean; error?: string; extension?: string } {
  if (!fileName || typeof fileName !== 'string' || !fileName.trim()) {
    return { valid: false, error: 'A valid resume fileName is required.' }
  }

  const lowerName = fileName.toLowerCase().trim()
  const matchedExt = ALLOWED_EXTENSIONS.find((ext) => lowerName.endsWith(ext))
  if (!matchedExt) {
    return {
      valid: false,
      error: `Invalid file format. Only ${ALLOWED_EXTENSIONS.join(', ')} files are accepted.`,
    }
  }

  if (fileType && typeof fileType === 'string') {
    const lowerType = fileType.toLowerCase().trim()
    const isValidMime = (ALLOWED_MIME_TYPES as readonly string[]).includes(lowerType)
    if (!isValidMime && lowerType !== 'application/octet-stream') {
      return {
        valid: false,
        error: 'Invalid file MIME type. Only PDF and Microsoft Word documents are permitted.',
      }
    }
  }

  if (fileSize !== undefined && fileSize !== null) {
    const numericSize = Number(fileSize)
    if (isNaN(numericSize) || numericSize <= 0) {
      return { valid: false, error: 'File size must be greater than 0 bytes.' }
    }
    if (numericSize > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size (${(numericSize / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed 5 MB limit.`,
      }
    }
  }

  return { valid: true, extension: matchedExt }
}

export async function generatePresignedUploadUrl(params: {
  fileName: string
  fileType?: string
  fileSize?: number
}): Promise<{
  success: boolean
  uploadUrl: string
  key: string
  bucket: string
  expiresIn: number
}> {
  const validation = validateResumeMetadata(params.fileName, params.fileType, params.fileSize)
  if (!validation.valid || !validation.extension) {
    throw new Error(validation.error || 'Invalid resume metadata')
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
      `AWS credentials missing: [${missingKeys.join(', ')}]. Please configure these variables in Vercel Project Settings > Environment Variables.`,
    )
  }

  const uniqueId = crypto.randomUUID()
  const sanitizedExt = validation.extension.replace('.', '')
  const objectKey = `resumes/${Date.now()}-${uniqueId}.${sanitizedExt}`
  const contentType =
    params.fileType && (ALLOWED_MIME_TYPES as readonly string[]).includes(params.fileType)
      ? params.fileType
      : sanitizedExt === 'pdf'
      ? 'application/pdf'
      : 'application/octet-stream'

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  })

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: contentType,
    Metadata: {
      originalName: encodeURIComponent(params.fileName),
    },
  })

  const uploadUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 300 })

  return {
    success: true,
    uploadUrl,
    key: objectKey,
    bucket: bucketName,
    expiresIn: 300,
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    const rawBody = req.body
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : (rawBody || {})
    const { fileName, fileType, fileSize } = body
    const result = await generatePresignedUploadUrl({ fileName, fileType, fileSize })
    return res.status(200).json(result)
  } catch (err) {
    console.error('[get-resume-upload-url error]:', err)
    const message = err instanceof Error ? err.message : String(err)
    const isClientError =
      message.includes('Invalid') || message.includes('required') || message.includes('exceeds')
    return res.status(isClientError ? 400 : 500).json({
      error: message,
    })
  }
}
