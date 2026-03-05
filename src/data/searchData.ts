type SearchData = {
  id: string
  name: string
  url: string
  excludeLang?: boolean
  icon: string
  section: string
  shortcut?: string
}

const data: SearchData[] = [
  {
    id: '1',
    name: 'Overview',
    url: '/',
    icon: 'ri-dashboard-line',
    section: 'Pages'
  },
  {
    id: '2',
    name: 'My Station',
    url: '/stations',
    icon: 'ri-building-line',
    section: 'Pages'
  },
  {
    id: '3',
    name: 'Investment Report',
    url: '/reports',
    icon: 'ri-file-chart-line',
    section: 'Pages'
  },
  {
    id: '4',
    name: 'Charging Sessions',
    url: '/sessions',
    icon: 'ri-flashlight-line',
    section: 'Pages'
  }
]

export default data

