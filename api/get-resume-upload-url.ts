import { generatePresignedUploadUrl } from '../src/server/s3-service'

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
    const { fileName, fileType, fileSize } = req.body || {}
    const result = await generatePresignedUploadUrl({ fileName, fileType, fileSize })
    return res.status(200).json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const isClientError =
      message.includes('Invalid') || message.includes('required') || message.includes('exceeds')
    return res.status(isClientError ? 400 : 500).json({
      error: message,
    })
  }
}
