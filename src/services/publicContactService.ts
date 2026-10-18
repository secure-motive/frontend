/**
 * Public Contact Submission Service
 *
 * Saves public contact inquiries via rate-limited, anti-spam server API
 * with direct Firestore fallback.
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
   * Submit a contact inquiry document.
   * Routes through /api/submit-contact to enforce server-side rate limits,
   * honeypot checks, and XSS sanitization.
   */
  async submitContact(
    values: ContactFormValues & { _gotcha?: string; _renderTime?: number },
  ): Promise<PublicSubmissionResponse> {
    // 1. Attempt server-side hardened endpoint
    try {
      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, id: data.id }
      }

      if (response.status === 429) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(
          errData.error || 'Too many submissions. Please wait before submitting another message.',
        )
      }

      // If client error from validation or honeypot (400)
      if (response.status === 400) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Validation error in submission.')
      }
    } catch (apiErr: any) {
      // If error was an explicit rate limit or validation error, rethrow
      if (
        apiErr?.message?.includes('Too many') ||
        apiErr?.message?.includes('Validation') ||
        apiErr?.message?.includes('exceeded') ||
        apiErr?.message?.includes('Duplicate')
      ) {
        throw apiErr
      }
      console.warn('[Public Contact Service] Server API unavailable, falling back to direct Firestore:', apiErr)
    }

    // 2. Direct Firestore write fallback
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
      service: values.industry.trim(),
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
