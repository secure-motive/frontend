import { useContext } from 'react'
import { AdminAuthContext, type AdminAuthContextValue } from './AdminAuthContextDefinition'

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
