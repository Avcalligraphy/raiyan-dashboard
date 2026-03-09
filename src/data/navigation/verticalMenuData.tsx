// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Overview',
    href: '/',
    icon: 'ri-dashboard-line'
    // no permission: visible to all authenticated users
  },
  {
    label: 'Package',
    icon: 'ri-box-3-line',
    permission: 'packages.read',
    children: [
      { label: 'List', href: '/package/list', exactMatch: false, activeUrl: '/package' },
      { label: 'Hotels', href: '/package/hotels' },
      { label: 'Facility', href: '/package/facility' },
    ]
  },
  {
    label: 'Blog',
    icon: 'ri-article-line',
    permission: 'blog.read',
    children: [
      { label: 'Categories', href: '/blog/categories' },
      { label: 'Post', href: '/blog/post' },
      { label: 'Tags', href: '/blog/tags' }
    ]
  },
  {
    label: 'Testimonials',
    href: '/testimonials',
    icon: 'ri-star-line',
    permission: 'testimonials.read'
  },
  {
    label: 'Site Galleries',
    href: '/site-galleries',
    icon: 'ri-image-line',
    permission: 'galleries.read'
  },
  {
    label: 'Legal Document',
    href: '/legal-document',
    icon: 'ri-file-text-line',
    permission: 'legal.read'
  },
  {
    label: 'Lead CRM',
    href: '/lead-crm',
    icon: 'ri-customer-service-line',
    permission: 'leads.read'
  },
  {
    label: 'User Management',
    href: '/user-management',
    icon: 'ri-user-settings-line',
    permission: 'users.read'
  }
]

export default verticalMenuData
