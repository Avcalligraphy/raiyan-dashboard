import { getPermissionsForRoleId } from '@configs/permissions'
import type { AuthUser } from '@core/contexts/AuthContext'
import { getApiUrl } from '@/services/apiClient'

export type LoginCredentials = {
  email: string
  password: string
}

type BackendUser = {
  id: string
  email: string
  full_name?: string
  role_id?: string | null
  is_active?: boolean
  last_login_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

type BackendLoginResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: BackendUser
}

export type LoginResult = {
  token: string
  refreshToken: string
  user: AuthUser
  permissions: string[]
}

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const baseUrl = getApiUrl()
  // Login is unauthenticated; use raw fetch so we don't attach a token or trigger 401 handler
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password
    })
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message =
      (data && typeof data.error === 'string' && data.error) ||
      (res.status === 401 ? 'Invalid email or password' : 'Login failed')
    throw new Error(message)
  }

  const payload = data as BackendLoginResponse
  if (!payload.access_token || !payload.user) {
    throw new Error('Invalid login response')
  }

  const u = payload.user
  const user: AuthUser = {
    id: u.id,
    email: u.email,
    name: u.full_name ?? undefined,
    role: u.role_id ?? undefined
  }

  const permissions = getPermissionsForRoleId(u.role_id ?? undefined)

  return {
    token: payload.access_token,
    refreshToken: payload.refresh_token ?? '',
    user,
    permissions
  }
}

/**
 * Exchange a refresh token for new access and refresh tokens.
 * Uses raw fetch (no Bearer, no 401 handler). Returns null if refresh fails.
 */
export async function refreshAuth(currentRefreshToken: string): Promise<LoginResult | null> {
  const baseUrl = getApiUrl()
  const res = await fetch(`${baseUrl}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: currentRefreshToken })
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    return null
  }

  const payload = data as BackendLoginResponse
  if (!payload.access_token || !payload.user) {
    return null
  }

  const u = payload.user
  const user: AuthUser = {
    id: u.id,
    email: u.email,
    name: u.full_name ?? undefined,
    role: u.role_id ?? undefined
  }

  const permissions = getPermissionsForRoleId(u.role_id ?? undefined)

  return {
    token: payload.access_token,
    refreshToken: payload.refresh_token ?? '',
    user,
    permissions
  }
}
