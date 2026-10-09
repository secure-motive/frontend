import { generatePresignedDownloadUrl } from '../src/server/s3-service'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
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
