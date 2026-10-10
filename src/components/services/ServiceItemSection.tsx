import type { PointBlock, ServiceItem } from '@/types/service'

/** A line of text, or a row of orange-dotted items for a list in the source. */
function Block({ block }: { block: PointBlock }) {
  if (typeof block === 'string') return <p>{block}</p>

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
      {block.map((entry) => (
        <li key={entry} className="flex items-center gap-2">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-cyber-orange" />
          {entry}
        </li>
      ))}
    </ul>
  )
}

/**
 * One service within a domain page: the teal heading on a left rule from the
 * design, followed by its technical points.
 */
export default function ServiceItemSection({ item }: { item: ServiceItem }) {
  return (
    <section
      id={item.slug}
      aria-labelledby={`${item.slug}-title`}
      className="scroll-mt-24 border-l-2 border-cyber-teal/30 pl-6"
    >
      <h2
        id={`${item.slug}-title`}
        className="font-display text-xl font-semibold tracking-wide text-cyber-teal"
      >
        {item.title}
      </h2>
      <div className="mt-3 flex flex-col gap-5">
        {item.points?.map((point) => (
          <div key={point.title}>
            <h3 className="font-display font-semibold tracking-wide text-white">{point.title}</h3>
            <div className="mt-1 flex flex-col gap-2 leading-relaxed text-cyber-muted">
              {point.body.map((block, index) => (
                <Block key={index} block={block} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
