import { useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { AdminUser } from '../types/admin'
import { adminAuthService, getFirebaseErrorMessage } from '@/services/adminAuthService'
import { AdminAuthContext } from './AdminAuthContextDefinition'

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sessionExpired, setSessionExpired] = useState<boolean>(false)

  // Listen to Firebase authentication state changes via onAuthStateChanged
  useEffect(() => {
    const unsubscribe = adminAuthService.onAuthStateChanged((adminUser, fbUser) => {
      setUser(adminUser)
      setFirebaseUser(fbUser)
      setIsLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, pass: string) => {
    setIsLoading(true)
    try {
      const authenticatedUser = await adminAuthService.login(email, pass)
      setUser(authenticatedUser)
      setFirebaseUser(adminAuthService.getCurrentUser())
      setSessionExpired(false)
      return { success: true }
    } catch (err) {
      const message = getFirebaseErrorMessage(err)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminAuthService.logout()
    } catch (err) {
      console.error('[Firebase Auth] Logout error:', err)
    } finally {
      setUser(null)
      setFirebaseUser(null)
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
        firebaseUser,
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
