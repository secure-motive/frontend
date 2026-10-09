import type { CareerApplication } from '@/types/career'
import { publicCareerService } from './publicCareerService'
import type { SubmissionResult } from '@/types/form'

/**
 * Sends a career application: uploads the resume to S3 and creates a Firestore document.
 */
export async function submitCareerApplication(
  application: CareerApplication,
  onProgress?: (step: 'presigning' | 'uploading' | 'saving' | 'done') => void,
): Promise<SubmissionResult> {
  await publicCareerService.submitApplication(application, onProgress)
  return { delivered: true }
}
