import assert from 'node:assert/strict'
import { generatePresignedUploadUrl } from './src/server/s3-service.ts'

console.log('🧪 Testing live S3 binary PUT upload with presigned URL...')

async function run() {
  try {
    const testContent = Buffer.from('%PDF-1.4 Mock PDF Content for verification')
    const fileName = 'verification_test_resume.pdf'

    // 1. Generate presigned URL
    const presign = await generatePresignedUploadUrl({
      fileName,
      fileType: 'application/pdf',
      fileSize: testContent.length,
    })

    console.log(`- Generated Presigned PUT URL for key: ${presign.key}`)

    // 2. Perform direct PUT upload to S3
    const uploadRes = await fetch(presign.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/pdf',
      },
      body: testContent,
    })

    console.log(`- Upload HTTP Status: ${uploadRes.status} ${uploadRes.statusText}`)

    if (!uploadRes.ok) {
      const errText = await uploadRes.text()
      console.error('❌ S3 Upload response body:', errText)
      throw new Error(`S3 returned HTTP ${uploadRes.status}`)
    }

    assert.equal(uploadRes.status, 200, 'S3 upload should return HTTP 200 OK')
    console.log('🎉 LIVE S3 BINARY UPLOAD VERIFIED SUCCESSFULLY! S3 IAM credentials and bucket access are 100% working!\n')
  } catch (err) {
    console.error('❌ Live S3 Upload failed:', err)
    process.exit(1)
  }
}

run()
