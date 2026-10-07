import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import { sectorSpecializations } from '@/data/company'
import type { SectorSpecialization } from '@/types/company'

function SectorIcon({ icon }: { icon: SectorSpecialization['icon'] }) {
  if (icon === 'automotive') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7"
        aria-hidden="true"
      >
        {/* Sleek passenger vehicle / SDV shape */}
        <path d="M4 17h16M5 17l1.5-6.5a2 2 0 0 1 1.9-1.5h7.2a2 2 0 0 1 1.9 1.5L19 17" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="16.5" cy="17.5" r="2.5" />
        <path d="M7 11h10M12 9V5M9 6l3-3 3 3" />
      </svg>
    )
  }

  if (icon === 'agriculture') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7"
        aria-hidden="true"
      >
        {/* Smart agricultural tractor / machinery */}
        <path d="M3 17h2M7 17h6M11 9H5a2 2 0 0 0-2 2v6" />
        <path d="M14 6h4l2 5v6h-3" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="15" r="4" />
        <path d="M14 11h6M12 6V3M9 4l3-2 3 2" />
      </svg>
    )
  }

  if (icon === 'commercial') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7"
        aria-hidden="true"
      >
        {/* Commercial transport & freight truck */}
        <rect x="2" y="6" width="13" height="10" rx="1" />
        <path d="M15 10h4l3 3v3h-7v-6z" />
        <circle cx="6" cy="17" r="2" />
        <circle cx="18" cy="17" r="2" />
        <path d="M19 13h2M6 10h5" />
      </svg>
    )
  }

  // industrial & off-highway
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden="true"
    >
      {/* Heavy industrial machinery / rig & gears */}
      <path d="M4 19h16M3 15h6l3-6h5l2 4M6 15l2-6h4" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
      <path d="M14 6l4-3 3 2M18 3v6" />
    </svg>
  )
}

export default function SectorSpecializations() {
  return (
    <section className="border-t border-cyber-teal/10 bg-cyber-surface/20 py-16 md:py-24">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <SectionHeading
              label="Field Expertise"
              title="Sector"
              highlight="Specializations"
              size="lg"
            />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-cyber-muted">
              Our engineering teams possess deep field experience across harsh operational
              environments and specialized bus architectures:
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="font-code text-xs text-cyber-teal uppercase tracking-widest">
              // 4 Specialized Sectors
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sectorSpecializations.map((sector) => (
            <Card
              key={sector.id}
              interactive
              className="group flex h-full flex-col justify-between p-6 sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between pb-6">
                  <div className="flex size-12 items-center justify-center rounded-lg border border-cyber-teal/30 bg-cyber-surface text-cyber-teal transition-all duration-300 group-hover:border-cyber-teal group-hover:bg-cyber-teal/10 group-hover:shadow-glow">
                    <SectorIcon icon={sector.icon} />
                  </div>
                  <span className="font-code text-2xs uppercase tracking-widest text-cyber-teal/40 group-hover:text-cyber-teal">
                    ACTIVE FIELD
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold tracking-wide text-white transition-colors duration-200 group-hover:text-cyber-teal">
                  {sector.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-cyber-muted">
                  {sector.description}
                </p>
              </div>

              <div className="mt-6 border-t border-cyber-teal/10 pt-4">
                <p className="mb-2 font-code text-3xs text-cyber-muted uppercase tracking-wider">
                  Target Architectures:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sector.architectures.map((arch) => (
                    <span
                      key={arch}
                      className="rounded bg-cyber-field px-2 py-0.5 font-code text-2xs text-cyber-teal/90 border border-cyber-teal/15"
                    >
                      {arch}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
