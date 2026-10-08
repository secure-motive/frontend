import { useState, useEffect, useCallback, type ReactNode } from 'react'
import type { AdminUser } from '../types/admin'
import { adminAuthService } from '@/services/adminAuthService'
import { setUnauthorizedHandler, ApiError } from '@/services/api'
import { AdminAuthContext } from './AdminAuthContextDefinition'

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sessionExpired, setSessionExpired] = useState<boolean>(false)

  // Verify active session with backend on initial application mount
  useEffect(() => {
    let isMounted = true

    const verifySession = async () => {
      try {
        const verifiedUser = await adminAuthService.getMe()
        if (isMounted) {
          setUser(verifiedUser)
          setSessionExpired(false)
        }
      } catch {
        if (isMounted) {
          setUser(null)
          // Silent failure on initial verification - user simply isn't logged in yet
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    verifySession()

    return () => {
      isMounted = false
    }
  }, [])

  // Handle mid-session 401 unauthorized errors from protected API calls
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null)
      setSessionExpired(true)
    }

    setUnauthorizedHandler(handleUnauthorized)

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [])

  const login = useCallback(async (email: string, pass: string) => {
    setIsLoading(true)
    try {
      const authenticatedUser = await adminAuthService.login(email, pass)
      setUser(authenticatedUser)
      setSessionExpired(false)
      return { success: true }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Authentication failed. Please verify credentials.'
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminAuthService.logout()
    } catch {
      // Even if network fails, ensure client session is purged
    } finally {
      setUser(null)
      setSessionExpired(false)
    }
  }, [])

  const clearSessionExpired = useCallback(() => {
    setSessionExpired(false)
  }, [])

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sessionExpired,
        login,
        logout,
        clearSessionExpired,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}
