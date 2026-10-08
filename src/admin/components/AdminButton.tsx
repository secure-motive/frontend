import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/utils/helpers'

export type AdminButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost' | 'secondary'
export type AdminButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface AdminButtonBaseProps {
  variant?: AdminButtonVariant
  size?: AdminButtonSize
  icon?: ReactNode
  iconRight?: ReactNode
  isLoading?: boolean
  fullWidth?: boolean
  className?: string
  children: ReactNode
}

interface AdminButtonAsButtonProps extends AdminButtonBaseProps {
  to?: undefined
  href?: undefined
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

interface AdminButtonAsLinkProps extends AdminButtonBaseProps {
  to: string
  href?: undefined
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

interface AdminButtonAsAnchorProps extends AdminButtonBaseProps {
  href: string
  to?: undefined
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

type AdminButtonProps =
  | AdminButtonAsButtonProps
  | AdminButtonAsLinkProps
  | AdminButtonAsAnchorProps

const BASE_STYLES =
  'inline-flex items-center justify-center font-code tracking-wider uppercase rounded-md transition-colors cursor-pointer select-none font-medium whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none'

const SIZE_STYLES: Record<AdminButtonSize, string> = {
  xs: 'text-2xs px-2.5 py-1 gap-1.5',
  sm: 'text-xs px-3.5 py-1.5 gap-2',
  md: 'text-xs px-5 py-2.5 gap-2.5',
  lg: 'text-sm px-6 py-3 gap-3',
}

const VARIANT_STYLES: Record<AdminButtonVariant, string> = {
  primary:
    'bg-cyber-teal text-cyber-bg font-semibold hover:bg-cyber-teal/90 shadow-sm focus-visible:ring-2 focus-visible:ring-cyber-teal/50',
  outline:
    'border border-cyber-teal/40 text-cyber-teal bg-cyber-teal/5 hover:bg-cyber-teal/15 hover:border-cyber-teal focus-visible:ring-2 focus-visible:ring-cyber-teal/40',
  secondary:
    'border border-white/15 text-white/90 bg-white/5 hover:bg-white/10 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20',
  danger:
    'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25 hover:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/40',
  ghost:
    'text-cyber-muted hover:text-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/20',
}

export function AdminButton(props: AdminButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconRight,
    isLoading = false,
    fullWidth = false,
    className,
    children,
  } = props

  const combinedClasses = cn(
    BASE_STYLES,
    SIZE_STYLES[size],
    VARIANT_STYLES[variant],
    fullWidth && 'w-full',
    className,
  )

  const content = (
    <>
      {isLoading ? (
        <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      <span>{children}</span>
      {!isLoading && iconRight}
    </>
  )

  if (props.to !== undefined) {
    return (
      <Link to={props.to} onClick={props.onClick} className={combinedClasses}>
        {content}
      </Link>
    )
  }

  if (props.href !== undefined) {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={props.onClick}
        className={combinedClasses}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      disabled={props.disabled || isLoading}
      onClick={props.onClick}
      className={combinedClasses}
    >
      {content}
    </button>
  )
}
