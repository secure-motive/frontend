export type JobBadge = 'HOT' | 'NEW'

export interface Job {
  id: string
  /** Uppercase department tag, e.g. "ENGINEERING". */
  department: string
  badge?: JobBadge
  title: string
  /** Rendered joined with " / ", e.g. ["Munich", "Remote"]. */
  locations: string[]
  /** e.g. "Full-Time", "Internship". */
  employmentType: string
}

/** A "Why choose SecureXmotive" card on the Careers page. */
export interface Benefit {
  /** Two-digit position, e.g. "01". */
  index: string
  title: string
  description: string
}

/** Text fields of the Careers / Resume Upload form, in design order according to SecureXmotive_Resume_Upload_Form.pdf */
export interface CareerApplicationValues {
  fullName: string
  email: string
  phone: string
  currentLocation: string
  linkedin: string
  consent: boolean
}

/** A complete application: the text fields plus the uploaded resume. */
export interface CareerApplication extends CareerApplicationValues {
  resume: File
}
