import { API_ENDPOINTS, apiRequest } from './api'
import type { AdminContactMessage } from '@/admin/types/message'

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

interface MessagesListResponse {
  success: boolean
  data: BackendContactSubmission[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface MessageDetailResponse {
  success: boolean
  message?: string
  data: BackendContactSubmission
}

export function mapBackendMessage(item: BackendContactSubmission): AdminContactMessage {
  return {
    id: item.id,
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    phone: item.phone || 'Not provided',
    company: item.company || 'Direct Inquiry',
    service: 'General Inquiries',
    message: item.message,
    isRead: false,
    submittedAt: item.createdAt,
  }
}

export const adminMessageService = {
  /**
   * Fetch all contact submissions from backend.
   */
  async getMessages(params?: { page?: number; limit?: number }, signal?: AbortSignal): Promise<{
    messages: AdminContactMessage[]
    total: number
  }> {
    const res = await apiRequest<MessagesListResponse>(API_ENDPOINTS.adminContact, {
      method: 'GET',
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 100,
      },
      signal,
    })

    const rawList = Array.isArray(res.data) ? res.data : []
    const messages = rawList.map(mapBackendMessage)
    const total = res.pagination?.total ?? messages.length

    return { messages, total }
  },

  /**
   * Fetch a single contact submission by ID from backend.
   */
  async getMessageById(id: string, signal?: AbortSignal): Promise<AdminContactMessage> {
    const res = await apiRequest<MessageDetailResponse>(`${API_ENDPOINTS.adminContact}/${id}`, {
      method: 'GET',
      signal,
    })
    return mapBackendMessage(res.data)
  },

  /**
   * Delete contact submission by ID.
   */
  async deleteMessage(id: string): Promise<void> {
    await apiRequest<void>(`${API_ENDPOINTS.adminContact}/${id}`, {
      method: 'DELETE',
    })
  },
}
