import { Link } from 'react-router'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import FrameworkChip from '@/components/common/FrameworkChip'
import SectionLabel from '@/components/common/SectionLabel'
import { ROUTES } from '@/routes/paths'
import type { ServiceDomain } from '@/types/service'
import NextService from './NextService'

/**
 * Side column of a domain page: the domain's services (jump links), the
 * standards its content names, the "Engage this service" card and the link to
 * the next domain.
 */
export default function ServiceSidebar({ domain }: { domain: ServiceDomain }) {
  return (
    <aside aria-label={`${domain.name} overview`} className="flex flex-col gap-5">
      <Card interactive className="p-6">
        <SectionLabel as="h2">Services</SectionLabel>
        <ul className="mt-4 flex flex-col gap-2.5 text-sm">
          {domain.servicesList.map((service, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1.75 size-1.5 shrink-0 rounded-full bg-cyber-orange"
              />
              <Link
                to={{ hash: 'services-list' }}
                className="text-cyber-muted transition-colors hover:text-cyber-teal"
              >
                {service}
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      {domain.standards.length > 0 && (
        <Card interactive className="p-6">
          <SectionLabel as="h2">Standards &amp; protocols</SectionLabel>
          <ul className="mt-4 flex flex-wrap gap-2">
            {domain.standards.map((standard) => (
              <li key={standard} className="flex">
                <FrameworkChip variant="tag">{standard}</FrameworkChip>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="rounded-xl border border-cyber-teal/20 bg-cyber-teal/5 p-6">
        <SectionLabel as="h2" tone="orange">
          Engage this service
        </SectionLabel>
        <p className="mt-3 text-sm text-cyber-muted">
          Ready to start? Talk to our specialists about your specific requirements.
        </p>
        <div className="mt-5">
          <Button to={ROUTES.contact} fullWidth>
            Get in touch
          </Button>
        </div>
      </div>

      <NextService slug={domain.slug} />
    </aside>
  )
}
