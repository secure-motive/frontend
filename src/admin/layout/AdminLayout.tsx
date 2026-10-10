import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { CloseIcon } from '@/components/common/icons'

export default function AdminLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [prevPath, setPrevPath] = useState(location.pathname)

  // Close mobile drawer on route navigation
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setMobileOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-cyber-bg text-white">
      {/* Desktop Sidebar (fixed/sticky) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[#161616] transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Admin Navigation"
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-cyber-muted hover:bg-white/10 hover:text-white"
            aria-label="Close navigation"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
        <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader onOpenMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-white/5 py-4 px-6 text-center font-code text-3xs text-cyber-muted/60">
          SecureXmotive Internal Administration Console · Confidential
        </footer>
      </div>
    </div>
  )
}
