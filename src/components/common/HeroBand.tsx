import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'
import Container from './Container'

export type HeroBandSize = 'default' | 'tall'

interface HeroBandProps {
  /** Extra background layers, rendered behind the content (e.g. a glow). */
  background?: ReactNode
  className?: string
  sectionClassName?: string
  size?: HeroBandSize
  children: ReactNode
}

/**
 * Full-width band that opens every inner page: a soft diagonal wash from the
 * top-left corner and a hairline along the bottom edge.
 */
export default function HeroBand({
  background,
  className,
  sectionClassName,
  size = 'default',
  children,
}: HeroBandProps) {
  const sizeClasses =
    size === 'tall'
      ? 'min-h-[440px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[580px] py-20 sm:py-24 md:py-32 lg:py-36 flex flex-col justify-center'
      : 'py-14 md:py-20'

  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-cyber-teal/10',
        sizeClasses,
        sectionClassName,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-cyber-surface/50 via-transparent to-transparent"
      />
      {background}
      <Container className={cn('relative flex flex-col items-start gap-4', className)}>
        {children}
      </Container>
    </section>
  )
}
