/**
 * Central API client: adds Bearer token, on 401 tries refresh then retry; if refresh fails calls on401.
 * Configure once via configureApiClient() from a component that has access to auth + navigate.
 */

import type { LoginPayload } from '@core/contexts/AuthContext'
import { refreshAuth } from '@/services/authService'

let getToken: () => string | null = () => null
let getRefreshToken: () => string | null = () => null
let setAuth: (payload: LoginPayload) => void = () => {}
let on401: () => void = () => {}

export function getApiUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (!url || typeof url !== 'string') {
    throw new Error('VITE_API_URL is not set')
  }
  return url.replace(/\/$/, '')
}

/**
 * Call this once from a component inside AuthProvider and RouterProvider
 * (e.g. ApiClientConfig in Providers) so the client can attach token, refresh on 401, and handle logout.
 */
export function configureApiClient(
  tokenGetter: () => string | null,
  refreshTokenGetter: () => string | null,
  setAuthPayload: (payload: LoginPayload) => void,
  onUnauthorized: () => void
): void {
  getToken = tokenGetter
  getRefreshToken = refreshTokenGetter
  setAuth = setAuthPayload
  on401 = onUnauthorized
}

/**
 * Fetch with base URL and Authorization: Bearer <token>.
 * On 401: tries refresh once; on success retries the request. If refresh fails or retry 401, calls on401() then throws.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {},
  triedRefresh = false
): Promise<Response> {
  const baseUrl = getApiUrl()
  const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
  const token = getToken()

  const headers = new Headers(options.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (!headers.has('Content-Type') && (options.body && typeof options.body === 'string')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, { ...options, headers })

  if (res.status === 401) {
    if (!triedRefresh && getRefreshToken()) {
      const refreshed = await refreshAuth(getRefreshToken()!)
      if (refreshed) {
        setAuth({
          token: refreshed.token,
          refreshToken: refreshed.refreshToken,
          user: refreshed.user,
          permissions: refreshed.permissions
        })
        return apiFetch(path, options, true)
      }
    }
    on401()
    throw new Error('Unauthorized')
  }

  return res
}

/**
 * Convenience: apiFetch then response.json().
 */
export async function apiFetchJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options)
  return res.json() as Promise<T>
}
