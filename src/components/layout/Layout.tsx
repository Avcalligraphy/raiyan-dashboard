

// React Imports
import { Outlet } from 'react-router-dom'

// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { Mode } from '@core/types'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import ScrollToTop from '@core/components/scroll-to-top'
import PWAInstallPrompt from '@components/common/PWAInstallPrompt'

// Util Imports
import { getMode } from '@core/utils/clientHelpers'

const Layout = () => {
  // Vars
  const direction = 'ltr'
  const mode = getMode() as Mode

  return (
    <>
      <LayoutWrapper
        systemMode={mode === 'system' ? 'light' : (mode as 'light' | 'dark')}
        verticalLayout={
          <VerticalLayout navigation={<Navigation mode={mode} />} navbar={<Navbar />} footer={<VerticalFooter />}>
            <Outlet />
          </VerticalLayout>
        }
        horizontalLayout={
          <HorizontalLayout header={<Header />} footer={<HorizontalFooter />}>
            <Outlet />
          </HorizontalLayout>
        }
      />
      <ScrollToTop className='mui-fixed'>
        <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
          <i className='ri-arrow-up-line' />
        </Button>
      </ScrollToTop>
      <PWAInstallPrompt />
    </>
  )
}

export default Layout

