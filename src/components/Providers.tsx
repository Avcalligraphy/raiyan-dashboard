

// React Imports
import { useEffect, useState } from 'react'

// Type Imports
import type { ChildrenType, Direction, SystemMode } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/clientHelpers'

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
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ThemeProvider direction={direction} systemMode={systemMode}>
          {children}
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default Providers
