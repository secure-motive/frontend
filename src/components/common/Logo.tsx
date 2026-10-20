import { cn } from '@/utils/helpers'

interface LogoProps {
  /**
   * 'header' (default) renders the full logo sized for navigation bars.
   * 'footer' renders a larger full logo for footers and portal headers.
   */
  size?: 'header' | 'footer'
  /**
   * 'full' (default): Complete multi-tier lockup with circuit X, sector icons & tagline.
   * 'mark': Standalone cyber circuit X emblem.
   */
  variant?: 'full' | 'mark'
  className?: string
}

/**
 * Official SecureXmotive Logo component.
 *
 * Renders the official brand assets:
 * - Full Logo (`/logos/logo.svg`): Complete multi-tier lockup with circuit X, sector icons & tagline.
 * - Mark (`/logos/logo-mark.svg`): Standalone cyber circuit X emblem.
 */
export default function Logo({ size = 'header', variant = 'full', className }: LogoProps) {
  const isFooter = size === 'footer'
  const isMark = variant === 'mark'

  if (isMark) {
    return (
      <img
        src="/logos/logo-mark.svg"
        alt="SecureXmotive Mark"
        className={cn('size-8 object-contain transition-opacity duration-200 hover:opacity-90', className)}
        width={32}
        height={32}
      />
    )
  }

  return (
    <img
      src="/logos/logo.svg"
      alt="SecureXmotive — Cybersecurity Consulting Solutions"
      className={cn(
        'w-auto object-contain transition-opacity duration-200 hover:opacity-90 select-none',
        isFooter ? 'h-18 sm:h-22' : 'h-11 sm:h-12',
        className,
      )}
      width={1180}
      height={614}
      loading="eager"
      decoding="async"
    />
  )
}
