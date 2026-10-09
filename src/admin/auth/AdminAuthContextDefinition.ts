import { createContext } from 'react'
import type { User } from 'firebase/auth'
import type { AdminUser } from '../types/admin'

export interface AdminAuthContextValue {
  user: AdminUser | null
  firebaseUser?: User | null
  isAuthenticated: boolean
  isLoading: boolean
  sessionExpired: boolean
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  clearSessionExpired: () => void
}

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

