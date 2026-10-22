import type { ReactNode } from 'react'
import { Link } from 'react-router'
import Container from '@/components/common/Container'
import Divider from '@/components/common/Divider'
import FrameworkChip from '@/components/common/FrameworkChip'
import Logo from '@/components/common/Logo'
import { footerFrameworkCodes, sectorFocus } from '@/data/frameworks'
import { footerTagline, legalNav, primaryNav } from '@/data/navigation'
import { serviceDomains } from '@/data/services'
import { ROUTES, serviceDetailPath } from '@/routes/paths'

const CURRENT_YEAR = new Date().getFullYear()

// Size and line height sit on the list so each row is exactly 24px tall.
const LINK_LIST_CLASSES = 'flex flex-col gap-2 text-sm/6'
const LINK_CLASSES = 'text-cyber-muted transition-colors hover:text-cyber-teal'

function FooterColumn({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-sm font-semibold tracking-widest text-cyber-teal uppercase">
        {heading}
      </h2>
      {children}
    </div>
  )
}

/** Site footer: brand, navigation, services, frameworks and the legal bar. */
export default function Footer() {
  return (
    <footer className="relative border-t border-cyber-teal/10 bg-cyber-surface">
      <Divider width="full" />
      {/* Warm tint along the bottom edge. Present in the design PDFs but not in
          the Figma node data, so the stops are measured from the PDF. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-cyber-orange/[0.065] via-cyber-orange/[0.015] to-transparent"
      />

      <Container className="relative flex flex-col gap-6 py-16">
        <div className="grid gap-10 pb-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <div className="flex flex-col items-start gap-5 lg:col-span-4 xl:col-span-5">
            <Link to={ROUTES.home} aria-label="SecureXmotive — home">
              <Logo size="footer" />
            </Link>
            <p className="max-w-md text-sm/relaxed text-cyber-muted xl:max-w-[330px]">{footerTagline}</p>
            <p className="flex items-center gap-2 pt-1 font-code text-xs text-cyber-teal">
              <span aria-hidden="true" className="size-2 rounded-full bg-cyber-orange" />
              SYSTEMS OPERATIONAL
            </p>
          </div>

          <div className="lg:col-span-2 lg:pl-4 xl:pl-6">
            <FooterColumn heading="Navigation">
              <ul className={LINK_LIST_CLASSES}>
                {primaryNav.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={LINK_CLASSES}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          <div className="lg:col-span-3">
            <FooterColumn heading="Services">
              <ul className={LINK_LIST_CLASSES}>
                {serviceDomains.map((domain) => (
                  <li key={domain.slug}>
                    <Link to={serviceDetailPath(domain.slug)} className={LINK_CLASSES}>
                      {domain.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          <div className="lg:col-span-3 xl:col-span-2">
            <FooterColumn heading="Frameworks">
              <ul className="flex flex-wrap gap-2">
                {footerFrameworkCodes.map((code) => (
                  <li key={code} className="flex">
                    <FrameworkChip variant="tag">{code}</FrameworkChip>
                  </li>
                ))}
              </ul>
              <div className="border-t border-cyber-teal/10 pt-6">
                <p className="font-code text-xs text-cyber-muted">Sector Focus</p>
                <p className="mt-1 font-display text-lg font-semibold tracking-wide text-cyber-orange">
                  {sectorFocus.name}
                </p>
              </div>
            </FooterColumn>
          </div>
        </div>

        <Divider width="full" />

        <div className="flex flex-col gap-4 font-code text-xs text-cyber-muted md:flex-row md:items-center md:justify-between">
          <p>© {CURRENT_YEAR} SecureXmotive. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-cyber-teal">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
