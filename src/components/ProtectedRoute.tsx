// React Imports
import type { ReactNode } from 'react'

// React Router Imports
import { Navigate, useLocation } from 'react-router-dom'

// Hook Imports
import { useAuth } from '@core/hooks/useAuth'

type ProtectedRouteProps = {
  children: ReactNode
}

/**
 * Renders children only when authenticated; otherwise redirects to /login
 * with state.from for post-login redirect. Must be used inside AuthProvider.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
