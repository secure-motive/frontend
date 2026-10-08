import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface AdminCardProps {
  children: ReactNode
  className?: string
  interactive?: boolean
}

export function AdminCard({ children, className, interactive = false }: AdminCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-[#161616]/95 backdrop-blur-sm shadow-md transition-all',
        interactive && 'hover:border-cyber-teal/30 hover:bg-[#1a1a1a]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AdminCardHeader({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between border-b border-white/5 px-6 py-4.5', className)}>
      {children}
    </div>
  )
}

export function AdminCardTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h3
      className={cn(
        'font-display text-base font-bold tracking-wide text-white flex items-center gap-2',
        className,
      )}
    >
      {children}
    </h3>
  )
}

export function AdminCardContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('p-6', className)}>{children}</div>
}
