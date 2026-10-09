import { useState, type FormEvent, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAdminAuth } from '../auth/useAdminAuth'
import Logo from '@/components/common/Logo'
import { EyeIcon, EyeOffIcon, AlertTriangleIcon } from '../components/AdminIcons'
import { AdminButton } from '../components/AdminButton'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, isAuthenticated, isLoading, sessionExpired } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated once loading completes
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, location.state])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }
    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await login(email, password)
      if (result.success) {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin'
        navigate(from, { replace: true })
      } else {
        setErrorMessage(result.error || 'Invalid credentials provided.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Prevent flash of login screen while checking existing Firebase session
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cyber-bg text-cyber-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-cyber-teal border-t-transparent" />
          <span className="font-code text-xs tracking-widest text-cyber-muted uppercase">
            Verifying Session...
          </span>
        </div>
      </div>
    )
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cyber-bg p-4 text-white">
      {/* Background glow effect */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="size-[500px] rounded-full bg-cyber-teal/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Portal Branding Card */}
        <div className="mb-6 text-center">
          <div className="inline-flex justify-center mb-4">
            <Logo size="footer" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="rounded bg-cyber-teal/15 border border-cyber-teal/30 px-2.5 py-0.5 font-code text-3xs font-semibold tracking-widest text-cyber-teal uppercase">
              Admin Portal
            </span>
            <span className="font-code text-3xs text-cyber-muted tracking-wide">
              Console v2.0
            </span>
          </div>
          <h1 className="mt-3 font-display text-xl font-bold tracking-wide text-white uppercase">
            Internal Access Portal
          </h1>
          <p className="mt-1 font-body text-xs text-cyber-muted">
            Sign in to manage applications, contact queries, and videos
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl border border-white/10 bg-[#161616]/95 p-8 shadow-2xl backdrop-blur-md">
          {sessionExpired && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300"
            >
              <AlertTriangleIcon className="size-4 shrink-0 mt-0.5 text-amber-400" />
              <span>Your session has expired. Please sign in again to continue.</span>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300"
            >
              <AlertTriangleIcon className="size-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block font-code text-xs tracking-widest text-cyber-muted uppercase"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@securexmotive.com"
                className="w-full rounded-lg border border-cyber-teal/20 bg-cyber-field px-4 py-3 font-body text-sm text-cyber-value placeholder:text-cyber-placeholder/50 transition-colors focus:border-cyber-teal/60 focus:ring-2 focus:ring-cyber-teal/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block font-code text-xs tracking-widest text-cyber-muted uppercase"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-cyber-teal/20 bg-cyber-field px-4 py-3 pr-11 font-body text-sm text-cyber-value placeholder:text-cyber-placeholder/50 transition-colors focus:border-cyber-teal/60 focus:ring-2 focus:ring-cyber-teal/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-cyber-muted hover:text-white transition-colors disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4.5" />
                  ) : (
                    <EyeIcon className="size-4.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <AdminButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Sign In to Console
              </AdminButton>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 border-t border-white/5 pt-4 text-center">
            <p className="font-code text-3xs tracking-wider text-cyber-muted/60 leading-relaxed uppercase">
              Restricted system. Unauthorized access attempts are monitored and recorded.
            </p>
          </div>
        </div>

        {/* Back to public website */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="font-code text-xs tracking-wider text-cyber-muted hover:text-cyber-teal transition-colors"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  )
}
