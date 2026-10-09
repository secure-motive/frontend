import assert from 'node:assert/strict'
import { generatePresignedUploadUrl } from './src/server/s3-service.ts'

console.log('🧪 Testing live S3 Presigned Upload URL generation...')

async function run() {
  try {
    const result = await generatePresignedUploadUrl({
      fileName: 'candidate_resume.pdf',
      fileType: 'application/pdf',
      fileSize: 1024 * 1024,
    })

    console.log('✅ Presigned URL successfully generated!')
    console.log(`- Bucket: ${result.bucket}`)
    console.log(`- Key: ${result.key}`)
    console.log(`- Expires In: ${result.expiresIn}s`)
    console.log(`- URL starts with: ${result.uploadUrl.substring(0, 50)}...`)

    assert.ok(result.uploadUrl.includes('secure-motive-files.s3.ap-south-1.amazonaws.com') || result.uploadUrl.includes('s3.ap-south-1.amazonaws.com/secure-motive-files'), 'URL must target secure-motive-files in ap-south-1')
    assert.ok(result.key.startsWith('resumes/'), 'Object key must start with resumes/')
    assert.ok(result.key.endsWith('.pdf'), 'Object key must end with .pdf')
    console.log('🎉 Live S3 Presign Test PASSED!\n')
  } catch (err) {
    console.error('❌ Presign generation failed:', err)
    process.exit(1)
  }
}

run()
