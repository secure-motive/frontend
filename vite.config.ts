import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import {
  generatePresignedUploadUrl,
  generatePresignedDownloadUrl,
} from './src/server/s3-service.ts'

/**
 * Local API plugin for Vite development server.
 * Handles /api/get-resume-upload-url and /api/get-resume-download-url
 * during local development without requiring Vercel CLI or a separate server process.
 */
function localDevApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'local-dev-api-endpoints',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const host = req.headers.host || 'localhost:5173'
        const parsedUrl = new globalThis.URL(req.url || '', `http://${host}`)

        // Endpoint 1: POST /api/get-resume-upload-url
        if (parsedUrl.pathname === '/api/get-resume-upload-url') {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            res.statusCode = 200
            res.end()
            return
          }

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
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : String(err)
              const isClientError =
                message.includes('Invalid') ||
                message.includes('required') ||
                message.includes('exceeds')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = isClientError ? 400 : 500
              res.end(JSON.stringify({ error: message }))
            }
          })
          return
        }

        // Endpoint 2: GET or POST /api/get-resume-download-url
        if (parsedUrl.pathname === '/api/get-resume-download-url') {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            res.statusCode = 200
            res.end()
            return
          }

          const key = parsedUrl.searchParams.get('key') || ''
          const fileName = parsedUrl.searchParams.get('fileName') || 'resume.pdf'

          try {
            const result = await generatePresignedDownloadUrl({ key, fileName }, env)
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify(result))
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err)
            const isClientError = message.includes('Invalid') || message.includes('Missing')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = isClientError ? 400 : 500
            res.end(JSON.stringify({ error: message }))
          }
          return
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables (including AWS secrets for serverless/local dev middleware)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), localDevApiPlugin(env)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
