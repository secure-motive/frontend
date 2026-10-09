import Container from '@/components/common/Container'
import type { CareerFormState } from '@/hooks/useCareerForm'
import CareerForm from './CareerForm'

interface SubmitResumeProps {
  /** Anchor id that "Apply now" jumps to. */
  id: string
  form: CareerFormState
}

/** "Submit resume": the open-application section container and form. */
export default function SubmitResume({ id, form }: SubmitResumeProps) {
  return (
    <Container size="narrow" className="py-14 md:py-20">
      <section id={id} className="scroll-mt-24">
        <CareerForm form={form} />
      </section>
    </Container>
  )
}
