import { useEffect, useState } from 'react'
import { fetchPublishedVideos } from '@/services/videoService'
import type { Video } from '@/types/video'

interface UseVideosResult {
  status: 'loading' | 'ready' | 'error'
  videos: Video[]
  /** Tries the request again after a failure. */
  retry: () => void
}

interface LoadResult {
  /** The attempt this result belongs to; older results are ignored. */
  attempt: number
  videos: Video[] | null
}

/**
 * Knowledge Centre videos hook.
 *
 * Loads published videos from Cloud Firestore once per mount (and again on `retry`).
 */
export function useVideos(): UseVideosResult {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<LoadResult | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchPublishedVideos(controller.signal)
      .then((videos) => {
        if (!controller.signal.aborted) {
          setResult({ attempt, videos })
        }
      })
      .catch((err) => {
        // An aborted request belongs to an unmounted or superseded attempt.
        if (!controller.signal.aborted) {
          console.error('[useVideos] Failed to load published videos from Cloud Firestore:', err)
          setResult({ attempt, videos: null })
        }
      })
    return () => controller.abort()
  }, [attempt])

  const retry = () => setAttempt((current) => current + 1)

  // Loading is derived: there is no result yet for the current attempt.
  if (result?.attempt !== attempt) return { status: 'loading', videos: [], retry }
  if (result.videos === null) return { status: 'error', videos: [], retry }
  return { status: 'ready', videos: result.videos, retry }
}
