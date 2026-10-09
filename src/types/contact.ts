/** Fields of the Contact Us form, in design order according to SecureXmotive_Contact_Us_Form.pdf */
export interface ContactFormValues {
  fullName: string
  email: string
  company: string
  jobTitle: string
  country: string
  industry: string
  message: string
  consent: boolean
}

export const INDUSTRY_OPTIONS = [
  'Automotive',
  'Agricultural Vehicles & Equipment',
  'Off-highway Vehicles & Equipment',
  'Trucks & Buses',
  'Industrial OT / ICS',
  'Automotive Supplier / Tier 1 / Tier 2',
  'Other',
] as const

export type IndustryOption = (typeof INDUSTRY_OPTIONS)[number]

export interface Office {
  city: string
  country: string
  address: string
  email: string
  phone: string
}

/** A line in the "Response time" card. */
export interface ResponseTime {
  label: string
  /** Bullet colour. */
  tone: 'orange' | 'teal'
}
