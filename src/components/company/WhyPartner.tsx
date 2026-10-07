import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import { whyPartner } from '@/data/company'

export default function WhyPartner() {
  return (
    <section className="border-t border-cyber-teal/15 bg-cyber-surface/30 py-16 md:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Heading and narrative text */}
          <div className="lg:col-span-6">
            <SectionHeading
              label={whyPartner.label}
              title={whyPartner.title}
              highlight={whyPartner.highlight}
              size="lg"
              className="mb-6"
            />

            <div className="mb-6 inline-block rounded-md border border-cyber-orange/30 bg-cyber-orange/10 px-3.5 py-1.5 font-display text-sm font-bold tracking-wider text-cyber-orange uppercase sm:text-base">
              {whyPartner.subheading}
            </div>

            <div className="space-y-4 text-base leading-relaxed text-cyber-muted sm:text-lg">
              {whyPartner.paragraphs.map((p, idx) => (
                <p key={idx} className={idx === 0 ? 'text-white/95 font-medium' : 'text-cyber-muted'}>
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-cyber-teal/15 pt-6 font-code text-xs text-cyber-muted">
              <div>
                <span className="block font-display text-2xl font-bold text-cyber-teal">0 Friction</span>
                <span className="text-3xs uppercase tracking-wider text-cyber-muted">Audit Roadblocks</span>
              </div>
              <div className="h-8 w-px bg-cyber-teal/20" />
              <div>
                <span className="block font-display text-2xl font-bold text-cyber-orange">Chip-to-Cloud</span>
                <span className="text-3xs uppercase tracking-wider text-cyber-muted">Lifecycle Stack</span>
              </div>
              <div className="h-8 w-px bg-cyber-teal/20" />
              <div>
                <span className="block font-display text-2xl font-bold text-white">4 Sectors</span>
                <span className="text-3xs uppercase tracking-wider text-cyber-muted">Cross-Domain Synergies</span>
              </div>
            </div>
          </div>

          {/* Right Column: Strategic Advantages Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {whyPartner.advantages.map((adv) => (
              <Card
                key={adv.title}
                interactive
                className="group flex flex-col justify-between p-5 sm:p-6"
              >
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <span className="font-code text-3xs font-semibold tracking-wider text-cyber-teal uppercase">
                      {adv.metric}
                    </span>
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-cyber-teal transition-all duration-300 group-hover:scale-150"
                    />
                  </div>

                  <h3 className="font-display text-lg font-bold tracking-wide text-white transition-colors duration-200 group-hover:text-cyber-teal">
                    {adv.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-cyber-muted">
                    {adv.description}
                  </p>
                </div>

                <div className="mt-4 pt-2">
                  <span
                    aria-hidden="true"
                    className="block h-0.5 w-6 bg-cyber-teal/40 transition-all duration-300 group-hover:w-10 group-hover:bg-cyber-teal"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
