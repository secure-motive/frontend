import PageHeading from '@/components/common/PageHeading'
import CompanyCTA from '@/components/company/CompanyCTA'
import CorporateServices from '@/components/company/CorporateServices'
import CoreUSPs from '@/components/company/CoreUSPs'
import SectorSpecializations from '@/components/company/SectorSpecializations'
import WhoWeAre from '@/components/company/WhoWeAre'
import WhyPartner from '@/components/company/WhyPartner'
import PageContainer from '@/components/layout/PageContainer'
import { corporateHero } from '@/data/company'

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

      {/* 2. Sector Specializations from PDF Page 1 */}
      <SectorSpecializations />

      {/* 3. Core Unique Selling Propositions (USPs) from PDF Page 1 */}
      <CoreUSPs />

      {/* 4. Comprehensive End-to-End Service Offerings from PDF Page 2 */}
      <CorporateServices />

      {/* 5. Why Partner with SecureXmotive? from PDF Page 2 */}
      <WhyPartner />

      {/* Call to Action Band */}
      <CompanyCTA />
    </PageContainer>
  )
}

