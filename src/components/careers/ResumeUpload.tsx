import { useId, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { FieldShell } from '@/components/common/FormFields'
import { cn } from '@/utils/helpers'
import { RESUME_EXTENSIONS } from '@/utils/validation'

interface ResumeUploadProps {
  file: File | null
  onChange: (file: File | null) => void
  error?: string
  disabled?: boolean
  className?: string
}

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Resume Upload component matching SecureXmotive_Resume_Upload_Form.pdf specifications.
 */
export default function ResumeUpload({ file, onChange, error, disabled, className }: ResumeUploadProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const remove = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const dropped = event.dataTransfer.files[0]
    if (dropped && !disabled) onChange(dropped)
  }

  return (
    <FieldShell id={id} label="" required={false} error={error} className={className}>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-all',
          error
            ? 'border-cyber-orange bg-cyber-orange/5'
            : isDragging
            ? 'border-cyber-teal bg-cyber-teal/10 shadow-[0_0_20px_rgba(0,229,191,0.15)]'
            : file
            ? 'border-cyber-teal/60 bg-cyber-teal/5'
            : 'border-cyber-teal/30 bg-cyber-field/80 hover:border-cyber-teal/50 hover:bg-cyber-field',
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={RESUME_EXTENSIONS.join(',')}
          disabled={disabled}
          required
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="sr-only"
        />

        {/* Upload Box Content */}
        <div className="space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-cyber-teal/10 border border-cyber-teal/20 text-cyber-teal">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div>
            <h3 className="font-display text-base font-bold tracking-wider text-white uppercase">
              UPLOAD YOUR RESUME <span className="text-cyber-orange">*</span>
            </h3>
            <p className="mt-1 font-body text-xs sm:text-sm text-cyber-muted">
              Attach your latest resume or CV
            </p>
            <p className="mt-1 font-code text-2xs tracking-wider text-cyber-teal">
              PDF, DOC or DOCX • Maximum 5 MB
            </p>
          </div>

          {/* Selected File Display or Selection Controls */}
          <div className="pt-2">
            {file ? (
              <div className="mx-auto max-w-lg rounded-lg border border-cyber-teal/40 bg-cyber-bg/90 p-3 sm:p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded bg-cyber-teal/20 text-cyber-teal flex items-center justify-center shrink-0 font-code text-xs font-bold">
                    {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="truncate font-code text-xs font-bold text-white">
                      {file.name}
                    </p>
                    <p className="font-code text-2xs text-cyber-muted">
                      {formatSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label
                    htmlFor={id}
                    className="cursor-pointer rounded border border-white/10 px-2.5 py-1 font-code text-2xs uppercase tracking-wider text-cyber-teal hover:border-cyber-teal hover:bg-cyber-teal/10 transition-colors"
                  >
                    Replace
                  </label>
                  <button
                    type="button"
                    onClick={remove}
                    disabled={disabled}
                    className="cursor-pointer rounded border border-white/10 px-2.5 py-1 font-code text-2xs uppercase tracking-wider text-cyber-muted hover:border-red-500/40 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <label
                  htmlFor={id}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-cyber-teal px-5 py-2.5 font-code text-xs font-bold uppercase tracking-wider text-cyber-bg hover:bg-cyber-teal/90 transition-colors shadow-md shadow-cyber-teal/10"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Select File</span>
                </label>
                <span className="font-code text-2xs text-cyber-muted">or drag & drop here</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </FieldShell>
  )
}
