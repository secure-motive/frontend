import { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'
import { ChevronDownIcon } from './icons'

/**
 * Form controls shared by the Contact and Career forms. Each field renders its
 * own label and error message and wires them to the control for assistive
 * technology.
 */

interface FieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  /** Marks the label with an asterisk and the control as required. */
  required?: boolean
  error?: string
  /** Layout classes for the field wrapper, e.g. `sm:col-span-2`. */
  className?: string
}

export const CONTROL_CLASSES =
  'w-full rounded-lg border border-cyber-teal/20 bg-cyber-field text-sm text-cyber-value transition-colors placeholder:text-cyber-placeholder/50 focus:border-cyber-teal/60 focus:ring-2 focus:ring-cyber-teal/20 focus:outline-none aria-invalid:border-cyber-orange'

interface FieldShellProps {
  id: string
  label: string
  required?: boolean
  error?: string
  className?: string
  children: ReactNode
}

export function FieldShell({ id, label, required, error, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block font-code text-xs tracking-widest text-cyber-muted uppercase"
      >
        {label}
        {required && <span aria-hidden="true" className="text-cyber-orange"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 font-code text-2xs text-cyber-orange">
          {error}
        </p>
      )}
    </div>
  )
}

/** aria attributes that tie a control to its error message. */
function describe(id: string, error?: string) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  }
}

interface TextFieldProps extends FieldProps {
  type?: 'text' | 'email' | 'tel' | 'url'
  /** On-screen keyboard hint, e.g. `decimal` for a number typed as text. */
  inputMode?: 'text' | 'decimal' | 'numeric'
  placeholder?: string
  autoComplete?: string
}

export function TextField({
  label,
  name,
  value,
  onChange,
  required,
  error,
  className,
  type = 'text',
  inputMode,
  placeholder,
  autoComplete,
}: TextFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} required={required} error={error} className={className}>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(CONTROL_CLASSES, 'px-4 py-3 leading-5.25')}
        {...describe(id, error)}
      />
    </FieldShell>
  )
}

interface SelectFieldProps extends FieldProps {
  /** Text of the empty first option, e.g. "Select your industry". */
  placeholder: string
  options: readonly string[]
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  required,
  error,
  className,
  placeholder,
  options,
}: SelectFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} required={required} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className={cn(CONTROL_CLASSES, 'appearance-none py-3 pr-10 pl-4')}
          {...describe(id, error)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2 text-cyber-muted" />
      </div>
    </FieldShell>
  )
}

interface TextAreaFieldProps extends FieldProps {
  placeholder?: string
  size?: 'md' | 'lg'
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  required,
  error,
  className,
  placeholder,
  size = 'lg',
}: TextAreaFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} required={required} error={error} className={className}>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        rows={size === 'lg' ? 5 : 4}
        className={cn(
          CONTROL_CLASSES,
          'mb-1.75 block resize-none px-4 py-3 leading-5.25',
        )}
        {...describe(id, error)}
      />
    </FieldShell>
  )
}

interface CheckboxFieldProps {
  id?: string
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  required?: boolean
  className?: string
  children: ReactNode
}

export function CheckboxField({
  id: customId,
  name,
  checked,
  onChange,
  error,
  required,
  className,
  children,
}: CheckboxFieldProps) {
  const generatedId = useId()
  const id = customId || generatedId

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer select-none">
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            required={required}
            className="peer sr-only"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          <div className="size-5 rounded border border-cyber-teal/30 bg-cyber-field transition-all peer-checked:border-cyber-teal peer-checked:bg-cyber-teal/20 peer-focus-visible:ring-2 peer-focus-visible:ring-cyber-teal flex items-center justify-center">
            {checked && (
              <svg className="size-3.5 text-cyber-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <span className="font-body text-xs sm:text-sm text-cyber-muted leading-relaxed">
          {children}
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className="ml-8 font-code text-2xs text-cyber-orange">
          {error}
        </p>
      )}
    </div>
  )
}
