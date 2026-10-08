import type { Video } from '@/types/video'
import { API_ENDPOINTS, apiRequest } from './api'

/**
 * A video as the public endpoint is expected to return it.
 *
 * PROVISIONAL — the backend was not available when this was written. Check the
 * field names (and whether the list is wrapped in an envelope) against the real
 * response, and adjust `toVideo` below; nothing else in the app needs to change.
 */
interface ApiVideo {
  id: string | number
  title: string
  description?: string | null
  youtubeUrl: string
  thumbnail?: string | null
  /** Absent is treated as published: the public endpoint should only return those. */
  published?: boolean
  createdAt?: string | null
}

function toVideo(item: ApiVideo): Video {
  return {
    id: String(item.id),
    title: item.title,
    description: item.description ?? '',
    youtubeUrl: item.youtubeUrl,
    thumbnailUrl: item.thumbnail ?? undefined,
    publishedAt: item.createdAt ?? undefined,
  }
}

/** The card links to this address, so only ordinary web links are let through. */
function hasWebLink(item: ApiVideo): boolean {
  return typeof item.youtubeUrl === 'string' && /^https?:\/\//i.test(item.youtubeUrl)
}

export async function fetchPublishedVideos(signal?: AbortSignal): Promise<Video[]> {
  const response = await apiRequest<{ success: boolean; data: ApiVideo[] } | ApiVideo[]>(API_ENDPOINTS.videos, { signal })
  const items = Array.isArray(response) ? response : response?.data ?? []
  return items.filter((item) => item.published !== false && hasWebLink(item)).map(toVideo)
}
