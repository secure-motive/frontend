import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import {
  generatePresignedUploadUrl,
  generatePresignedDownloadUrl,
  verifyAdminAuthorization,
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

          // 1. Authenticate administrator via Firebase ID token
          const authHeader = (req.headers?.authorization || req.headers?.Authorization) as string | undefined
          const queryToken = parsedUrl.searchParams.get('token') || undefined
          const idToken = authHeader?.replace(/^Bearer\s+/i, '').trim() || queryToken?.trim()

          const authCheck = await verifyAdminAuthorization(idToken, env)
          if (!authCheck.authorized) {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = authCheck.status
            res.end(JSON.stringify({ error: authCheck.error || 'Unauthorized: Administrator authentication required.' }))
            return
          }

          // 2. Validate S3 object key
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
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('firestore')) {
              return 'vendor-firebase-firestore'
            }
            if (id.includes('auth')) {
              return 'vendor-firebase-auth'
            }
            if (id.includes('node_modules/firebase') || id.includes('@firebase')) {
              return 'vendor-firebase-core'
            }
            if (
              id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router')
            ) {
              return 'vendor-react'
            }
          },
        },
      },
    },
  }
})
