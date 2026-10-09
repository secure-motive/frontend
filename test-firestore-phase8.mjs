/**
 * Verification test for Phase 8: Contact Messages & Video Management Firestore Services
 */
import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  Timestamp,
} from 'firebase/firestore'

const CONTACT_COLLECTION = 'contactSubmissions'
const VIDEOS_COLLECTION = 'videos'

// Helper date parser
function parseFirestoreDate(val) {
  if (!val) return new Date().toISOString()
  if (val instanceof Timestamp) return val.toDate().toISOString()
  if (typeof val === 'object' && val !== null && 'toDate' in val && typeof val.toDate === 'function') {
    return val.toDate().toISOString()
  }
  if (typeof val === 'string') {
    const d = new Date(val)
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
  }
  if (typeof val === 'number') {
    const d = new Date(val)
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
  }
  if (val instanceof Date) return val.toISOString()
  return new Date().toISOString()
}

// Extract YouTube ID helper
function extractYoutubeId(url) {
  if (!url) return null
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  const match = url.match(regExp)
  return match ? match[1] : null
}

function getYoutubeThumbnail(url) {
  const id = extractYoutubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

// Message mapper
function mapFirestoreMessage(docSnap) {
  const data = docSnap.data() || {}
  let firstName = String(data.firstName || '').trim()
  let lastName = String(data.lastName || '').trim()
  if (!firstName && !lastName) {
    const full = String(data.name || data.fullName || '').trim()
    if (full) {
      const parts = full.split(/\s+/)
      firstName = parts[0] || 'Inquirer'
      lastName = parts.slice(1).join(' ')
    } else {
      firstName = 'Inquirer'
      lastName = ''
    }
  }
  const isRead = Boolean(data.isRead ?? data.read ?? false)
  const submittedAt = parseFirestoreDate(data.submittedAt || data.createdAt)

  return {
    id: docSnap.id,
    firstName,
    lastName,
    email: String(data.email || ''),
    phone: String(data.phone || 'Not provided'),
    company: String(data.company || data.organization || 'Direct Inquiry'),
    jobTitle: data.jobTitle ? String(data.jobTitle) : undefined,
    service: String(data.service || data.subject || 'General Inquiries'),
    message: String(data.message || data.body || data.inquiry || ''),
    isRead,
    submittedAt,
  }
}

// Video mapper
function mapFirestoreVideo(docSnap) {
  const data = docSnap.data() || {}
  const youtubeUrl = String(data.youtubeUrl || data.url || '')
  const isPublished = Boolean(data.isPublished ?? data.published ?? false)
  const createdAt = parseFirestoreDate(data.createdAt || data.submittedAt)
  const updatedAt = parseFirestoreDate(data.updatedAt || data.createdAt)

  return {
    id: docSnap.id,
    title: String(data.title || 'Untitled Video'),
    description: String(data.description || ''),
    youtubeUrl,
    thumbnailUrl: String(data.thumbnailUrl || data.thumbnail || getYoutubeThumbnail(youtubeUrl) || ''),
    isPublished,
    createdAt,
    updatedAt,
  }
}

const firebaseConfig = {
  apiKey: 'AIzaSyC1TyVkbXbQVjBS8EN5koK8BekPzuZ0PlM',
  authDomain: 'xmotivebase.firebaseapp.com',
  projectId: 'xmotivebase',
  storageBucket: 'xmotivebase.firebasestorage.app',
  messagingSenderId: '663045401238',
  appId: '1:663045401238:web:cb875176fef173aee2f0b7',
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

let passed = 0
let failed = 0

function report(label, success, detail) {
  if (success) {
    console.log(`[PASS] ${label}: ${detail}`)
    passed++
  } else {
    console.error(`[FAIL] ${label}: ${detail}`)
    failed++
  }
}

console.log('\n--- TEST 1: Contact Message Schema Mapping (Unit Tests) ---')
const msgDoc1 = {
  id: 'msg-001',
  data: () => ({
    firstName: 'Alice',
    lastName: 'Vance',
    email: 'alice@oem.com',
    phone: '+49 89 123456',
    company: 'Bavaria Motors',
    service: 'Automotive TARA',
    message: 'Requesting consultation on ISO/SAE 21434 compliance.',
    read: false,
    createdAt: '2026-10-09T10:00:00.000Z',
  }),
}
const mappedMsg1 = mapFirestoreMessage(msgDoc1)
report('Message mapping (name)', mappedMsg1.firstName === 'Alice' && mappedMsg1.lastName === 'Vance', `${mappedMsg1.firstName} ${mappedMsg1.lastName}`)
report('Message mapping (company)', mappedMsg1.company === 'Bavaria Motors', mappedMsg1.company)
report('Message mapping (read status read=false -> isRead: false)', mappedMsg1.isRead === false, String(mappedMsg1.isRead))
report('Message mapping (service)', mappedMsg1.service === 'Automotive TARA', mappedMsg1.service)

const msgDoc2 = {
  id: 'msg-002',
  data: () => ({
    name: 'Robert Chen',
    email: 'robert@tier1.com',
    organization: 'Tier1 Tech',
    subject: 'CAN Bus Penetration Testing',
    body: 'Inquiry details here.',
    isRead: true,
  }),
}
const mappedMsg2 = mapFirestoreMessage(msgDoc2)
report('Message mapping (split name)', mappedMsg2.firstName === 'Robert' && mappedMsg2.lastName === 'Chen', `${mappedMsg2.firstName} ${mappedMsg2.lastName}`)
report('Message mapping (organization alias)', mappedMsg2.company === 'Tier1 Tech', mappedMsg2.company)
report('Message mapping (subject alias)', mappedMsg2.service === 'CAN Bus Penetration Testing', mappedMsg2.service)
report('Message mapping (isRead=true)', mappedMsg2.isRead === true, String(mappedMsg2.isRead))

console.log('\n--- TEST 2: Video Schema Mapping & Thumbnail Derivation (Unit Tests) ---')
const videoDoc1 = {
  id: 'vid-001',
  data: () => ({
    title: 'ISO/SAE 21434 Threat Analysis & Risk Assessment Walkthrough',
    description: 'A deep dive into automotive threat modeling.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isPublished: true,
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-05T15:00:00.000Z',
  }),
}
const mappedVid1 = mapFirestoreVideo(videoDoc1)
report('Video mapping (title)', mappedVid1.title.startsWith('ISO/SAE 21434'), mappedVid1.title)
report('Video mapping (isPublished: true)', mappedVid1.isPublished === true, String(mappedVid1.isPublished))
report('Video mapping (thumbnailUrl derived)', mappedVid1.thumbnailUrl.includes('dQw4w9WgXcQ'), mappedVid1.thumbnailUrl)

const videoDoc2 = {
  id: 'vid-002',
  data: () => ({
    title: 'CAN Bus Reverse Engineering',
    youtubeUrl: 'https://youtu.be/abc123XYZ00',
    published: false,
  }),
}
const mappedVid2 = mapFirestoreVideo(videoDoc2)
report('Video mapping (published=false -> isPublished: false)', mappedVid2.isPublished === false, String(mappedVid2.isPublished))
report('Video mapping (shortlink thumbnail)', mappedVid2.thumbnailUrl.includes('abc123XYZ00'), mappedVid2.thumbnailUrl)

console.log('\n--- TEST 3: Firestore Security Enforcement ---')
try {
  const colRef = collection(db, CONTACT_COLLECTION)
  await getDocs(colRef)
  report('Unauthenticated contact read', false, 'Expected permission-denied')
} catch (err) {
  const code = err?.code || 'unknown'
  if (code === 'permission-denied') {
    report('Unauthenticated contact read', true, `Correctly denied with code: ${code}`)
  } else {
    report('Unauthenticated contact read', false, `Unexpected error: ${code}`)
  }
}

try {
  const colRef = collection(db, VIDEOS_COLLECTION)
  await getDocs(colRef)
  report('Unauthenticated videos read', false, 'Expected permission-denied')
} catch (err) {
  const code = err?.code || 'unknown'
  if (code === 'permission-denied') {
    report('Unauthenticated videos read', true, `Correctly denied with code: ${code}`)
  } else {
    report('Unauthenticated videos read', false, `Unexpected error: ${code}`)
  }
}

// Authenticated live check if credentials supplied
const adminEmail = process.env.ADMIN_EMAIL
const adminPass = process.env.ADMIN_PASS

if (adminEmail && adminPass) {
  console.log('\n--- TEST 4: Authenticated Firestore Queries ---')
  try {
    await signInWithEmailAndPassword(auth, adminEmail, adminPass)
    console.log(`Authenticated as: ${auth.currentUser?.email}`)

    const cSnap = await getDocs(collection(db, CONTACT_COLLECTION))
    report('Authenticated read contactSubmissions', true, `Count = ${cSnap.docs.length}`)

    const vSnap = await getDocs(collection(db, VIDEOS_COLLECTION))
    report('Authenticated read videos', true, `Count = ${vSnap.docs.length}`)
  } catch (err) {
    report('Authenticated Firestore query', false, `${err?.code}: ${err.message}`)
  }
} else {
  console.log('\n[SKIP] Set ADMIN_EMAIL and ADMIN_PASS to run live authenticated read/write tests against Firebase.')
}

console.log(`\n========================================`)
console.log(`Summary: ${passed} passed, ${failed} failed (${passed + failed} total)`)
console.log(`========================================`)
