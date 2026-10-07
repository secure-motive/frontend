import TechnicalTicker from '@/components/common/TechnicalTicker'
import ComplianceSection from '@/components/home/ComplianceSection'
import DeliverablesSection from '@/components/home/DeliverablesSection'
import Hero from '@/components/home/Hero'
import HomeCTA from '@/components/home/HomeCTA'
import WhyChooseSection from '@/components/home/WhyChooseSection'
import PageContainer from '@/components/layout/PageContainer'
import { tickers } from '@/data/tickers'

export default function Home() {
  return (
    <PageContainer flush>
      <Hero />
      <TechnicalTicker items={tickers.homeCompliance} tone="teal" />
      <ComplianceSection />
      <TechnicalTicker items={tickers.homeCapabilities} />
      <DeliverablesSection />
      <TechnicalTicker items={tickers.homeTechnologies} tone="grey" />
      <WhyChooseSection />
      <HomeCTA />
    </PageContainer>
  )
}
