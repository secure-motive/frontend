import type { CareerApplication } from '@/types/career'
import { API_ENDPOINTS, apiRequest, submitOrPreview, type SubmissionResult } from './api'

/**
 * Sends a career application as multipart form data: the text fields plus the
 * resume file under `resume`. Field names are provisional — see api.ts.
 */
export function submitCareerApplication({
  resume,
  ...fields
}: CareerApplication): Promise<SubmissionResult> {
  return submitOrPreview(() => {
    const body = new FormData()
    const fullName = `${fields.firstName} ${fields.lastName}`.trim()
    body.append('fullName', fullName)
    for (const [name, value] of Object.entries(fields)) body.append(name, value)
    body.append('resume', resume)
    return apiRequest<void>(API_ENDPOINTS.careerApplications, { method: 'POST', body })
  })
}
