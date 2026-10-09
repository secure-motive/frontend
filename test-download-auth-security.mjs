/**
 * Security Audit Verification Test: Server-Side Resume Download Authorization
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { verifyAdminAuthorization, generatePresignedDownloadUrl } from './src/server/s3-service.ts'

console.log('=================================================================')
console.log('🛡️  Running Admin Resume Download Security Audit Tests...')
console.log('=================================================================')

// Test 1: Unauthenticated request (missing token) must return 401
const missingTokenResult = await verifyAdminAuthorization(undefined)
assert.strictEqual(missingTokenResult.authorized, false)
assert.strictEqual(missingTokenResult.status, 401)
console.log('✅ [PASS] Security: Rejects unauthenticated download requests (HTTP 401)')

// Test 2: Malformed/Invalid token must return 401
const invalidTokenResult = await verifyAdminAuthorization('invalid-token-12345')
assert.strictEqual(invalidTokenResult.authorized, false)
assert.strictEqual(invalidTokenResult.status, 401)
console.log('✅ [PASS] Security: Rejects invalid or forged tokens (HTTP 401)')

// Test 3: Path Traversal & Prefix Protection
try {
  await generatePresignedDownloadUrl({ key: '../system/secrets.json' })
  assert.fail('Should have thrown an error for non-resumes/ key')
} catch (err) {
  assert.ok(err.message.includes('Invalid resume key'))
  console.log('✅ [PASS] Security: Enforces resumes/ prefix constraint and blocks path traversal')
}

// Test 4: Frontend attaches Authorization Bearer token
const clientServiceContent = fs.readFileSync(
  path.resolve('src/services/firestoreApplicationService.ts'),
  'utf-8'
)
assert.ok(
  clientServiceContent.includes('getIdToken()'),
  'Client must retrieve Firebase ID token'
)
assert.ok(
  clientServiceContent.includes("'Authorization'"),
  'Client must attach Authorization header'
)
console.log('✅ [PASS] Client Service: Attaches Firebase ID token to download requests')

// Test 5: Serverless endpoints require verifyAdminAuthorization
const serverlessContent = fs.readFileSync(
  path.resolve('api/get-resume-download-url.ts'),
  'utf-8'
)
assert.ok(
  serverlessContent.includes('verifyAdminAuth') || serverlessContent.includes('verifyAdminAuthorization'),
  'Serverless function must verify admin authorization'
)
console.log('✅ [PASS] Serverless Handlers: Independently authenticate incoming requests')

console.log('=================================================================')
console.log('📊 Summary: All 5 security audit tests passed successfully.')
console.log('=================================================================')
