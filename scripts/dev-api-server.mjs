/**
 * Standalone Local API Development Server
 *
 * Runs a standalone lightweight HTTP server on port 5001 to handle S3 presigned URL requests
 * during local development without Vercel CLI.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  generatePresignedUploadUrl,
  generatePresignedDownloadUrl,
} from '../src/server/s3-service.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Simple env loader from .env
function loadLocalEnv() {
  const envPath = path.join(__dirname, '../.env')
  const env = { ...process.env }
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...rest] = trimmed.split('=')
        env[key.trim()] = rest.join('=').trim()
      }
    }
  }
  return env
}

const env = loadLocalEnv()
const PORT = process.env.DEV_API_PORT || 5001

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`
  const parsedUrl = new URL(req.url || '', `http://${host}`)

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  // 1. POST /api/get-resume-upload-url
  if (parsedUrl.pathname === '/api/get-resume-upload-url') {
    if (req.method !== 'POST') {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 405
      res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }))
      return
    }

    let bodyBuffer = ''
    req.on('data', (chunk) => {
      bodyBuffer += chunk
    })

    req.on('end', async () => {
      try {
        const body = bodyBuffer ? JSON.parse(bodyBuffer) : {}
        const result = await generatePresignedUploadUrl(body, env)
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end(JSON.stringify(result))
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        const isClientError =
          message.includes('Invalid') || message.includes('required') || message.includes('exceeds')
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = isClientError ? 400 : 500
        res.end(JSON.stringify({ error: message }))
      }
    })
    return
  }

  // 2. GET or POST /api/get-resume-download-url
  if (parsedUrl.pathname === '/api/get-resume-download-url') {
    const key = parsedUrl.searchParams.get('key') || ''
    const fileName = parsedUrl.searchParams.get('fileName') || 'resume.pdf'

    try {
      const result = await generatePresignedDownloadUrl({ key, fileName }, env)
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      res.end(JSON.stringify(result))
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      const isClientError = message.includes('Invalid') || message.includes('Missing')
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = isClientError ? 400 : 500
      res.end(JSON.stringify({ error: message }))
    }
    return
  }

  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ error: 'Endpoint not found.' }))
})

server.listen(PORT, () => {
  console.log(`🚀 [SecureXmotive Dev API Server] Running on http://localhost:${PORT}`)
})
