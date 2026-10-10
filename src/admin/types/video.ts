export interface AdminVideo {
  id: string
  title: string
  description: string
  youtubeUrl: string
  thumbnailUrl?: string
  isPublished: boolean
  order?: number
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

export interface VideoFormValues {
  title: string
  description: string
  youtubeUrl: string
  isPublished: boolean
  order?: number
}
