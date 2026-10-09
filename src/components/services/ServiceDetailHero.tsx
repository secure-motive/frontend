import Divider from '@/components/common/Divider'
import HeroBand from '@/components/common/HeroBand'
import Tag from '@/components/common/Tag'
import TextLink from '@/components/common/TextLink'
import { ROUTES } from '@/routes/paths'
import type { ServiceDomain } from '@/types/service'
import ServiceHeroBackground from './ServiceHeroBackground'

/** Top band of a domain page: back link, tag, title, rule and optional tagline. */
export default function ServiceDetailHero({ domain }: { domain: ServiceDomain }) {
  return (
    <HeroBand background={<ServiceHeroBackground videoSrc={domain.video} />}>
      <TextLink to={ROUTES.services} arrow="left" tone="muted">
        All services
      </TextLink>
      <Tag className="mt-3.75">{domain.label}</Tag>
      <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
        {domain.name}
      </h1>
      <Divider width="md" />
      {domain.tagline && (
        <p className="max-w-2xl pt-2 text-lg text-cyber-teal/80 italic">{domain.tagline}</p>
      )}
    </HeroBand>
  )
}
