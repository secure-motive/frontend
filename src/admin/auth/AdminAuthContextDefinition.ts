import { createContext } from 'react'
import type { AdminUser } from '../types/admin'

export interface AdminAuthContextValue {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  sessionExpired: boolean
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  clearSessionExpired: () => void
}

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)
