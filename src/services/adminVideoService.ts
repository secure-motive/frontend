import { API_ENDPOINTS, apiRequest } from './api'
import type { AdminVideo, VideoFormValues } from '@/admin/types/video'
import { getYoutubeThumbnail } from '@/admin/utils/videoUtils'

export interface BackendVideo {
  id: string
  title: string
  description: string | null
  youtubeUrl: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

interface VideoListResponse {
  success: boolean
  data: BackendVideo[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface VideoDetailResponse {
  success: boolean
  message?: string
  data: BackendVideo
}

export function mapBackendVideo(item: BackendVideo): AdminVideo {
  return {
    id: item.id,
    title: item.title,
    description: item.description || '',
    youtubeUrl: item.youtubeUrl,
    thumbnailUrl: getYoutubeThumbnail(item.youtubeUrl) || undefined,
    isPublished: item.isPublished,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

export const adminVideoService = {
  /**
   * Fetch all videos (published & unpublished) for administration.
   */
  async getVideos(params?: { page?: number; limit?: number }, signal?: AbortSignal): Promise<{
    videos: AdminVideo[]
    total: number
  }> {
    const res = await apiRequest<VideoListResponse>(API_ENDPOINTS.adminVideos, {
      method: 'GET',
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 100,
      },
      signal,
    })

    const rawList = Array.isArray(res.data) ? res.data : []
    const videos = rawList.map(mapBackendVideo)
    const total = res.pagination?.total ?? videos.length

    return { videos, total }
  },

  /**
   * Fetch a single video record by ID.
   */
  async getVideoById(id: string, signal?: AbortSignal): Promise<AdminVideo> {
    const res = await apiRequest<VideoDetailResponse>(`${API_ENDPOINTS.adminVideos}/${id}`, {
      method: 'GET',
      signal,
    })
    return mapBackendVideo(res.data)
  },

  /**
   * Create a new video entry.
   */
  async createVideo(values: VideoFormValues): Promise<AdminVideo> {
    const res = await apiRequest<VideoDetailResponse>(API_ENDPOINTS.adminVideos, {
      method: 'POST',
      body: {
        title: values.title.trim(),
        description: values.description ? values.description.trim() : null,
        youtubeUrl: values.youtubeUrl.trim(),
        isPublished: values.isPublished,
      },
    })
    return mapBackendVideo(res.data)
  },

  /**
   * Update video record.
   */
  async updateVideo(id: string, values: Partial<VideoFormValues>): Promise<AdminVideo> {
    const body: Record<string, unknown> = {}
    if (values.title !== undefined) body.title = values.title.trim()
    if (values.description !== undefined) body.description = values.description.trim() || null
    if (values.youtubeUrl !== undefined) body.youtubeUrl = values.youtubeUrl.trim()
    if (values.isPublished !== undefined) body.isPublished = values.isPublished

    const res = await apiRequest<VideoDetailResponse>(`${API_ENDPOINTS.adminVideos}/${id}`, {
      method: 'PUT',
      body,
    })
    return mapBackendVideo(res.data)
  },

  /**
   * Delete video record.
   */
  async deleteVideo(id: string): Promise<void> {
    await apiRequest<void>(`${API_ENDPOINTS.adminVideos}/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Publish a video.
   */
  async publishVideo(id: string): Promise<AdminVideo> {
    const res = await apiRequest<VideoDetailResponse>(`${API_ENDPOINTS.adminVideos}/${id}/publish`, {
      method: 'PATCH',
    })
    return mapBackendVideo(res.data)
  },

  /**
   * Unpublish a video.
   */
  async unpublishVideo(id: string): Promise<AdminVideo> {
    const res = await apiRequest<VideoDetailResponse>(`${API_ENDPOINTS.adminVideos}/${id}/unpublish`, {
      method: 'PATCH',
    })
    return mapBackendVideo(res.data)
  },
}
