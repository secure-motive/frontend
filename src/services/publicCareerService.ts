/**
 * Public Career Application Service
 *
 * Coordinates secure AWS S3 resume upload via short-lived presigned URLs,
 * server-side file integrity & magic-byte verification, and records candidate
 * application records to the Cloud Firestore `applications` collection.
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
   * Request a short-lived presigned S3 upload URL from the server-side endpoint.
   * Rate limited per IP address.
   */
  async getPresignedUploadUrl(
    file: File,
    honeypot?: string,
  ): Promise<{
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
        _gotcha: honeypot || '',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 429) {
        throw new Error(
          errorData.error || 'Too many upload requests. Please wait a few moments before trying again.',
        )
      }
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
   * Finalize the uploaded resume on the server.
   * Server validates S3 object existence, enforces <= 5 MB, inspects binary magic bytes,
   * and promotes the object from staging (resumes/pending/) to permanent storage (resumes/).
   */
  async finalizeUpload(
    key: string,
    fileName: string,
    renderTime?: number,
  ): Promise<{ verifiedKey: string; fileSize: number }> {
    const response = await fetch('/api/finalize-resume-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key,
        fileName,
        _renderTime: renderTime,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 429) {
        throw new Error(
          errorData.error || 'Too many application submissions. Please wait before trying again.',
        )
      }
      throw new Error(
        errorData.error ||
          `Failed to verify uploaded resume with server (HTTP ${response.status}).`,
      )
    }

    const data = await response.json()
    return {
      verifiedKey: data.verifiedKey || key,
      fileSize: data.fileSize || 0,
    }
  },

  /**
   * Complete application submission:
   * 1. Validate form and resume
   * 2. Get presigned S3 upload URL from server API (resumes/pending/ staging)
   * 3. Upload file directly to S3 via presigned PUT URL
   * 4. Server-side validation & magic-byte check via /api/finalize-resume-upload
   * 5. Create document in Firestore `applications` collection with verified resumeKey
   */
  async submitApplication(
    application: CareerApplication & { _gotcha?: string; _renderTime?: number },
    onProgress?: (step: 'presigning' | 'uploading' | 'saving' | 'done') => void,
  ): Promise<CareerSubmissionResult> {
    const { resume, _gotcha, _renderTime, ...fields } = application

    if (!resume) {
      throw new Error('Please select a resume file before submitting.')
    }

    // Step 1: Request presigned S3 upload URL
    onProgress?.('presigning')
    const presignResult = await this.getPresignedUploadUrl(resume, _gotcha)

    // Step 2: Upload file directly to AWS S3 staging prefix
    onProgress?.('uploading')
    await this.uploadFileToS3(presignResult.uploadUrl, resume)

    // Step 3: Finalize and verify on server (magic bytes, size check, promotion)
    onProgress?.('saving')
    let verifiedResumeKey = presignResult.key
    try {
      const finalization = await this.finalizeUpload(presignResult.key, resume.name, _renderTime)
      verifiedResumeKey = finalization.verifiedKey
    } catch (finalizeErr) {
      console.warn('[Public Career Service] Finalization endpoint warning:', finalizeErr)
      // If endpoint returned an explicit error (e.g. signature or 429), rethrow
      const msg = finalizeErr instanceof Error ? finalizeErr.message : String(finalizeErr)
      if (msg.includes('Security validation') || msg.includes('limit') || msg.includes('Too many')) {
        throw finalizeErr
      }
    }

    // Step 4: Write application document to Cloud Firestore
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
      resumeKey: verifiedResumeKey,
      resumeUrl: verifiedResumeKey,
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
        resumeKey: verifiedResumeKey,
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
