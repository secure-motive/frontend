export type ApplicationStatus = 'NEW' | 'REVIEWED' | 'SHORTLISTED' | 'ARCHIVED'

export interface AdminApplication {
  id: string
  fullName: string
  email: string
  phone: string
  experience: string
  role: string
  linkedin: string
  resumeFileName: string
  resumeFileSize?: string
  coverNote?: string
  status: ApplicationStatus
  submittedAt: string // ISO string
}
