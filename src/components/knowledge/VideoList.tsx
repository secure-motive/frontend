import { useState } from 'react'
import { useSearchParams } from 'react-router'
import Button from '@/components/common/Button'
import { useVideos } from '@/hooks/useVideos'
import type { Video } from '@/types/video'
import TabMessage from './TabMessage'
import VideoCard from './VideoCard'
import VideoModal from './VideoModal'

/** The Videos tab: published videos with direct in-page playback, theater modal, and empty/error states. */
export default function VideoList() {
  const { status, videos, retry } = useVideos()
  const [searchParams] = useSearchParams()

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [theaterVideo, setTheaterVideo] = useState<Video | null>(null)

  // Derive active playing video from user selection or URL param (?tab=videos&v=<id>)
  const urlVideoParam = searchParams.get('v')
  const playingVideoId =
    activeVideoId ??
    (urlVideoParam && videos.some((v) => v.id === urlVideoParam) ? urlVideoParam : null)

  const setPlayingVideoId = (id: string | null) => {
    setActiveVideoId(id)
  }

  if (status === 'loading') return <TabMessage>Loading videos…</TabMessage>

  if (status === 'error') {
    return (
      <div className="flex flex-col items-start gap-4">
        <TabMessage tone="error">Videos could not be loaded. Please try again.</TabMessage>
        <Button variant="outline" size="md" onClick={retry}>
          Retry
        </Button>
      </div>
    )
  }

  if (videos.length === 0) return <TabMessage>No videos have been published yet.</TabMessage>

  return (
    <>
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-code text-2xs uppercase tracking-widest text-cyber-teal font-semibold">
            {videos.length} {videos.length === 1 ? 'Video Briefing' : 'Video Briefings'}
          </span>
        </div>

        {playingVideoId && (
          <button
            type="button"
            onClick={() => setPlayingVideoId(null)}
            className="font-code text-2xs text-cyber-muted hover:text-cyber-teal transition-colors underline decoration-dotted"
          >
            Collapse active player
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {videos.map((video) => (
          <li key={video.id}>
            <VideoCard
              video={video}
              isPlaying={playingVideoId === video.id}
              onPlay={() => setPlayingVideoId(video.id)}
              onClose={() => setPlayingVideoId(null)}
              onTheater={() => setTheaterVideo(video)}
            />
          </li>
        ))}
      </ul>

      {/* Cinematic Theater Mode Modal */}
      <VideoModal
        video={theaterVideo}
        isOpen={theaterVideo !== null}
        onClose={() => setTheaterVideo(null)}
      />
    </>
  )
}
