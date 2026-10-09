import { createContext } from 'react'
import type { AdminStats } from '../types/admin'
import type { AdminApplication, ApplicationStatus } from '../types/application'
import type { AdminContactMessage } from '../types/message'
import type { AdminVideo, VideoFormValues } from '../types/video'

export interface AdminDataContextValue {
  applications: AdminApplication[]
  messages: AdminContactMessage[]
  videos: AdminVideo[]
  stats: AdminStats

  // Loading & error states
  isLoading: boolean
  error: string | null
  refreshAll: () => Promise<void>

  // Synchronous cache lookup helpers
  getApplication: (id: string) => AdminApplication | undefined
  getMessage: (id: string) => AdminContactMessage | undefined
  getVideo: (id: string) => AdminVideo | undefined

  // Direct backend fetchers for deep-links/refreshes
  fetchApplication: (id: string) => Promise<AdminApplication>
  fetchMessage: (id: string) => Promise<AdminContactMessage>
  fetchVideo: (id: string) => Promise<AdminVideo>

  // Video CRUD connected to real backend
  addVideo: (values: VideoFormValues) => Promise<AdminVideo>
  updateVideo: (id: string, values: Partial<VideoFormValues>) => Promise<AdminVideo | null>
  deleteVideo: (id: string) => Promise<boolean>
  toggleVideoPublish: (id: string) => Promise<boolean>

  // Applications & Messages backend actions
  deleteApplication: (id: string) => Promise<boolean>
  deleteMessage: (id: string) => Promise<boolean>
  getResumeDownloadUrl: (id: string) => Promise<{ url: string; fileName: string; expiresIn: number }>

  // Local & Firestore UI status helpers
  markMessageAsRead: (id: string) => Promise<void> | void
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void> | void

  // Reset / reload
  resetAllData: () => void
}

export const AdminDataContext = createContext<AdminDataContextValue | null>(null)
