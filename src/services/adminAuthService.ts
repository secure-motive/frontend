import { API_ENDPOINTS, apiRequest } from './api'
import type { AdminUser } from '@/admin/types/admin'

interface AuthMeResponse {
  success: boolean
  message: string
  data: {
    id: string
    email: string
    createdAt: string
  }
}

interface LoginResponse {
  success: boolean
  message: string
  data: {
    id: string
    email: string
  }
}

interface LogoutResponse {
  success: boolean
  message: string
}

function mapToAdminUser(data: { id: string; email: string; createdAt?: string }): AdminUser {
  const username = data.email.split('@')[0] || 'Admin'
  const displayName = username.charAt(0).toUpperCase() + username.slice(1)
  return {
    id: data.id,
    email: data.email,
    name: displayName === 'Admin' ? 'Security Admin' : `${displayName} (Admin)`,
    role: 'SUPER_ADMIN',
    lastLoginAt: data.createdAt || new Date().toISOString(),
  }
}

export const adminAuthService = {
  /**
   * Authenticate admin via email and password.
   * On success, backend sets an HTTP-only secure cookie ('admin_token').
   */
  async login(email: string, password: string): Promise<AdminUser> {
    const res = await apiRequest<LoginResponse>(API_ENDPOINTS.authLogin, {
      method: 'POST',
      body: {
        email: email.trim().toLowerCase(),
        password,
      },
    })
    return mapToAdminUser(res.data)
  },

  /**
   * Verify session of currently logged-in administrator.
   */
  async getMe(signal?: AbortSignal): Promise<AdminUser> {
    const res = await apiRequest<AuthMeResponse>(API_ENDPOINTS.authMe, {
      method: 'GET',
      signal,
    })
    return mapToAdminUser(res.data)
  },

  /**
   * Logout administrator and clear HTTP-only session cookie on the backend.
   */
  async logout(): Promise<void> {
    await apiRequest<LogoutResponse>(API_ENDPOINTS.authLogout, {
      method: 'POST',
    })
  },
}
