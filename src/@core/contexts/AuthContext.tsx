// React Imports
import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

// Storage keys for auth persistence
const AUTH_TOKEN_KEY = 'raiyan_auth_token'
const AUTH_REFRESH_TOKEN_KEY = 'raiyan_auth_refresh_token'
const AUTH_USER_KEY = 'raiyan_auth_user'
const AUTH_PERMISSIONS_KEY = 'raiyan_auth_permissions'

export type AuthUser = {
  id: string
  email: string
  name?: string
  role?: string
}

export type AuthState = {
  user: AuthUser | null
  permissions: string[]
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type LoginPayload = {
  token: string
  refreshToken?: string
  user: AuthUser
  permissions: string[]
}

export type AuthContextValue = AuthState & {
  login: (payload: LoginPayload) => void
  logout: () => void
  setAuth: (payload: LoginPayload) => void
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_REFRESH_TOKEN_KEY)
}

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function getStoredPermissions(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(AUTH_PERMISSIONS_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function clearStorage(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(AUTH_PERMISSIONS_KEY)
}

function persistAuth(
  token: string,
  user: AuthUser,
  permissions: string[],
  refreshToken?: string | null
): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  localStorage.setItem(AUTH_PERMISSIONS_KEY, JSON.stringify(permissions))
  if (refreshToken != null) {
    localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken)
  } else {
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY)
  }
}

export const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = (props: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!token && !!user

  const setAuth = useCallback((payload: LoginPayload) => {
    const { token: t, user: u, permissions: p, refreshToken: r } = payload
    setToken(t)
    setUser(u)
    setPermissions(p)
    setRefreshToken(r ?? null)
    persistAuth(t, u, p, r ?? null)
  }, [])

  const login = useCallback(
    (payload: LoginPayload) => {
      setAuth(payload)
    },
    [setAuth]
  )

  const logout = useCallback(() => {
    setToken(null)
    setRefreshToken(null)
    setUser(null)
    setPermissions([])
    clearStorage()
  }, [])

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!permission) return true
      return permissions.includes(permission)
    },
    [permissions]
  )

  const hasAnyPermission = useCallback(
    (perms: string[]): boolean => {
      if (!perms.length) return true
      return perms.some(p => permissions.includes(p))
    },
    [permissions]
  )

  // On init: restore session from storage
  useEffect(() => {
    const storedToken = getStoredToken()
    const storedRefreshToken = getStoredRefreshToken()
    const storedUser = getStoredUser()
    const storedPermissions = getStoredPermissions()

    if (storedToken && storedUser) {
      setToken(storedToken)
      setRefreshToken(storedRefreshToken)
      setUser(storedUser)
      setPermissions(storedPermissions)
    }
    setIsLoading(false)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      permissions,
      token,
      refreshToken,
      isAuthenticated,
      isLoading,
      login,
      logout,
      setAuth,
      hasPermission,
      hasAnyPermission
    }),
    [
      user,
      permissions,
      token,
      refreshToken,
      isAuthenticated,
      isLoading,
      login,
      logout,
      setAuth,
      hasPermission,
      hasAnyPermission
    ]
  )

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}
