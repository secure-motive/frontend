import { Link } from 'react-router'
import { useAdminData } from '../context/useAdminData'
import { useAdminAuth } from '../auth/useAdminAuth'
import {
  ApplicationsIcon,
  MessagesIcon,
  VideosIcon,
} from '../components/AdminIcons'
import {
  ArrowRightIcon,
  PlusIcon,
} from '@/components/common/icons'
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent } from '../components/AdminCard'
import { AdminButton } from '../components/AdminButton'
import { AdminBadge } from '../components/AdminBadge'
import { formatDate } from '@/utils/helpers'

const TODAY_DATE = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export default function AdminDashboard() {
  const { user } = useAdminAuth()
  const { stats, applications, messages, isLoading, error, refreshAll } = useAdminData()

  const recentApplications = applications.slice(0, 5)
  const recentMessages = messages.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-code text-2xs tracking-widest text-cyber-teal uppercase font-semibold">
              Overview
            </span>
            <span className="text-white/20">·</span>
            <span className="font-code text-2xs text-cyber-muted tracking-wider">
              {TODAY_DATE}
            </span>
            {isLoading && (
              <>
                <span className="text-white/20">·</span>
                <span className="font-code text-2xs text-cyber-teal animate-pulse">Syncing...</span>
              </>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-white uppercase">
            Admin Dashboard
          </h1>
          <p className="mt-1 font-body text-sm text-cyber-muted">
            Welcome back, <span className="text-white font-medium">{user?.name || 'Administrator'}</span>.
            Here is the current platform status.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <AdminButton
            to="/admin/videos/new"
            variant="primary"
            size="sm"
            icon={<PlusIcon className="size-4" />}
          >
            Add Video
          </AdminButton>
          <AdminButton
            to="/admin/applications"
            variant="outline"
            size="sm"
          >
            View Applications
          </AdminButton>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
          <div className="flex items-center gap-2.5">
            <span className="font-code font-bold uppercase tracking-wider text-red-400">Connection Error:</span>
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

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Applications */}
        <Link to="/admin/applications" className="group block focus:outline-none">
          <AdminCard interactive className="h-full">
            <AdminCardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-code text-xs tracking-widest text-cyber-muted uppercase">
                    Applications
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-white tracking-wide group-hover:text-cyber-teal transition-colors">
                    {stats.totalApplications}
                  </p>
                </div>
                <div className="rounded-lg bg-cyber-teal/10 p-2.5 text-cyber-teal border border-cyber-teal/20 group-hover:scale-105 transition-transform">
                  <ApplicationsIcon className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="font-code text-2xs text-cyber-muted">
                  {stats.newApplicationsCount} unreviewed
                </span>
                <span className="font-code text-2xs text-cyber-teal flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Manage <ArrowRightIcon className="size-3" />
                </span>
              </div>
            </AdminCardContent>
          </AdminCard>
        </Link>

        {/* Card 2: Contact Messages */}
        <Link to="/admin/messages" className="group block focus:outline-none">
          <AdminCard interactive className="h-full">
            <AdminCardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-code text-xs tracking-widest text-cyber-muted uppercase">
                    Contact Messages
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-white tracking-wide group-hover:text-cyber-teal transition-colors">
                    {stats.totalMessages}
                  </p>
                </div>
                <div className="rounded-lg bg-cyber-orange/10 p-2.5 text-cyber-orange border border-cyber-orange/20 group-hover:scale-105 transition-transform">
                  <MessagesIcon className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="font-code text-2xs text-cyber-muted">
                  {stats.unreadMessagesCount} unread queries
                </span>
                <span className="font-code text-2xs text-cyber-teal flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View <ArrowRightIcon className="size-3" />
                </span>
              </div>
            </AdminCardContent>
          </AdminCard>
        </Link>

        {/* Card 3: Total Videos */}
        <Link to="/admin/videos" className="group block focus:outline-none">
          <AdminCard interactive className="h-full">
            <AdminCardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-code text-xs tracking-widest text-cyber-muted uppercase">
                    Total Videos
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-white tracking-wide group-hover:text-cyber-teal transition-colors">
                    {stats.totalVideos}
                  </p>
                </div>
                <div className="rounded-lg bg-cyber-teal/10 p-2.5 text-cyber-teal border border-cyber-teal/20 group-hover:scale-105 transition-transform">
                  <VideosIcon className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="font-code text-2xs text-cyber-muted">
                  {stats.draftVideos} in draft
                </span>
                <span className="font-code text-2xs text-cyber-teal flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Manage <ArrowRightIcon className="size-3" />
                </span>
              </div>
            </AdminCardContent>
          </AdminCard>
        </Link>

        {/* Card 4: Published Videos */}
        <Link to="/admin/videos" className="group block focus:outline-none">
          <AdminCard interactive className="h-full">
            <AdminCardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-code text-xs tracking-widest text-cyber-muted uppercase">
                    Published Videos
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-white tracking-wide group-hover:text-cyber-teal transition-colors">
                    {stats.publishedVideos}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                  <VideosIcon className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="font-code text-2xs text-cyber-muted">
                  Live on Knowledge Centre
                </span>
                <span className="font-code text-2xs text-cyber-teal flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View <ArrowRightIcon className="size-3" />
                </span>
              </div>
            </AdminCardContent>
          </AdminCard>
        </Link>
      </div>

      {/* Two Column Section: Recent Applications & Recent Messages */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <AdminCard>
          <AdminCardHeader>
            <div>
              <AdminCardTitle>Recent Applications</AdminCardTitle>
              <p className="font-body text-xs text-cyber-muted mt-0.5">
                Latest submissions from the Careers portal
              </p>
            </div>
            <AdminButton to="/admin/applications" variant="ghost" size="xs">
              View All ({applications.length})
            </AdminButton>
          </AdminCardHeader>
          {recentApplications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-code text-xs text-cyber-muted">No applications submitted yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 overflow-x-auto">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-display font-bold text-sm text-white">
                        {app.fullName}
                      </p>
                      {app.status === 'NEW' && (
                        <AdminBadge tone="orange" dot={false} className="py-0 px-1.5 text-3xs">
                          New
                        </AdminBadge>
                      )}
                    </div>
                    <p className="truncate font-body text-xs text-cyber-muted">
                      {app.role} · <span className="font-code text-2xs">{app.experience}</span>
                    </p>
                    <p className="font-code text-3xs text-cyber-muted/60 mt-0.5">
                      {formatDate(app.submittedAt)}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <AdminButton
                      to={`/admin/applications/${app.id}`}
                      variant="outline"
                      size="xs"
                    >
                      View
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Recent Contact Messages */}
        <AdminCard>
          <AdminCardHeader>
            <div>
              <AdminCardTitle>Recent Contact Messages</AdminCardTitle>
              <p className="font-body text-xs text-cyber-muted mt-0.5">
                Inquiries received via Contact Us
              </p>
            </div>
            <AdminButton to="/admin/messages" variant="ghost" size="xs">
              View All ({messages.length})
            </AdminButton>
          </AdminCardHeader>
          {recentMessages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-code text-xs text-cyber-muted">No contact messages received yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 overflow-x-auto">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-display font-bold text-sm text-white">
                        {msg.firstName} {msg.lastName}
                      </p>
                      {!msg.isRead && (
                        <AdminBadge tone="teal" dot={false} className="py-0 px-1.5 text-3xs">
                          Unread
                        </AdminBadge>
                      )}
                    </div>
                    <p className="truncate font-body text-xs text-cyber-muted">
                      {msg.company} · <span className="text-white/80">{msg.service || 'General'}</span>
                    </p>
                    <p className="font-code text-3xs text-cyber-muted/60 mt-0.5">
                      {formatDate(msg.submittedAt)}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <AdminButton
                      to={`/admin/messages/${msg.id}`}
                      variant="outline"
                      size="xs"
                    >
                      View
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="rounded-xl border border-white/10 bg-[#161616] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-base font-bold text-white tracking-wide uppercase">
            Quick Navigation Actions
          </h2>
          <p className="font-body text-xs text-cyber-muted mt-0.5">
            Direct shortcuts to primary management workspaces
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminButton to="/admin/applications" variant="secondary" size="sm">
            View Applications
          </AdminButton>
          <AdminButton to="/admin/messages" variant="secondary" size="sm">
            View Messages
          </AdminButton>
          <AdminButton to="/admin/videos" variant="secondary" size="sm">
            Manage Videos
          </AdminButton>
          <AdminButton to="/admin/videos/new" variant="primary" size="sm">
            + New Video
          </AdminButton>
        </div>
      </div>
    </div>
  )
}
