import { MenuIcon } from '@/components/common/icons'
import { ExternalLinkIcon } from '../components/AdminIcons'
import { useAdminAuth } from '../auth/useAdminAuth'

interface AdminHeaderProps {
  onOpenMobileMenu: () => void
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const { user } = useAdminAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#141414]/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile hamburger + Admin portal title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg border border-white/10 p-2 text-cyber-muted hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Open navigation drawer"
        >
          <MenuIcon className="size-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="font-display text-sm font-bold tracking-wide text-white hidden sm:inline">
            SECURE<span className="text-cyber-teal">X</span>MOTIVE
          </span>
          <span className="hidden sm:inline font-code text-xs text-white/20">/</span>
          <span className="font-code text-xs tracking-widest text-cyber-teal uppercase font-medium">
            Admin Console
          </span>
        </div>
      </div>

      {/* Right: Environment indicator + User Pill */}
      <div className="flex items-center gap-3">
        <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-cyber-teal/30 bg-cyber-teal/10 px-3 py-1 font-code text-3xs tracking-widest text-cyber-teal uppercase">
          <span className="size-1.5 rounded-full bg-cyber-teal animate-pulse" />
          Live System
        </span>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 font-code text-3xs tracking-widest text-cyber-muted hover:border-cyber-teal/40 hover:text-white transition-colors"
          title="Open public website in a new tab"
        >
          <span>Live Site</span>
          <ExternalLinkIcon className="size-3" />
        </a>

        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
          <div className="size-7 rounded-full bg-cyber-teal/20 text-cyber-teal border border-cyber-teal/40 flex items-center justify-center font-display text-xs font-bold">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <span className="hidden lg:inline font-body text-xs text-white/90">
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  )
}
