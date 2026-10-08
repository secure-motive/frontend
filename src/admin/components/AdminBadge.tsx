import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

export type BadgeTone = 'teal' | 'orange' | 'yellow' | 'muted' | 'green'

interface AdminBadgeProps {
  tone?: BadgeTone
  dot?: boolean
  children: ReactNode
  className?: string
}

const TONE_CLASSES: Record<BadgeTone, { badge: string; dot: string }> = {
  teal: {
    badge: 'bg-cyber-teal/10 text-cyber-teal border-cyber-teal/30',
    dot: 'bg-cyber-teal',
  },
  orange: {
    badge: 'bg-cyber-orange/10 text-cyber-orange border-cyber-orange/30',
    dot: 'bg-cyber-orange',
  },
  yellow: {
    badge: 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30',
    dot: 'bg-accent-yellow',
  },
  green: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  muted: {
    badge: 'bg-white/5 text-cyber-muted border-white/10',
    dot: 'bg-cyber-muted',
  },
}

export function AdminBadge({
  tone = 'teal',
  dot = true,
  children,
  className,
}: AdminBadgeProps) {
  const { badge, dot: dotClass } = TONE_CLASSES[tone]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-code text-2xs tracking-wider uppercase',
        badge,
        className,
      )}
    >
      {dot && (
        <span
          className={cn('size-1.5 shrink-0 rounded-full', dotClass)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
