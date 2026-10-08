import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon, ExternalLinkIcon } from '@/components/common/icons'
import type { Video } from '@/types/video'
import { getYouTubeEmbedUrl } from '@/utils/youtube'
import ItemMeta from './ItemMeta'

interface VideoModalProps {
  video: Video | null
  isOpen: boolean
  onClose: () => void
}

/**
 * Theater-mode video player modal for the Knowledge Centre.
 * Plays YouTube video directly on the site with full 16:9 cinematic presentation,
 * backdrop blur, keyboard dismiss (Esc), and light-dismiss on backdrop click.
 */
export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !video) return null

  const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl, true)

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      {/* Dark blur backdrop (light-dismiss on click) */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl lg:max-w-4xl flex-col overflow-hidden rounded-2xl border border-cyber-teal/35 bg-[#181818] shadow-2xl shadow-cyber-teal/10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top bar with title and close button */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-[#141414]">
          <div className="flex items-center gap-2.5 overflow-hidden pr-3">
            <span className="flex size-2 rounded-full bg-cyber-teal shadow-glow animate-pulse" />
            <span className="font-code text-2xs uppercase tracking-widest text-cyber-teal font-semibold shrink-0">
              Video Briefing
            </span>
            <span className="text-white/20">|</span>
            <h2
              id="video-modal-title"
              className="truncate font-display text-sm sm:text-base font-bold text-white tracking-wide"
            >
              {video.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-code text-xs text-cyber-muted hover:border-cyber-teal/40 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close video player"
            >
              <CloseIcon className="size-4" />
              <span className="hidden sm:inline text-2xs text-cyber-muted/80">Esc</span>
            </button>
          </div>
        </div>

        {/* Video Player (16:9 responsive embed) */}
        <div className="relative aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="size-full border-0"
              loading="eager"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center p-6 text-center">
              <p className="font-display text-base text-white">Video unavailable for direct embed</p>
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-cyber-teal/40 bg-cyber-teal/15 px-4 py-2 font-code text-xs text-cyber-teal hover:bg-cyber-teal/25"
              >
                <span>Watch on YouTube</span>
                <ExternalLinkIcon className="size-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Bottom Details Bar */}
        <div className="flex flex-col gap-3 border-t border-white/10 bg-[#161616] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <ItemMeta publishedAt={video.publishedAt} />
            {video.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-cyber-muted">
                {video.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-code text-xs text-cyber-muted hover:border-cyber-teal/40 hover:text-cyber-teal transition-colors"
              title="Open video on YouTube in a new tab"
            >
              <span>Watch on YouTube</span>
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
