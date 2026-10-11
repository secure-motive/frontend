import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import SectionLabel from '@/components/common/SectionLabel'
import { statements } from '@/data/company'
import { cn } from '@/utils/helpers'

/** Mission and Vision: two equal cards, teal and orange. */
export default function MissionVision() {
  return (
    // The top padding includes the empty 37px band the design leaves under every hero.
    <Container className="grid gap-8 pt-16 pb-14 md:grid-cols-2 md:pt-29 md:pb-20">
      {statements.map((statement) => (
        <Card key={statement.label} interactive className="flex flex-col gap-2 p-6 sm:p-8">
          <span
            aria-hidden="true"
            className={cn(
              'h-0.5 w-8',
              statement.tone === 'orange' ? 'bg-cyber-orange' : 'bg-cyber-teal',
            )}
          />
          <SectionLabel tone={statement.tone} className="pt-3">
            {statement.label}
          </SectionLabel>
          <h2 className="font-display text-2xl font-bold tracking-wide text-white sm:text-3xl">
            {statement.heading}
          </h2>
          <p className="pt-2 leading-relaxed text-white text-justify">{statement.body}</p>
        </Card>
      ))}
    </Container>
  )
}
