import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import { coreUSPs } from '@/data/company'
import { cn } from '@/utils/helpers'

export default function CoreUSPs() {
  return (
    <section className="border-y border-cyber-teal/15 bg-cyber-surface/35 py-16 md:py-24">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <SectionHeading
            label="Our Differentiators"
            title="Core Unique"
            highlight="Selling Propositions (USPs)"
            size="lg"
            className="mb-12"
          />
          <span className="mb-12 hidden font-code text-xs text-cyber-teal/60 md:block uppercase tracking-wider">
            // UNMATCHED DOMAIN DEPTH
          </span>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coreUSPs.map((usp) => {
            const isOrange = usp.accent === 'orange'

            return (
              <li key={usp.index} className="h-full">
                <Card
                  interactive
                  className="group relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-7"
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute -top-10 -right-10 size-28 rounded-full blur-2xl transition-opacity duration-300 opacity-20 group-hover:opacity-40',
                      isOrange ? 'bg-cyber-orange' : 'bg-cyber-teal',
                    )}
                  />

                  <div>
                    <div className="flex items-center justify-between pb-3">
                      <span
                        className={cn(
                          'font-code text-sm font-semibold tracking-wider',
                          isOrange ? 'text-cyber-orange' : 'text-cyber-teal',
                        )}
                      >
                        {usp.index}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'h-0.5 w-8 transition-all duration-300 group-hover:w-14',
                          isOrange ? 'bg-cyber-orange' : 'bg-cyber-teal',
                        )}
                      />
                    </div>

                    <h3 className="pt-2 font-display text-lg font-bold tracking-wider text-white uppercase transition-colors duration-200 group-hover:text-cyber-teal sm:text-xl">
                      {usp.title}
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-cyber-muted">
                      {usp.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-cyber-teal/10 pt-3">
                    <span className="font-code text-3xs uppercase tracking-widest text-cyber-muted/60">
                      MISSION CRITICAL OT
                    </span>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
