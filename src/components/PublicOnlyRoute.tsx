// React Imports
import type { ReactNode } from 'react'

// React Router Imports
import { Navigate, useLocation } from 'react-router-dom'

// Hook Imports
import { useAuth } from '@core/hooks/useAuth'

type PublicOnlyRouteProps = {
  children: ReactNode
}

/**
 * Renders children only when not authenticated; otherwise redirects to /
 * (or to state.from if present, e.g. after login). Use for /login, etc.
 * Must be used inside AuthProvider.
 */
const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={from ?? '/'} replace />
  }

  return <>{children}</>
}

export default PublicOnlyRoute
