import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import { frameworks, sectorFocus } from '@/data/frameworks'
import { cn } from '@/utils/helpers'

interface CoverageCardProps {
  title: string
  description: string
  /** The sector card is drawn in orange and carries a small tag at the bottom. */
  tone?: 'teal' | 'orange'
  tag?: string
}

function CoverageCard({ title, description, tone = 'teal', tag }: CoverageCardProps) {
  const isOrange = tone === 'orange'

  return (
    <Card interactive className="flex h-full flex-col justify-between p-5">
      <div className="flex flex-col gap-2">
        <span
          aria-hidden="true"
          className={cn(
            'h-0.5 w-8 transition-[width] duration-300 group-hover:w-12',
            isOrange ? 'bg-cyber-orange' : 'bg-cyber-teal',
          )}
        />
        <h3
          className={cn(
            'pt-2 font-display text-xl font-bold tracking-wide',
            isOrange ? 'text-cyber-orange' : 'text-cyber-teal',
          )}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-white/80">{description}</p>
      </div>
      {tag && <p className="pt-4 font-code text-xs text-cyber-orange/50">{tag}</p>}
    </Card>
  )
}

/** "Compliance & Framework": one card per regulation, then the sector card. */
export default function ComplianceSection() {
  return (
    <Container className="pt-14 pb-16 md:pt-24 md:pb-24">
      <SectionHeading
        size="lg"
        label="Regulatory coverage"
        title="Compliance &"
        highlight="Framework"
        className="mb-14"
      />
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {frameworks.map((framework) => (
          <li key={framework.id}>
            <CoverageCard title={framework.code} description={framework.name} />
          </li>
        ))}
        <li>
          <CoverageCard
            tone="orange"
            title={sectorFocus.name}
            description={sectorFocus.description}
            tag={sectorFocus.tag}
          />
        </li>
      </ul>
    </Container>
  )
}
