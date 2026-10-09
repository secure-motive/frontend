import { useState } from 'react'
import type { SubmissionResult } from '@/types/form'
import { validateForm, type FormErrors, type FormRules } from '@/utils/validation'

/**
 * `success` — the submission succeeded.
 * `preview` — the form is valid but preview mode is active.
 * `error` — submission failed.
 */
export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'preview' | 'error'

interface UseFormSubmissionOptions<T extends object> {
  initialValues: T
  rules: FormRules<T>
  submit: (values: T) => Promise<SubmissionResult>
  /** Checks outside the text fields (e.g. a file). Returns true when valid. */
  validateExtra?: () => boolean
  /** Runs after submission succeeds, to clear state held elsewhere. */
  onDelivered?: () => void
}

/** Shared state machine for the site's forms: values, validation, submission. */
export function useFormSubmission<T extends object>({
  initialValues,
  rules,
  submit,
  validateExtra,
  onDelivered,
}: UseFormSubmissionOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const setField = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault()
    if (status === 'submitting') return

    const nextErrors = validateForm(values, rules)
    setErrors(nextErrors)
    // Run both checks so every problem is shown at once.
    const extraIsValid = validateExtra ? validateExtra() : true
    if (Object.keys(nextErrors).length > 0 || !extraIsValid) {
      setStatus('idle')
      return
    }

    setStatus('submitting')
    setErrorMessage(null)
    try {
      const { delivered } = await submit(values)
      if (delivered) {
        setValues(initialValues)
        onDelivered?.()
      }
      setStatus(delivered ? 'success' : 'preview')
    } catch (err) {
      console.error('[Form Submission Error]:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed. Please try again.')
      setStatus('error')
    }
  }

  const resetStatus = () => {
    setStatus('idle')
    setErrorMessage(null)
  }

  return { values, errors, status, errorMessage, setField, handleSubmit, resetStatus }
}
