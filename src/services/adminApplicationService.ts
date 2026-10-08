import { API_ENDPOINTS, apiRequest } from './api'
import type { AdminApplication } from '@/admin/types/application'

export interface BackendCareerApplication {
  id: string
  fullName: string
  phone: string
  email: string
  experience: string
  linkedin: string | null
  resumeKey: string
  resumeOriginalName: string
  createdAt: string
}

interface ApplicationsListResponse {
  success: boolean
  data: BackendCareerApplication[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface ApplicationDetailResponse {
  success: boolean
  message?: string
  data: BackendCareerApplication
}

interface ResumeDownloadResponse {
  success: boolean
  message: string
  data: {
    url: string
    expiresIn: number
    fileName: string
  }
}

export function mapBackendApplication(item: BackendCareerApplication): AdminApplication {
  return {
    id: item.id,
    fullName: item.fullName,
    email: item.email,
    phone: item.phone,
    experience: item.experience,
    role: 'Career Applicant',
    linkedin: item.linkedin || '',
    resumeFileName: item.resumeOriginalName || 'resume.pdf',
    resumeFileSize: 'PDF/DOC',
    coverNote: item.experience,
    status: 'NEW',
    submittedAt: item.createdAt,
  }
}

export const adminApplicationService = {
  /**
   * Fetch all career applications from backend.
   */
  async getApplications(params?: { page?: number; limit?: number }, signal?: AbortSignal): Promise<{
    applications: AdminApplication[]
    total: number
  }> {
    const res = await apiRequest<ApplicationsListResponse>(API_ENDPOINTS.adminCareers, {
      method: 'GET',
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 100,
      },
      signal,
    })

    const rawList = Array.isArray(res.data) ? res.data : []
    const applications = rawList.map(mapBackendApplication)
    const total = res.pagination?.total ?? applications.length

    return { applications, total }
  },

  /**
   * Fetch a single application by ID from backend.
   */
  async getApplicationById(id: string, signal?: AbortSignal): Promise<AdminApplication> {
    const res = await apiRequest<ApplicationDetailResponse>(`${API_ENDPOINTS.adminCareers}/${id}`, {
      method: 'GET',
      signal,
    })
    return mapBackendApplication(res.data)
  },

  /**
   * Generate short-lived presigned S3 URL to view/download applicant resume.
   */
  async getResumeDownloadUrl(id: string): Promise<{ url: string; fileName: string; expiresIn: number }> {
    const res = await apiRequest<ResumeDownloadResponse>(`${API_ENDPOINTS.adminCareers}/${id}/resume`, {
      method: 'GET',
    })
    return res.data
  },

  /**
   * Delete career application and its associated S3 resume file.
   */
  async deleteApplication(id: string): Promise<void> {
    await apiRequest<void>(`${API_ENDPOINTS.adminCareers}/${id}`, {
      method: 'DELETE',
    })
  },
}
