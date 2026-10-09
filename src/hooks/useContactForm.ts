import { submitContactForm } from '@/services/contactService'
import type { ContactFormValues } from '@/types/contact'
import { contactFormRules } from '@/utils/validation'
import { useFormSubmission } from './useFormSubmission'

const INITIAL_VALUES: ContactFormValues = {
  fullName: '',
  email: '',
  company: '',
  jobTitle: '',
  country: '',
  industry: '',
  message: '',
  consent: false,
}

/** State for the Contact page form matching SecureXmotive_Contact_Us_Form.pdf. */
export function useContactForm() {
  return useFormSubmission<ContactFormValues>({
    initialValues: INITIAL_VALUES,
    rules: contactFormRules,
    submit: submitContactForm,
  })
}
