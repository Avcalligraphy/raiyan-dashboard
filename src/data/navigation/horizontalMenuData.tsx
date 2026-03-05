// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Overview',
    href: '/',
    icon: 'ri-dashboard-line'
  },
  {
    label: 'My Station',
    href: '/stations',
    icon: 'ri-building-line'
  },
  {
    label: 'Investment Report',
    href: '/reports',
    icon: 'ri-file-chart-line'
  },
  {
    label: 'Charging Sessions',
    href: '/sessions',
    icon: 'ri-flashlight-line'
  }
]

export default horizontalMenuData
