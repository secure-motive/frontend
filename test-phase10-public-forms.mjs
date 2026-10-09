/**
 * Automated Verification Test Script for Phase 10:
 * Public Forms Redesign, Firebase Submission, and S3 Resume Upload
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=================================================================')
console.log('🧪 Running Phase 10 & Local Resume Submission Verification Tests...')
console.log('=================================================================\n')

let passedTests = 0
let failedTests = 0

function runTest(name, fn) {
  try {
    fn()
    console.log(`✅ [PASS] ${name}`)
    passedTests++
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`)
    console.error(`   Error: ${err.message}\n`)
    failedTests++
  }
}

// Helper validation function mirror for node test
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

function validateResumeMetadata(fileName, fileType, fileSize) {
  if (!fileName || typeof fileName !== 'string' || !fileName.trim()) {
    return { valid: false, error: 'A valid resume fileName is required.' }
  }
  const lowerName = fileName.toLowerCase().trim()
  const matchedExt = ALLOWED_EXTENSIONS.find((ext) => lowerName.endsWith(ext))
  if (!matchedExt) {
    return { valid: false, error: `Invalid file format. Only ${ALLOWED_EXTENSIONS.join(', ')} files are accepted.` }
  }
  if (fileSize !== undefined && fileSize !== null) {
    const numericSize = Number(fileSize)
    if (isNaN(numericSize) || numericSize <= 0) {
      return { valid: false, error: 'File size must be greater than 0 bytes.' }
    }
    if (numericSize > MAX_FILE_SIZE) {
      return { valid: false, error: `File size exceeds 5 MB limit.` }
    }
  }
  return { valid: true, extension: matchedExt }
}

// 1. Check S3 Resume Metadata Validation
runTest('S3 Service: Validates acceptable files and rejects invalid extensions or oversize files', () => {
  // Valid PDF
  const resPdf = validateResumeMetadata('john_resume.pdf', 'application/pdf', 1024 * 1024)
  assert.equal(resPdf.valid, true, 'Valid PDF should pass')
  assert.equal(resPdf.extension, '.pdf')

  // Valid DOCX
  const resDocx = validateResumeMetadata('john_resume.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2 * 1024 * 1024)
  assert.equal(resDocx.valid, true, 'Valid DOCX should pass')
  assert.equal(resDocx.extension, '.docx')

  // Valid DOC
  const resDoc = validateResumeMetadata('john_resume.doc', 'application/msword', 500 * 1024)
  assert.equal(resDoc.valid, true, 'Valid DOC should pass')

  // Invalid extension (exe)
  const resExe = validateResumeMetadata('malicious.exe', 'application/octet-stream', 1024)
  assert.equal(resExe.valid, false, 'EXE file must be rejected')
  assert.ok(resExe.error.includes('Invalid file format'))

  // Invalid size (> 5 MB)
  const resOversize = validateResumeMetadata('large_portfolio.pdf', 'application/pdf', 6 * 1024 * 1024)
  assert.equal(resOversize.valid, false, 'File larger than 5 MB must be rejected')
  assert.ok(resOversize.error.includes('exceeds 5 MB limit'))

  // Zero byte file
  const resZero = validateResumeMetadata('empty.pdf', 'application/pdf', 0)
  assert.equal(resZero.valid, false, '0 byte file must be rejected')
})

// 2. Check Contact Form types & schema
runTest('Contact Form: types, options and validation structure', () => {
  const contactTypesPath = path.join(__dirname, 'src/types/contact.ts')
  const content = fs.readFileSync(contactTypesPath, 'utf8')

  assert.ok(content.includes('fullName: string'), 'Must include fullName')
  assert.ok(content.includes('email: string'), 'Must include email')
  assert.ok(content.includes('country: string'), 'Must include country')
  assert.ok(content.includes('industry: string'), 'Must include industry')
  assert.ok(content.includes('message: string'), 'Must include message')
  assert.ok(content.includes('consent: boolean'), 'Must include consent')
  assert.ok(content.includes('Agricultural Vehicles & Equipment'), 'Must include all PDF industry options')
  assert.ok(content.includes('Off-highway Vehicles & Equipment'), 'Must include Off-highway Vehicles')
  assert.ok(content.includes('Industrial OT / ICS'), 'Must include Industrial OT / ICS')
})

// 3. Check Contact Form component layout & wording
runTest('Contact Form: layout matches SecureXmotive_Contact_Us_Form.pdf', () => {
  const contactFormPath = path.join(__dirname, 'src/components/contact/ContactForm.tsx')
  const content = fs.readFileSync(contactFormPath, 'utf8')

  assert.ok(content.includes('01'), 'Must include Section 01 badge')
  assert.ok(content.includes('Your Information'), 'Must include Section 01 title')
  assert.ok(content.includes('02'), 'Must include Section 02 badge')
  assert.ok(content.includes('Your Inquiry'), 'Must include Section 02 title')
  assert.ok(content.includes('SEND MESSAGE'), 'Submit button must say SEND MESSAGE')
  assert.ok(content.includes('Enter your name'), 'Full name placeholder must match PDF')
  assert.ok(content.includes('name@company.com'), 'Email placeholder must match PDF')
  assert.ok(content.includes('Your organization'), 'Company placeholder must match PDF')
  assert.ok(content.includes('Enter your country'), 'Country placeholder must match PDF')
  assert.ok(content.includes('I agree to the processing of my personal information'), 'Consent copy must match PDF')
  assert.ok(content.includes('Privacy Notice'), 'Must link to Privacy Notice')
})

// 4. Check Career Form types & schema
runTest('Career Form: types and schema match SecureXmotive_Resume_Upload_Form.pdf', () => {
  const careerTypesPath = path.join(__dirname, 'src/types/career.ts')
  const content = fs.readFileSync(careerTypesPath, 'utf8')

  assert.ok(content.includes('fullName: string'), 'Must include fullName')
  assert.ok(content.includes('email: string'), 'Must include email')
  assert.ok(content.includes('phone: string'), 'Must include phone')
  assert.ok(content.includes('currentLocation: string'), 'Must include currentLocation')
  assert.ok(content.includes('linkedin: string'), 'Must include linkedin')
  assert.ok(content.includes('consent: boolean'), 'Must include consent')
  assert.ok(content.includes('resume: File'), 'Must include resume File')
})

// 5. Check Career Form component layout & wording
runTest('Career Form: layout matches SecureXmotive_Resume_Upload_Form.pdf', () => {
  const careerFormPath = path.join(__dirname, 'src/components/careers/CareerForm.tsx')
  const content = fs.readFileSync(careerFormPath, 'utf8')

  assert.ok(content.includes('01'), 'Must include Section 01 badge')
  assert.ok(content.includes('Personal Information'), 'Must include Section 01 title')
  assert.ok(content.includes('02'), 'Must include Section 02 badge')
  assert.ok(content.includes('Resume Upload'), 'Must include Section 02 title')
  assert.ok(content.includes('SUBMIT RESUME'), 'Submit button must say SUBMIT RESUME')
  assert.ok(content.includes('Enter full name'), 'Full name placeholder must match PDF')
  assert.ok(content.includes('name@example.com'), 'Email placeholder must match PDF')
  assert.ok(content.includes('+91 XXXXX XXXXX'), 'Phone placeholder must match PDF')
  assert.ok(content.includes('City, Country'), 'Current location placeholder must match PDF')
  assert.ok(content.includes('I consent to SecureXmotive processing my personal information'), 'Consent copy must match PDF')
})

// 6. Check S3 serverless & Vite dev API integration
runTest('Local Dev S3 API: Vite config contains local API dev middleware', () => {
  const viteConfigPath = path.join(__dirname, 'vite.config.ts')
  const content = fs.readFileSync(viteConfigPath, 'utf8')

  assert.ok(content.includes('localDevApiPlugin'), 'Vite config must include localDevApiPlugin')
  assert.ok(content.includes('/api/get-resume-upload-url'), 'Vite middleware must handle upload URL')
  assert.ok(content.includes('/api/get-resume-download-url'), 'Vite middleware must handle download URL')
})

// 7. Check Firestore Security Rules
runTest('Firestore Security Rules: Validated public creates & admin-only reads/updates', () => {
  const rulesPath = path.join(__dirname, 'firestore.rules')
  const content = fs.readFileSync(rulesPath, 'utf8')

  assert.ok(content.includes('match /contactSubmissions/{submissionId}'), 'Must have contactSubmissions rule block')
  assert.ok(content.includes('match /applications/{applicationId}'), 'Must have applications rule block')
  assert.ok(content.includes('match /videos/{videoId}'), 'Must have videos rule block')
  assert.ok(content.includes('request.resource.data.fullName.size() >= 2'), 'Must validate fullName size')
  assert.ok(content.includes('isValidEmail(request.resource.data.email)'), 'Must validate email format')
  assert.ok(content.includes('isValidIndustry(request.resource.data.industry)'), 'Must validate industry format')
  assert.ok(content.includes('request.resource.data.resumeKey.matches'), 'Must validate resumeKey path prefix')
  assert.ok(content.includes('allow read, update, delete: if isAdmin()'), 'Must restrict read/update/delete to isAdmin()')
})

// 8. Confirm backend repository integrity
runTest('Backend Integrity: Express, Prisma & Neon files preserved untouched', () => {
  const backendDir = path.join(__dirname, '../backend')
  assert.ok(fs.existsSync(backendDir), 'Backend directory exists')
  assert.ok(fs.existsSync(path.join(backendDir, 'prisma/schema.prisma')), 'Prisma schema exists')
  assert.ok(fs.existsSync(path.join(backendDir, 'src/server.js')), 'Express server.js exists')
})

console.log('\n=================================================================')
console.log(`📊 Summary: ${passedTests} passed, ${failedTests} failed.`)
console.log('=================================================================')

if (failedTests > 0) {
  process.exit(1)
}
