import { useParams } from 'react-router'
import Card from '@/components/common/Card'
import Container from '@/components/common/Container'
import PageContainer from '@/components/layout/PageContainer'
import ServiceDetailHero from '@/components/services/ServiceDetailHero'
import ServiceSidebar from '@/components/services/ServiceSidebar'
import { getServiceDomain } from '@/data/services'
import NotFound from './NotFound'

/** One template for all five domains; the content matches the client PDF specifications verbatim. */
export default function ServiceDetail() {
  const { serviceSlug = '' } = useParams()
  const domain = getServiceDomain(serviceSlug)

  if (!domain) return <NotFound />

  return (
    <PageContainer title={`${domain.name} services`}>
      <ServiceDetailHero domain={domain} />
      {/* The top padding includes the band under the hero. */}
      <Container className="grid items-start gap-12 pt-14 pb-14 md:pt-20 md:pb-16 lg:grid-cols-3">
        <div className="flex flex-col gap-12 lg:col-span-2">
          {/* Main Introduction Paragraphs from PDF */}
          {domain.intro && (
            <div className="flex flex-col gap-5 text-base/relaxed sm:text-lg/relaxed text-cyber-muted">
              {domain.intro.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}

          {/* Services List from PDF */}
          {domain.servicesList && domain.servicesList.length > 0 && (
            <section id="services-list" className="scroll-mt-24">
              <h2 className="font-display text-2xl font-bold tracking-wide text-cyber-teal">
                {domain.servicesHeading}
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {domain.servicesList.map((service, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-cyber-surface/60 p-4 transition-all hover:border-cyber-teal/30 hover:bg-cyber-surface"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-2 shrink-0 rounded-full bg-cyber-orange shadow-[0_0_8px_rgba(255,107,0,0.6)]"
                    />
                    <span className="font-medium text-white/90">{service}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Closing / Value Proposition Section from PDF */}
          {domain.closingSection && (
            <section
              id="why-securexmotive"
              className="scroll-mt-24 rounded-2xl border border-cyber-teal/20 bg-gradient-to-br from-cyber-teal/[0.04] to-transparent p-6 sm:p-8"
            >
              <h2 className="font-display text-2xl font-bold tracking-wide text-white">
                {domain.closingSection.title}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-base/relaxed sm:text-lg/relaxed text-cyber-muted">
                {domain.closingSection.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
                {domain.closingSection.slogan && (
                  <p className="mt-3 font-display text-lg font-semibold tracking-wide text-cyber-teal italic">
                    {domain.closingSection.slogan}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>
        <ServiceSidebar domain={domain} />
      </Container>
    </PageContainer>
  )
}

