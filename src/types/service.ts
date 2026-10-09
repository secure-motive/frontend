/** Colour family of a service domain, assigned by position on the Services page. */
export type ServiceAccent = 'teal' | 'orange' | 'yellow' | 'red' | 'purple'

/** A regulation or standard, e.g. UNECE R155. */
export interface Framework {
  id: string
  /** Short label shown on chips and cards, e.g. "UNECE R155". */
  code: string
  /** Descriptive name shown under the code, e.g. "Vehicle Cybersecurity Management". */
  name: string
}

/**
 * One block of a technical point's description: a string is a line of text,
 * an array is a bullet list. Blocks render in order, so a sentence the source
 * splits around a list stays in the source's shape.
 */
export type PointBlock = string | string[]

/** A named technical capability inside a service, e.g. "Asset Mapping". */
export interface TechnicalPoint {
  title: string
  body: PointBlock[]
}

/** A service offered within a domain, e.g. "Threat Analysis and Risk Assessment (TARA)". */
export interface ServiceItem {
  /** Also the anchor id of its section on the domain page. */
  slug: string
  title: string
  points: TechnicalPoint[]
}

/** One of the five service domains. Each has its own page at /services/:slug. */
export interface ServiceDomain {
  slug: string
  slugAliases?: string[]
  /** Two-digit position, e.g. "01". */
  index: string
  /** Uppercase mono tag, e.g. "AUTOMOTIVE". */
  label: string
  /** Display name used in titles and navigation. */
  name: string
  accent: ServiceAccent
  /** Short description for the Services row. Not supplied yet. */
  summary?: string
  /** Italic one-line statement under the page title. Not supplied yet. */
  tagline?: string
  /** Opening paragraph of the domain page. Not supplied yet. */
  intro?: string
  items: ServiceItem[]
  /** Standards and protocols the domain's own content names. */
  standards: string[]
}
