import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useAdminData } from '../context/useAdminData'
import { useAdminToast } from '../components/useAdminToast'
import { extractYoutubeId, getYoutubeThumbnail } from '../utils/videoUtils'
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent } from '../components/AdminCard'
import { AdminButton } from '../components/AdminButton'
import { ArrowLeftIcon, AlertTriangleIcon, CheckIcon } from '../components/AdminIcons'
import type { AdminVideo } from '../types/video'

interface VideoEditFormProps {
  video: AdminVideo
}

function VideoEditForm({ video }: VideoEditFormProps) {
  const navigate = useNavigate()
  const { updateVideo } = useAdminData()
  const { showToast } = useAdminToast()

  const [title, setTitle] = useState(video.title)
  const [description, setDescription] = useState(video.description)
  const [youtubeUrl, setYoutubeUrl] = useState(video.youtubeUrl)
  const [isPublished, setIsPublished] = useState(video.isPublished)
  const [order, setOrder] = useState<number | string>(video.order ?? 1)

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSaving, setIsSaving] = useState(false)

  // Derived YouTube preview
  const detectedVideoId = extractYoutubeId(youtubeUrl)
  const thumbnailPreviewUrl = detectedVideoId ? getYoutubeThumbnail(youtubeUrl) : null

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!title.trim()) {
      newErrors.title = 'Video title is required.'
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters.'
    }

    if (!description.trim()) {
      newErrors.description = 'Video description is required.'
    }

    if (!youtubeUrl.trim()) {
      newErrors.youtubeUrl = 'YouTube URL is required.'
    } else if (!detectedVideoId) {
      newErrors.youtubeUrl = 'Please provide a valid YouTube video URL.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    try {
      const parsedOrder = Number(order)
      const updated = await updateVideo(video.id, {
        title,
        description,
        youtubeUrl,
        isPublished,
        order: !isNaN(parsedOrder) && parsedOrder > 0 ? parsedOrder : 1,
      })

      if (updated) {
        showToast('Changes Saved', {
          detail: `"${updated.title}" has been updated in the database.`,
          type: 'success',
        })
      }

      navigate('/admin/videos')
    } catch (err) {
      showToast('Save Failed', {
        detail: err instanceof Error ? err.message : 'Could not save video updates.',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Title */}
      <div>
        <label
          htmlFor="video-title"
          className="mb-2 block font-code text-xs tracking-widest text-cyber-muted uppercase"
        >
          Video Title <span className="text-cyber-teal">*</span>
        </label>
        <input
          id="video-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Automotive Cybersecurity Threat Landscape 2026"
          className="w-full rounded-lg border border-white/10 bg-[#161616] px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:border-cyber-teal/60 focus:outline-none"
        />
        {errors.title && (
          <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-red-400">
            <AlertTriangleIcon className="size-3.5" />
            <span>{errors.title}</span>
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="video-desc"
          className="mb-2 block font-code text-xs tracking-widest text-cyber-muted uppercase"
        >
          Description / Summary <span className="text-cyber-teal">*</span>
        </label>
        <textarea
          id="video-desc"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Summarize the core takeaways, technical standards discussed, and automotive context..."
          className="w-full rounded-lg border border-white/10 bg-[#161616] px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:border-cyber-teal/60 focus:outline-none resize-y"
        />
        {errors.description && (
          <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-red-400">
            <AlertTriangleIcon className="size-3.5" />
            <span>{errors.description}</span>
          </p>
        )}
      </div>

      {/* YouTube URL */}
      <div>
        <label
          htmlFor="video-youtube"
          className="mb-2 block font-code text-xs tracking-widest text-cyber-muted uppercase"
        >
          YouTube Video URL <span className="text-cyber-teal">*</span>
        </label>
        <input
          id="video-youtube"
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-lg border border-white/10 bg-[#161616] px-4 py-3 font-code text-xs text-white placeholder-white/30 focus:border-cyber-teal/60 focus:outline-none"
        />
        {errors.youtubeUrl && (
          <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-red-400">
            <AlertTriangleIcon className="size-3.5" />
            <span>{errors.youtubeUrl}</span>
          </p>
        )}

        {/* Thumbnail Preview if detected */}
        {detectedVideoId && thumbnailPreviewUrl && (
          <div className="mt-4 rounded-xl border border-white/10 bg-[#141414] p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative aspect-video w-44 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
              <img
                src={thumbnailPreviewUrl}
                alt="Detected video preview"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 font-code text-3xs text-cyber-teal uppercase font-bold">
                Preview
              </span>
            </div>
            <div className="text-left space-y-1">
              <p className="font-code text-2xs text-cyber-teal uppercase tracking-wider flex items-center gap-1">
                <CheckIcon className="size-3" /> Valid YouTube Video Link
              </p>
              <p className="font-code text-xs text-white">ID: {detectedVideoId}</p>
              <p className="font-body text-2xs text-cyber-muted">
                Thumbnail is automatically resolved from YouTube CDN.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Display Order / Priority */}
      <div className="rounded-xl border border-white/10 bg-[#141414] p-4">
        <label htmlFor="edit-video-order" className="font-display text-sm font-bold text-white block">
          Display Order / Priority
        </label>
        <p className="font-body text-xs text-cyber-muted mt-0.5 mb-3">
          Determines video sequence on the Knowledge Centre page. Lower numbers appear first (e.g. 1 is top/first).
        </p>
        <div className="flex items-center gap-3">
          <input
            id="edit-video-order"
            type="number"
            min={1}
            step={1}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-28 rounded-lg border border-white/10 bg-[#161616] px-3.5 py-2 font-code text-sm text-white focus:border-cyber-teal/60 focus:outline-none"
          />
          <span className="font-code text-2xs text-cyber-teal">
            Position #{order || 1}
          </span>
        </div>
      </div>

      {/* Publication Status Toggle */}
      <div className="rounded-xl border border-white/10 bg-[#141414] p-4 flex items-center justify-between">
        <div>
          <label htmlFor="edit-publish-toggle" className="font-display text-sm font-bold text-white block">
            Published on Website
          </label>
          <p className="font-body text-xs text-cyber-muted mt-0.5">
            When published, this video will appear publicly in the Knowledge Centre video section.
          </p>
        </div>

        <button
          id="edit-publish-toggle"
          type="button"
          role="switch"
          aria-checked={isPublished}
          onClick={() => setIsPublished(!isPublished)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-cyber-teal ${
            isPublished ? 'bg-cyber-teal' : 'bg-white/15'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isPublished ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Submit / Cancel Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <AdminButton
          to="/admin/videos"
          variant="outline"
          disabled={isSaving}
        >
          Cancel
        </AdminButton>

        <AdminButton
          type="submit"
          variant="primary"
          isLoading={isSaving}
        >
          Save Changes
        </AdminButton>
      </div>
    </form>
  )
}

export default function AdminVideoEdit() {
  const { id } = useParams<{ id: string }>()
  const { getVideo, fetchVideo } = useAdminData()
  const cachedVideo = id ? getVideo(id) : undefined
  const [fetchedVideo, setFetchedVideo] = useState<AdminVideo | null>(null)
  const video = cachedVideo ?? fetchedVideo ?? undefined

  const [isLoading, setIsLoading] = useState<boolean>(!cachedVideo)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || cachedVideo) return
    let isMounted = true

    const load = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const v = await fetchVideo(id)
        if (isMounted) setFetchedVideo(v)
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Video not found.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [id, cachedVideo, fetchVideo])

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Link
          to="/admin/videos"
          className="inline-flex items-center gap-2 font-code text-xs text-cyber-muted hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back to Videos</span>
        </Link>
        <AdminCard className="p-12 text-center">
          <p className="font-display text-base font-semibold text-white animate-pulse">
            Loading video record...
          </p>
        </AdminCard>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Link
          to="/admin/videos"
          className="inline-flex items-center gap-2 font-code text-xs text-cyber-muted hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back to Videos</span>
        </Link>
        <AdminCard className="p-12 text-center">
          <h2 className="font-display text-xl font-bold text-white uppercase">
            Video Not Found
          </h2>
          <p className="mt-2 font-body text-sm text-cyber-muted">
            {error || `The video with ID "${id}" was not found.`}
          </p>
          <div className="mt-6">
            <AdminButton to="/admin/videos" variant="primary">
              Return to Video List
            </AdminButton>
          </div>
        </AdminCard>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/videos"
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 font-code text-xs text-cyber-muted hover:border-cyber-teal/40 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Cancel</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="font-code text-xs text-cyber-muted truncate max-w-[200px]">
            Edit &ldquo;{video.title}&rdquo;
          </span>
        </div>
      </div>

      <AdminCard>
        <AdminCardHeader>
          <div>
            <AdminCardTitle>Edit Video</AdminCardTitle>
            <p className="font-body text-xs text-cyber-muted mt-0.5">
              Update video metadata, YouTube link, or publication status.
            </p>
          </div>
        </AdminCardHeader>

        <AdminCardContent>
          <VideoEditForm key={video.id} video={video} />
        </AdminCardContent>
      </AdminCard>
    </div>
  )
}
