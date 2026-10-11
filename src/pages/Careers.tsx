import PageHeading from '@/components/common/PageHeading'
import JobList from '@/components/careers/JobList'
import SubmitResume from '@/components/careers/SubmitResume'
import WhyChooseUs from '@/components/careers/WhyChooseUs'
import PageContainer from '@/components/layout/PageContainer'
import { useCareerForm } from '@/hooks/useCareerForm'
import type { Job } from '@/types/career'

const APPLY_SECTION_ID = 'apply'

export default function Careers() {
  const form = useCareerForm()
  const applyFor = (_job: Job) => {
    // Smooth scroll to apply section
    const el = document.getElementById(APPLY_SECTION_ID)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <PageContainer title="Careers">
      <PageHeading
        label="Join the team"
        title="Career at"
        highlight="SecureXmotive"
        stacked
        description="We are building the team that will define automotive cybersecurity. If you are obsessed with vehicle security, regulatory excellence, or offensive research — read on."
      />
      <WhyChooseUs />
      <JobList applyTo={`#${APPLY_SECTION_ID}`} onApply={applyFor} />
      {/* <SubmitResume id={APPLY_SECTION_ID} form={form} /> */}
    </PageContainer>
  )
}

