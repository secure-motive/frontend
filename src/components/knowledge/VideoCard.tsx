import { useState } from 'react'
import Card from '@/components/common/Card'
import {
  CloseIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  PlayIcon,
} from '@/components/common/icons'
import type { Video } from '@/types/video'
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/utils/youtube'
import ItemMeta from './ItemMeta'

interface VideoCardProps {
  video: Video
  /** Whether this video is currently playing inline on the page. */
  isPlaying?: boolean
  /** Handler to activate inline playback for this video. */
  onPlay?: () => void
  /** Handler to stop inline playback and collapse back to thumbnail. */
  onClose?: () => void
  /** Handler to open this video in full cinematic theater modal. */
  onTheater?: () => void
}

/**
 * Knowledge Centre video card.
 *
 * Supports direct in-page playback (inline player), theater mode modal view,
 * and optional direct YouTube link without leaving the site by default.
 */
export default function VideoCard({
  video,
  isPlaying: controlledIsPlaying,
  onPlay: controlledOnPlay,
  onClose: controlledOnClose,
  onTheater,
}: VideoCardProps) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false)
  const [thumbnailFailed, setThumbnailFailed] = useState(false)

  const isPlaying = controlledIsPlaying ?? internalIsPlaying
  const handlePlay = controlledOnPlay ?? (() => setInternalIsPlaying(true))
  const handleClose = controlledOnClose ?? (() => setInternalIsPlaying(false))

  const thumbnail = video.thumbnailUrl ?? getYouTubeThumbnail(video.youtubeUrl)
  const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl, true)

  // ---------------------------------------------------------------------------
  // Active inline playback state (compact normal size)
  // ---------------------------------------------------------------------------
  if (isPlaying) {
    return (
      <div className="flex flex-col gap-4 sm:gap-5 rounded-card border border-cyber-teal/40 bg-cyber-surface p-4 sm:p-5 shadow-glow transition duration-300 sm:flex-row sm:items-start">
        {/* Responsive 16:9 embedded player (normal proportional width) */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-cyber-teal/25 bg-black shadow-lg sm:w-80 md:w-96">
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
            <div className="flex size-full flex-col items-center justify-center p-4 text-center text-cyber-muted">
              <p className="font-display text-sm text-white">Playback unavailable for this link</p>
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-cyber-teal/40 bg-cyber-teal/15 px-3 py-1 font-code text-xs text-cyber-teal"
              >
                <span>Open on YouTube</span>
                <ExternalLinkIcon className="size-3" />
              </a>
            </div>
          )}
        </div>

        {/* Video meta and control toolbar */}
        <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex size-2 rounded-full bg-cyber-teal shadow-glow animate-pulse" />
              <span className="font-code text-2xs uppercase tracking-widest text-cyber-teal font-semibold">
                Playing on page
              </span>
              <span className="text-white/20">·</span>
              <ItemMeta publishedAt={video.publishedAt} />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-wide text-white">
              {video.title}
            </h2>
            {video.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-cyber-muted line-clamp-3">
                {video.description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyber-teal/40 bg-cyber-teal/15 px-3 py-1.5 font-code text-xs font-semibold text-cyber-teal hover:bg-cyber-teal/25 transition-colors"
              title="Close player and return to thumbnail"
            >
              <CloseIcon className="size-3.5" />
              <span>Close Player</span>
            </button>

            {onTheater && (
              <button
                type="button"
                onClick={onTheater}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-code text-xs text-cyber-muted hover:border-cyber-teal/40 hover:bg-white/10 hover:text-white transition-colors"
                title="Expand to theater modal"
              >
                <MaximizeIcon className="size-3.5" />
                <span>Theater View</span>
              </button>
            )}

            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-code text-xs text-cyber-muted hover:border-white/20 hover:text-white transition-colors"
              title="Open video on YouTube in a new tab"
            >
              <span>YouTube</span>
              <ExternalLinkIcon className="size-3" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Thumbnail list view state (card is clickable to play inline)
  // ---------------------------------------------------------------------------
  return (
    <Card
      onClick={handlePlay}
      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start group cursor-pointer"
    >
      {/* 16:9 Thumbnail box with hover play button */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-cyber-teal/15 bg-cyber-field sm:w-60 group-hover:border-cyber-teal/40 transition-colors">
        {thumbnail && !thumbnailFailed && (
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            onError={() => setThumbnailFailed(true)}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/10">
          <span className="flex size-11 items-center justify-center rounded-full border border-cyber-teal/40 bg-cyber-bg/85 text-cyber-teal shadow-lg transition duration-300 group-hover:scale-110 group-hover:border-cyber-teal group-hover:shadow-glow">
            <PlayIcon className="size-5 fill-cyber-teal/20 translate-x-0.5" />
          </span>
        </div>
      </div>

      {/* Video information */}
      <div className="min-w-0 flex-1">
        <ItemMeta publishedAt={video.publishedAt} />
        <h2 className="mt-1 font-display text-lg font-semibold tracking-wide text-white transition-colors group-hover:text-cyber-teal">
          {video.title}
        </h2>
        {video.description && (
          <p className="mt-1 line-clamp-2 sm:line-clamp-3 text-sm leading-relaxed text-cyber-muted">
            {video.description}
          </p>
        )}

        {/* Action pills bar */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyber-teal/30 bg-cyber-teal/10 px-3 py-1 font-code text-2xs font-semibold text-cyber-teal transition-colors group-hover:bg-cyber-teal/20 group-hover:border-cyber-teal/50">
            <PlayIcon className="size-3" />
            <span>Play on page</span>
          </span>

          {onTheater && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onTheater()
              }}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-code text-2xs text-cyber-muted hover:border-cyber-teal/40 hover:bg-white/10 hover:text-white transition-colors"
              title="Open in theater modal"
            >
              <MaximizeIcon className="size-3" />
              <span>Theater view</span>
            </button>
          )}

          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-code text-2xs text-cyber-muted hover:border-white/20 hover:text-white transition-colors"
            title="Open on YouTube in new tab"
          >
            <span>YouTube</span>
            <ExternalLinkIcon className="size-3" />
          </a>
        </div>
      </div>

      {/* Visual cue icon on right edge */}
      <div className="mt-1 hidden shrink-0 sm:flex sm:items-center text-cyber-muted transition-colors group-hover:text-cyber-teal">
        <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 group-hover:border-cyber-teal/40 group-hover:bg-cyber-teal/10 transition-colors">
          <PlayIcon className="size-4" />
        </span>
      </div>
    </Card>
  )
}
