/**
 * Admin Application Service
 *
 * Migrated to Cloud Firestore (Phase 7).
 * Interacts directly with the Firestore `applications` collection.
 */
import type { AdminApplication, ApplicationStatus } from '@/admin/types/application'
import { firestoreApplicationService } from './firestoreApplicationService'

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

export const adminApplicationService = {
  /**
   * Fetch all career applications from Cloud Firestore.
   */
  async getApplications(params?: { page?: number; limit?: number }, _signal?: AbortSignal): Promise<{
    applications: AdminApplication[]
    total: number
  }> {
    return firestoreApplicationService.getApplications({ limit: params?.limit ?? 100 })
  },

  /**
   * Fetch a single application by ID from Cloud Firestore.
   */
  async getApplicationById(id: string, _signal?: AbortSignal): Promise<AdminApplication> {
    return firestoreApplicationService.getApplicationById(id)
  },

  /**
   * Update status of an application in Cloud Firestore.
   */
  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
    return firestoreApplicationService.updateApplicationStatus(id, status)
  },

  /**
   * Preserved resume download link resolver.
   */
  async getResumeDownloadUrl(id: string): Promise<{ url: string; fileName: string; expiresIn: number }> {
    return firestoreApplicationService.getResumeDownloadUrl(id)
  },

  /**
   * Delete career application from Cloud Firestore.
   */
  async deleteApplication(id: string): Promise<void> {
    return firestoreApplicationService.deleteApplication(id)
  },
}
