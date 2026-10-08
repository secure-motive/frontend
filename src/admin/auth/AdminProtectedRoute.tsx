import { Navigate, Outlet, useLocation } from 'react-router'
import { useAdminAuth } from './useAdminAuth'

export default function AdminProtectedRoute() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cyber-bg text-cyber-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-cyber-teal border-t-transparent" />
          <span className="font-code text-xs tracking-widest text-cyber-muted uppercase">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
