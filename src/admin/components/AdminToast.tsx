import { useState, useCallback, type ReactNode } from 'react'
import { CheckIcon, AlertTriangleIcon } from './AdminIcons'
import { CloseIcon } from '@/components/common/icons'
import { cn } from '@/utils/helpers'
import { ToastContext, type ToastType } from './ToastContextDefinition'

interface ToastItem {
  id: string
  message: string
  detail?: string
  type: ToastType
}

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, options?: { detail?: string; type?: ToastType; duration?: number }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const type = options?.type ?? 'success'
      const detail = options?.detail
      const duration = options?.duration ?? 4000

      setToasts((prev) => [...prev, { id, message, detail, type }])

      setTimeout(() => {
        removeToast(id)
      }, duration)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-6 right-6 z-60 flex flex-col gap-2 max-w-md pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200',
              toast.type === 'success' && 'border-cyber-teal/40 bg-[#162220] text-cyber-teal',
              toast.type === 'error' && 'border-red-500/40 bg-[#281414] text-red-400',
              toast.type === 'info' && 'border-white/20 bg-[#1e1e1e] text-white',
            )}
          >
            {toast.type === 'success' && <CheckIcon className="size-5 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertTriangleIcon className="size-5 shrink-0 mt-0.5 text-red-400" />}
            {toast.type === 'info' && (
              <span className="size-5 shrink-0 mt-0.5 rounded-full border border-cyber-teal/60 flex items-center justify-center font-code text-2xs text-cyber-teal">
                i
              </span>
            )}
            <div className="flex-1 space-y-0.5">
              <p className="font-code text-xs font-semibold tracking-wide text-white">
                {toast.message}
              </p>
              {toast.detail && (
                <p className="font-body text-2xs text-cyber-muted leading-relaxed">
                  {toast.detail}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-cyber-muted hover:text-white transition-colors"
              aria-label="Dismiss toast"
            >
              <CloseIcon className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
