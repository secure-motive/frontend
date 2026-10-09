import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { useAdminData } from '../context/useAdminData'
import { AdminSearchInput } from '../components/AdminSearchInput'
import { AdminBadge } from '../components/AdminBadge'
import { AdminButton } from '../components/AdminButton'
import { formatDate } from '@/utils/helpers'

export default function AdminMessages() {
  const { messages, isLoading, error, refreshAll } = useAdminData()

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [readFilter, setReadFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL')

  const filteredMessages = useMemo(() => {
    let result = [...messages]

    // Read status filter
    if (readFilter === 'UNREAD') {
      result = result.filter((m) => !m.isRead)
    } else if (readFilter === 'READ') {
      result = result.filter((m) => m.isRead)
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (m) =>
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q) ||
          (m.service && m.service.toLowerCase().includes(q)) ||
          m.message.toLowerCase().includes(q),
      )
    }

    // Sorting
    result.sort((a, b) => {
      const timeA = new Date(a.submittedAt).getTime()
      const timeB = new Date(b.submittedAt).getTime()
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })

    return result
  }, [messages, searchQuery, sortOrder, readFilter])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-code text-2xs tracking-widest text-cyber-teal uppercase font-semibold">
              Inquiries
            </span>
            <span className="text-white/20">·</span>
            <span className="font-code text-2xs text-cyber-muted tracking-wider">
              {messages.length} Total Messages
            </span>
            {isLoading && (
              <>
                <span className="text-white/20">·</span>
                <span className="font-code text-2xs text-cyber-teal animate-pulse">Loading...</span>
              </>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-white uppercase">
            Contact Messages
          </h1>
          <p className="mt-1 font-body text-xs sm:text-sm text-cyber-muted">
            Incoming inquiries from prospective clients, automotive OEMs, and Tier-1 suppliers.
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
            placeholder="Search by name, email, company, or message..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Read status filter */}
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value as typeof readFilter)}
            className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 font-code text-xs text-cyber-value focus:border-cyber-teal/60 focus:outline-none"
            aria-label="Filter by read status"
          >
            <option value="ALL">All Messages</option>
            <option value="UNREAD">Unread Only</option>
            <option value="READ">Read Only</option>
          </select>

          {/* Sort order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 font-code text-xs text-cyber-value focus:border-cyber-teal/60 focus:outline-none"
            aria-label="Sort contact messages"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Messages Table Card */}
      <div className="rounded-xl border border-white/10 bg-[#161616] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="Contact messages table">
            <thead>
              <tr className="border-b border-white/10 bg-[#1a1a1a] font-code text-2xs uppercase tracking-widest text-cyber-muted">
                <th scope="col" className="py-3.5 pl-6 pr-4">Sender</th>
                <th scope="col" className="py-3.5 px-4">Company</th>
                <th scope="col" className="py-3.5 px-4">Contact</th>
                <th scope="col" className="py-3.5 px-4">Subject</th>
                <th scope="col" className="py-3.5 px-4">Status</th>
                <th scope="col" className="py-3.5 px-4">Submitted</th>
                <th scope="col" className="py-3.5 pl-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-body text-xs">
              {isLoading && messages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cyber-muted">
                    <p className="font-display text-base font-semibold text-white animate-pulse">
                      Loading inquiries...
                    </p>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cyber-muted">
                    <p className="font-display text-base font-semibold text-white">
                      No contact messages have been received yet.
                    </p>
                    <p className="font-body text-xs mt-1">
                      New inquiries submitted through the contact page will appear here.
                    </p>
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cyber-muted">
                    <p className="font-display text-base font-semibold text-white">
                      No matching contact messages found
                    </p>
                    <p className="font-body text-xs mt-1">
                      Try adjusting your search query or status filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Name */}
                    <td className="py-4 pl-6 pr-4">
                      <Link
                        to={`/admin/messages/${msg.id}`}
                        className="font-display text-sm font-bold text-white hover:text-cyber-teal transition-colors block"
                      >
                        {msg.firstName} {msg.lastName}
                      </Link>
                      <span className="font-code text-3xs text-cyber-muted tracking-wider">
                        {msg.id}
                      </span>
                    </td>

                    {/* Company */}
                    <td className="py-4 px-4">
                      <p className="font-medium text-white/90">{msg.company}</p>
                      {msg.jobTitle && (
                        <p className="font-code text-3xs text-cyber-muted mt-0.5">{msg.jobTitle}</p>
                      )}
                    </td>

                    {/* Email & Phone */}
                    <td className="py-4 px-4">
                      <p className="text-white/90">{msg.email}</p>
                      <p className="font-code text-3xs text-cyber-muted mt-0.5">{msg.phone}</p>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-4">
                      <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 font-code text-2xs text-cyber-teal">
                        {msg.service || 'General Inquiries'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <AdminBadge tone={msg.isRead ? 'muted' : 'teal'}>
                        {msg.isRead ? 'Read' : 'New'}
                      </AdminBadge>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-4 font-code text-2xs text-cyber-muted whitespace-nowrap">
                      {formatDate(msg.submittedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                      <AdminButton
                        to={`/admin/messages/${msg.id}`}
                        variant="outline"
                        size="xs"
                      >
                        View
                      </AdminButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-3 font-code text-2xs text-cyber-muted">
          <span>Showing {filteredMessages.length} of {messages.length} messages</span>
          <span>Cloud Firestore Integrated</span>
        </div>
      </div>
    </div>
  )
}
