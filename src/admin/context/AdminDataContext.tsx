import { useEffect, useMemo, useState, useCallback, useRef, type ReactNode } from 'react'
import { useAdminAuth } from '../auth/useAdminAuth'
import { adminApplicationService } from '@/services/adminApplicationService'
import { adminMessageService } from '@/services/adminMessageService'
import { adminVideoService } from '@/services/adminVideoService'
import {
  fetchDashboardStats,
  getFirestoreStatsErrorMessage,
} from '@/services/firestoreDashboardService'
import type { AdminStats } from '../types/admin'
import type { AdminApplication, ApplicationStatus } from '../types/application'
import type { AdminContactMessage } from '../types/message'
import type { AdminVideo, VideoFormValues } from '../types/video'
import { AdminDataContext } from './AdminDataContextDefinition'

/** Default zero-state for dashboard statistics. */
const EMPTY_STATS: AdminStats = {
  totalApplications: 0,
  totalMessages: 0,
  totalVideos: 0,
  publishedVideos: 0,
  draftVideos: 0,
  newApplicationsCount: 0,
  unreadMessagesCount: 0,
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, firebaseUser, isLoading: isAuthLoading } = useAdminAuth()

  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [messages, setMessages] = useState<AdminContactMessage[]>([])
  const [videos, setVideos] = useState<AdminVideo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Firestore dashboard statistics (Phase 6)
  const [firestoreStats, setFirestoreStats] = useState<AdminStats>(EMPTY_STATS)
  const [statsLoading, setStatsLoading] = useState<boolean>(false)
  const [statsError, setStatsError] = useState<string | null>(null)
  // Guard against duplicate concurrent Firestore requests
  const statsRequestRef = useRef<number>(0)

  /**
   * Fetch dashboard statistics from Firestore.
   * Ensures auth is settled and firebaseUser is active before initiating queries.
   */
  const refreshStats = useCallback(async () => {
    if (!isAuthenticated || isAuthLoading || !firebaseUser) return

    const requestId = ++statsRequestRef.current
    setStatsLoading(true)
    setStatsError(null)

    try {
      const stats = await fetchDashboardStats()
      // Only apply if this is still the latest request (prevents race conditions)
      if (requestId === statsRequestRef.current) {
        setFirestoreStats(stats)
      }
    } catch (err) {
      console.error('[Firestore Stats] Dashboard statistics fetch failed:', err)
      if (requestId === statsRequestRef.current) {
        setStatsError(getFirestoreStatsErrorMessage(err))
      }
    } finally {
      if (requestId === statsRequestRef.current) {
        setStatsLoading(false)
      }
    }
  }, [isAuthenticated, isAuthLoading, firebaseUser])

  // Fetch all collections from Cloud Firestore when authenticated
  const refreshAll = useCallback(async () => {
    if (!isAuthenticated || isAuthLoading || !firebaseUser) return

    setIsLoading(true)
    setError(null)

    // Kick off Firestore stats refresh concurrently
    void refreshStats()

    try {
      const [appsResult, msgsResult, vidsResult] = await Promise.allSettled([
        adminApplicationService.getApplications({ page: 1, limit: 100 }),
        adminMessageService.getMessages({ page: 1, limit: 100 }),
        adminVideoService.getVideos({ page: 1, limit: 100 }),
      ])

      if (appsResult.status === 'fulfilled') {
        setApplications(appsResult.value.applications)
      } else {
        console.error('[Firestore Applications] Failed to load applications:', appsResult.reason)
      }

      if (msgsResult.status === 'fulfilled') {
        setMessages(msgsResult.value.messages)
      } else {
        console.error('[Firestore Messages] Failed to load messages:', msgsResult.reason)
      }

      if (vidsResult.status === 'fulfilled') {
        setVideos(vidsResult.value.videos)
      } else {
        console.error('[Firestore Videos] Failed to load videos:', vidsResult.reason)
      }

      // If all three collections failed, surface an error
      if (
        appsResult.status === 'rejected' &&
        msgsResult.status === 'rejected' &&
        vidsResult.status === 'rejected'
      ) {
        setError('Failed to load data from Cloud Firestore. Please check your network connection.')
      }
    } catch (err) {
      console.error('Data refresh error:', err)
      setError('An unexpected error occurred while loading data.')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, isAuthLoading, firebaseUser, refreshStats])

  // Trigger initial fetch when authentication state is confirmed
  useEffect(() => {
    let isMounted = true

    if (isAuthenticated && !isAuthLoading && firebaseUser) {
      void Promise.resolve().then(() => {
        if (isMounted) void refreshAll()
      })
    } else if (!isAuthenticated && !isAuthLoading) {
      // Clear data when unauthenticated
      void Promise.resolve().then(() => {
        if (isMounted) {
          setApplications([])
          setMessages([])
          setVideos([])
          setError(null)
          setFirestoreStats(EMPTY_STATS)
          setStatsError(null)
        }
      })
    }

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, isAuthLoading, firebaseUser, refreshAll])

  /**
   * Merged statistics: Firestore stats are authoritative for dashboard
   * counts. When Firestore stats are available, use them. Fall back to
   * locally-computed stats from loaded data only if Firestore stats are
   * still at the zero initial state (not yet loaded).
   */
  const stats = useMemo<AdminStats>(() => {
    if (!statsLoading && (firestoreStats !== EMPTY_STATS || statsError)) {
      return firestoreStats
    }

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
  }, [firestoreStats, statsLoading, statsError, applications, messages, videos])

  // Combined loading state: either collection records or dashboard stats are loading
  const combinedLoading = isLoading || statsLoading

  // Combined error
  const combinedError = useMemo(() => {
    if (statsError && error) {
      if (statsError === error) return statsError
      return `${statsError} — Additionally: ${error}`
    }
    return statsError || error
  }, [statsError, error])

  // Synchronous cache lookup helpers
  const getApplication = useCallback((id: string) => applications.find((a) => a.id === id), [applications])
  const getMessage = useCallback((id: string) => messages.find((m) => m.id === id), [messages])
  const getVideo = useCallback((id: string) => videos.find((v) => v.id === id), [videos])

  // Direct backend / Firestore fetchers
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

  // Video CRUD actions connected to Cloud Firestore
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

  // Applications & Messages actions
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

  // Local & Firestore UI status helpers
  const markMessageAsRead = useCallback(async (id: string) => {
    try {
      await adminMessageService.markMessageAsRead(id, true)
    } catch (err) {
      console.error('[Firestore Messages] Failed to mark message as read in Firestore:', err)
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)))
  }, [])

  const updateApplicationStatus = useCallback(async (id: string, status: ApplicationStatus) => {
    await adminApplicationService.updateApplicationStatus(id, status)
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }, [])

  return (
    <AdminDataContext.Provider
      value={{
        applications,
        messages,
        videos,
        stats,
        isLoading: combinedLoading,
        error: combinedError,
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
      }}
    >
      {children}
    </AdminDataContext.Provider>
  )
}
