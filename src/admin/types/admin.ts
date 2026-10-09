export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'SUPER_ADMIN' | 'SECURITY_ANALYST' | 'CONTENT_MANAGER'
  avatarUrl?: string
  lastLoginAt?: string
}

export interface AdminStats {
  totalApplications: number
  totalMessages: number
  totalVideos: number
  publishedVideos: number
  draftVideos: number
  newApplicationsCount: number
  unreadMessagesCount: number
}
