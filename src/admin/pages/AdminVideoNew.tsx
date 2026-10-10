import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAdminData } from '../context/useAdminData'
import { useAdminToast } from '../components/useAdminToast'
import { extractYoutubeId, getYoutubeThumbnail } from '../utils/videoUtils'
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent } from '../components/AdminCard'
import { AdminButton } from '../components/AdminButton'
import { ArrowLeftIcon, AlertTriangleIcon, CheckIcon } from '../components/AdminIcons'

export default function AdminVideoNew() {
  const navigate = useNavigate()
  const { addVideo, videos } = useAdminData()
  const { showToast } = useAdminToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [order, setOrder] = useState<number | string>(videos.length + 1)

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
      newErrors.youtubeUrl = 'Please provide a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...).'
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
      const newVideo = await addVideo({
        title,
        description,
        youtubeUrl,
        isPublished,
        order: !isNaN(parsedOrder) && parsedOrder > 0 ? parsedOrder : videos.length + 1,
      })

      showToast('Video Created Successfully', {
        detail: `"${newVideo.title}" has been added to the database.`,
        type: 'success',
      })

      navigate('/admin/videos')
    } catch (err) {
      showToast('Creation Failed', {
        detail: err instanceof Error ? err.message : 'Failed to save video record.',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
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
          <span className="font-code text-xs text-cyber-muted">New Video</span>
        </div>
      </div>

      <AdminCard>
        <AdminCardHeader>
          <div>
            <AdminCardTitle>Add New Video</AdminCardTitle>
            <p className="font-body text-xs text-cyber-muted mt-0.5">
              Publish a new technical cybersecurity briefing or tutorial.
            </p>
          </div>
        </AdminCardHeader>

        <AdminCardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Title */}
            <div>
              <label
                htmlFor="video-title"
                className="mb-2 block font-code text-xs tracking-widest text-cyber-muted uppercase"
              >
                Video Title <span className="text-cyber-orange">*</span>
              </label>
              <input
                id="video-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Automotive Ethernet MACsec & SOME/IP Security"
                className="w-full rounded-lg border border-cyber-teal/20 bg-cyber-field px-4 py-3 font-body text-sm text-cyber-value placeholder:text-cyber-placeholder/50 transition-colors focus:border-cyber-teal/60 focus:ring-2 focus:ring-cyber-teal/20 focus:outline-none"
              />
              {errors.title && (
                <p className="mt-1.5 font-code text-2xs text-cyber-orange flex items-center gap-1">
                  <AlertTriangleIcon className="size-3" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* YouTube URL */}
            <div>
              <label
                htmlFor="video-url"
                className="mb-2 block font-code text-xs tracking-widest text-cyber-muted uppercase"
              >
                YouTube Video URL <span className="text-cyber-orange">*</span>
              </label>
              <input
                id="video-url"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-lg border border-cyber-teal/20 bg-cyber-field px-4 py-3 font-body text-sm text-cyber-value placeholder:text-cyber-placeholder/50 transition-colors focus:border-cyber-teal/60 focus:ring-2 focus:ring-cyber-teal/20 focus:outline-none"
              />
              {errors.youtubeUrl ? (
                <p className="mt-1.5 font-code text-2xs text-cyber-orange flex items-center gap-1">
                  <AlertTriangleIcon className="size-3" />
                  {errors.youtubeUrl}
                </p>
              ) : detectedVideoId ? (
                <p className="mt-1.5 font-code text-2xs text-emerald-400 flex items-center gap-1">
                  <CheckIcon className="size-3" />
                  Valid YouTube Video ID: {detectedVideoId}
                </p>
              ) : (
                <p className="mt-1.5 font-code text-3xs text-cyber-muted">
                  Supports standard watch links, youtu.be short links, or embed URLs.
                </p>
              )}
            </div>

            {/* Live Thumbnail Preview */}
            {thumbnailPreviewUrl && (
              <div className="rounded-lg border border-white/10 bg-[#121212] p-4 flex items-center gap-4">
                <img
                  src={thumbnailPreviewUrl}
                  alt="YouTube thumbnail preview"
                  className="w-32 h-20 rounded-md object-cover border border-white/10"
                />
                <div>
                  <p className="font-code text-xs font-semibold text-white">
                    Derived YouTube Thumbnail Preview
                  </p>
                  <p className="font-code text-2xs text-cyber-muted mt-0.5">
                    Will be displayed on Knowledge Centre cards
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label
                htmlFor="video-description"
                className="mb-2 block font-code text-xs tracking-widest text-cyber-muted uppercase"
              >
                Description <span className="text-cyber-orange">*</span>
              </label>
              <textarea
                id="video-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive summary of the technical topic, key frameworks, and findings discussed in this video..."
                className="w-full rounded-lg border border-cyber-teal/20 bg-cyber-field px-4 py-3 font-body text-sm text-cyber-value placeholder:text-cyber-placeholder/50 transition-colors focus:border-cyber-teal/60 focus:ring-2 focus:ring-cyber-teal/20 focus:outline-none resize-none leading-relaxed"
              />
              {errors.description && (
                <p className="mt-1.5 font-code text-2xs text-cyber-orange flex items-center gap-1">
                  <AlertTriangleIcon className="size-3" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Display Order / Priority */}
            <div className="rounded-lg border border-white/10 bg-[#141414] p-4">
              <label
                htmlFor="video-order-input"
                className="font-display text-sm font-bold text-white block"
              >
                Display Order / Priority
              </label>
              <p className="font-body text-xs text-cyber-muted mt-0.5 mb-3">
                Determines sequence on the Knowledge Centre video page. Lower numbers appear first (e.g. 1 is top/first).
              </p>
              <div className="flex items-center gap-3">
                <input
                  id="video-order-input"
                  type="number"
                  min={1}
                  step={1}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-28 rounded-lg border border-cyber-teal/20 bg-cyber-field px-3.5 py-2 font-code text-sm text-cyber-value focus:border-cyber-teal/60 focus:ring-2 focus:ring-cyber-teal/20 focus:outline-none"
                />
                <span className="font-code text-2xs text-cyber-teal">
                  Position #{order || 1}
                </span>
              </div>
            </div>

            {/* Published Toggle */}
            <div className="rounded-lg border border-white/10 bg-[#141414] p-4 flex items-center justify-between">
              <div>
                <label
                  htmlFor="video-published-toggle"
                  className="font-display text-sm font-bold text-white block cursor-pointer"
                >
                  Publish Immediately
                </label>
                <p className="font-body text-xs text-cyber-muted mt-0.5">
                  When enabled, this video will be visible immediately in the public Knowledge Centre.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="video-published-toggle"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-teal" />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <AdminButton
                type="button"
                variant="secondary"
                size="md"
                onClick={() => navigate('/admin/videos')}
                disabled={isSaving}
              >
                Cancel
              </AdminButton>
              <AdminButton
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
              >
                Save Video
              </AdminButton>
            </div>
          </form>
        </AdminCardContent>
      </AdminCard>
    </div>
  )
}
