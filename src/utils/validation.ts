import type { CareerApplicationValues } from '@/types/career'
import type { ContactFormValues } from '@/types/contact'

/** Returns an error message, or undefined when the value is valid. */
export type Validator<T = unknown> = (value: T) => string | undefined

export type FormRules<T> = {
  [K in keyof T]?: Array<Validator<T[K]>>
}

export type FormErrors<T> = Partial<Record<keyof T, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s().-]{7,25}$/

export const required =
  (label: string): Validator<string> =>
  (value) =>
    (typeof value === 'string' && value.trim()) ? undefined : `${label} is required.`

export const requiredCheckbox =
  (label: string): Validator<boolean> =>
  (value) =>
    value === true ? undefined : `You must agree to the ${label}.`

export const email: Validator<string> = (value) => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return !trimmed || EMAIL_PATTERN.test(trimmed) ? undefined : 'Enter a valid email address.'
}

export const phone: Validator<string> = (value) => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return !trimmed || PHONE_PATTERN.test(trimmed) ? undefined : 'Enter a valid phone number.'
}

export const url: Validator<string> = (value) => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  // Accept links typed without a scheme, e.g. "linkedin.com/in/yourname".
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    new URL(candidate)
  } catch {
    return 'Enter a valid URL.'
  }
  return candidate.includes('.') ? undefined : 'Enter a valid URL.'
}

/*
 * Resume upload limits matching SecureXmotive_Resume_Upload_Form.pdf:
 * PDF, DOC or DOCX • Maximum 5 MB
 */
export const RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx']
export const RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
export const RESUME_MAX_BYTES = 5 * 1024 * 1024 // 5 MB

/** Returns an error message for a missing, mistyped or oversized resume. */
export function validateResume(file: File | null): string | undefined {
  if (!file) return 'Please attach your resume or CV.'
  const name = file.name.toLowerCase()
  const hasValidExt = RESUME_EXTENSIONS.some((ext) => name.endsWith(ext))
  if (!hasValidExt) {
    return 'Upload a PDF, DOC or DOCX file.'
  }
  if (file.size > RESUME_MAX_BYTES) {
    return 'The file exceeds the maximum 5 MB limit.'
  }
  if (file.size === 0) {
    return 'The selected file is empty.'
  }
  return undefined
}

/** Runs every rule and returns the first error per field. */
export function validateForm<T extends object>(
  values: T,
  rules: FormRules<T>,
): FormErrors<T> {
  const errors: FormErrors<T> = {}
  for (const field of Object.keys(rules) as Array<keyof T>) {
    const fieldRules = rules[field]
    if (!fieldRules) continue
    for (const validate of fieldRules) {
      const message = validate(values[field])
      if (message) {
        errors[field] = message
        break
      }
    }
  }
  return errors
}

/* Validation rules matching PDF forms */
export const contactFormRules: FormRules<ContactFormValues> = {
  fullName: [required('Full name')],
  email: [required('Business email'), email],
  country: [required('Country / Region')],
  industry: [required('Industry')],
  message: [required('Message')],
  consent: [requiredCheckbox('Privacy Notice')],
}

export const careerFormRules: FormRules<CareerApplicationValues> = {
  fullName: [required('Full name')],
  email: [required('Email address'), email],
  phone: [required('Phone number'), phone],
  currentLocation: [required('Current location')],
  linkedin: [url],
  consent: [requiredCheckbox('Privacy Notice')],
}
