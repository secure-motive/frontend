import Button from '@/components/common/Button'
import Container from '@/components/common/Container'
import CtaBand from '@/components/common/CtaBand'
import PageHeading from '@/components/common/PageHeading'
import TechnicalTicker from '@/components/common/TechnicalTicker'
import PageContainer from '@/components/layout/PageContainer'
import ServiceHeroBackground from '@/components/services/ServiceHeroBackground'
import ServiceRow from '@/components/services/ServiceRow'
import { serviceDomains } from '@/data/services'
import { tickers } from '@/data/tickers'
import { ROUTES } from '@/routes/paths'

export default function Services() {
  return (
    <PageContainer title="Services">
      {/* The design's intro describes the earlier practice-area list, so it is
          left out until copy for the five domains is supplied. */}
      <PageHeading
        label="Capabilities matrix"
        title="Our"
        highlight="Services"
        background={<ServiceHeroBackground videoSrc="/gifs/home.mp4" />}
      />

      {/* The top padding includes the empty 37px band the design leaves under every hero. */}
      <Container className="pt-16 pb-14 md:pt-29 md:pb-20">
        <ul className="flex flex-col gap-6">
          {serviceDomains.map((domain) => (
            <li key={domain.slug}>
              <ServiceRow domain={domain} />
            </li>
          ))}
        </ul>
      </Container>

      <TechnicalTicker items={tickers.services} />

      <CtaBand
        title="Not sure where to start?"
        description="Our specialists will map your compliance gaps and recommend a tailored engagement plan."
      >
        <Button to={ROUTES.contact}>Book a free assessment</Button>
      </CtaBand>
    </PageContainer>
  )
}
