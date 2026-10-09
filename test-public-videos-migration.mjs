/**
 * Verification Test: Public Video Firestore Migration
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

console.log('=================================================================')
console.log('🎬 Running Public Video Section Firestore Migration Tests...')
console.log('=================================================================')

// Test 1: Verify firestoreVideoService exports getPublishedVideos
const firestoreVideoContent = fs.readFileSync(
  path.resolve('src/services/firestoreVideoService.ts'),
  'utf-8'
)
assert.ok(
  firestoreVideoContent.includes('getPublishedVideos(): Promise<Video[]>'),
  'firestoreVideoService must implement getPublishedVideos'
)
assert.ok(
  firestoreVideoContent.includes("where('isPublished', '==', true)"),
  'firestoreVideoService must filter for isPublished == true'
)
console.log('✅ [PASS] firestoreVideoService: getPublishedVideos querying Firestore published videos')

// Test 2: Verify videoService delegates directly to Firestore without Express API
const videoServiceContent = fs.readFileSync(
  path.resolve('src/services/videoService.ts'),
  'utf-8'
)
assert.ok(
  !videoServiceContent.includes('apiRequest'),
  'videoService must NOT make apiRequest calls'
)
assert.ok(
  !videoServiceContent.includes('API_ENDPOINTS.videos'),
  'videoService must NOT call API_ENDPOINTS.videos'
)
assert.ok(
  videoServiceContent.includes('firestoreVideoService.getPublishedVideos()'),
  'videoService must delegate to firestoreVideoService.getPublishedVideos()'
)
console.log('✅ [PASS] videoService: Obsolete Express /api/videos call completely removed')

// Test 3: Verify useVideos hook does not rely on legacy API_ENABLED switch
const useVideosContent = fs.readFileSync(
  path.resolve('src/hooks/useVideos.ts'),
  'utf-8'
)
assert.ok(
  !useVideosContent.includes('API_ENABLED'),
  'useVideos must not check API_ENABLED switch'
)
assert.ok(
  useVideosContent.includes('fetchPublishedVideos(controller.signal)'),
  'useVideos must invoke fetchPublishedVideos'
)
console.log('✅ [PASS] useVideos: Loads Firestore published videos seamlessly')

// Test 4: Verify Firestore security rules protect draft videos and allow published videos
const rulesContent = fs.readFileSync(path.resolve('firestore.rules'), 'utf-8')
assert.ok(
  rulesContent.includes('match /videos/{videoId}'),
  'firestore.rules must contain /videos/{videoId} rule'
)
assert.ok(
  rulesContent.includes('allow read: if (resource.data.published == true || resource.data.isPublished == true) || isAdmin();'),
  'firestore.rules must restrict public reads to published videos'
)
assert.ok(
  rulesContent.includes('allow write: if isAdmin();'),
  'firestore.rules must allow write only to admin'
)
console.log('✅ [PASS] Firestore Security Rules: Public reads restricted to published videos only')

console.log('=================================================================')
console.log('📊 Summary: All 4 video migration tests passed successfully.')
console.log('=================================================================')
