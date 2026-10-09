import { Link } from 'react-router'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { CheckboxField, SelectField, TextAreaField, TextField } from '@/components/common/FormFields'
import FormStatus from '@/components/common/FormStatus'
import { useContactForm } from '@/hooks/useContactForm'
import { INDUSTRY_OPTIONS } from '@/types/contact'

/**
 * Contact Us Form matching SecureXmotive_Contact_Us_Form.pdf specifications.
 */
export default function ContactForm() {
  const { values, errors, status, errorMessage, setField, handleSubmit, resetStatus } = useContactForm()
  const isSubmitting = status === 'submitting'
  const isSuccess = status === 'success'

  return (
    <Card interactive className="overflow-hidden border border-cyber-teal/20 bg-cyber-bg/95 p-6 sm:p-8 md:p-10 shadow-2xl">
      {/* Header & Introductory Content */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-lg font-bold tracking-wider text-cyber-teal">
            secure<span className="text-white">X</span>motive
          </span>
          <span className="font-code text-2xs tracking-widest text-cyber-muted uppercase border border-white/10 px-2 py-0.5 rounded">
            Contact Form
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
          Contact Us
        </h1>
        <p className="mt-1 font-display text-base sm:text-lg font-semibold text-cyber-teal">
          Let's Secure Your Connected World
        </p>
        <p className="mt-2 font-body text-sm text-cyber-muted leading-relaxed max-w-2xl">
          Have a cybersecurity challenge or project requirement? Send us a message, and our team will get in touch.
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
            Thank You for Reaching Out
          </h3>
          <p className="font-body text-sm text-cyber-muted max-w-md mx-auto">
            Your inquiry has been received. Our cybersecurity advisory team will review your requirements and get in touch shortly.
          </p>
          <div className="pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetStatus}
            >
              Send Another Message
            </Button>
          </div>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} aria-labelledby="contact-form-heading">
          <div className="space-y-8">
            {/* Section 01 — Your Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded bg-cyber-teal font-code text-xs font-bold text-cyber-bg">
                  01
                </span>
                <h2 id="contact-form-heading" className="font-display text-lg font-bold uppercase tracking-wide text-white">
                  Your Information
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
                    placeholder="Enter your name"
                    autoComplete="name"
                    required
                  />

                  <TextField
                    label="Company Name"
                    name="company"
                    value={values.company}
                    onChange={(value) => setField('company', value)}
                    error={errors.company}
                    placeholder="Your organization"
                    autoComplete="organization"
                  />

                  <TextField
                    label="Country / Region"
                    name="country"
                    value={values.country}
                    onChange={(value) => setField('country', value)}
                    error={errors.country}
                    placeholder="Enter your country"
                    autoComplete="country-name"
                    required
                  />
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <TextField
                    label="Business Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={(value) => setField('email', value)}
                    error={errors.email}
                    placeholder="name@company.com"
                    autoComplete="email"
                    required
                  />

                  <TextField
                    label="Job Title"
                    name="jobTitle"
                    value={values.jobTitle}
                    onChange={(value) => setField('jobTitle', value)}
                    error={errors.jobTitle}
                    placeholder="e.g. Cybersecurity Manager"
                    autoComplete="organization-title"
                  />
                </div>
              </div>
            </div>

            {/* Section 02 — Your Inquiry */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded bg-cyber-teal font-code text-xs font-bold text-cyber-bg">
                  02
                </span>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                  Your Inquiry
                </h2>
              </div>

              <div className="space-y-4">
                <SelectField
                  label="Industry"
                  name="industry"
                  value={values.industry}
                  onChange={(value) => setField('industry', value)}
                  error={errors.industry}
                  placeholder="Select your industry"
                  options={INDUSTRY_OPTIONS}
                  required
                />

                {/* Visual Industry Reference Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setField('industry', opt)}
                      className={`font-code text-3xs px-2.5 py-1 rounded transition-all ${
                        values.industry === opt
                          ? 'bg-cyber-teal text-cyber-bg font-bold border border-cyber-teal'
                          : 'bg-white/5 text-cyber-muted border border-white/10 hover:border-cyber-teal/40 hover:text-white'
                      }`}
                    >
                      ■ {opt}
                    </button>
                  ))}
                </div>

                <TextAreaField
                  label="Your Message"
                  name="message"
                  value={values.message}
                  onChange={(value) => setField('message', value)}
                  error={errors.message}
                  placeholder="Describe your cybersecurity challenge, project requirements, or how we can help..."
                  size="lg"
                  required
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
                I agree to the processing of my personal information to respond to this inquiry, as described in the{' '}
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
                {isSubmitting ? 'Sending Message…' : 'SEND MESSAGE'}
              </Button>

              <FormStatus
                status={status}
                success="Message sent. We will respond within one business day."
                error={errorMessage || 'Your message could not be sent. Please check the form and try again.'}
              />

              <p className="text-center font-body text-xs text-cyber-muted/80">
                Your information will be handled confidentially in accordance with our{' '}
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
