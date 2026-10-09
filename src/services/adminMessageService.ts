/**
 * Admin Contact Message Service
 *
 * Migrated to Cloud Firestore (Phase 8).
 * Interacts directly with the Firestore `contactSubmissions` collection.
 */
import type { AdminContactMessage } from '@/admin/types/message'
import { firestoreMessageService } from './firestoreMessageService'

export interface BackendContactSubmission {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  company: string | null
  message: string
  createdAt: string
}

export const adminMessageService = {
  /**
   * Fetch all contact submissions from Cloud Firestore.
   */
  async getMessages(params?: { page?: number; limit?: number }, _signal?: AbortSignal): Promise<{
    messages: AdminContactMessage[]
    total: number
  }> {
    return firestoreMessageService.getMessages({ limit: params?.limit ?? 100 })
  },

  /**
   * Fetch a single contact submission by ID from Cloud Firestore.
   */
  async getMessageById(id: string, _signal?: AbortSignal): Promise<AdminContactMessage> {
    return firestoreMessageService.getMessageById(id)
  },

  /**
   * Mark message as read/unread in Cloud Firestore.
   */
  async markMessageAsRead(id: string, isRead = true): Promise<void> {
    return firestoreMessageService.markMessageAsRead(id, isRead)
  },

  /**
   * Delete contact submission from Cloud Firestore.
   */
  async deleteMessage(id: string): Promise<void> {
    return firestoreMessageService.deleteMessage(id)
  },
}
