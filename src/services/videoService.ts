import type { Video } from '@/types/video'
import { firestoreVideoService } from './firestoreVideoService'

/**
 * Fetch all published videos from Cloud Firestore for the public Knowledge Centre.
 * Unauthenticated public visitors can only read published videos.
 */
export async function fetchPublishedVideos(_signal?: AbortSignal): Promise<Video[]> {
  return firestoreVideoService.getPublishedVideos()
}
