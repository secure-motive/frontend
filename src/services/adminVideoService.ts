/**
 * Admin Video Service
 *
 * Migrated to Cloud Firestore (Phase 8).
 * Interacts directly with the Firestore `videos` collection.
 */
import type { AdminVideo, VideoFormValues } from '@/admin/types/video'
import { firestoreVideoService } from './firestoreVideoService'

export interface BackendVideo {
  id: string
  title: string
  description: string | null
  youtubeUrl: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export const adminVideoService = {
  /**
   * Fetch all videos for administration from Cloud Firestore.
   */
  async getVideos(params?: { page?: number; limit?: number }, _signal?: AbortSignal): Promise<{
    videos: AdminVideo[]
    total: number
  }> {
    return firestoreVideoService.getVideos({ limit: params?.limit ?? 100 })
  },

  /**
   * Fetch a single video record by ID from Cloud Firestore.
   */
  async getVideoById(id: string, _signal?: AbortSignal): Promise<AdminVideo> {
    return firestoreVideoService.getVideoById(id)
  },

  /**
   * Create a new video entry in Cloud Firestore.
   */
  async createVideo(values: VideoFormValues): Promise<AdminVideo> {
    return firestoreVideoService.createVideo(values)
  },

  /**
   * Update video record in Cloud Firestore.
   */
  async updateVideo(id: string, values: Partial<VideoFormValues>): Promise<AdminVideo> {
    return firestoreVideoService.updateVideo(id, values)
  },

  /**
   * Delete video record from Cloud Firestore.
   */
  async deleteVideo(id: string): Promise<void> {
    return firestoreVideoService.deleteVideo(id)
  },

  /**
   * Publish a video in Cloud Firestore.
   */
  async publishVideo(id: string): Promise<AdminVideo> {
    return firestoreVideoService.publishVideo(id)
  },

  /**
   * Unpublish a video in Cloud Firestore.
   */
  async unpublishVideo(id: string): Promise<AdminVideo> {
    return firestoreVideoService.unpublishVideo(id)
  },
}
