/**
 * Firestore Contact Messages Service
 *
 * Handles Cloud Firestore operations for the `contactSubmissions` collection:
 * - Query & list inquiries (ordered by submission date descending)
 * - Single message retrieval by ID
 * - Mark as read / unread persistence
 * - Message deletion
 * - Safe document schema normalization (handling Firestore Timestamps, ISO strings, field variations)
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { AdminContactMessage } from '@/admin/types/message'

export const CONTACT_COLLECTION = 'contactSubmissions'

/**
 * Safely parse timestamps from Firestore documents (Timestamp, ISO string, number, Date).
 */
export function parseFirestoreMessageDate(val: unknown): string {
  if (!val) return new Date().toISOString()
  if (val instanceof Timestamp) {
    return val.toDate().toISOString()
  }
  if (typeof val === 'object' && val !== null && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate().toISOString()
  }
  if (typeof val === 'string') {
    const d = new Date(val)
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
  }
  if (typeof val === 'number') {
    const d = new Date(val)
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
  }
  if (val instanceof Date) {
    return val.toISOString()
  }
  return new Date().toISOString()
}

/**
 * Normalize a Firestore document snapshot into an AdminContactMessage interface.
 */
export function mapFirestoreMessage(
  docSnap: QueryDocumentSnapshot<DocumentData> | { id: string; data: () => DocumentData | undefined },
): AdminContactMessage {
  const data = docSnap.data() || {}

  // Name handling: split if single 'name' or 'fullName' field provided
  let firstName = String(data.firstName || '').trim()
  let lastName = String(data.lastName || '').trim()

  if (!firstName && !lastName) {
    const full = String(data.name || data.fullName || '').trim()
    if (full) {
      const parts = full.split(/\s+/)
      firstName = parts[0] || 'Inquirer'
      lastName = parts.slice(1).join(' ')
    } else {
      firstName = 'Inquirer'
      lastName = ''
    }
  }

  // Read status: supports 'isRead' or 'read'
  const isRead = Boolean(data.isRead ?? data.read ?? false)

  const submittedAt = parseFirestoreMessageDate(data.submittedAt || data.createdAt)
  const country = data.country ? String(data.country) : undefined
  const industry = data.industry ? String(data.industry) : undefined
  const service = String(data.service || data.industry || data.subject || 'General Inquiries')

  return {
    id: docSnap.id,
    firstName,
    lastName,
    email: String(data.email || ''),
    phone: String(data.phone || 'Not provided'),
    company: String(data.company || data.organization || 'Direct Inquiry'),
    jobTitle: data.jobTitle ? String(data.jobTitle) : undefined,
    country,
    industry,
    service,
    message: String(data.message || data.body || data.inquiry || ''),
    isRead,
    submittedAt,
  }
}

export const firestoreMessageService = {
  /**
   * Fetch all contact messages from Cloud Firestore, ordered by creation date descending.
   */
  async getMessages(params?: { limit?: number }): Promise<{
    messages: AdminContactMessage[]
    total: number
  }> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const maxItems = params?.limit ?? 100
    const colRef = collection(db, CONTACT_COLLECTION)

    let snapshot
    try {
      // Primary query: ordered by createdAt descending
      const q = query(colRef, orderBy('createdAt', 'desc'), firestoreLimit(maxItems))
      snapshot = await getDocs(q)
    } catch (err) {
      console.warn('[Firestore Messages] Primary query with orderBy(createdAt) failed, falling back to unordered query:', err)
      try {
        const fallbackQ = query(colRef, firestoreLimit(maxItems))
        snapshot = await getDocs(fallbackQ)
      } catch (fallbackErr) {
        console.error('[Firestore Messages] Fallback getDocs query failed:', fallbackErr)
        throw fallbackErr
      }
    }

    const messages = snapshot.docs.map((docSnap) => mapFirestoreMessage(docSnap))

    // Client-side sort by date descending to ensure consistent ordering
    messages.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return {
      messages,
      total: messages.length,
    }
  },

  /**
   * Fetch a single contact message by ID from Cloud Firestore.
   */
  async getMessageById(id: string): Promise<AdminContactMessage> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const docRef = doc(db, CONTACT_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error(`Contact message with ID "${id}" was not found.`)
    }

    return mapFirestoreMessage(docSnap)
  },

  /**
   * Mark a message as read or unread in Cloud Firestore.
   */
  async markMessageAsRead(id: string, isRead = true): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const docRef = doc(db, CONTACT_COLLECTION, id)
    await updateDoc(docRef, {
      isRead,
      read: isRead,
      updatedAt: serverTimestamp(),
    })
  },

  /**
   * Delete a contact message document from Cloud Firestore.
   */
  async deleteMessage(id: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const docRef = doc(db, CONTACT_COLLECTION, id)
    await deleteDoc(docRef)
  },
}
