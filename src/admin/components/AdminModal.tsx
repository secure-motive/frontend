import { useEffect, type ReactNode } from 'react'
import { CloseIcon } from '@/components/common/icons'
import { AlertTriangleIcon } from './AdminIcons'
import { AdminButton } from './AdminButton'
import { cn } from '@/utils/helpers'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: AdminModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative w-full max-w-lg rounded-xl border border-white/15 bg-[#181818] p-6 shadow-2xl transition-all',
          className,
        )}
      >
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <h2 id="modal-title" className="font-display text-lg font-bold tracking-wide text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-cyber-muted hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        <div className="py-4">{children}</div>
      </div>
    </div>
  )
}

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  itemTitle: string
  itemType?: string
  isDeleting?: boolean
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemTitle,
  itemType = 'video',
  isDeleting = false,
}: DeleteConfirmModalProps) {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3.5 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm">
          <AlertTriangleIcon className="size-5 shrink-0 text-red-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-white/90">
              Are you sure you want to delete this {itemType}?
            </p>
            <p className="font-display font-bold text-white text-base">
              &ldquo;{itemTitle}&rdquo;
            </p>
            <p className="font-code text-xs text-red-400/90 pt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <AdminButton variant="secondary" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancel
          </AdminButton>
          <AdminButton
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            Delete
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  )
}
