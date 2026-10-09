/**
 * Firestore Career Applications Service
 *
 * Handles Cloud Firestore operations for the `applications` collection:
 * - Query & list applications (with ordering by submission date)
 * - Single application retrieval by ID
 * - Status updates (NEW, REVIEWED, SHORTLISTED, ARCHIVED)
 * - Document deletion
 * - Safe document schema normalization (handling Firestore Timestamps, ISO strings, field variations)
 * - S3 Presigned Download URL generation
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
import type { AdminApplication, ApplicationStatus } from '@/admin/types/application'

export const APPLICATIONS_COLLECTION = 'applications'

/**
 * Valid application status values.
 */
const VALID_STATUSES: Record<string, ApplicationStatus> = {
  NEW: 'NEW',
  PENDING: 'NEW',
  REVIEWED: 'REVIEWED',
  SHORTLISTED: 'SHORTLISTED',
  ARCHIVED: 'ARCHIVED',
  REJECTED: 'ARCHIVED',
}

/**
 * Safely parse timestamps from Firestore documents (Timestamp, ISO string, number, Date).
 */
export function parseFirestoreDate(val: unknown): string {
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
 * Normalize a Firestore document snapshot into an AdminApplication interface.
 */
export function mapFirestoreApplication(docSnap: QueryDocumentSnapshot<DocumentData> | { id: string; data: () => DocumentData | undefined }): AdminApplication {
  const data = docSnap.data() || {}
  const rawStatus = String(data.status || 'NEW').toUpperCase().trim()
  const status: ApplicationStatus = VALID_STATUSES[rawStatus] || 'NEW'

  // Construct full name if stored as separate fields
  let fullName = String(data.fullName || '').trim()
  if (!fullName && (data.firstName || data.lastName)) {
    fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim()
  }
  if (!fullName) {
    fullName = 'Applicant'
  }

  const currentLocation = data.currentLocation ? String(data.currentLocation) : (data.location ? String(data.location) : undefined)
  const resumeKey = data.resumeKey ? String(data.resumeKey) : (data.resumeUrl ? String(data.resumeUrl) : undefined)
  const submittedAt = parseFirestoreDate(data.submittedAt || data.createdAt)

  return {
    id: docSnap.id,
    fullName,
    email: String(data.email || ''),
    phone: String(data.phone || ''),
    experience: String(data.experience || data.yearsOfExperience || (currentLocation ? `Location: ${currentLocation}` : 'Not specified')),
    role: String(data.role || data.position || 'Career Applicant'),
    linkedin: String(data.linkedin || ''),
    currentLocation,
    resumeFileName: String(data.resumeFileName || data.resumeOriginalName || data.resumeName || 'resume.pdf'),
    resumeFileSize: data.resumeFileSize ? String(data.resumeFileSize) : 'PDF/DOC',
    resumeKey,
    coverNote: String(data.coverNote || data.experienceSummary || data.notes || data.message || ''),
    status,
    submittedAt,
  }
}

export const firestoreApplicationService = {
  /**
   * Fetch all applications from Cloud Firestore, ordered by creation date descending.
   */
  async getApplications(params?: { limit?: number }): Promise<{
    applications: AdminApplication[]
    total: number
  }> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const maxItems = params?.limit ?? 100
    const colRef = collection(db, APPLICATIONS_COLLECTION)

    let snapshot
    try {
      // Primary query: ordered by createdAt descending
      const q = query(colRef, orderBy('createdAt', 'desc'), firestoreLimit(maxItems))
      snapshot = await getDocs(q)
    } catch (err) {
      // Fallback query if 'createdAt' index is not yet indexed or documents use 'submittedAt'
      console.warn('[Firestore Applications] Primary query with orderBy(createdAt) failed, falling back to unordered query:', err)
      try {
        const fallbackQ = query(colRef, firestoreLimit(maxItems))
        snapshot = await getDocs(fallbackQ)
      } catch (fallbackErr) {
        console.error('[Firestore Applications] Fallback getDocs query failed:', fallbackErr)
        throw fallbackErr
      }
    }

    const applications = snapshot.docs.map((docSnap) => mapFirestoreApplication(docSnap))

    // Client-side sort by date descending to ensure consistent ordering
    applications.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return {
      applications,
      total: applications.length,
    }
  },

  /**
   * Fetch a single application by ID from Cloud Firestore.
   */
  async getApplicationById(id: string): Promise<AdminApplication> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const docRef = doc(db, APPLICATIONS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error(`Career application with ID "${id}" was not found.`)
    }

    return mapFirestoreApplication(docSnap)
  },

  /**
   * Update the status of an application in Cloud Firestore.
   */
  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const docRef = doc(db, APPLICATIONS_COLLECTION, id)
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    })
  },

  /**
   * Delete an application document from Cloud Firestore.
   */
  async deleteApplication(id: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const docRef = doc(db, APPLICATIONS_COLLECTION, id)
    await deleteDoc(docRef)
  },

  /**
   * Resume download reference handler.
   * Generates a short-lived presigned download URL for the resume in AWS S3.
   */
  async getResumeDownloadUrl(id: string): Promise<{ url: string; fileName: string; expiresIn: number }> {
    const app = await this.getApplicationById(id)
    const key = app.resumeKey

    if (key && key !== 'pending_upload' && key !== 'none') {
      try {
        const res = await fetch(`/api/get-resume-download-url?key=${encodeURIComponent(key)}&fileName=${encodeURIComponent(app.resumeFileName)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.url && data.url !== '#') {
            return {
              url: data.url,
              fileName: app.resumeFileName,
              expiresIn: data.expiresIn || 300,
            }
          }
        }
      } catch (err) {
        console.warn('[Firestore Applications] Error requesting presigned download URL:', err)
      }
    }

    return {
      url: '#',
      fileName: app.resumeFileName,
      expiresIn: 300,
    }
  },
}
