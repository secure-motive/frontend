import Card from '@/components/common/Card'
import type { Office } from '@/types/contact'

/** One office: city and country, address, email and phone. */
export default function OfficeCard({ office }: { office: Office }) {
  return (
    <Card interactive className="p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold tracking-wide text-white">
          {office.city}
        </h3>
        <span className="font-code text-xs text-cyber-teal">{office.country}</span>
      </div>
      <address className="mt-3 flex flex-col items-start gap-2 not-italic">
        <span className="text-xs leading-relaxed text-cyber-muted">{office.address}</span>
        {office.email && (
          <a
            href={`mailto:${office.email}`}
            className="font-code text-xs text-cyber-teal underline-offset-4 hover:underline"
          >
            {office.email}
          </a>
        )}
        {office.phone && (
          <a
            href={`tel:${office.phone.replaceAll(' ', '')}`}
            className="font-code text-xs text-cyber-muted transition-colors hover:text-cyber-teal"
          >
            {office.phone}
          </a>
        )}
      </address>
    </Card>
  )
}
