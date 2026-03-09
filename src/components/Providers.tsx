

// React Imports
import { useEffect, useState } from 'react'

// Third-party Imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Type Imports
import type { ChildrenType, Direction, SystemMode } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import { AuthProvider } from '@core/contexts/AuthContext'
import ThemeProvider from '@components/theme'

// Component Imports
import ApiClientConfig from '@components/ApiClientConfig'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/clientHelpers'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // State
  const [mode, setMode] = useState<string>('system')
  const [settingsCookie, setSettingsCookie] = useState<Record<string, any>>({})
  const [systemMode, setSystemMode] = useState<SystemMode>('light')

  // Initialize on mount
  useEffect(() => {
    setMode(getMode())
    setSettingsCookie(getSettingsFromCookie())
    setSystemMode(getSystemMode())
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ApiClientConfig />
        <VerticalNavProvider>
          <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
            <ThemeProvider direction={direction} systemMode={systemMode}>
              {children}
            </ThemeProvider>
          </SettingsProvider>
        </VerticalNavProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default Providers
