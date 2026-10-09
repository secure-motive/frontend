/**
 * Firestore Dashboard Statistics Service
 *
 * Retrieves document counts from Cloud Firestore collections using
 * server-side aggregation queries (getCountFromServer). This avoids
 * downloading all documents just to count them.
 *
 * Collections:
 * - `applications`        — Career applications
 * - `contactSubmissions`  — Contact-form inquiries
 * - `videos`              — Knowledge-centre videos (field: `isPublished`)
 */
import {
  collection,
  query,
  where,
  getCountFromServer,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { AdminStats } from '@/admin/types/admin'

/** Firestore collection names (shared across migration phases). */
export const FIRESTORE_COLLECTIONS = {
  applications: 'applications',
  contactSubmissions: 'contactSubmissions',
  videos: 'videos',
} as const

/**
 * Safely count documents in a collection, returning 0 for genuinely empty
 * collections and throwing on permission or network errors so callers
 * can distinguish "zero records" from "access denied".
 */
async function countCollection(collectionName: string): Promise<number> {
  const ref = collection(db, collectionName)
  const snapshot = await getCountFromServer(query(ref))
  return snapshot.data().count
}

/**
 * Count documents in a collection that match a `where` clause.
 */
async function countCollectionWhere(
  collectionName: string,
  field: string,
  value: unknown,
): Promise<number> {
  const ref = collection(db, collectionName)
  const q = query(ref, where(field, '==', value))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

/**
 * Fetch all dashboard statistics from Firestore in parallel.
 *
 * Each counter is fetched independently so a permission error on one
 * collection does not suppress results from others.
 */
export async function fetchDashboardStats(): Promise<AdminStats> {
  // Ensure Firebase Auth is active before executing Firestore queries
  const currentUser = auth.currentUser
  if (!currentUser) {
    console.warn('[Firestore Stats] Attempted to fetch statistics without an active Firebase session.')
    const unauthError = new Error('You are not authenticated with Firebase. Please sign in again.')
    ;(unauthError as { code?: string }).code = 'unauthenticated'
    throw unauthError
  }

  const [
    totalApplicationsResult,
    totalMessagesResult,
    totalVideosResult,
    publishedVideosResult,
  ] = await Promise.allSettled([
    countCollection(FIRESTORE_COLLECTIONS.applications),
    countCollection(FIRESTORE_COLLECTIONS.contactSubmissions),
    countCollection(FIRESTORE_COLLECTIONS.videos),
    countCollectionWhere(FIRESTORE_COLLECTIONS.videos, 'isPublished', true),
  ])

  // If every single request failed, throw the first error so callers
  // can show a meaningful error banner rather than misleading zeros.
  const allFailed = [
    totalApplicationsResult,
    totalMessagesResult,
    totalVideosResult,
    publishedVideosResult,
  ].every((r) => r.status === 'rejected')

  if (allFailed) {
    const firstReason = (totalApplicationsResult as PromiseRejectedResult).reason
    console.error(
      '[Firestore Stats] All collection queries failed. Diagnostic info:',
      {
        uid: currentUser.uid,
        email: currentUser.email,
        projectId: db.app.options.projectId,
        error: firstReason,
      },
    )
    throw firstReason
  }

  // Log individual failures so the developer can see which collection
  // had an error, but do not mask the rest.
  if (totalApplicationsResult.status === 'rejected') {
    console.error(
      `[Firestore Stats] Failed to count "${FIRESTORE_COLLECTIONS.applications}":`,
      totalApplicationsResult.reason,
    )
  }
  if (totalMessagesResult.status === 'rejected') {
    console.error(
      `[Firestore Stats] Failed to count "${FIRESTORE_COLLECTIONS.contactSubmissions}":`,
      totalMessagesResult.reason,
    )
  }
  if (totalVideosResult.status === 'rejected') {
    console.error(
      `[Firestore Stats] Failed to count "${FIRESTORE_COLLECTIONS.videos}":`,
      totalVideosResult.reason,
    )
  }
  if (publishedVideosResult.status === 'rejected') {
    console.error(
      `[Firestore Stats] Failed to count published "${FIRESTORE_COLLECTIONS.videos}":`,
      publishedVideosResult.reason,
    )
  }

  const totalApplications =
    totalApplicationsResult.status === 'fulfilled' ? totalApplicationsResult.value : 0
  const totalMessages =
    totalMessagesResult.status === 'fulfilled' ? totalMessagesResult.value : 0
  const totalVideos =
    totalVideosResult.status === 'fulfilled' ? totalVideosResult.value : 0
  const publishedVideos =
    publishedVideosResult.status === 'fulfilled' ? publishedVideosResult.value : 0

  return {
    totalApplications,
    totalMessages,
    totalVideos,
    publishedVideos,
    draftVideos: totalVideos - publishedVideos,
    newApplicationsCount: 0,
    unreadMessagesCount: 0,
  }
}

/**
 * Translate Firestore errors into user-friendly dashboard messages.
 */
export function getFirestoreStatsErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: string }).code)
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

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred while loading dashboard statistics.'
}
