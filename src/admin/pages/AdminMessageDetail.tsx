import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useAdminData } from '../context/useAdminData'
import { useAdminToast } from '../components/useAdminToast'
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent } from '../components/AdminCard'
import { AdminButton } from '../components/AdminButton'
import { AdminBadge } from '../components/AdminBadge'
import { ArrowLeftIcon, MessagesIcon, TrashIcon } from '../components/AdminIcons'
import { DeleteConfirmModal } from '../components/AdminModal'
import type { AdminContactMessage } from '../types/message'

export default function AdminMessageDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getMessage, fetchMessage, markMessageAsRead, deleteMessage } = useAdminData()
  const { showToast } = useAdminToast()

  const cachedMsg = id ? getMessage(id) : undefined
  const [fetchedMsg, setFetchedMsg] = useState<AdminContactMessage | null>(null)
  const message = cachedMsg ?? fetchedMsg ?? undefined

  const [isLoading, setIsLoading] = useState<boolean>(!cachedMsg)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  // Fetch inquiry directly from backend if not already in context cache
  useEffect(() => {
    if (!id || cachedMsg) return
    let isMounted = true

    const load = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const msg = await fetchMessage(id)
        if (isMounted) {
          setFetchedMsg(msg)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Message could not be loaded.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [id, cachedMsg, fetchMessage])

  // Automatically mark message as read when opened
  useEffect(() => {
    if (message && !message.isRead) {
      markMessageAsRead(message.id)
    }
  }, [message, markMessageAsRead])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/messages"
          className="inline-flex items-center gap-2 font-code text-xs text-cyber-muted hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back to Messages</span>
        </Link>
        <AdminCard className="p-12 text-center">
          <p className="font-display text-base font-semibold text-white animate-pulse">
            Loading contact inquiry details...
          </p>
        </AdminCard>
      </div>
    )
  }

  if (error || !message) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/messages"
          className="inline-flex items-center gap-2 font-code text-xs text-cyber-muted hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back to Messages</span>
        </Link>
        <AdminCard className="p-12 text-center">
          <h2 className="font-display text-xl font-bold text-white uppercase">
            Message Not Found
          </h2>
          <p className="mt-2 font-body text-sm text-cyber-muted">
            {error || `The requested contact inquiry "${id}" does not exist or has been removed.`}
          </p>
          <div className="mt-6">
            <AdminButton to="/admin/messages" variant="primary">
              View All Messages
            </AdminButton>
          </div>
        </AdminCard>
      </div>
    )
  }

  const handleDeleteMessage = async () => {
    setIsDeleting(true)
    try {
      await deleteMessage(message.id)
      showToast('Message Deleted', {
        detail: `Inquiry from ${message.firstName} ${message.lastName} has been deleted.`,
        type: 'success',
      })
      navigate('/admin/messages')
    } catch (err) {
      showToast('Delete Failed', {
        detail: err instanceof Error ? err.message : 'Could not delete message.',
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const formattedDate = new Date(message.submittedAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/messages')}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 font-code text-xs text-cyber-muted hover:border-cyber-teal/40 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Back to Messages</span>
          </button>
          <span className="text-white/20">/</span>
          <span className="font-code text-xs text-cyber-muted truncate max-w-[200px]">
            {message.firstName} {message.lastName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <AdminBadge tone={message.isRead ? 'muted' : 'teal'}>
            {message.isRead ? 'Status: Read' : 'Status: New'}
          </AdminBadge>

          <a
            href={`mailto:${message.email}?subject=SecureXmotive Response: ${encodeURIComponent(message.service || 'Inquiry')}`}
            className="inline-flex items-center gap-2 rounded-lg bg-cyber-teal px-4 py-2 font-code text-xs font-semibold text-cyber-bg hover:bg-cyber-teal/90 transition-colors uppercase"
          >
            <MessagesIcon className="size-3.5" />
            <span>Reply via Email</span>
          </a>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            title="Delete Message"
            aria-label="Delete message"
          >
            <TrashIcon className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Full Message Body */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div>
                <AdminCardTitle>Message Content</AdminCardTitle>
                <p className="font-body text-xs text-cyber-muted mt-0.5">
                  Submitted on {formattedDate}
                </p>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              <div className="rounded-xl border border-white/5 bg-[#141414] p-6 leading-relaxed">
                <p className="font-body text-sm sm:text-base text-cyber-value whitespace-pre-line break-words">
                  {message.message}
                </p>
              </div>

              {/* Service Requested Badge */}
              <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
                <span className="font-code text-xs text-cyber-muted uppercase">
                  Service Area:
                </span>
                <span className="rounded bg-cyber-teal/10 border border-cyber-teal/20 px-3 py-1 font-code text-xs text-cyber-teal">
                  {message.service || 'General Cybersecurity Inquiries'}
                </span>
              </div>
            </AdminCardContent>
          </AdminCard>
        </div>

        {/* Right Column: Contact Sender Details */}
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Sender Details</AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent className="space-y-4">
              <div className="space-y-1">
                <p className="font-code text-3xs tracking-widest text-cyber-muted uppercase">
                  Full Name
                </p>
                <p className="font-display text-base font-bold text-white">
                  {message.firstName} {message.lastName}
                </p>
                {message.jobTitle && (
                  <p className="font-body text-xs text-cyber-muted">{message.jobTitle}</p>
                )}
              </div>

              <div className="border-t border-white/5 pt-3 space-y-1">
                <p className="font-code text-3xs tracking-widest text-cyber-muted uppercase">
                  Organization / Company
                </p>
                <p className="font-body text-sm font-medium text-white/95">
                  {message.company}
                </p>
              </div>

              <div className="border-t border-white/5 pt-3 space-y-1">
                <p className="font-code text-3xs tracking-widest text-cyber-muted uppercase">
                  Email Address
                </p>
                <a
                  href={`mailto:${message.email}`}
                  className="block font-body text-sm text-cyber-teal hover:underline break-all"
                >
                  {message.email}
                </a>
              </div>

              <div className="border-t border-white/5 pt-3 space-y-1">
                <p className="font-code text-3xs tracking-widest text-cyber-muted uppercase">
                  Phone Number
                </p>
                <a
                  href={`tel:${message.phone}`}
                  className="block font-body text-sm text-cyber-teal hover:underline"
                >
                  {message.phone}
                </a>
              </div>

              <div className="border-t border-white/5 pt-3 space-y-1">
                <p className="font-code text-3xs tracking-widest text-cyber-muted uppercase">
                  Reference ID
                </p>
                <p className="font-code text-xs text-cyber-muted">
                  {message.id}
                </p>
              </div>
            </AdminCardContent>
          </AdminCard>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="DELETE CONTACT INQUIRY"
        itemTitle={`${message.firstName} ${message.lastName}`}
        itemType="contact inquiry"
        isDeleting={isDeleting}
        onConfirm={handleDeleteMessage}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
