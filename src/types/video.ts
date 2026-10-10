/** A published Knowledge Centre video, as the UI uses it. */
export interface Video {
  id: string
  title: string
  description: string
  /** Link to the video on YouTube; the card opens it in a new tab. */
  youtubeUrl: string
  /** Thumbnail from the backend. When absent, one is derived from the YouTube link. */
  thumbnailUrl?: string
  /** ISO date or date-time. */
  publishedAt?: string
  /** Display order (lower numbers come first). */
  order?: number
}
