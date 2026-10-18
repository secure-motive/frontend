import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import {
  checkRateLimit,
  getClientIp,
  applyRateLimitHeaders,
} from '../src/server/rate-limiter.ts'
import {
  isHoneypotTriggered,
  isSubmissionTooFast,
  isDuplicateSubmission,
  generateFingerprint,
  sanitizeString,
  isValidEmailFormat,
} from '../src/server/anti-spam.ts'

export const PERMITTED_INDUSTRIES = [
  'Automotive',
  'Agricultural Vehicles & Equipment',
  'Off-highway Vehicles & Equipment',
  'Trucks & Buses',
  'Industrial OT / ICS',
  'Automotive Supplier / Tier 1 / Tier 2',
  'Other',
] as const

function getFirebaseDb() {
  const apiKey =
    process.env.VITE_FIREBASE_API_KEY ||
    process.env.FIREBASE_API_KEY ||
    'AIzaSyC1TyVkbXbQVjBS8EN5koK8BekPzuZ0PlM'
  const projectId =
    process.env.VITE_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    'xmotivebase'

  const config = {
    apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    appId: process.env.VITE_FIREBASE_APP_ID || '1:663045401238:web:cb875176fef173aee2f0b7',
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(config)
  return getFirestore(app)
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  // 1. Client IP rate limiting
  const clientIp = getClientIp(req)
  const rateLimitResult = await checkRateLimit('contactSubmission', clientIp)
  applyRateLimitHeaders(res, rateLimitResult)

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      error: `Contact submission limit exceeded. Please try again in ${Math.ceil(rateLimitResult.retryAfterSeconds / 60)} minutes.`,
      retryAfter: rateLimitResult.retryAfterSeconds,
    })
  }

  try {
    const rawBody = req.body
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody || {}

    // 2. Anti-spam honeypot
    if (isHoneypotTriggered(body._gotcha ?? body.honeypot ?? body.website)) {
      return res.status(400).json({ error: 'Invalid submission parameters.' })
    }

    // 3. Minimum submission timing check
    if (body._renderTime) {
      const timing = isSubmissionTooFast(body._renderTime)
      if (timing.tooFast) {
        return res.status(400).json({ error: 'Submission processed too quickly. Please submit normally.' })
      }
    }

    // 4. Duplicate submission / idempotency check
    const fingerprint = generateFingerprint([body.email, body.message])
    if (isDuplicateSubmission(fingerprint)) {
      return res.status(400).json({ error: 'Duplicate submission detected. Your message was already received.' })
    }

    // 5. Strict input validation and sanitization
    const fullName = sanitizeString(body.fullName, 200)
    if (!fullName || fullName.length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters long.' })
    }

    const email = String(body.email || '').trim().toLowerCase()
    if (!isValidEmailFormat(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' })
    }

    const country = sanitizeString(body.country, 100)
    if (!country || country.length < 2) {
      return res.status(400).json({ error: 'Please enter a valid country name.' })
    }

    const industry = String(body.industry || '').trim()
    if (!(PERMITTED_INDUSTRIES as readonly string[]).includes(industry)) {
      return res.status(400).json({ error: 'Please select a valid industry category.' })
    }

    const message = sanitizeString(body.message, 10000)
    if (!message || message.length < 2) {
      return res.status(400).json({ error: 'Message must be at least 2 characters long.' })
    }

    if (!body.consent) {
      return res.status(400).json({ error: 'Consent to personal data processing is required.' })
    }

    const company = sanitizeString(body.company || 'Direct Inquiry', 100)
    const jobTitle = sanitizeString(body.jobTitle || '', 100)

    const nameParts = fullName.split(/\s+/)
    const firstName = nameParts[0] || 'Inquirer'
    const lastName = nameParts.slice(1).join(' ')

    const payload = {
      fullName,
      firstName,
      lastName,
      email,
      company: company || 'Direct Inquiry',
      jobTitle,
      country,
      industry,
      service: industry,
      message,
      consent: true,
      isRead: false,
      read: false,
      submittedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    }

    // 6. Write record to Firestore
    const db = getFirebaseDb()
    const docRef = await addDoc(collection(db, 'contactSubmissions'), payload)

    return res.status(200).json({
      success: true,
      id: docRef.id,
    })
  } catch (err: unknown) {
    console.error('[submit-contact server error]:', err)
    return res.status(500).json({
      error: 'Failed to process inquiry. Please try again later.',
    })
  }
}
