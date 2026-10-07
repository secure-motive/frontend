import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import { corporateServices } from '@/data/company'
import { cn } from '@/utils/helpers'

export default function CorporateServices() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <SectionHeading
              label="Services Portfolio • Lifecycle Execution"
              title="Comprehensive End-to-End"
              highlight="Service Offerings"
              size="lg"
            />
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-cyber-muted">
              SecureXmotive provides holistic cybersecurity solutions covering the entire product
              development lifecycle—from concept and architecture to post-production threat
              monitoring.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyber-teal/30 bg-cyber-teal/10 px-3 py-1 font-code text-xs text-cyber-teal">
              <span className="size-2 rounded-full bg-cyber-teal" />
              FULL LIFECYCLE COVERAGE
            </span>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5">
          {corporateServices.map((service) => {
            const isOrange = service.badgeTone === 'orange'
            const isPurple = service.badgeTone === 'purple'

            return (
              <Card
                key={service.index}
                interactive
                className="group relative flex flex-col justify-between overflow-hidden p-6 transition-all duration-300 sm:p-7"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left: Number and Title */}
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-cyber-teal/30 bg-cyber-surface font-code text-base font-bold text-cyber-teal sm:size-12 sm:text-lg">
                      {service.index}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-xl font-bold tracking-wide text-white transition-colors duration-200 group-hover:text-cyber-teal sm:text-2xl">
                          {service.title}
                        </h3>
                        <span
                          className={cn(
                            'rounded-full px-3 py-0.5 font-code text-2xs font-semibold tracking-wider uppercase border',
                            isOrange
                              ? 'border-cyber-orange/40 bg-cyber-orange/10 text-cyber-orange'
                              : isPurple
                                ? 'border-accent-purple/40 bg-accent-purple/10 text-accent-purple'
                                : 'border-cyber-teal/40 bg-cyber-teal/10 text-cyber-teal',
                          )}
                        >
                          {service.badge}
                        </span>
                      </div>
                      <p className="mt-3 max-w-4xl text-sm leading-relaxed text-cyber-muted sm:text-base">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
