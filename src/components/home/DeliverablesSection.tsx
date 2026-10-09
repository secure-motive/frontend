import { Link } from 'react-router'
import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import { ArrowRightIcon, PlusIcon } from '@/components/common/icons'
import SectionHeading from '@/components/common/SectionHeading'
import Tag from '@/components/common/Tag'
import { serviceDomains } from '@/data/services'
import { ROUTES, serviceDetailPath } from '@/routes/paths'
import type { ServiceDomain } from '@/types/service'

function ServiceCard({ domain }: { domain: ServiceDomain }) {
  return (
    <Card to={serviceDetailPath(domain.slug)} className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <Tag className="text-cyber-teal">{domain.label}</Tag>
        <ArrowRightIcon className="size-4 text-cyber-muted transition-colors group-hover:text-cyber-teal" />
      </div>
      <h3 className="mb-2.5 font-display text-xl font-semibold tracking-wide text-white transition-colors group-hover:text-cyber-teal">
        {domain.name}
      </h3>
      <p className="text-sm leading-relaxed text-white/75">
        {domain.summary || domain.items.map((item) => item.title).join(', ') + '.'}
      </p>
    </Card>
  )
}

function AllServicesTile() {
  return (
    <Link
      to={ROUTES.services}
      className="flex h-full min-h-50 flex-col items-center justify-center rounded-xl border-2 border-dashed border-cyber-teal/20 p-6 text-center transition-colors hover:border-cyber-teal/45 hover:bg-cyber-teal/5"
    >
      <span className="mb-3 flex size-10 items-center justify-center rounded-full border border-cyber-teal/30 text-cyber-teal">
        <PlusIcon className="size-5" />
      </span>
      <span className="font-display text-lg font-semibold tracking-wide text-cyber-teal">
        All Services
      </span>
      <span className="mt-1 text-xs text-white/60">Explore full capabilities</span>
    </Link>
  )
}

/** "What we deliver": a card per service domain plus the dashed "All Services" tile. */
export default function DeliverablesSection() {
  return (
    <Container className="py-16 md:py-24">
      <SectionHeading
        size="lg"
        label="Capabilities"
        title="What we"
        highlight="Deliver"
        className="mb-14"
      />
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {serviceDomains.map((domain) => (
          <li key={domain.slug}>
            <ServiceCard domain={domain} />
          </li>
        ))}
        <li>
          <AllServicesTile />
        </li>
      </ul>
    </Container>
  )
}
