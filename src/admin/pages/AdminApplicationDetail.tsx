import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useAdminData } from '../context/useAdminData'
import { useAdminToast } from '../components/useAdminToast'
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent } from '../components/AdminCard'
import { AdminButton } from '../components/AdminButton'
import { AdminBadge } from '../components/AdminBadge'
import { DownloadIcon, ExternalLinkIcon, ArrowLeftIcon, TrashIcon } from '../components/AdminIcons'
import { DeleteConfirmModal } from '../components/AdminModal'
import type { AdminApplication, ApplicationStatus } from '../types/application'

export default function AdminApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    getApplication,
    fetchApplication,
    updateApplicationStatus,
    getResumeDownloadUrl,
    deleteApplication,
  } = useAdminData()
  const { showToast } = useAdminToast()

  const cachedApp = id ? getApplication(id) : undefined
  const [fetchedApp, setFetchedApp] = useState<AdminApplication | null>(null)
  const application = cachedApp ?? fetchedApp ?? undefined

  const [isLoading, setIsLoading] = useState<boolean>(!cachedApp)
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  // Fetch application directly from backend if not already in context cache
  useEffect(() => {
    if (!id || cachedApp) return
    let isMounted = true

    const load = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const app = await fetchApplication(id)
        if (isMounted) {
          setFetchedApp(app)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Application could not be loaded.')
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
  }, [id, cachedApp, fetchApplication])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/applications"
          className="inline-flex items-center gap-2 font-code text-xs text-cyber-muted hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back to Applications</span>
        </Link>
        <AdminCard className="p-12 text-center">
          <p className="font-display text-base font-semibold text-white animate-pulse">
            Loading career application details...
          </p>
        </AdminCard>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/applications"
          className="inline-flex items-center gap-2 font-code text-xs text-cyber-muted hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back to Applications</span>
        </Link>
        <AdminCard className="p-12 text-center">
          <h2 className="font-display text-xl font-bold text-white uppercase">
            Application Not Found
          </h2>
          <p className="mt-2 font-body text-sm text-cyber-muted">
            {error || `The requested career application "${id}" does not exist or has been removed.`}
          </p>
          <div className="mt-6">
            <AdminButton to="/admin/applications" variant="primary">
              View All Applications
            </AdminButton>
          </div>
        </AdminCard>
      </div>
    )
  }

  const handleResumeDownload = async () => {
    setIsDownloading(true)
    try {
      const data = await getResumeDownloadUrl(application.id)
      if (data?.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer')
        showToast('Presigned Resume Access Granted', {
          detail: `Opened resume file "${data.fileName || application.resumeFileName}".`,
          type: 'success',
        })
      }
    } catch (err) {
      showToast('Resume Download Failed', {
        detail: err instanceof Error ? err.message : 'Unable to generate secure download link from AWS S3.',
        type: 'error',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(application.id, newStatus)
      setFetchedApp((prev) => (prev ? { ...prev, status: newStatus } : null))
      showToast(`Status updated to ${newStatus}`, {
        type: 'success',
      })
    } catch (err) {
      showToast('Status Update Failed', {
        detail: err instanceof Error ? err.message : 'Could not update application status in Cloud Firestore.',
        type: 'error',
      })
    }
  }

  const handleDeleteApplication = async () => {
    setIsDeleting(true)
    try {
      await deleteApplication(application.id)
      showToast('Application Deleted', {
        detail: `Application for ${application.fullName} has been removed.`,
        type: 'success',
      })
      navigate('/admin/applications')
    } catch (err) {
      showToast('Delete Failed', {
        detail: err instanceof Error ? err.message : 'Could not delete application.',
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const formattedDate = new Date(application.submittedAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/applications')}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 font-code text-xs text-cyber-muted hover:border-cyber-teal/40 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Back to Applications</span>
          </button>
          <span className="text-white/20">/</span>
          <span className="font-code text-xs text-cyber-muted truncate max-w-[200px]">
            {application.fullName}
          </span>
        </div>

        {/* Quick status toggle and delete */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-code text-2xs text-cyber-muted uppercase">Status:</span>
            <select
              value={application.status}
              onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
              className="rounded-lg border border-white/15 bg-[#1a1a1a] px-3 py-1.5 font-code text-xs text-cyber-value focus:border-cyber-teal/60 focus:outline-none"
              aria-label="Change candidate status"
            >
              <option value="NEW">NEW</option>
              <option value="REVIEWED">REVIEWED</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            title="Delete Application"
            aria-label="Delete application"
          >
            <TrashIcon className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Main Candidate Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Primary Details */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <AdminCardTitle>{application.fullName}</AdminCardTitle>
                  <p className="font-body text-xs text-cyber-muted mt-0.5">
                    Applied for <span className="text-white font-medium">{application.role}</span>
                  </p>
                </div>
                <AdminBadge
                  tone={
                    application.status === 'NEW'
                      ? 'orange'
                      : application.status === 'SHORTLISTED'
                      ? 'green'
                      : 'teal'
                  }
                >
                  {application.status}
                </AdminBadge>
              </div>
            </AdminCardHeader>

            <AdminCardContent className="space-y-6">
              {/* Information Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/5 bg-[#141414] p-4">
                  <p className="font-code text-3xs tracking-widest text-cyber-muted uppercase">
                    Email Address
                  </p>
                  <a
                    href={`mailto:${application.email}`}
                    className="mt-1.5 block font-body text-sm font-medium text-white hover:text-cyber-teal transition-colors"
                  >
                    {application.email}
                  </a>
                </div>

                <div className="rounded-lg border border-white/5 bg-[#141414] p-4">
                  <p className="font-code text-3xs tracking-widest text-cyber-muted uppercase">
                    Phone Number
                  </p>
                  <a
                    href={`tel:${application.phone}`}
                    className="mt-1.5 block font-body text-sm font-medium text-white hover:text-cyber-teal transition-colors"
                  >
                    {application.phone}
                  </a>
                </div>

                <div className="rounded-lg border border-white/5 bg-[#141414] p-4">
                  <p className="font-code text-3xs tracking-widest text-cyber-muted uppercase">
                    Current Location
                  </p>
                  <p className="mt-1.5 font-display text-base font-bold text-white">
                    {application.currentLocation || application.experience || 'Not specified'}
                  </p>
                </div>

                <div className="rounded-lg border border-white/5 bg-[#141414] p-4">
                  <p className="font-code text-3xs tracking-widest text-cyber-muted uppercase">
                    Submission Timestamp
                  </p>
                  <p className="mt-1.5 font-code text-xs text-white/90">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Cover Note / Summary */}
              {application.coverNote && (
                <div className="rounded-lg border border-white/5 bg-[#141414] p-5">
                  <h4 className="font-code text-xs font-semibold tracking-wider text-cyber-teal uppercase mb-2">
                    Candidate Statement / Experience Summary
                  </h4>
                  <p className="font-body text-sm text-cyber-value leading-relaxed whitespace-pre-line">
                    {application.coverNote}
                  </p>
                </div>
              )}
            </AdminCardContent>
          </AdminCard>
        </div>

        {/* Right Column: Resume & Profile Links */}
        <div className="space-y-6">
          {/* Resume File Box */}
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Resume Attachment</AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent className="space-y-4">
              <div className="rounded-lg border border-cyber-teal/20 bg-cyber-teal/5 p-4 text-center">
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-lg bg-cyber-teal/20 text-cyber-teal">
                  <DownloadIcon className="size-6" />
                </div>
                <p className="font-code text-xs font-bold text-white truncate">
                  {application.resumeFileName}
                </p>
                <p className="mt-1 font-code text-2xs text-cyber-muted">
                  Stored securely in AWS S3
                </p>

                <div className="mt-4">
                  <AdminButton
                    type="button"
                    variant="primary"
                    size="sm"
                    fullWidth
                    disabled={isDownloading}
                    onClick={handleResumeDownload}
                    icon={<DownloadIcon className="size-4" />}
                  >
                    {isDownloading ? 'Generating Link...' : 'Download Resume'}
                  </AdminButton>
                </div>
              </div>

              <p className="font-code text-3xs text-cyber-muted/70 text-center leading-relaxed">
                Generates a secure 300-second AWS S3 presigned download URL.
              </p>
            </AdminCardContent>
          </AdminCard>

          {/* External Links Card */}
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Professional Links</AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent className="space-y-3">
              {application.linkedin ? (
                <a
                  href={application.linkedin.startsWith('http') ? application.linkedin : `https://${application.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-[#141414] p-3 text-xs text-cyber-muted hover:border-cyber-teal/40 hover:text-white transition-colors"
                >
                  <span className="font-code text-xs text-cyber-teal">LinkedIn Profile</span>
                  <ExternalLinkIcon className="size-4" />
                </a>
              ) : (
                <p className="font-body text-xs text-cyber-muted">No LinkedIn profile provided.</p>
              )}
            </AdminCardContent>
          </AdminCard>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="DELETE CAREER APPLICATION"
        itemTitle={application.fullName}
        itemType="career application"
        isDeleting={isDeleting}
        onConfirm={handleDeleteApplication}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
