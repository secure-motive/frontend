import { Link } from 'react-router'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { CheckboxField, TextField } from '@/components/common/FormFields'
import FormStatus from '@/components/common/FormStatus'
import type { CareerFormState } from '@/hooks/useCareerForm'
import ResumeUpload from './ResumeUpload'

/**
 * Career / Resume Submission Form matching SecureXmotive_Resume_Upload_Form.pdf specifications.
 */
export default function CareerForm({ form }: { form: CareerFormState }) {
  const {
    values,
    errors,
    status,
    errorMessage,
    setField,
    handleSubmit,
    resetStatus,
    resume,
    resumeError,
    setResume,
    uploadStep,
  } = form

  const isSubmitting = status === 'submitting'
  const isSuccess = status === 'success'

  const getSubmitButtonText = () => {
    if (!isSubmitting) return 'SUBMIT RESUME'
    switch (uploadStep) {
      case 'presigning':
        return 'Authenticating Upload…'
      case 'uploading':
        return 'Uploading Resume to AWS S3…'
      case 'saving':
        return 'Saving Application Details…'
      default:
        return 'Submitting Application…'
    }
  }

  return (
    <Card interactive className="overflow-hidden border border-cyber-teal/20 bg-cyber-bg/95 p-6 sm:p-8 md:p-10 shadow-2xl">
      {/* Header & Introductory Content */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-lg font-bold tracking-wider text-cyber-teal">
            secure<span className="text-white">X</span>motive
          </span>
          <span className="font-code text-2xs tracking-widest text-cyber-muted uppercase border border-white/10 px-2 py-0.5 rounded">
            Resume Upload Form
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
          Careers & Opportunities
        </h1>
        <p className="mt-2 font-body text-sm text-cyber-muted leading-relaxed max-w-2xl">
          Join us in securing connected vehicles, off-highway machinery and industrial systems.
        </p>
      </div>

      {isSuccess ? (
        <div className="py-12 text-center space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-cyber-teal/10 border border-cyber-teal/30 text-cyber-teal">
            <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-bold uppercase text-white">
            Application & Resume Received
          </h3>
          <p className="font-body text-sm text-cyber-muted max-w-md mx-auto">
            Thank you for applying. Your profile and resume have been securely uploaded. Our technical talent team will review your qualifications and reach out if there is a match.
          </p>
          <div className="pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetStatus}
            >
              Submit Another Application
            </Button>
          </div>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} aria-labelledby="careers-form-heading">
          <div className="space-y-8">
            {/* Section 01 — Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded bg-cyber-teal font-code text-xs font-bold text-cyber-bg">
                  01
                </span>
                <h2 id="careers-form-heading" className="font-display text-lg font-bold uppercase tracking-wide text-white">
                  Personal Information
                </h2>
              </div>

              <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                {/* Column 1 */}
                <div className="space-y-4">
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={values.fullName}
                    onChange={(value) => setField('fullName', value)}
                    error={errors.fullName}
                    placeholder="Enter full name"
                    autoComplete="name"
                    required
                  />

                  <TextField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={(value) => setField('phone', value)}
                    error={errors.phone}
                    placeholder="+91 XXXXX XXXXX"
                    autoComplete="tel"
                    required
                  />

                  <TextField
                    label="LinkedIn Profile (Optional)"
                    name="linkedin"
                    type="url"
                    value={values.linkedin}
                    onChange={(value) => setField('linkedin', value)}
                    error={errors.linkedin}
                    placeholder="https://linkedin.com/in/your-profile"
                    autoComplete="url"
                  />
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={(value) => setField('email', value)}
                    error={errors.email}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />

                  <TextField
                    label="Current Location"
                    name="currentLocation"
                    value={values.currentLocation}
                    onChange={(value) => setField('currentLocation', value)}
                    error={errors.currentLocation}
                    placeholder="City, Country"
                    autoComplete="address-level2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 02 — Resume Upload */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded bg-cyber-teal font-code text-xs font-bold text-cyber-bg">
                  02
                </span>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                  Resume Upload
                </h2>
              </div>

              <div>
                <ResumeUpload
                  file={resume}
                  onChange={setResume}
                  error={resumeError}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Privacy Consent Checkbox */}
            <div className="border-t border-white/10 pt-6">
              <CheckboxField
                name="consent"
                checked={values.consent}
                onChange={(checked) => setField('consent', checked)}
                error={errors.consent}
                required
              >
                I consent to SecureXmotive processing my personal information and resume for recruitment purposes, as described in the{' '}
                <Link to="/privacy-policy" className="text-cyber-teal underline hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  Privacy Notice
                </Link>
                . *
              </CheckboxField>
            </div>

            {/* Submit Button & Confidentiality Note */}
            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                className="py-3.5 font-display text-base font-bold tracking-wider uppercase"
              >
                {getSubmitButtonText()}
              </Button>

              {isSubmitting && (
                <div className="flex items-center justify-center gap-2 font-code text-2xs text-cyber-teal">
                  <span className="inline-block size-2 animate-ping rounded-full bg-cyber-teal" />
                  <span>
                    {uploadStep === 'presigning' && 'Contacting AWS S3…'}
                    {uploadStep === 'uploading' && 'Streaming encrypted resume file to Amazon S3…'}
                    {uploadStep === 'saving' && 'Registering application document in Cloud Firestore…'}
                  </span>
                </div>
              )}

              <FormStatus
                status={status}
                success="Application submitted successfully. Our recruitment team will review your application."
                error={errorMessage || 'Application could not be submitted. Please check the required fields and try again.'}
              />

              <p className="text-center font-body text-xs text-cyber-muted/80">
                Your information will be handled confidentially in accordance with the{' '}
                <Link to="/privacy-policy" className="text-cyber-teal hover:underline">
                  Privacy Notice
                </Link>
                .
              </p>
            </div>
          </div>
        </form>
      )}
    </Card>
  )
}
