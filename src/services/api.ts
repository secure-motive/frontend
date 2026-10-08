/**
 * Central HTTP client for the SecureXmotive backend (Node.js + Express).
 * Handles base URL configuration, credentials (HTTP-only cookies),
 * headers, method routing, and centralized error parsing.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000').replace(/\/+$/, '')

/**
 * Backend API endpoint paths verified against Express routes.
 */
export const API_ENDPOINTS = {
  // Public
  health: '/api/health',
  contact: '/api/contact',
  career: '/api/career',
  videos: '/api/videos',

  // Authentication
  authLogin: '/api/auth/login',
  authLogout: '/api/auth/logout',
  authMe: '/api/auth/me',

  // Admin Protected
  adminContact: '/api/admin/contact',
  adminCareers: '/api/admin/careers',
  adminVideos: '/api/admin/videos',

  // Compatibility aliases
  careerApplications: '/api/career',
} as const

/**
 * Whether forms talk to the backend. Set VITE_ENABLE_API=true in .env to activate.
 */
export const API_ENABLED = import.meta.env.VITE_ENABLE_API === 'true'

/** Outcome of a public form submission. `delivered` is false in preview mode. */
export interface SubmissionResult {
  delivered: boolean
}

const PREVIEW_DELAY_MS = 600

/** Runs `send` when the API is enabled; otherwise waits briefly and reports preview mode. */
export async function submitOrPreview(send: () => Promise<void>): Promise<SubmissionResult> {
  if (!API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, PREVIEW_DELAY_MS))
    return { delivered: false }
  }
  await send()
  return { delivered: true }
}

export class ApiError extends Error {
  readonly status: number
  readonly errors?: unknown

  constructor(message: string, status: number, errors?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  params?: Record<string, string | number | boolean | undefined | null>
  /** Plain objects are serialized to JSON; FormData is transmitted multipart. */
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

let onUnauthorizedCallback: (() => void) | null = null

/** Register a callback invoked when any authenticated request returns 401 Unauthorized */
export function setUnauthorizedHandler(callback: (() => void) | null) {
  onUnauthorizedCallback = callback
}

interface BackendEnvelope {
  success?: boolean
  message?: string
  errors?: Array<{ field?: string; message?: string }> | string
  data?: unknown
}

async function parseErrorResponse(response: Response): Promise<{ message: string; errors?: unknown }> {
  try {
    const data: unknown = await response.json()
    if (typeof data === 'object' && data !== null) {
      const envelope = data as BackendEnvelope
      if (Array.isArray(envelope.errors) && envelope.errors.length > 0) {
        const errorDetails = envelope.errors
          .map((e) => (typeof e === 'object' && e !== null && 'message' in e ? String(e.message) : String(e)))
          .filter(Boolean)
          .join(', ')
        return {
          message: errorDetails || envelope.message || 'Validation error',
          errors: envelope.errors,
        }
      }
      if (typeof envelope.errors === 'string') {
        return { message: envelope.errors }
      }
      if (envelope.message) {
        return { message: String(envelope.message) }
      }
    }
  } catch {
    // Body was not JSON
  }

  if (response.status === 401) {
    return { message: 'Authentication required. Your session may have expired.' }
  }
  if (response.status === 403) {
    return { message: 'Access denied. You do not have permission for this resource.' }
  }
  if (response.status === 404) {
    return { message: 'The requested resource was not found.' }
  }
  if (response.status === 429) {
    return { message: 'Too many requests. Please wait a moment and try again.' }
  }
  if (response.status >= 500) {
    return { message: 'Internal server error. Please try again later.' }
  }

  return { message: response.statusText || `Request failed with status ${response.status}` }
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', params, body, headers = {}, signal }: RequestOptions = {},
): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  let url = `${BASE_URL}${path}`
  if (params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    }
    const queryString = searchParams.toString()
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString
    }
  }

  const requestHeaders: Record<string, string> = { ...headers }
  if (body !== undefined && !isFormData) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const init: RequestInit = {
    method,
    headers: requestHeaders,
    signal,
    // REQUIRED: Ensures browser automatically attaches HTTP-only admin_token cookie
    credentials: 'include',
  }

  if (body !== undefined) {
    init.body = isFormData ? body : JSON.stringify(body)
  }

  let response: Response
  try {
    response = await fetch(url, init)
  } catch (networkError) {
    throw new ApiError(
      'Unable to connect to SecureXmotive server. Please verify your connection or check if the backend is running.',
      0,
      networkError,
    )
  }

  if (!response.ok) {
    const { message, errors } = await parseErrorResponse(response)

    // Trigger session expiry handler if 401 received on a protected route
    if (response.status === 401 && !path.includes('/api/auth/login')) {
      onUnauthorizedCallback?.()
    }

    throw new ApiError(message, response.status, errors)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
