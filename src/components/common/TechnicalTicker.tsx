import { cn } from '@/utils/helpers'

type TickerTone = 'orange' | 'grey' | 'teal'

interface TechnicalTickerProps {
  /** One loop of terms. The component repeats them to fill the strip. */
  items: readonly string[]
  tone?: TickerTone
  className?: string
}

const TONES: Record<TickerTone, { strip: string; term: string; separator: string; glyph: string }> = {
  orange: {
    strip: 'border-cyber-orange/15 bg-cyber-orange/5',
    term: 'text-cyber-orange/80',
    separator: 'text-cyber-orange/30',
    glyph: '▸',
  },
  grey: {
    strip: 'border-cyber-teal/8 bg-cyber-surface/60',
    term: 'text-cyber-muted/70',
    separator: 'text-cyber-muted/25',
    glyph: '·',
  },
  teal: {
    strip: 'border-cyber-teal/20 bg-cyber-teal/[0.04]',
    term: 'text-cyber-teal',
    separator: 'text-cyber-teal/40',
    glyph: '◈',
  },
}

// The track is two identical halves and the animation shifts it by exactly one
// half, so the loop is seamless. Each half repeats the list often enough to
// stay wider than any realistic viewport.
const REPEATS_PER_HALF = 3

// Scroll speed in px/s. The design is static, so this value is a judgement call.
const SPEED = 40
// Mono 12px with 0.1em tracking advances 8.4px per character; each term is
// followed by a 28px separator slot.
const CHAR_WIDTH = 8.4
const SEPARATOR_WIDTH = 28

function loopSeconds(items: readonly string[]): number {
  const loopWidth = items.reduce(
    (width, item) => width + item.length * CHAR_WIDTH + SEPARATOR_WIDTH,
    0,
  )
  return Math.round((loopWidth * REPEATS_PER_HALF) / SPEED)
}

/**
 * Full-bleed strip of scrolling technical terms that separates page sections.
 * Decorative: hidden from assistive technology, and static when the user asks
 * for reduced motion.
 */
export default function TechnicalTicker({ items, tone = 'orange', className }: TechnicalTickerProps) {
  const styles = TONES[tone]
  const half = Array.from({ length: REPEATS_PER_HALF }, () => items).flat()

  return (
    <div
      aria-hidden="true"
      className={cn('relative overflow-hidden border-y py-2.5', styles.strip, className)}
    >
      <div
        className="flex w-max animate-marquee motion-reduce:animate-none"
        style={{ animationDuration: `${loopSeconds(items)}s` }}
      >
        {[...half, ...half].map((item, index) => (
          <span key={index} className="inline-flex shrink-0 items-center gap-3 font-code text-xs">
            <span className={cn('font-medium tracking-widest uppercase', styles.term)}>{item}</span>
            <span className={cn('px-1', styles.separator)}>{styles.glyph}</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-cyber-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-cyber-bg to-transparent" />
    </div>
  )
}
