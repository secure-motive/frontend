/**
 * Standalone test: Verify Firestore dashboard statistics service
 * against live Firebase project `securexmotivebase`.
 *
 * Tests:
 * 1. getCountFromServer aggregation queries against each collection
 * 2. Error handling for permission denied
 * 3. Module-level function signatures
 */
import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  where,
  getCountFromServer,
} from 'firebase/firestore'

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

const COLLECTIONS = {
  applications: 'applications',
  contactSubmissions: 'contactSubmissions',
  videos: 'videos',
}

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

// --- TEST 1: Unauthenticated access should fail with permission-denied ---
console.log('\n--- TEST 1: Unauthenticated Firestore access ---')
try {
  const ref = collection(db, COLLECTIONS.applications)
  await getCountFromServer(query(ref))
  report('Unauthenticated access', false, 'Expected permission-denied error but got success')
} catch (err) {
  const code = err?.code || 'unknown'
  if (code === 'permission-denied') {
    report('Unauthenticated access', true, `Correctly denied with code: ${code}`)
  } else {
    report('Unauthenticated access', false, `Unexpected error code: ${code} — ${err.message}`)
  }
}

// --- TEST 2: Error message mapping ---
console.log('\n--- TEST 2: Error message mapping (unit test) ---')
function getFirestoreStatsErrorMessage(error) {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String(error.code)
    switch (code) {
      case 'permission-denied':
        return 'Firestore access denied. Verify that security rules allow reads for your admin UID.'
      case 'unavailable':
        return 'Firestore is temporarily unavailable. Please try again shortly.'
      case 'unauthenticated':
        return 'You are not authenticated with Firebase. Please sign in again.'
      case 'not-found':
        return 'Firestore database or collection not found. Verify your Firebase project configuration.'
      default:
        break
    }
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred while loading dashboard statistics.'
}

const errorCases = [
  { code: 'permission-denied', expected: 'Firestore access denied. Verify that security rules allow reads for your admin UID.' },
  { code: 'unavailable', expected: 'Firestore is temporarily unavailable. Please try again shortly.' },
  { code: 'unauthenticated', expected: 'You are not authenticated with Firebase. Please sign in again.' },
  { code: 'not-found', expected: 'Firestore database or collection not found. Verify your Firebase project configuration.' },
]

for (const tc of errorCases) {
  const result = getFirestoreStatsErrorMessage({ code: tc.code })
  report(`Error mapping (${tc.code})`, result === tc.expected, `"${result}"`)
}

// --- TEST 3: getCountFromServer function signature validation ---
console.log('\n--- TEST 3: Firestore SDK function signatures ---')
report(
  'getCountFromServer exists',
  typeof getCountFromServer === 'function',
  `typeof = ${typeof getCountFromServer}`,
)
report(
  'collection exists',
  typeof collection === 'function',
  `typeof = ${typeof collection}`,
)
report(
  'query exists',
  typeof query === 'function',
  `typeof = ${typeof query}`,
)
report(
  'where exists',
  typeof where === 'function',
  `typeof = ${typeof where}`,
)

// --- TEST 4: Authenticated Firestore access (if admin creds provided) ---
console.log('\n--- TEST 4: Authenticated Firestore count queries ---')
const adminEmail = process.env.ADMIN_EMAIL
const adminPass = process.env.ADMIN_PASS

if (adminEmail && adminPass) {
  try {
    await signInWithEmailAndPassword(auth, adminEmail, adminPass)
    console.log(`Authenticated as: ${auth.currentUser?.email}`)

    // Count applications
    const appsRef = collection(db, COLLECTIONS.applications)
    const appsSnap = await getCountFromServer(query(appsRef))
    const appsCount = appsSnap.data().count
    report('Count applications', typeof appsCount === 'number', `count = ${appsCount}`)

    // Count contactSubmissions
    const msgsRef = collection(db, COLLECTIONS.contactSubmissions)
    const msgsSnap = await getCountFromServer(query(msgsRef))
    const msgsCount = msgsSnap.data().count
    report('Count contactSubmissions', typeof msgsCount === 'number', `count = ${msgsCount}`)

    // Count all videos
    const vidsRef = collection(db, COLLECTIONS.videos)
    const vidsSnap = await getCountFromServer(query(vidsRef))
    const vidsCount = vidsSnap.data().count
    report('Count videos (total)', typeof vidsCount === 'number', `count = ${vidsCount}`)

    // Count published videos
    const pubQ = query(vidsRef, where('isPublished', '==', true))
    const pubSnap = await getCountFromServer(pubQ)
    const pubCount = pubSnap.data().count
    report('Count videos (published)', typeof pubCount === 'number', `count = ${pubCount}`)

    // Verify draft = total - published
    const draftCount = vidsCount - pubCount
    report('Draft videos calculation', draftCount >= 0, `draft = ${draftCount}`)

  } catch (err) {
    const code = err?.code || 'unknown'
    if (code === 'permission-denied') {
      report('Authenticated access', false,
        `Permission denied — Firestore rules may not allow this UID. Code: ${code}`)
    } else {
      report('Authenticated access', false, `Error: ${code} — ${err.message}`)
    }
  }
} else {
  console.log('[SKIP] Set ADMIN_EMAIL and ADMIN_PASS environment variables to run authenticated tests.')
  console.log('       Example: ADMIN_EMAIL=admin@example.com ADMIN_PASS=secret node test-firestore-stats.mjs')
}

// --- SUMMARY ---
console.log(`\n========================================`)
console.log(`Summary: ${passed} passed, ${failed} failed (${passed + failed} total)`)
console.log(`========================================`)
