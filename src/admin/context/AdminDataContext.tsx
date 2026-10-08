import { useEffect, useMemo, useState, useCallback, type ReactNode } from 'react'
import { useAdminAuth } from '../auth/useAdminAuth'
import { adminApplicationService } from '@/services/adminApplicationService'
import { adminMessageService } from '@/services/adminMessageService'
import { adminVideoService } from '@/services/adminVideoService'
import type { AdminStats } from '../types/admin'
import type { AdminApplication, ApplicationStatus } from '../types/application'
import type { AdminContactMessage } from '../types/message'
import type { AdminVideo, VideoFormValues } from '../types/video'
import { AdminDataContext } from './AdminDataContextDefinition'

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth()

  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [messages, setMessages] = useState<AdminContactMessage[]>([])
  const [videos, setVideos] = useState<AdminVideo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all data from backend when authenticated
  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setError(null)

    try {
      const [appsResult, msgsResult, vidsResult] = await Promise.allSettled([
        adminApplicationService.getApplications({ page: 1, limit: 100 }),
        adminMessageService.getMessages({ page: 1, limit: 100 }),
        adminVideoService.getVideos({ page: 1, limit: 100 }),
      ])

      if (appsResult.status === 'fulfilled') {
        setApplications(appsResult.value.applications)
      } else {
        console.error('Failed to load applications:', appsResult.reason)
      }

      if (msgsResult.status === 'fulfilled') {
        setMessages(msgsResult.value.messages)
      } else {
        console.error('Failed to load messages:', msgsResult.reason)
      }

      if (vidsResult.status === 'fulfilled') {
        setVideos(vidsResult.value.videos)
      } else {
        console.error('Failed to load videos:', vidsResult.reason)
      }

      // If all three failed, surface an aggregate error
      if (
        appsResult.status === 'rejected' &&
        msgsResult.status === 'rejected' &&
        vidsResult.status === 'rejected'
      ) {
        setError('Unable to connect to backend services. Please check network connection.')
      }
    } catch (err) {
      console.error('Data refresh error:', err)
      setError('An unexpected error occurred while loading data.')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  // Trigger initial fetch when authentication state is confirmed
  useEffect(() => {
    let isMounted = true

    if (isAuthenticated) {
      void Promise.resolve().then(() => {
        if (isMounted) void refreshAll()
      })
    } else {
      // Clear data when unauthenticated
      void Promise.resolve().then(() => {
        if (isMounted) {
          setApplications([])
          setMessages([])
          setVideos([])
          setError(null)
        }
      })
    }

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, refreshAll])

  // Compute live statistics based on real backend items
  const stats = useMemo<AdminStats>(() => {
    const publishedVideos = videos.filter((v) => v.isPublished).length
    return {
      totalApplications: applications.length,
      totalMessages: messages.length,
      totalVideos: videos.length,
      publishedVideos,
      draftVideos: videos.length - publishedVideos,
      newApplicationsCount: applications.filter((a) => a.status === 'NEW').length,
      unreadMessagesCount: messages.filter((m) => !m.isRead).length,
    }
  }, [applications, messages, videos])

  // Synchronous cache lookup helpers
  const getApplication = useCallback((id: string) => applications.find((a) => a.id === id), [applications])
  const getMessage = useCallback((id: string) => messages.find((m) => m.id === id), [messages])
  const getVideo = useCallback((id: string) => videos.find((v) => v.id === id), [videos])

  // Direct backend fetchers
  const fetchApplication = useCallback(async (id: string): Promise<AdminApplication> => {
    const app = await adminApplicationService.getApplicationById(id)
    setApplications((prev) => {
      const exists = prev.some((a) => a.id === app.id)
      return exists ? prev.map((a) => (a.id === app.id ? app : a)) : [app, ...prev]
    })
    return app
  }, [])

  const fetchMessage = useCallback(async (id: string): Promise<AdminContactMessage> => {
    const msg = await adminMessageService.getMessageById(id)
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === msg.id)
      return exists ? prev.map((m) => (m.id === msg.id ? msg : m)) : [msg, ...prev]
    })
    return msg
  }, [])

  const fetchVideo = useCallback(async (id: string): Promise<AdminVideo> => {
    const vid = await adminVideoService.getVideoById(id)
    setVideos((prev) => {
      const exists = prev.some((v) => v.id === vid.id)
      return exists ? prev.map((v) => (v.id === vid.id ? vid : v)) : [vid, ...prev]
    })
    return vid
  }, [])

  // Video CRUD actions connected to backend API
  const addVideo = useCallback(async (values: VideoFormValues): Promise<AdminVideo> => {
    const created = await adminVideoService.createVideo(values)
    setVideos((prev) => [created, ...prev.filter((v) => v.id !== created.id)])
    return created
  }, [])

  const updateVideo = useCallback(
    async (id: string, values: Partial<VideoFormValues>): Promise<AdminVideo | null> => {
      const updated = await adminVideoService.updateVideo(id, values)
      setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)))
      return updated
    },
    [],
  )

  const deleteVideo = useCallback(async (id: string): Promise<boolean> => {
    await adminVideoService.deleteVideo(id)
    setVideos((prev) => prev.filter((v) => v.id !== id))
    return true
  }, [])

  const toggleVideoPublish = useCallback(
    async (id: string): Promise<boolean> => {
      const target = videos.find((v) => v.id === id)
      if (!target) return false

      const nextPublished = !target.isPublished
      const updated = nextPublished
        ? await adminVideoService.publishVideo(id)
        : await adminVideoService.unpublishVideo(id)

      setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)))
      return updated.isPublished
    },
    [videos],
  )

  // Applications & Messages backend actions
  const deleteApplication = useCallback(async (id: string): Promise<boolean> => {
    await adminApplicationService.deleteApplication(id)
    setApplications((prev) => prev.filter((a) => a.id !== id))
    return true
  }, [])

  const deleteMessage = useCallback(async (id: string): Promise<boolean> => {
    await adminMessageService.deleteMessage(id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
    return true
  }, [])

  const getResumeDownloadUrl = useCallback(async (id: string) => {
    return await adminApplicationService.getResumeDownloadUrl(id)
  }, [])

  // Local UI status helpers
  const markMessageAsRead = useCallback((id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)))
  }, [])

  const updateApplicationStatus = useCallback((id: string, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }, [])

  const resetAllData = useCallback(() => {
    refreshAll()
  }, [refreshAll])

  return (
    <AdminDataContext.Provider
      value={{
        applications,
        messages,
        videos,
        stats,
        isLoading,
        error,
        refreshAll,
        getApplication,
        getMessage,
        getVideo,
        fetchApplication,
        fetchMessage,
        fetchVideo,
        addVideo,
        updateVideo,
        deleteVideo,
        toggleVideoPublish,
        deleteApplication,
        deleteMessage,
        getResumeDownloadUrl,
        markMessageAsRead,
        updateApplicationStatus,
        resetAllData,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  )
}
