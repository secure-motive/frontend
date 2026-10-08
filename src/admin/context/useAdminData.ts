import { useContext } from 'react'
import { AdminDataContext, type AdminDataContextValue } from './AdminDataContextDefinition'

export function useAdminData(): AdminDataContextValue {
  const context = useContext(AdminDataContext)
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider')
  }
  return context
}
