// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
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
      { label: 'List', icon: 'ri-list-check', href: '/package/list' },
      { label: 'Departure', icon: 'ri-calendar-event-line', href: '/package/departure' },
      { label: 'Hotels', icon: 'ri-hotel-line', href: '/package/hotels' },
      { label: 'Facility', icon: 'ri-building-2-line', href: '/package/facility' },
      { label: 'Gallery', icon: 'ri-gallery-line', href: '/package/gallery' }
    ]
  },
  {
    label: 'Blog',
    icon: 'ri-article-line',
    permission: 'blog.read',
    children: [
      { label: 'Categories', icon: 'ri-folder-line', href: '/blog/categories' },
      { label: 'Post', icon: 'ri-file-edit-line', href: '/blog/post' },
      { label: 'Tags', icon: 'ri-price-tag-3-line', href: '/blog/tags' }
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

export default horizontalMenuData
