/**
 * Public Career Application Service
 *
 * Coordinates secure AWS S3 resume upload via short-lived presigned URLs
 * and saves candidate application records to the Cloud Firestore `applications` collection.
 */
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CareerApplication } from '@/types/career'

export const APPLICATIONS_COLLECTION = 'applications'

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export interface CareerSubmissionResult {
  success: boolean
  id?: string
  resumeKey?: string
  error?: string
}

export const publicCareerService = {
  /**
   * Request a short-lived presigned S3 upload URL from server-side endpoint.
   */
  async getPresignedUploadUrl(file: File): Promise<{
    uploadUrl: string
    key: string
    bucket: string
    expiresIn: number
  }> {
    const response = await fetch('/api/get-resume-upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        fileSize: file.size,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMsg =
        errorData.error ||
        `Server returned HTTP ${response.status} (${response.statusText}) when requesting upload URL.`
      throw new Error(errorMsg)
    }

    const data = await response.json()
    if (!data.uploadUrl) {
      throw new Error(
        data.error ||
          'Failed to obtain S3 upload authorization. Please ensure server-side AWS credentials and S3 bucket are configured.',
      )
    }

    return data
  },

  /**
   * Upload the binary file directly to Amazon S3 via the presigned PUT URL.
   */
  async uploadFileToS3(uploadUrl: string, file: File): Promise<void> {
    try {
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error(`S3 upload failed with status ${uploadResponse.status} (${uploadResponse.statusText})`)
      }
    } catch (err) {
      console.error('[S3 Upload Error]:', err)
      const message = err instanceof Error ? err.message : 'Failed to transfer resume to AWS S3.'
      throw new Error(`S3 File Transfer Failed: ${message}`)
    }
  },

  /**
   * Complete application submission:
   * 1. Validate form and resume
   * 2. Get presigned S3 upload URL from server API
   * 3. Upload file directly to S3 via presigned PUT URL
   * 4. Create document in Firestore `applications` collection
   */
  async submitApplication(
    application: CareerApplication,
    onProgress?: (step: 'presigning' | 'uploading' | 'saving' | 'done') => void,
  ): Promise<CareerSubmissionResult> {
    const { resume, ...fields } = application

    if (!resume) {
      throw new Error('Please select a resume file before submitting.')
    }

    // Step 1: Request presigned S3 upload URL
    onProgress?.('presigning')
    const presignResult = await this.getPresignedUploadUrl(resume)

    // Step 2: Upload file directly to AWS S3
    onProgress?.('uploading')
    await this.uploadFileToS3(presignResult.uploadUrl, resume)

    // Step 3: Write application document to Cloud Firestore
    onProgress?.('saving')
    const fullName = fields.fullName.trim()
    const nameParts = fullName.split(/\s+/)
    const firstName = nameParts[0] || 'Applicant'
    const lastName = nameParts.slice(1).join(' ')

    const payload = {
      fullName,
      firstName,
      lastName,
      email: fields.email.trim().toLowerCase(),
      phone: fields.phone.trim(),
      currentLocation: fields.currentLocation.trim(),
      location: fields.currentLocation.trim(),
      linkedin: fields.linkedin ? fields.linkedin.trim() : '',
      role: 'Careers & Opportunities / Connected Vehicle Security',
      experience: 'Not specified',
      coverNote: `Location: ${fields.currentLocation.trim()}`,
      resumeFileName: resume.name,
      resumeFileSize: formatFileSize(resume.size),
      resumeKey: presignResult.key,
      resumeUrl: presignResult.key,
      status: 'NEW',
      consent: Boolean(fields.consent),
      submittedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    try {
      const colRef = collection(db, APPLICATIONS_COLLECTION)
      const docRef = await addDoc(colRef, payload)
      onProgress?.('done')
      return {
        success: true,
        id: docRef.id,
        resumeKey: presignResult.key,
      }
    } catch (err) {
      console.error('[Public Career Service] Firestore write failed:', err)
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to register application in Cloud Firestore.'
      throw new Error(`Application Registration Failed: ${message}`)
    }
  },
}
