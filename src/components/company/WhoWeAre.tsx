import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import { corporatePillars, whoWeAre } from '@/data/company'
import { ShieldCheckIcon } from '@/components/common/icons'

export default function WhoWeAre() {
  return (
    <section className="pt-12 pb-16 md:pt-16 md:pb-24">
      <Container>
        {/* Top Eyebrow / Tagline banner from PDF */}
        <div className="mb-10 inline-flex flex-wrap items-center gap-2.5 rounded-full border border-cyber-teal/25 bg-cyber-teal/5 px-4 py-1.5 text-xs text-cyber-teal sm:text-sm">
          <span className="size-2 animate-pulse rounded-full bg-cyber-teal" />
          <span className="font-code tracking-wider uppercase">
            Cyber-Physical Security for Next-Gen Mobility & Machinery
          </span>
          <span className="hidden text-cyber-muted/40 sm:inline">•</span>
          <span className="hidden font-code text-cyber-muted/80 uppercase sm:inline">
            Corporate Overview
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Heading and narrative text */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <SectionHeading
              label="Corporate Overview"
              title="Who"
              highlight="We Are"
              size="lg"
              className="mb-6"
            />
            <div className="space-y-4 text-base leading-relaxed text-cyber-muted sm:text-lg">
              {whoWeAre.paragraphs.map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? 'text-white/95 font-medium' : 'text-cyber-muted'}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right Column: Mission-critical highlight box */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <div className="relative overflow-hidden rounded-card border border-cyber-teal/30 bg-cyber-surface/60 p-6 backdrop-blur-sm sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-cyber-teal/10 blur-2xl"
              />
              <div className="flex items-center gap-3 pb-4">
                <div className="flex size-10 items-center justify-center rounded-lg border border-cyber-teal/40 bg-cyber-teal/10 text-cyber-teal">
                  <ShieldCheckIcon className="size-6" />
                </div>
                <div>
                  <p className="font-code text-xs text-cyber-teal uppercase tracking-wider">
                    Full-Lifecycle Defense
                  </p>
                  <h3 className="font-display text-lg font-bold text-white">
                    Cyber-Physical Resilience
                  </h3>
                </div>
              </div>
              <p className="border-t border-cyber-teal/15 pt-4 text-sm leading-relaxed text-white/80">
                Operating at the converged frontier of embedded system architecture, operational technology (OT), and advanced threat intelligence to safeguard mission-critical fleets and heavy machinery.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 font-code text-2xs text-cyber-teal/80">
                <span className="rounded border border-cyber-teal/20 bg-cyber-teal/5 px-2 py-0.5">
                  ISO/SAE 21434
                </span>
                <span className="rounded border border-cyber-teal/20 bg-cyber-teal/5 px-2 py-0.5">
                  UN R155/R156
                </span>
                <span className="rounded border border-cyber-teal/20 bg-cyber-teal/5 px-2 py-0.5">
                  ISO 26262 / 25119
                </span>
                <span className="rounded border border-cyber-teal/20 bg-cyber-teal/5 px-2 py-0.5">
                  EU CRA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Prominent Stat / Pillar Cards from Page 1 of the PDF */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3 md:mt-16">
          {corporatePillars.map((pillar, i) => (
            <Card
              key={pillar.title}
              interactive
              className="group relative flex flex-col justify-between overflow-hidden p-6 sm:p-7"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -bottom-6 size-24 rounded-full bg-cyber-teal/5 blur-xl transition-all duration-300 group-hover:bg-cyber-teal/15 group-hover:scale-125"
              />
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-code text-xs text-cyber-teal/60">0{i + 1} // PILLAR</span>
                  <span className="size-1.5 rounded-full bg-cyber-teal animate-ping" />
                </div>
                <h3 className="font-display text-2xl font-bold tracking-wider text-white transition-colors duration-200 group-hover:text-cyber-teal sm:text-3xl">
                  {pillar.title}
                </h3>
                <p className="mt-2 font-code text-xs font-semibold tracking-wide text-cyber-teal">
                  {pillar.subtitle}
                </p>
              </div>
              <div className="mt-6 border-t border-cyber-teal/15 pt-3">
                <span className="text-xs text-cyber-muted">{pillar.highlight}</span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
