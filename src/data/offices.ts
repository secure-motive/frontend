import type { Office, ResponseTime } from '@/types/contact'

export const offices: Office[] = [
  {
    city: 'Chandigarh',
    country: 'India',
    address: 'Sector 5, Panchkula',
    email: 'contact@securexmotive.com',
  },
]

export const responseTimes: ResponseTime[] = [
  { label: 'Initial response: 1 business day', tone: 'orange' },
  { label: 'Assessment proposal: 3–5 business days', tone: 'teal' },
]

/** Contact-page "Security disclosure" card. */
export const securityDisclosure = {
  heading: 'SECURITY DISCLOSURE',
  body: 'Found a vulnerability in automotive infrastructure? Use our responsible disclosure process.',
  email: 'security@securexmotive.com',
} as const
