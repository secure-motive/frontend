import { useState } from 'react'
import { submitCareerApplication } from '@/services/careerService'
import type { CareerApplicationValues } from '@/types/career'
import { careerFormRules, validateResume } from '@/utils/validation'
import { useFormSubmission } from './useFormSubmission'

const INITIAL_VALUES: CareerApplicationValues = {
  fullName: '',
  email: '',
  phone: '',
  currentLocation: '',
  linkedin: '',
  consent: false,
}

export type UploadStep = 'idle' | 'presigning' | 'uploading' | 'saving' | 'done'

/** State for the Careers "Submit resume" form: the text fields plus the resume file. */
export function useCareerForm() {
  const [resume, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string>()
  const [uploadStep, setUploadStep] = useState<UploadStep>('idle')

  /** Stores the chosen file and reports a wrong type or size straight away. */
  const setResume = (file: File | null) => {
    setResumeFile(file)
    setResumeError(file ? validateResume(file) : undefined)
  }

  const form = useFormSubmission<CareerApplicationValues>({
    initialValues: INITIAL_VALUES,
    rules: careerFormRules,
    validateExtra: () => {
      const error = validateResume(resume)
      setResumeError(error)
      return !error
    },
    submit: (values) => {
      setUploadStep('presigning')
      return submitCareerApplication(
        { ...values, resume: resume as File },
        (step) => setUploadStep(step),
      )
    },
    onDelivered: () => {
      setResumeFile(null)
      setUploadStep('idle')
    },
  })

  return { ...form, resume, resumeError, setResume, uploadStep }
}

export type CareerFormState = ReturnType<typeof useCareerForm>
