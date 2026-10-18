/**
 * Standalone Local API Development Server
 *
 * Runs a lightweight HTTP server on port 5001 to handle S3 presigned URL requests
 * and upload finalization during local development without Vercel CLI.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  generatePresignedUploadUrl,
  generatePresignedDownloadUrl,
  verifyAdminAuthorization,
  verifyAndFinalizeResumeUpload,
} from '../src/server/s3-service.ts'
import {
  checkRateLimit,
  getClientIp,
  applyRateLimitHeaders,
} from '../src/server/rate-limiter.ts'
import { isHoneypotTriggered } from '../src/server/anti-spam.ts'

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

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

    const clientIp = getClientIp(req)
    const rateLimit = await checkRateLimit('uploadUrl', clientIp)
    applyRateLimitHeaders(res, rateLimit)

    if (!rateLimit.allowed) {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 429
      res.end(
        JSON.stringify({
          error: `Too many upload URL requests. Please try again in ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minutes.`,
          retryAfter: rateLimit.retryAfterSeconds,
        }),
      )
      return
    }

    let bodyBuffer = ''
    req.on('data', (chunk) => {
      bodyBuffer += chunk
    })

    req.on('end', async () => {
      try {
        const body = bodyBuffer ? JSON.parse(bodyBuffer) : {}
        if (isHoneypotTriggered(body._gotcha ?? body.honeypot ?? body.website)) {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Invalid submission parameters.' }))
          return
        }

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

  // 2. POST /api/finalize-resume-upload
  if (parsedUrl.pathname === '/api/finalize-resume-upload') {
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
        const result = await verifyAndFinalizeResumeUpload(body, env)
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end(JSON.stringify(result))
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        const isClientError =
          message.includes('Invalid') ||
          message.includes('not found') ||
          message.includes('signature') ||
          message.includes('exceeds')
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = isClientError ? 400 : 500
        res.end(JSON.stringify({ error: message }))
      }
    })
    return
  }

  // 3. GET or POST /api/get-resume-download-url (Secured with verifyAdminAuthorization)
  if (parsedUrl.pathname === '/api/get-resume-download-url') {
    const authHeader = (req.headers?.authorization || req.headers?.Authorization)
    const queryToken = parsedUrl.searchParams.get('token')
    const idToken = authHeader?.replace(/^Bearer\s+/i, '').trim() || queryToken?.trim()

    const authCheck = await verifyAdminAuthorization(idToken, env)
    if (!authCheck.authorized) {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = authCheck.status
      res.end(JSON.stringify({ error: authCheck.error || 'Unauthorized: Administrator authentication required.' }))
      return
    }

    const key = parsedUrl.searchParams.get('key') || ''
    const fileName = parsedUrl.searchParams.get('fileName') || 'resume.pdf'

    if (!key || !/^resumes\/[a-zA-Z0-9_./-]+$/.test(key) || key.includes('..')) {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Invalid resume key. Access restricted to resumes/ namespace.' }))
      return
    }

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
