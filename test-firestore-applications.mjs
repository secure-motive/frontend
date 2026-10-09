/**
 * Verification test for Firestore Career Applications Service
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

const APPLICATIONS_COLLECTION = 'applications'

const VALID_STATUSES = {
  NEW: 'NEW',
  PENDING: 'NEW',
  REVIEWED: 'REVIEWED',
  SHORTLISTED: 'SHORTLISTED',
  ARCHIVED: 'ARCHIVED',
  REJECTED: 'ARCHIVED',
}

function parseFirestoreDate(val) {
  if (!val) return new Date().toISOString()
  if (val instanceof Timestamp) {
    return val.toDate().toISOString()
  }
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
  if (val instanceof Date) {
    return val.toISOString()
  }
  return new Date().toISOString()
}

function mapFirestoreApplication(docSnap) {
  const data = docSnap.data() || {}
  const rawStatus = String(data.status || 'NEW').toUpperCase().trim()
  const status = VALID_STATUSES[rawStatus] || 'NEW'

  let fullName = String(data.fullName || '').trim()
  if (!fullName && (data.firstName || data.lastName)) {
    fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim()
  }
  if (!fullName) {
    fullName = 'Applicant'
  }

  const submittedAt = parseFirestoreDate(data.submittedAt || data.createdAt)

  return {
    id: docSnap.id,
    fullName,
    email: String(data.email || ''),
    phone: String(data.phone || ''),
    experience: String(data.experience || data.yearsOfExperience || 'Not specified'),
    role: String(data.role || data.position || 'Career Applicant'),
    linkedin: String(data.linkedin || ''),
    resumeFileName: String(data.resumeFileName || data.resumeOriginalName || data.resumeName || 'resume.pdf'),
    resumeFileSize: data.resumeFileSize ? String(data.resumeFileSize) : 'PDF/DOC',
    coverNote: String(data.coverNote || data.experienceSummary || data.notes || data.message || ''),
    status,
    submittedAt,
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

console.log('\n--- TEST 1: Schema Normalization & Date Parsing (Unit Tests) ---')

// Test date parsing with various formats
const now = new Date()
const ts = Timestamp.fromDate(now)
report('Timestamp parsing', parseFirestoreDate(ts) === now.toISOString(), parseFirestoreDate(ts))
report('ISO string parsing', parseFirestoreDate('2026-10-09T12:00:00.000Z') === '2026-10-09T12:00:00.000Z', 'Valid ISO')
report('Epoch number parsing', typeof parseFirestoreDate(1728475200000) === 'string', parseFirestoreDate(1728475200000))
report('Null fallback parsing', typeof parseFirestoreDate(null) === 'string', 'Returns current ISO')

// Test document mapping with various field patterns
const mockDoc1 = {
  id: 'app-001',
  data: () => ({
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 555-0100',
    experience: '5 years',
    role: 'Automotive Security Engineer',
    linkedin: 'linkedin.com/in/janedoe',
    resumeFileName: 'Jane_Doe_Resume.pdf',
    coverNote: 'Excited to apply.',
    status: 'NEW',
    createdAt: ts,
  }),
}

const mapped1 = mapFirestoreApplication(mockDoc1)
report('Mapping complete document (id)', mapped1.id === 'app-001', mapped1.id)
report('Mapping complete document (fullName)', mapped1.fullName === 'Jane Doe', mapped1.fullName)
report('Mapping complete document (status)', mapped1.status === 'NEW', mapped1.status)
report('Mapping complete document (role)', mapped1.role === 'Automotive Security Engineer', mapped1.role)

const mockDoc2 = {
  id: 'app-002',
  data: () => ({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    yearsOfExperience: '3 years',
    position: 'Penetration Tester',
    resumeOriginalName: 'CV.docx',
    notes: 'Cover letter note',
    status: 'pending',
  }),
}

const mapped2 = mapFirestoreApplication(mockDoc2)
report('Mapping split name (firstName+lastName)', mapped2.fullName === 'John Smith', mapped2.fullName)
report('Mapping alias fields (yearsOfExperience)', mapped2.experience === '3 years', mapped2.experience)
report('Mapping alias fields (position)', mapped2.role === 'Penetration Tester', mapped2.role)
report('Mapping status normalization (pending -> NEW)', mapped2.status === 'NEW', mapped2.status)
report('Mapping resumeOriginalName fallback', mapped2.resumeFileName === 'CV.docx', mapped2.resumeFileName)

console.log('\n--- TEST 2: Firestore Security & Live Query Checks ---')
try {
  const colRef = collection(db, APPLICATIONS_COLLECTION)
  await getDocs(colRef)
  report('Unauthenticated applications read', false, 'Expected permission-denied')
} catch (err) {
  const code = err?.code || 'unknown'
  if (code === 'permission-denied') {
    report('Unauthenticated applications read', true, `Correctly denied with code: ${code}`)
  } else {
    report('Unauthenticated applications read', false, `Unexpected error: ${code} — ${err.message}`)
  }
}

// Authenticated live check if credentials supplied
const adminEmail = process.env.ADMIN_EMAIL
const adminPass = process.env.ADMIN_PASS

if (adminEmail && adminPass) {
  console.log('\n--- TEST 3: Authenticated Firestore Application Operations ---')
  try {
    await signInWithEmailAndPassword(auth, adminEmail, adminPass)
    console.log(`Authenticated as: ${auth.currentUser?.email}`)

    const colRef = collection(db, APPLICATIONS_COLLECTION)
    const snap = await getDocs(colRef)
    report('Authenticated read applications collection', true, `Loaded ${snap.docs.length} applications`)
  } catch (err) {
    report('Authenticated read applications collection', false, `${err?.code}: ${err.message}`)
  }
} else {
  console.log('\n[SKIP] Set ADMIN_EMAIL and ADMIN_PASS to run live authenticated read/write tests against Firebase.')
}

console.log(`\n========================================`)
console.log(`Summary: ${passed} passed, ${failed} failed (${passed + failed} total)`)
console.log(`========================================`)
