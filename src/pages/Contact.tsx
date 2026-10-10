import Container from '@/components/common/Container'
import PageHeading from '@/components/common/PageHeading'
import ContactForm from '@/components/contact/ContactForm'
import OfficeCard from '@/components/contact/OfficeCard'
import ResponseTimeCard from '@/components/contact/ResponseTimeCard'
import SecurityDisclosure from '@/components/contact/SecurityDisclosure'
import PageContainer from '@/components/layout/PageContainer'
import { offices } from '@/data/offices'

export default function Contact() {
  return (
    <PageContainer title="Contact">
      <PageHeading
        label="Reach out"
        title="Contact"
        highlight="Us"
        description="Tell us about your program and we will respond within one business day with a tailored assessment approach."
      />
      {/* The top padding includes the empty 37px band the design leaves under every hero. */}
      <Container className="grid items-start gap-12 pt-14 pb-14 md:pt-25 md:pb-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* <ContactForm /> */}
        </div>
        <aside aria-label="Contact details" className="flex flex-col gap-5">
          <ResponseTimeCard />
          {offices.map((office) => (
            <OfficeCard key={office.city} office={office} />
          ))}
          <SecurityDisclosure />
        </aside>
      </Container>
    </PageContainer>
  )
}
