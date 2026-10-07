import PageHeading from '@/components/common/PageHeading'
import TechnicalTicker from '@/components/common/TechnicalTicker'
import CompanyCTA from '@/components/company/CompanyCTA'
import CompanyTimeline from '@/components/company/CompanyTimeline'
import CorporateServices from '@/components/company/CorporateServices'
import CoreUSPs from '@/components/company/CoreUSPs'
import SectorSpecializations from '@/components/company/SectorSpecializations'
import WhoWeAre from '@/components/company/WhoWeAre'
import WhyPartner from '@/components/company/WhyPartner'
import PageContainer from '@/components/layout/PageContainer'
import { corporateHero } from '@/data/company'
import { tickers } from '@/data/tickers'

/** Soft teal glow in the top-right corner of the Company hero. */
const heroGlow = (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute top-0 right-0 size-125 rounded-full bg-cyber-teal/3 blur-[32px]"
  />
)

export default function Company() {
  return (
    <PageContainer title="Company Overview">
      <PageHeading
        label={corporateHero.documentContext}
        title="Corporate"
        highlight="Overview"
        description={corporateHero.tagline}
        descriptionSize="lg"
        background={heroGlow}
      />

      {/* 1. Who We Are & 3 Core Pillar Badges from PDF Page 1 */}
      <WhoWeAre />

      {/* Dynamic Technical Ticker */}
      <TechnicalTicker items={tickers.companyValues} />

      {/* 2. Sector Specializations from PDF Page 1 */}
      <SectorSpecializations />

      {/* 3. Core Unique Selling Propositions (USPs) from PDF Page 1 */}
      <CoreUSPs />

      {/* 4. Comprehensive End-to-End Service Offerings from PDF Page 2 */}
      <CorporateServices />

      {/* 5. Why Partner with SecureXmotive? from PDF Page 2 */}
      <WhyPartner />

      {/* Technical Ticker with Historical & Technological Milestones */}
      <TechnicalTicker items={tickers.companyMilestones} tone="grey" />

      {/* Company Timeline & History */}
      <CompanyTimeline />

      {/* Call to Action Band */}
      <CompanyCTA />
    </PageContainer>
  )
}
