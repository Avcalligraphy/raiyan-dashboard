// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
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

export default verticalMenuData
