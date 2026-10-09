/**
 * Public Contact Submission Service
 *
 * Saves public contact inquiries directly to the Cloud Firestore `contactSubmissions` collection.
 */
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ContactFormValues } from '@/types/contact'

export const CONTACT_COLLECTION = 'contactSubmissions'

export interface PublicSubmissionResponse {
  success: boolean
  id?: string
  error?: string
}

export const publicContactService = {
  /**
   * Submit a contact inquiry document to Cloud Firestore.
   */
  async submitContact(values: ContactFormValues): Promise<PublicSubmissionResponse> {
    const fullName = values.fullName.trim()
    const nameParts = fullName.split(/\s+/)
    const firstName = nameParts[0] || 'Inquirer'
    const lastName = nameParts.slice(1).join(' ')

    const payload = {
      fullName,
      firstName,
      lastName,
      email: values.email.trim().toLowerCase(),
      company: values.company.trim() || 'Direct Inquiry',
      jobTitle: values.jobTitle.trim(),
      country: values.country.trim(),
      industry: values.industry.trim(),
      service: values.industry.trim(), // Map industry to service for admin compatibility
      message: values.message.trim(),
      consent: Boolean(values.consent),
      isRead: false,
      read: false,
      submittedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    }

    try {
      const colRef = collection(db, CONTACT_COLLECTION)
      const docRef = await addDoc(colRef, payload)
      return { success: true, id: docRef.id }
    } catch (err) {
      console.error('[Public Contact Service] Firestore submission error:', err)
      const message = err instanceof Error ? err.message : 'Failed to submit contact message.'
      throw new Error(message)
    }
  },
}
