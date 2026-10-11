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
        {/* Automotive & Passenger Vehicles (Passenger SDV / Sedan) */}
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.8C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
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
        {/* Agriculture & Smart Farming (Agricultural Tractor) */}
        <path d="M10 11l11 .9a1 1 0 0 1 .8 1.1l-.66 5a1 1 0 0 1-.99.85l-4.15-.35" />
        <path d="M4 18V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
        <path d="M8 8V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v4" />
        <circle cx="18" cy="18" r="2" />
        <circle cx="7" cy="15" r="5" />
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
        {/* Commercial Vehicles & Logistics (Transport & Freight Truck) */}
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </svg>
    )
  }

  // industrial & off-highway machinery
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
      {/* Industrial & Off-Highway Machinery (Heavy Construction Excavator / Mining Rig) */}
      <rect x="2" y="16" width="11" height="4" rx="2" />
      <circle cx="4.5" cy="18" r="0.75" />
      <circle cx="7.5" cy="18" r="0.75" />
      <circle cx="10.5" cy="18" r="0.75" />
      <path d="M3 16V9a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v7" />
      <path d="M5 11h3" />
      <path d="M9 12l5-7 4.5 4" />
      <path d="M18.5 9l2.5 1.5-1.5 3-2.5-.5z" />
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
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white text-justify">
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

                <p className="mt-3 text-sm leading-relaxed text-white text-justify">
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
