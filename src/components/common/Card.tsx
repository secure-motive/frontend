import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/utils/helpers'

interface CardProps {
  /**
   * Adds the hover treatment: brighter border and a soft teal glow. Also marks
   * the card as a `group`, so children can react with `group-hover:`.
   */
  interactive?: boolean
  /** Makes the whole card an internal link. Link cards are always interactive. */
  to?: string
  /** Makes the whole card an external link that opens in a new tab. */
  href?: string
  /** Makes the card an interactive button trigger. */
  onClick?: (e: React.MouseEvent) => void
  className?: string
  children: ReactNode
}

/** The surface every card on the site is built on. Padding is set by the caller. */
export default function Card({ interactive = false, to, href, onClick, className, children }: CardProps) {
  const classes = cn(
    'rounded-card border border-cyber-teal/15 bg-cyber-surface',
    (interactive || to || href || onClick) &&
      'group transition duration-300 hover:border-cyber-teal/45 hover:drop-shadow-glow',
    onClick && 'cursor-pointer text-left w-full',
    className,
  )

  if (to) {
    return (
      <Link to={to} className={cn('block', classes)}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cn('block', classes)}>
        {children}
      </a>
    )
  }

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick(e as unknown as React.MouseEvent)
          }
        }}
        className={classes}
      >
        {children}
      </div>
    )
  }

  return <div className={classes}>{children}</div>
}

