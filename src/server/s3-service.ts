import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
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
 * Resolve server environment variables in priority order.
 */
export function loadServerEnv(explicitEnv?: Record<string, string | undefined>): Record<string, string | undefined> {
  const merged: Record<string, string | undefined> = { ...process.env }

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

/**
 * Creates an authorized S3 client instance.
 */
function createS3Client(config: S3Config): S3Client {
  const missingKeys: string[] = []
  if (!config.accessKeyId) missingKeys.push('AWS_ACCESS_KEY_ID')
  if (!config.secretAccessKey) missingKeys.push('AWS_SECRET_ACCESS_KEY')

  if (missingKeys.length > 0) {
    throw new Error(
      `AWS credentials missing: [${missingKeys.join(', ')}]. Please configure server-side AWS credentials.`,
    )
  }

  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId!,
      secretAccessKey: config.secretAccessKey!,
    },
  })
}

/**
 * Validates resume metadata before generating presigned upload URLs.
 */
export function validateResumeMetadata(
  fileName: unknown,
  fileType?: unknown,
  fileSize?: unknown,
): { valid: boolean; error?: string; extension?: string } {
  if (!fileName || typeof fileName !== 'string' || !fileName.trim()) {
    return { valid: false, error: 'A valid resume fileName is required.' }
  }

  const cleanName = path.basename(fileName.trim())
  if (!cleanName || cleanName.includes('..') || cleanName.length > 255) {
    return { valid: false, error: 'Invalid resume fileName. Path traversal characters not permitted.' }
  }

  const lowerName = cleanName.toLowerCase()
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

/**
 * Inspects binary magic bytes / file signature to verify actual document format.
 */
export function verifyMagicBytes(buffer: Uint8Array | Buffer, extension: string): boolean {
  if (!buffer || buffer.length < 4) return false
  const ext = extension.toLowerCase().replace('.', '')

  if (ext === 'pdf') {
    // PDF magic bytes: %PDF- (0x25, 0x50, 0x44, 0x46, 0x2D)
    const headerStr = Buffer.from(buffer.subarray(0, 5)).toString('ascii')
    return headerStr.startsWith('%PDF-')
  }

  if (ext === 'docx') {
    // DOCX is a ZIP container: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
    return buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04
  }

  if (ext === 'doc') {
    // Legacy DOC is OLE CFB: 0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1
    return buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0
  }

  return false
}

/**
 * Generates a short-lived presigned S3 PUT URL for direct resume upload.
 * Uploads are staged in the dedicated temporary prefix `resumes/pending/`.
 */
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
  const s3Client = createS3Client(config)

  const uniqueId = crypto.randomUUID()
  const sanitizedExt = validation.extension.replace('.', '')
  // Staging in temporary pending prefix for lifecycle cleanup of abandoned uploads
  const objectKey = `resumes/pending/${Date.now()}-${uniqueId}.${sanitizedExt}`

  const contentType =
    params.fileType && (ALLOWED_MIME_TYPES as readonly string[]).includes(params.fileType)
      ? params.fileType
      : sanitizedExt === 'pdf'
      ? 'application/pdf'
      : 'application/octet-stream'

  const putCommand = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: objectKey,
    ContentType: contentType,
    Metadata: {
      originalName: encodeURIComponent(path.basename(params.fileName)),
    },
  })

  // Short-lived 300 second URL
  const uploadUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 300 })

  return {
    success: true,
    uploadUrl,
    key: objectKey,
    bucket: config.bucketName,
    expiresIn: 300,
  }
}

/**
 * Verifies that the uploaded resume exists in S3, satisfies size constraints,
 * possesses valid file signature / magic bytes, and promotes it to permanent storage.
 */
export async function verifyAndFinalizeResumeUpload(
  params: { key: string; originalFileName?: string },
  env?: Record<string, string | undefined>,
): Promise<{
  success: boolean
  verifiedKey: string
  fileSize: number
  contentType: string
}> {
  const { key } = params
  if (!key || typeof key !== 'string') {
    throw new Error('Missing S3 resume object key.')
  }

  // Strictly enforce resume namespace and reject path traversal
  if (!/^resumes\/(pending\/)?[a-zA-Z0-9_.-]+\.(pdf|doc|docx)$/i.test(key) || key.includes('..')) {
    throw new Error('Invalid resume key. Key must belong to the resumes/ namespace.')
  }

  const config = getS3Config(env)
  const s3Client = createS3Client(config)

  // 1. If key is already in permanent resumes/ namespace (idempotent retry)
  if (key.startsWith('resumes/') && !key.startsWith('resumes/pending/')) {
    const head = await s3Client.send(new HeadObjectCommand({ Bucket: config.bucketName, Key: key }))
    return {
      success: true,
      verifiedKey: key,
      fileSize: head.ContentLength || 0,
      contentType: head.ContentType || 'application/pdf',
    }
  }

  // 2. Verify object exists in staging prefix resumes/pending/
  let head
  try {
    head = await s3Client.send(new HeadObjectCommand({ Bucket: config.bucketName, Key: key }))
  } catch (err: any) {
    if (err?.name === 'NotFound' || err?.$metadata?.httpStatusCode === 404) {
      throw new Error('Uploaded resume file not found in storage. Please upload the file before submitting.')
    }
    throw err
  }

  const contentLength = head.ContentLength || 0
  if (contentLength <= 0) {
    throw new Error('Uploaded file is empty (0 bytes). Please upload a valid resume.')
  }
  if (contentLength > MAX_FILE_SIZE) {
    throw new Error(`Uploaded file exceeds the maximum permitted 5 MB limit (${(contentLength / (1024 * 1024)).toFixed(2)} MB).`)
  }

  // 3. Inspect first 512 bytes for genuine file signatures
  const getRange = await s3Client.send(
    new GetObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Range: 'bytes=0-511',
    }),
  )

  const byteArray = await getRange.Body?.transformToByteArray()
  if (!byteArray || byteArray.length < 4) {
    throw new Error('Unable to verify file header signature.')
  }

  const extMatch = key.match(/\.(pdf|doc|docx)$/i)
  const ext = extMatch ? extMatch[0].toLowerCase() : '.pdf'
  const isSignatureValid = verifyMagicBytes(Buffer.from(byteArray), ext)

  if (!isSignatureValid) {
    // Delete invalid file immediately to prevent storage contamination
    await s3Client.send(new DeleteObjectCommand({ Bucket: config.bucketName, Key: key })).catch(() => {})
    throw new Error(`Security validation failed: File content does not match genuine ${ext.toUpperCase()} document signature.`)
  }

  // 4. Promote object from temporary resumes/pending/ to permanent resumes/
  const uniqueId = crypto.randomUUID()
  const sanitizedExt = ext.replace('.', '')
  const permanentKey = `resumes/${Date.now()}-${uniqueId}.${sanitizedExt}`

  await s3Client.send(
    new CopyObjectCommand({
      Bucket: config.bucketName,
      CopySource: `${config.bucketName}/${key}`,
      Key: permanentKey,
      MetadataDirective: 'COPY',
    }),
  )

  // Clean up pending staging object
  await s3Client.send(new DeleteObjectCommand({ Bucket: config.bucketName, Key: key })).catch((delErr) => {
    console.warn(`[s3-service] Could not remove pending staging object ${key}:`, delErr)
  })

  return {
    success: true,
    verifiedKey: permanentKey,
    fileSize: contentLength,
    contentType: head.ContentType || 'application/pdf',
  }
}

/**
 * Generates an authorized, short-lived presigned GET URL for administrator resume review.
 */
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

  if (!key || typeof key !== 'string' || !/^resumes\/[a-zA-Z0-9_./-]+$/.test(key) || key.includes('..')) {
    throw new Error('Invalid resume key. Access is restricted to objects in the resumes/ prefix.')
  }

  const cleanFileName = path.basename(fileName).replace(/["\r\n]/g, '').trim() || 'resume.pdf'

  const config = getS3Config(env)
  const s3Client = createS3Client(config)

  const getCommand = new GetObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ResponseContentDisposition: `inline; filename="${encodeURIComponent(cleanFileName)}"; filename*="UTF-8''${encodeURIComponent(cleanFileName)}"`,
  })

  const presignedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 300 })

  return {
    success: true,
    url: presignedUrl,
    fileName: cleanFileName,
    expiresIn: 300,
  }
}

export interface AdminAuthVerificationResult {
  authorized: boolean
  status: 200 | 401 | 403 | 500
  uid?: string
  error?: string
}

/**
 * Validates a Firebase ID token on the server against Google's Identity Toolkit API
 * and ensures the authenticated UID matches an authorized administrator.
 */
export async function verifyAdminAuthorization(
  idToken: string | undefined,
  env?: Record<string, string | undefined>,
): Promise<AdminAuthVerificationResult> {
  if (!idToken || typeof idToken !== 'string' || !idToken.trim()) {
    return {
      authorized: false,
      status: 401,
      error: 'Authentication required. Missing Bearer token in Authorization header.',
    }
  }

  const serverEnv = loadServerEnv(env)
  const apiKey =
    serverEnv.VITE_FIREBASE_API_KEY ||
    serverEnv.FIREBASE_API_KEY ||
    'AIzaSyC1TyVkbXbQVjBS8EN5koK8BekPzuZ0PlM'

  // Recognized admin UIDs from environment and security rules
  const recognizedAdminUids = new Set(
    [
      serverEnv.VITE_FIREBASE_ADMIN_UID,
      serverEnv.FIREBASE_ADMIN_UID,
      'C4Y2foGCBme6H1WUCbmUdu5ez1h1',
      'GiNviJNYaXR2kRNFA2kRTTvsQwH2',
    ]
      .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
      .map((u) => u.trim()),
  )

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

    if (!recognizedAdminUids.has(authenticatedUid)) {
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
