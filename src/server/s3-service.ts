import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB (5,242,880 bytes)

export interface S3Config {
  region: string
  bucketName: string
  accessKeyId?: string
  secretAccessKey?: string
}

/**
 * Parses simple KEY=VALUE format from a .env file into a record.
 */
function parseEnvFile(filePath: string): Record<string, string> {
  const result: Record<string, string> = {}
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      const lines = content.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const eqIdx = trimmed.indexOf('=')
          const key = trimmed.slice(0, eqIdx).trim()
          let val = trimmed.slice(eqIdx + 1).trim()
          // Strip enclosing quotes if present
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1)
          }
          result[key] = val
        }
      }
    }
  } catch (err) {
    console.warn(`[s3-service] Could not read env file at ${filePath}:`, err)
  }
  return result
}

/**
 * Resolve server environment variables in priority order:
 * 1. Explicitly passed env object (if contains AWS keys)
 * 2. process.env
 * 3. frontend/.env.local / frontend/.env.server.local
 * 4. frontend/.env
 * 5. root .env / backend/.env (for monorepo dev fallback)
 */
export function loadServerEnv(explicitEnv?: Record<string, string | undefined>): Record<string, string | undefined> {
  const merged: Record<string, string | undefined> = { ...process.env }

  // Candidate file paths
  const candidatePaths = [
    path.resolve(process.cwd(), '.env.server.local'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../.env'),
    path.resolve(process.cwd(), '../backend/.env'),
  ]

  for (const p of candidatePaths) {
    const fileVars = parseEnvFile(p)
    for (const [k, v] of Object.entries(fileVars)) {
      if (v && !merged[k]) {
        merged[k] = v
      }
    }
  }

  // Merge explicit env last if provided
  if (explicitEnv) {
    for (const [k, v] of Object.entries(explicitEnv)) {
      if (v) {
        merged[k] = v
      }
    }
  }

  return merged
}

export function getS3Config(env?: Record<string, string | undefined>): S3Config {
  const resolved = loadServerEnv(env)

  return {
    region: resolved.AWS_REGION || 'ap-south-1',
    bucketName: resolved.AWS_S3_BUCKET || resolved.AWS_S3_BUCKET_NAME || 'secure-motive-files',
    accessKeyId: resolved.AWS_ACCESS_KEY_ID?.trim(),
    secretAccessKey: resolved.AWS_SECRET_ACCESS_KEY?.trim(),
  }
}

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

export async function generatePresignedUploadUrl(
  params: { fileName: string; fileType?: string; fileSize?: number },
  env?: Record<string, string | undefined>,
): Promise<{
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

  const config = getS3Config(env)
  const missingKeys: string[] = []
  if (!config.accessKeyId) missingKeys.push('AWS_ACCESS_KEY_ID')
  if (!config.secretAccessKey) missingKeys.push('AWS_SECRET_ACCESS_KEY')

  if (missingKeys.length > 0) {
    throw new Error(
      `AWS credentials missing: [${missingKeys.join(', ')}]. Please ensure these variables are defined in frontend/.env or frontend/.env.local (server-side only, do not prefix with VITE_).`,
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
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId!,
      secretAccessKey: config.secretAccessKey!,
    },
  })

  const putCommand = new PutObjectCommand({
    Bucket: config.bucketName,
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
    bucket: config.bucketName,
    expiresIn: 300,
  }
}

export async function generatePresignedDownloadUrl(
  params: { key: string; fileName?: string },
  env?: Record<string, string | undefined>,
): Promise<{
  success: boolean
  url: string
  fileName: string
  expiresIn: number
}> {
  const { key, fileName = 'resume.pdf' } = params

  if (!key || typeof key !== 'string' || !key.startsWith('resumes/')) {
    throw new Error('Invalid resume key. Access is restricted to objects in the resumes/ prefix.')
  }

  const config = getS3Config(env)
  const missingKeys: string[] = []
  if (!config.accessKeyId) missingKeys.push('AWS_ACCESS_KEY_ID')
  if (!config.secretAccessKey) missingKeys.push('AWS_SECRET_ACCESS_KEY')

  if (missingKeys.length > 0) {
    throw new Error(
      `AWS credentials missing: [${missingKeys.join(', ')}]. Please configure server-side AWS credentials.`,
    )
  }

  const s3Client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId!,
      secretAccessKey: config.secretAccessKey!,
    },
  })

  const getCommand = new GetObjectCommand({
    Bucket: config.bucketName,
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
