export interface AdminContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle?: string
  service?: string
  message: string
  isRead: boolean
  submittedAt: string // ISO string
}
