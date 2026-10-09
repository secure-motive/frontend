import type { ContactFormValues } from '@/types/contact'
import { publicContactService } from './publicContactService'
import type { SubmissionResult } from '@/types/form'

/**
 * Sends a Contact form submission directly to Cloud Firestore.
 */
export async function submitContactForm(values: ContactFormValues): Promise<SubmissionResult> {
  await publicContactService.submitContact(values)
  return { delivered: true }
}
