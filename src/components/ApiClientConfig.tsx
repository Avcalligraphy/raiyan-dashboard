// React Imports
import { useEffect } from 'react'

// React Router Imports
import { useLocation, useNavigate } from 'react-router-dom'

// Hook Imports
import { useAuth } from '@core/hooks/useAuth'

// Service Imports
import { configureApiClient } from '@/services/apiClient'

/**
 * Configures the global API client with current auth token and 401 handler
 * (logout + redirect to /login with from state). Must be rendered inside
 * AuthProvider and RouterProvider.
 */
const ApiClientConfig = () => {
  const { token, refreshToken, setAuth, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    configureApiClient(
      () => token,
      () => refreshToken,
      setAuth,
      () => {
        logout()
        navigate('/login', { state: { from: location }, replace: true })
      }
    )
  }, [token, refreshToken, setAuth, logout, navigate, location])

  return null
}

export default ApiClientConfig
