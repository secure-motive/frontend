import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { useAdminData } from '../context/useAdminData'
import { useAdminToast } from '../components/useAdminToast'
import { AdminSearchInput } from '../components/AdminSearchInput'
import { AdminBadge } from '../components/AdminBadge'
import { AdminButton } from '../components/AdminButton'
import { DeleteConfirmModal } from '../components/AdminModal'
import {
  EditIcon,
  TrashIcon,
  ExternalLinkIcon,
} from '../components/AdminIcons'
import { PlusIcon } from '@/components/common/icons'
import { formatDate } from '@/utils/helpers'
import type { AdminVideo } from '../types/video'

export default function AdminVideos() {
  const { videos, isLoading, error, refreshAll, deleteVideo, toggleVideoPublish } = useAdminData()
  const { showToast } = useAdminToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL')
  const [videoToDelete, setVideoToDelete] = useState<AdminVideo | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const filteredVideos = useMemo(() => {
    let result = [...videos]

    if (statusFilter === 'PUBLISHED') {
      result = result.filter((v) => v.isPublished)
    } else if (statusFilter === 'DRAFT') {
      result = result.filter((v) => !v.isPublished)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.youtubeUrl.toLowerCase().includes(q),
      )
    }

    // Sort by updated date descending
    result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return result
  }, [videos, searchQuery, statusFilter])

  const handleTogglePublish = async (video: AdminVideo) => {
    setTogglingId(video.id)
    try {
      const nextState = await toggleVideoPublish(video.id)
      showToast(
        nextState ? `Video Published` : `Video Moved to Draft`,
        {
          detail: `"${video.title.slice(0, 40)}..." is now ${nextState ? 'visible' : 'hidden'} on the public site.`,
          type: nextState ? 'success' : 'info',
        },
      )
    } catch (err) {
      showToast('Toggle Failed', {
        detail: err instanceof Error ? err.message : 'Could not change publication status.',
        type: 'error',
      })
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return
    setIsDeleting(true)
    try {
      const deleted = await deleteVideo(videoToDelete.id)
      if (deleted) {
        showToast('Video Deleted', {
          detail: `"${videoToDelete.title.slice(0, 40)}..." has been removed.`,
          type: 'success',
        })
      }
    } catch (err) {
      showToast('Delete Failed', {
        detail: err instanceof Error ? err.message : 'Could not delete video record.',
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
      setVideoToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-code text-2xs tracking-widest text-cyber-teal uppercase font-semibold">
              Knowledge Centre
            </span>
            <span className="text-white/20">·</span>
            <span className="font-code text-2xs text-cyber-muted tracking-wider">
              {videos.length} Total Videos
            </span>
            {isLoading && (
              <>
                <span className="text-white/20">·</span>
                <span className="font-code text-2xs text-cyber-teal animate-pulse">Loading...</span>
              </>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-white uppercase">
            Video Management
          </h1>
          <p className="mt-1 font-body text-xs sm:text-sm text-cyber-muted">
            Manage cybersecurity tutorials, threat briefings, and video broadcasts.
          </p>
        </div>

        {/* Add video button */}
        <AdminButton
          to="/admin/videos/new"
          variant="primary"
          icon={<PlusIcon className="size-4" />}
        >
          Add New Video
        </AdminButton>
      </div>

      {/* Error state with retry */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
          <div className="flex items-center gap-2.5">
            <span className="font-code font-bold uppercase tracking-wider text-red-400">Error:</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => refreshAll()}
            className="rounded bg-red-500/20 px-3 py-1 font-code text-2xs font-semibold uppercase text-red-200 hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by title, description, or YouTube URL..."
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 font-code text-xs text-cyber-value focus:border-cyber-teal/60 focus:outline-none"
            aria-label="Filter by publication status"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Videos Table Card */}
      <div className="rounded-xl border border-white/10 bg-[#161616] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="Videos table">
            <thead>
              <tr className="border-b border-white/10 bg-[#1a1a1a] font-code text-2xs uppercase tracking-widest text-cyber-muted">
                <th scope="col" className="py-3.5 pl-6 pr-4">Video</th>
                <th scope="col" className="py-3.5 px-4">Status</th>
                <th scope="col" className="py-3.5 px-4">Last Updated</th>
                <th scope="col" className="py-3.5 pl-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-body text-xs">
              {isLoading && videos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-cyber-muted">
                    <p className="font-display text-base font-semibold text-white animate-pulse">
                      Loading videos...
                    </p>
                  </td>
                </tr>
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-cyber-muted">
                    <p className="font-display text-base font-semibold text-white">
                      No videos found
                    </p>
                    <p className="font-body text-xs mt-1">
                      No videos have been added to the database yet.
                    </p>
                    <div className="mt-4">
                      <AdminButton to="/admin/videos/new" variant="outline" size="sm">
                        + Add First Video
                      </AdminButton>
                    </div>
                  </td>
                </tr>
              ) : filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-cyber-muted">
                    <p className="font-display text-base font-semibold text-white">
                      No matching videos
                    </p>
                    <p className="font-body text-xs mt-1">
                      Try adjusting your search criteria or clear status filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video) => (
                  <tr
                    key={video.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Video Info (Thumbnail + Title + Description) */}
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e]">
                          {video.thumbnailUrl ? (
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="size-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center font-code text-3xs text-cyber-muted">
                              NO THUMB
                            </div>
                          )}
                        </div>

                        {/* Text info */}
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/admin/videos/${video.id}/edit`}
                            className="font-display text-sm font-bold text-white hover:text-cyber-teal transition-colors line-clamp-1"
                          >
                            {video.title}
                          </Link>
                          {video.description && (
                            <p className="mt-0.5 font-body text-xs text-cyber-muted line-clamp-1">
                              {video.description}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            <a
                              href={video.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-code text-3xs text-cyber-teal hover:underline truncate max-w-[280px]"
                            >
                              <span>{video.youtubeUrl}</span>
                              <ExternalLinkIcon className="size-3 shrink-0" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={video.isPublished}
                          disabled={togglingId === video.id}
                          onClick={() => handleTogglePublish(video)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-cyber-teal disabled:opacity-50 ${
                            video.isPublished ? 'bg-cyber-teal' : 'bg-white/15'
                          }`}
                          title={video.isPublished ? 'Click to set to Draft' : 'Click to Publish'}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              video.isPublished ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <AdminBadge tone={video.isPublished ? 'teal' : 'muted'}>
                          {video.isPublished ? 'Published' : 'Draft'}
                        </AdminBadge>
                      </div>
                    </td>

                    {/* Last Updated */}
                    <td className="py-4 px-4 font-code text-2xs text-cyber-muted whitespace-nowrap">
                      {formatDate(video.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <AdminButton
                          to={`/admin/videos/${video.id}/edit`}
                          variant="outline"
                          size="xs"
                          icon={<EditIcon className="size-3" />}
                        >
                          Edit
                        </AdminButton>
                        <button
                          type="button"
                          onClick={() => setVideoToDelete(video)}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                          title="Delete video"
                          aria-label={`Delete video ${video.title}`}
                        >
                          <TrashIcon className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-3 font-code text-2xs text-cyber-muted">
          <span>Showing {filteredVideos.length} of {videos.length} videos</span>
          <span>Cloud Firestore Integrated</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {videoToDelete && (
        <DeleteConfirmModal
          isOpen={true}
          onClose={() => setVideoToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="DELETE VIDEO?"
          itemTitle={videoToDelete.title}
          itemType="video"
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}
