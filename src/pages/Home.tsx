import ComplianceSection from '@/components/home/ComplianceSection'
import DeliverablesSection from '@/components/home/DeliverablesSection'
import Hero from '@/components/home/Hero'
import HomeCTA from '@/components/home/HomeCTA'
import WhyChooseSection from '@/components/home/WhyChooseSection'
import PageContainer from '@/components/layout/PageContainer'

export default function Home() {
  return (
    <PageContainer flush>
      <Hero />
      <ComplianceSection />
      <DeliverablesSection />
      <WhyChooseSection />
      <HomeCTA />
    </PageContainer>
  )
}

