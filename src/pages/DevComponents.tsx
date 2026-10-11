import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import CtaBand from '@/components/common/CtaBand'
import FrameworkChip from '@/components/common/FrameworkChip'
import IconTile from '@/components/common/IconTile'
import { ArrowRightIcon } from '@/components/common/icons'
import PageHeading from '@/components/common/PageHeading'
import SectionHeading from '@/components/common/SectionHeading'
import SectionLabel from '@/components/common/SectionLabel'
import Tag from '@/components/common/Tag'
import TextLink from '@/components/common/TextLink'
import PageContainer from '@/components/layout/PageContainer'
import { frameworks } from '@/data/frameworks'
import { ROUTES } from '@/routes/paths'
import type { ServiceAccent } from '@/types/service'

const ACCENTS: ServiceAccent[] = ['teal', 'orange', 'yellow', 'red', 'purple']

/**
 * TEMPORARY, development-only gallery of the shared components, used to check
 * them against the design. The route exists only in `npm run dev` builds and
 * this file is not part of the website.
 */
export default function DevComponents() {
  return (
    <PageContainer title="Component gallery">
      <PageHeading
        label="Capabilities matrix"
        title="Our"
        highlight="services"
        description="Five focused practice areas covering the full automotive cybersecurity lifecycle — from strategic consulting and compliance through offensive testing and architecture."
      />

      <Container className="flex flex-col gap-14 py-24">
        <SectionHeading size="lg" label="Regulatory coverage" title="Compliance &" highlight="Framework" />

        <div className="flex flex-wrap items-center gap-4">
          <Button>Book free consultation</Button>
          <Button variant="secondary">Join our team</Button>
          <Button variant="outline" size="sm">
            Get assessment
          </Button>
          <Button disabled>Disabled</Button>
          <TextLink to={ROUTES.company} arrow="right">
            Learn about us
          </TextLink>
          <TextLink to={ROUTES.services} arrow="left" tone="muted">
            All services
          </TextLink>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {ACCENTS.map((accent) => (
            <Button
              key={accent}
              variant="outline"
              accent={accent}
              icon={<ArrowRightIcon className="size-4" />}
            >
              Learn more
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {frameworks.map((framework) => (
            <FrameworkChip key={framework.id}>{framework.code}</FrameworkChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tag>Strategy</Tag>
          <Tag>Regulation</Tag>
          <FrameworkChip variant="tag">UNECE R155</FrameworkChip>
          <SectionLabel tone="orange">Start your compliance journey</SectionLabel>
          <SectionLabel tone="muted">Next service</SectionLabel>
        </div>
      </Container>

      <Container className="flex flex-col gap-12 py-24">
        <SectionHeading label="The case for joining" title="Why choose" highlight="SecureXmotive" />
        <div className="grid gap-5 md:grid-cols-3">
          <Card interactive className="flex flex-col gap-3 p-6">
            <div className="flex items-center justify-between">
              <Tag>Strategy</Tag>
              <ArrowRightIcon className="size-4 transition-colors group-hover:text-cyber-teal" />
            </div>
            <h3 className="font-display text-xl font-semibold tracking-wide transition-colors group-hover:text-cyber-teal">
              Cybersecurity Consulting
            </h3>
            <p className="text-sm leading-relaxed text-white/75">
              Strategic automotive cybersecurity guidance aligned with UN regulations and ISO
              standards for OEMs and Tier suppliers.
            </p>
          </Card>
          <Card className="flex items-start gap-4 p-6">
            <IconTile />
            <p className="text-sm leading-relaxed text-cyber-muted">Static card with an icon tile.</p>
          </Card>
        </div>
      </Container>

      <div className="h-24" />

      <CtaBand
        title="Ready to work with us?"
        description="Whether you need a TARA, a penetration test, or a full CSMS — our team is ready."
      >
        <Button to={ROUTES.contact}>Contact us</Button>
        <Button variant="secondary" to={ROUTES.careers}>
          Join our team
        </Button>
      </CtaBand>
    </PageContainer>
  )
}
