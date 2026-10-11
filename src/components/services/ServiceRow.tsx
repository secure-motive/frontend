import { Link } from 'react-router'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import IconTile from '@/components/common/IconTile'
import { ArrowRightIcon } from '@/components/common/icons'
import { serviceDetailPath } from '@/routes/paths'
import type { ServiceDomain } from '@/types/service'
import { cn } from '@/utils/helpers'
import { ACCENT_CLASSES } from './serviceAccents'

/**
 * One service domain on the Services page: a tinted header strip (number,
 * label, "View details") over a body with the name, its services as chips and
 * a "Learn more" button, all in the domain's accent colour.
 */
export default function ServiceRow({ domain }: { domain: ServiceDomain }) {
  const accent = ACCENT_CLASSES[domain.accent]
  const detailPath = serviceDetailPath(domain.slug)

  return (
    <Card interactive className="overflow-hidden">
      <div
        className={cn(
          'relative flex items-center justify-between gap-4 border-b border-cyber-teal/8 bg-linear-to-r to-transparent px-6 py-3',
          accent.wash,
        )}
      >
        <span
          aria-hidden="true"
          className={cn('absolute inset-y-0 left-0 w-1 bg-linear-to-b', accent.bar)}
        />
        <div className="flex items-center gap-4 pl-2">
          <span className="font-code text-2xl/6 font-bold text-white/10">{domain.index}</span>
          <span aria-hidden="true" className="h-4 w-px bg-cyber-teal/15" />
          <span
            className={cn(
              'font-code text-xs font-semibold tracking-widest whitespace-nowrap',
              accent.text,
            )}
          >
            {domain.label}
          </span>
        </div>
        <Link
          to={detailPath}
          aria-label={`View details: ${domain.name}`}
          className={cn(
            'flex shrink-0 items-center gap-2 font-code text-xs tracking-widest opacity-60 transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
            accent.text,
          )}
        >
          {/* Below `sm` the strip only has room for the arrow; the link keeps its label. */}
          <span className="hidden sm:inline">VIEW DETAILS</span>
          <ArrowRightIcon className="size-3.5" strokeWidth={4 / 3} />
        </Link>
      </div>

      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
        <IconTile className="mt-0.5" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h2
            className={cn(
              'font-display text-2xl font-bold tracking-wide text-white transition-colors',
              accent.titleHover,
            )}
          >
            {domain.name}
          </h2>
          {domain.summary && (
            <p className="max-w-2xl leading-relaxed text-white text-justify">{domain.summary}</p>
          )}
          <ul className="flex flex-wrap gap-3 pt-2">
            {domain.items.map((item) => (
              <li
                key={item.slug}
                className={cn(
                  'flex items-center gap-2 rounded-lg border border-white/5 px-3 py-1.5 text-sm text-white',
                  accent.chip,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn('size-1.5 shrink-0 rounded-full', accent.dot)}
                />
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="shrink-0 lg:self-center">
          <Button
            variant="outline"
            accent={domain.accent}
            to={detailPath}
            icon={<ArrowRightIcon className="size-4" />}
          >
            Learn more
          </Button>
        </div>
      </div>
    </Card>
  )
}
