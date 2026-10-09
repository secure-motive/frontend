import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { useAdminData } from '../context/useAdminData'
import { useAdminToast } from '../components/useAdminToast'
import { AdminSearchInput } from '../components/AdminSearchInput'
import { AdminBadge } from '../components/AdminBadge'
import { AdminButton } from '../components/AdminButton'
import { DownloadIcon, ExternalLinkIcon } from '../components/AdminIcons'
import { formatDate } from '@/utils/helpers'

export default function AdminApplications() {
  const { applications, isLoading, error, refreshAll, getResumeDownloadUrl } = useAdminData()
  const { showToast } = useAdminToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'REVIEWED' | 'SHORTLISTED'>('ALL')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const filteredApplications = useMemo(() => {
    let result = [...applications]

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((a) => a.status === statusFilter)
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.experience.toLowerCase().includes(q),
      )
    }

    // Sorting
    result.sort((a, b) => {
      const timeA = new Date(a.submittedAt).getTime()
      const timeB = new Date(b.submittedAt).getTime()
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })

    return result
  }, [applications, searchQuery, sortOrder, statusFilter])

  const handleResumeDownload = async (appId: string, candidateName: string) => {
    setDownloadingId(appId)
    try {
      const data = await getResumeDownloadUrl(appId)
      if (data?.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer')
        showToast('Presigned Resume Access Granted', {
          detail: `Opened resume file "${data.fileName || 'resume'}" for ${candidateName}.`,
          type: 'success',
        })
      }
    } catch (err) {
      showToast('Resume Download Failed', {
        detail: err instanceof Error ? err.message : 'Unable to generate secure download link from AWS S3.',
        type: 'error',
      })
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-code text-2xs tracking-widest text-cyber-teal uppercase font-semibold">
              Careers Portal
            </span>
            <span className="text-white/20">·</span>
            <span className="font-code text-2xs text-cyber-muted tracking-wider">
              {applications.length} Total Submissions
            </span>
            {isLoading && (
              <>
                <span className="text-white/20">·</span>
                <span className="font-code text-2xs text-cyber-teal animate-pulse">Loading...</span>
              </>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-white uppercase">
            Career Applications
          </h1>
          <p className="mt-1 font-body text-xs sm:text-sm text-cyber-muted">
            Review candidate resumes, technical profiles, and experience submissions.
          </p>
        </div>
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
            placeholder="Search candidate name, email, or role..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 font-code text-xs text-cyber-value focus:border-cyber-teal/60 focus:outline-none"
            aria-label="Filter by application status"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New Only</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="SHORTLISTED">Shortlisted</option>
          </select>

          {/* Sort order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 font-code text-xs text-cyber-value focus:border-cyber-teal/60 focus:outline-none"
            aria-label="Sort applications"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="rounded-xl border border-white/10 bg-[#161616] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="Applications table">
            <thead>
              <tr className="border-b border-white/10 bg-[#1a1a1a] font-code text-2xs uppercase tracking-widest text-cyber-muted">
                <th scope="col" className="py-3.5 pl-6 pr-4">Candidate</th>
                <th scope="col" className="py-3.5 px-4">Contact</th>
                <th scope="col" className="py-3.5 px-4">Experience & Role</th>
                <th scope="col" className="py-3.5 px-4">Resume</th>
                <th scope="col" className="py-3.5 px-4">Status</th>
                <th scope="col" className="py-3.5 px-4">Submitted</th>
                <th scope="col" className="py-3.5 pl-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-body text-xs">
              {isLoading && applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cyber-muted">
                    <p className="font-display text-base font-semibold text-white animate-pulse">
                      Loading applications...
                    </p>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cyber-muted">
                    <p className="font-display text-base font-semibold text-white">
                      No applications have been submitted yet.
                    </p>
                    <p className="font-body text-xs mt-1">
                      New candidate submissions from the public careers page will appear here.
                    </p>
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cyber-muted">
                    <p className="font-display text-base font-semibold text-white">
                      No matching applications found
                    </p>
                    <p className="font-body text-xs mt-1">
                      Try adjusting your search terms or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Candidate Name & ID */}
                    <td className="py-4 pl-6 pr-4">
                      <Link
                        to={`/admin/applications/${app.id}`}
                        className="font-display text-sm font-bold text-white hover:text-cyber-teal transition-colors block"
                      >
                        {app.fullName}
                      </Link>
                      <span className="font-code text-3xs text-cyber-muted tracking-wider">
                        {app.id}
                      </span>
                    </td>

                    {/* Contact Email & Phone */}
                    <td className="py-4 px-4">
                      <p className="text-white/90">{app.email}</p>
                      <p className="font-code text-3xs text-cyber-muted mt-0.5">{app.phone}</p>
                    </td>

                    {/* Role & Experience */}
                    <td className="py-4 px-4">
                      <p className="font-medium text-white/90">{app.role}</p>
                      <span className="inline-block mt-0.5 font-code text-2xs text-cyber-teal truncate max-w-[200px]">
                        {app.experience}
                      </span>
                    </td>

                    {/* Resume Download */}
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleResumeDownload(app.id, app.fullName)}
                        disabled={downloadingId === app.id}
                        className="inline-flex items-center gap-1.5 font-code text-2xs text-cyber-teal hover:underline disabled:opacity-50"
                        title="Download resume from AWS S3"
                      >
                        <DownloadIcon className="size-3.5" />
                        <span className="truncate max-w-[130px]">
                          {downloadingId === app.id ? 'Accessing...' : app.resumeFileName}
                        </span>
                      </button>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <AdminBadge
                        tone={
                          app.status === 'NEW'
                            ? 'orange'
                            : app.status === 'SHORTLISTED'
                            ? 'green'
                            : 'teal'
                        }
                      >
                        {app.status}
                      </AdminBadge>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-4 font-code text-2xs text-cyber-muted whitespace-nowrap">
                      {formatDate(app.submittedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {app.linkedin && (
                          <a
                            href={app.linkedin.startsWith('http') ? app.linkedin : `https://${app.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1 text-cyber-muted hover:text-white hover:bg-white/5 transition-colors"
                            title="LinkedIn profile"
                            aria-label={`LinkedIn profile for ${app.fullName}`}
                          >
                            <ExternalLinkIcon className="size-3.5" />
                          </a>
                        )}
                        <AdminButton
                          to={`/admin/applications/${app.id}`}
                          variant="outline"
                          size="xs"
                        >
                          View
                        </AdminButton>
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
          <span>Showing {filteredApplications.length} of {applications.length} applications</span>
          <span>Cloud Firestore Integrated</span>
        </div>
      </div>
    </div>
  )
}
