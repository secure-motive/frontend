import { useContext } from 'react'
import { ToastContext, type ToastContextValue } from './ToastContextDefinition'

export function useAdminToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useAdminToast must be used within an AdminToastProvider')
  }
  return context
}
