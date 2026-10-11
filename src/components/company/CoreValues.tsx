import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import { coreValues } from '@/data/company'

/** "Core values": four numbered cards on a tinted band. */
export default function CoreValues() {
  return (
    <section className="border-y border-cyber-teal/10 bg-cyber-surface/30 py-14 md:py-20">
      <Container>
        <SectionHeading label="What drives us" title="Core" highlight="Values" className="mb-12" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value) => (
            <li key={value.index}>
              <Card interactive className="flex h-full flex-col gap-2 p-6">
                <span className="pb-1 font-code text-xs text-cyber-teal/30">{value.index}</span>
                <span aria-hidden="true" className="h-0.5 w-8 bg-cyber-teal" />
                <h3 className="pt-2 font-display text-lg font-semibold tracking-wide text-white">
                  {value.title}
                </h3>
                <p className="text-xs leading-relaxed text-white text-justify">{value.description}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
