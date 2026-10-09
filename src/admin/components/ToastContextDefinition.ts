import { createContext } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastContextValue {
  showToast: (message: string, options?: { detail?: string; type?: ToastType; duration?: number }) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
