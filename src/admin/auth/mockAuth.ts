import type { AdminUser } from '../types/admin'

const MOCK_STORAGE_KEY = 'securexmotive_admin_session'

const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'usr-001',
  name: 'Security Admin',
  email: 'admin@securexmotive.com',
  role: 'SUPER_ADMIN',
  lastLoginAt: new Date().toISOString(),
}

const VALID_CREDENTIALS: Record<string, string> = {
  'admin@securexmotive.com': 'Admin@SecureX2026!',
  'security@securexmotive.com': 'Password123!',
}

export interface MockAuthResult {
  success: boolean
  user?: AdminUser
  error?: string
}

/** Simulates backend authentication delay and credential verification */
export async function authenticateMockUser(
  email: string,
  pass: string,
): Promise<MockAuthResult> {
  // Simulate realistic network latency
  await new Promise((resolve) => setTimeout(resolve, 500))

  const cleanEmail = email.trim().toLowerCase()
  const expectedPassword = VALID_CREDENTIALS[cleanEmail]

  if (expectedPassword && expectedPassword === pass) {
    const user: AdminUser = {
      ...DEFAULT_ADMIN_USER,
      email: cleanEmail,
      lastLoginAt: new Date().toISOString(),
    }
    return { success: true, user }
  }

  return {
    success: false,
    error: 'Invalid email or password. Please verify your credentials.',
  }
}

/** Retrieves saved session from storage */
export function getSavedAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

/** Saves session to storage */
export function saveAdminSession(user: AdminUser): void {
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user))
  } catch {
    // Storage quota or privacy restriction
  }
}

/** Removes session from storage */
export function clearAdminSession(): void {
  try {
    localStorage.removeItem(MOCK_STORAGE_KEY)
  } catch {
    // Ignore
  }
}
