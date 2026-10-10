/**
 * Firestore Video Management Service
 *
 * Handles Cloud Firestore operations for the `videos` collection:
 * - Query & list all videos for admin (ordered by updated/created date descending)
 * - Single video retrieval by ID
 * - Create new video document
 * - Update existing video document
 * - Delete video document
 * - Publish / unpublish toggling
 * - Automatic YouTube thumbnail derivation and timestamp handling
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { Video } from '@/types/video'
import type { AdminVideo, VideoFormValues } from '@/admin/types/video'
import { getYoutubeThumbnail } from '@/admin/utils/videoUtils'

export const VIDEOS_COLLECTION = 'videos'

/**
 * Safely parse timestamps from Firestore documents (Timestamp, ISO string, number, Date).
 */
export function parseFirestoreVideoDate(val: unknown): string {
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
 * Normalize a Firestore document snapshot into an AdminVideo interface.
 */
export function mapFirestoreVideo(
  docSnap: QueryDocumentSnapshot<DocumentData> | { id: string; data: () => DocumentData | undefined },
): AdminVideo {
  const data = docSnap.data() || {}
  const youtubeUrl = String(data.youtubeUrl || data.url || '')
  const isPublished = Boolean(data.isPublished ?? data.published ?? false)
  const createdAt = parseFirestoreVideoDate(data.createdAt || data.submittedAt)
  const updatedAt = parseFirestoreVideoDate(data.updatedAt || data.createdAt)
  const rawOrder = data.order !== undefined ? Number(data.order) : (data.displayOrder !== undefined ? Number(data.displayOrder) : undefined)
  const order = typeof rawOrder === 'number' && !isNaN(rawOrder) ? rawOrder : undefined

  return {
    id: docSnap.id,
    title: String(data.title || 'Untitled Video'),
    description: String(data.description || ''),
    youtubeUrl,
    thumbnailUrl: String(data.thumbnailUrl || data.thumbnail || getYoutubeThumbnail(youtubeUrl) || ''),
    isPublished,
    order,
    createdAt,
    updatedAt,
  }
}

export const firestoreVideoService = {
  /**
   * Fetch all videos from Cloud Firestore (for admin portal).
   */
  async getVideos(params?: { limit?: number }): Promise<{
    videos: AdminVideo[]
    total: number
  }> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const maxItems = params?.limit ?? 100
    const colRef = collection(db, VIDEOS_COLLECTION)

    let snapshot
    try {
      // Primary query: ordered by updatedAt descending
      const q = query(colRef, orderBy('updatedAt', 'desc'), firestoreLimit(maxItems))
      snapshot = await getDocs(q)
    } catch (err) {
      console.warn('[Firestore Videos] Primary query with orderBy(updatedAt) failed, falling back to unordered query:', err)
      try {
        const fallbackQ = query(colRef, firestoreLimit(maxItems))
        snapshot = await getDocs(fallbackQ)
      } catch (fallbackErr) {
        console.error('[Firestore Videos] Fallback getDocs query failed:', fallbackErr)
        throw fallbackErr
      }
    }

    const videos = snapshot.docs.map((docSnap) => mapFirestoreVideo(docSnap))

    // Client-side sort by order ascending (1, 2, 3...), then update date descending
    videos.sort((a, b) => {
      const orderA = a.order !== undefined && a.order !== null ? a.order : Number.MAX_SAFE_INTEGER
      const orderB = b.order !== undefined && b.order !== null ? b.order : Number.MAX_SAFE_INTEGER
      if (orderA !== orderB) {
        return orderA - orderB
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

    return {
      videos,
      total: videos.length,
    }
  },

  /**
   * Fetch a single video record by ID from Cloud Firestore.
   */
  async getVideoById(id: string): Promise<AdminVideo> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const docRef = doc(db, VIDEOS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error(`Video with ID "${id}" was not found.`)
    }

    return mapFirestoreVideo(docSnap)
  },

  /**
   * Create a new video entry in Cloud Firestore.
   */
  async createVideo(values: VideoFormValues): Promise<AdminVideo> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const title = values.title.trim()
    const description = values.description.trim()
    const youtubeUrl = values.youtubeUrl.trim()
    const isPublished = Boolean(values.isPublished)
    const thumbnailUrl = getYoutubeThumbnail(youtubeUrl) || ''
    const order = values.order !== undefined && !isNaN(Number(values.order)) ? Number(values.order) : 1

    const colRef = collection(db, VIDEOS_COLLECTION)
    const docRef = await addDoc(colRef, {
      title,
      description,
      youtubeUrl,
      thumbnailUrl,
      isPublished,
      published: isPublished,
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    const nowIso = new Date().toISOString()
    return {
      id: docRef.id,
      title,
      description,
      youtubeUrl,
      thumbnailUrl: thumbnailUrl || undefined,
      isPublished,
      order,
      createdAt: nowIso,
      updatedAt: nowIso,
    }
  },

  /**
   * Update an existing video document in Cloud Firestore.
   */
  async updateVideo(id: string, values: Partial<VideoFormValues>): Promise<AdminVideo> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const updateData: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    }

    if (values.title !== undefined) updateData.title = values.title.trim()
    if (values.description !== undefined) updateData.description = values.description.trim()
    if (values.youtubeUrl !== undefined) {
      const trimmedUrl = values.youtubeUrl.trim()
      updateData.youtubeUrl = trimmedUrl
      updateData.thumbnailUrl = getYoutubeThumbnail(trimmedUrl) || ''
    }
    if (values.isPublished !== undefined) {
      updateData.isPublished = values.isPublished
      updateData.published = values.isPublished
    }
    if (values.order !== undefined) {
      const numOrder = Number(values.order)
      updateData.order = isNaN(numOrder) ? 1 : numOrder
    }

    const docRef = doc(db, VIDEOS_COLLECTION, id)
    await updateDoc(docRef, updateData)

    return this.getVideoById(id)
  },

  /**
   * Batch reorder videos by updating order field for multiple videos.
   */
  async reorderVideos(videoOrders: { id: string; order: number }[]): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const promises = videoOrders.map(({ id, order }) => {
      const docRef = doc(db, VIDEOS_COLLECTION, id)
      return updateDoc(docRef, {
        order,
        updatedAt: serverTimestamp(),
      })
    })

    await Promise.all(promises)
  },

  /**
   * Delete a video document from Cloud Firestore.
   */
  async deleteVideo(id: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('You are not authenticated with Firebase. Please sign in again.')
    }

    const docRef = doc(db, VIDEOS_COLLECTION, id)
    await deleteDoc(docRef)
  },

  /**
   * Publish a video in Cloud Firestore.
   */
  async publishVideo(id: string): Promise<AdminVideo> {
    return this.updateVideo(id, { isPublished: true })
  },

  /**
   * Unpublish a video in Cloud Firestore.
   */
  async unpublishVideo(id: string): Promise<AdminVideo> {
    return this.updateVideo(id, { isPublished: false })
  },

  /**
   * Fetch all published videos from Cloud Firestore for the public website.
   * Public visitors can only view videos with isPublished: true or published: true.
   */
  async getPublishedVideos(): Promise<Video[]> {
    const colRef = collection(db, VIDEOS_COLLECTION)
    let snapshot

    try {
      // Primary query: filter for published documents
      const q = query(colRef, where('isPublished', '==', true))
      snapshot = await getDocs(q)
    } catch (err) {
      console.warn('[Firestore Public Videos] Primary query (isPublished == true) failed, trying fallback query (published == true):', err)
      try {
        const fallbackQ = query(colRef, where('published', '==', true))
        snapshot = await getDocs(fallbackQ)
      } catch (fallbackErr) {
        console.error('[Firestore Public Videos] Failed to fetch published videos from Firestore:', fallbackErr)
        throw fallbackErr
      }
    }

    const videos: Video[] = []
    const seenIds = new Set<string>()

    for (const docSnap of snapshot.docs) {
      if (seenIds.has(docSnap.id)) continue
      seenIds.add(docSnap.id)

      const data = docSnap.data()
      const isPublished = Boolean(data.isPublished ?? data.published ?? false)
      if (!isPublished) continue

      const youtubeUrl = String(data.youtubeUrl || data.url || '')
      if (!youtubeUrl || !/^https?:\/\//i.test(youtubeUrl)) continue

      const publishedAt = parseFirestoreVideoDate(data.createdAt || data.updatedAt)
      const derivedThumbnail = String(data.thumbnailUrl || data.thumbnail || getYoutubeThumbnail(youtubeUrl) || '')
      const rawOrder = data.order !== undefined ? Number(data.order) : (data.displayOrder !== undefined ? Number(data.displayOrder) : undefined)
      const order = typeof rawOrder === 'number' && !isNaN(rawOrder) ? rawOrder : undefined

      videos.push({
        id: docSnap.id,
        title: String(data.title || 'Untitled Video'),
        description: String(data.description || ''),
        youtubeUrl,
        thumbnailUrl: derivedThumbnail || undefined,
        publishedAt,
        order,
      })
    }

    // Sort by order ascending (1, 2, 3...), then by publication/creation date descending
    videos.sort((a, b) => {
      const orderA = a.order !== undefined && a.order !== null ? a.order : Number.MAX_SAFE_INTEGER
      const orderB = b.order !== undefined && b.order !== null ? b.order : Number.MAX_SAFE_INTEGER
      if (orderA !== orderB) {
        return orderA - orderB
      }
      const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return timeB - timeA
    })

    return videos
  },
}
