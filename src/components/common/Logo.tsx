import { cn } from '@/utils/helpers'

interface LogoProps {
  /**
   * 'header' (default) renders the logo sized for navigation bars.
   * 'footer' renders a larger full logo for footers and portal headers.
   */
  size?: 'header' | 'footer'
  /**
   * 'nav': Cropped brand lockup showing only SecureXmotive without sector icons & tagline (used for navbar).
   * 'full': Complete multi-tier lockup with circuit X, sector icons & tagline.
   * 'mark': Standalone cyber circuit X emblem.
   */
  variant?: 'full' | 'mark' | 'nav'
  className?: string
}

/**
 * Official SecureXmotive Logo component.
 *
 * Renders the official brand assets:
 * - Nav Logo (`/logos/logo-nav.svg`): Cropped brand lockup with circuit X without sector icons & tagline.
 * - Full Logo (`/logos/logo.svg`): Complete multi-tier lockup with circuit X, sector icons & tagline.
 * - Mark (`/logos/logo-mark.svg`): Standalone cyber circuit X emblem.
 */
export default function Logo({ size = 'header', variant, className }: LogoProps) {
  const isFooter = size === 'footer'
  const isMark = variant === 'mark'
  const resolvedVariant = variant ?? (isFooter ? 'full' : 'nav')

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

  if (resolvedVariant === 'nav') {
    return (
      <img
        src="/logos/logo-nav.svg"
        alt="SecureXmotive"
        className={cn(
          'w-auto object-contain transition-opacity duration-200 hover:opacity-90 select-none',
          'h-8 sm:h-9.5',
          className,
        )}
        width={1180}
        height={255}
        loading="eager"
        decoding="async"
      />
    )
  }

  return (
    <img
      src="/logos/logo.svg"
      alt="SecureXmotive — Cybersecurity Consulting Solutions"
      className={cn(
        'max-w-full w-auto object-contain transition-opacity duration-200 hover:opacity-90 select-none',
        !className?.includes('h-') && (isFooter ? 'h-32 sm:h-40 lg:h-44 xl:h-52' : 'h-11 sm:h-12'),
        className,
      )}
      width={1180}
      height={614}
      loading="eager"
      decoding="async"
    />
  )
}

