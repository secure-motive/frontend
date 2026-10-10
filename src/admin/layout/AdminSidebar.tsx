import { NavLink } from 'react-router'
import {
  DashboardIcon,
  ApplicationsIcon,
  MessagesIcon,
  VideosIcon,
  LogoutIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
} from '../components/AdminIcons'
import { useAdminAuth } from '../auth/useAdminAuth'
import { useAdminData } from '../context/useAdminData'
import { useAdminToast } from '../components/useAdminToast'
import Logo from '@/components/common/Logo'
import { cn } from '@/utils/helpers'

interface AdminSidebarProps {
  onCloseMobile?: () => void
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const { user, logout } = useAdminAuth()
  const { stats, refreshAll } = useAdminData()
  const { showToast } = useAdminToast()

  const navItems = [
    {
      label: 'Dashboard',
      to: '/admin',
      end: true,
      icon: DashboardIcon,
    },
    {
      label: 'Applications',
      to: '/admin/applications',
      end: false,
      icon: ApplicationsIcon,
      badge: stats.newApplicationsCount > 0 ? stats.newApplicationsCount : undefined,
    },
    {
      label: 'Messages',
      to: '/admin/messages',
      end: false,
      icon: MessagesIcon,
      badge: stats.unreadMessagesCount > 0 ? stats.unreadMessagesCount : undefined,
    },
    {
      label: 'Videos',
      to: '/admin/videos',
      end: false,
      icon: VideosIcon,
      count: stats.totalVideos,
    },
  ]

  const handleRefreshData = async () => {
    try {
      await refreshAll()
      showToast('Data refreshed', {
        detail: 'Dashboard, applications, messages, and videos synchronized.',
        type: 'success',
      })
    } catch {
      showToast('Refresh failed', {
        detail: 'Could not sync data from server.',
        type: 'error',
      })
    }
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-[#161616] text-white">
      {/* Brand header */}
      <div className="flex flex-col gap-2.5 border-b border-white/10 p-5">
        <div className="flex items-center justify-between">
          <Logo size="header" />
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-cyber-teal/15 px-2 py-0.5 font-code text-3xs font-semibold tracking-widest text-cyber-teal border border-cyber-teal/30 uppercase">
            Admin Portal
          </span>
          <span className="font-code text-3xs text-cyber-muted tracking-wide">
            Live Console
          </span>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1.5 p-3.5" aria-label="Admin Navigation">
        <div className="px-3 pb-2 pt-1 font-code text-3xs tracking-widest text-cyber-muted/70 uppercase">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between rounded-lg px-3.5 py-2.5 font-code text-xs tracking-wider transition-colors',
                  isActive
                    ? 'bg-cyber-teal/15 text-cyber-teal font-semibold border-l-2 border-cyber-teal shadow-xs'
                    : 'text-cyber-muted hover:bg-white/5 hover:text-white',
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="flex size-5 items-center justify-center rounded-full bg-cyber-orange text-3xs font-bold text-cyber-bg">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && (
                <span className="font-code text-3xs text-cyber-muted/80">
                  {item.count}
                </span>
              )}
            </NavLink>
          )
        })}

        <div className="pt-6 px-3 pb-2 font-code text-3xs tracking-widest text-cyber-muted/70 uppercase">
          Quick Tools
        </div>

        <button
          type="button"
          onClick={handleRefreshData}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 font-code text-xs tracking-wider text-cyber-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <RefreshCwIcon className="size-4 shrink-0 text-cyber-teal/80" />
          <span>Refresh Data</span>
        </button>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg px-3.5 py-2.5 font-code text-xs tracking-wider text-cyber-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <div className="flex items-center gap-3">
            <ExternalLinkIcon className="size-4 shrink-0" />
            <span>Public Website</span>
          </div>
        </a>
      </nav>

      {/* User profile & Logout */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-[#1a1a1a] p-2.5 border border-white/5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cyber-teal/20 text-cyber-teal font-display font-bold text-xs border border-cyber-teal/40">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xs font-bold text-white">
              {user?.name ?? 'Admin User'}
            </p>
            <p className="truncate font-code text-3xs text-cyber-muted">
              {user?.email ?? 'admin@securexmotive.com'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2 font-code text-xs tracking-wider text-red-400 transition-colors hover:bg-red-500/20 hover:border-red-500/40"
        >
          <LogoutIcon className="size-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
