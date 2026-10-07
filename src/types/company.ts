/** Mission / Vision card on the Company page. */
export interface CompanyStatement {
  label: string
  heading: string
  body: string
  tone: 'teal' | 'orange'
}

export interface CoreValue {
  /** Two-digit position, e.g. "01". */
  index: string
  title: string
  description: string
}

export interface TimelineEntry {
  year: string
  event: string
}

/** High-level corporate overview pillar card from PDF. */
export interface CorporatePillar {
  title: string
  subtitle: string
  highlight?: string
}

/** Sector specialization domain from PDF. */
export interface SectorSpecialization {
  id: string
  title: string
  description: string
  architectures: string[]
  icon: 'automotive' | 'agriculture' | 'commercial' | 'industrial'
}

/** Core Unique Selling Proposition (USP) from PDF. */
export interface CoreUSP {
  index: string
  title: string
  description: string
  accent?: 'teal' | 'orange'
}

/** Comprehensive end-to-end service offering from PDF. */
export interface CorporateService {
  index: string
  title: string
  badge: string
  badgeTone?: 'teal' | 'orange' | 'cyan' | 'purple'
  description: string
}

/** Strategic advantage bullet for Why Partner section. */
export interface PartnershipAdvantage {
  title: string
  description: string
  metric?: string
}
