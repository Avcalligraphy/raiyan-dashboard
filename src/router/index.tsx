import { createBrowserRouter, Outlet } from 'react-router-dom'
import DashboardPage from '../pages/dashboard/DashboardPage'
import StationsPage from '../pages/stations/StationsPage'
import ReportsPage from '../pages/reports/ReportsPage'
import SessionsPage from '../pages/sessions/SessionsPage'
import LoginPage from '../views/Login'
import NotFoundPage from '../views/NotFound'
import Layout from '../components/layout/Layout'
import BlankLayout from '../@layouts/BlankLayout'
import Providers from '../components/Providers'

// Wrapper component to provide context
const LayoutWithProviders = () => (
  <Providers direction='ltr'>
    <Layout />
  </Providers>
)

const BlankLayoutWithProviders = () => (
  <Providers direction='ltr'>
    <BlankLayout systemMode='light'>
      <Outlet />
    </BlankLayout>
  </Providers>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <BlankLayoutWithProviders>
        <LoginPage mode='light' />
      </BlankLayoutWithProviders>
    )
  },
  {
    path: '/',
    element: <LayoutWithProviders />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'stations',
        element: <StationsPage />
      },
      {
        path: 'reports',
        element: <ReportsPage />
      },
      {
        path: 'sessions',
        element: <SessionsPage />
      }
    ]
  },
  {
    path: '*',
    element: (
      <BlankLayoutWithProviders>
        <NotFoundPage mode='light' />
      </BlankLayoutWithProviders>
    )
  }
])

