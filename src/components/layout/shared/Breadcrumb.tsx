// React Imports
import { useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'

// MUI Imports
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'

// Data Imports
import horizontalMenuData from '@/data/navigation/horizontalMenuData'
import verticalMenuData from '@/data/navigation/verticalMenuData'

// Type Imports
import type { HorizontalMenuDataType, VerticalMenuDataType } from '@/types/menuTypes'

const Breadcrumb = () => {
  const location = useLocation()
  const pathname = location.pathname

  // Function to find menu item by href
  const findMenuItem = (
    menuData: (HorizontalMenuDataType | VerticalMenuDataType)[],
    path: string
  ): { item: HorizontalMenuDataType | VerticalMenuDataType; parent?: HorizontalMenuDataType | VerticalMenuDataType } | null => {
    for (const menuItem of menuData) {
      // Check if it's a direct match
      if ('href' in menuItem && menuItem.href === path) {
        return { item: menuItem }
      }

      // Check if it has children
      if ('children' in menuItem && menuItem.children) {
        for (const child of menuItem.children) {
          if ('href' in child && child.href === path) {
            return { item: child, parent: menuItem }
          }
        }
      }
    }

    return null
  }

  // Get breadcrumb data based on current path
  const breadcrumbData = useMemo(() => {
    // Try horizontal menu first, then vertical
    const horizontalMatch = findMenuItem(horizontalMenuData(), pathname)
    if (horizontalMatch) {
      return horizontalMatch
    }

    const verticalMatch = findMenuItem(verticalMenuData(), pathname)
    if (verticalMatch) {
      return verticalMatch
    }

    return null
  }, [pathname])

  // If no match found, return null or show default
  if (!breadcrumbData) {
    return null
  }

  const { item, parent } = breadcrumbData

  // If it's a sub-menu item (has parent)
  if (parent) {
    const parentHref = 'href' in parent ? parent.href : undefined
    const parentIcon = 'icon' in parent ? parent.icon : undefined
    const parentHrefString = typeof parentHref === 'string' ? parentHref : '#'

    return (
      <Breadcrumbs aria-label='breadcrumb' separator='/' className='flex items-center'>
        <Link to={parentHrefString} className='flex items-center gap-2 no-underline'>
          {parentIcon && typeof parentIcon === 'string' && (
            <i className={parentIcon} style={{ fontSize: '1.5rem' }} />
          )}
          <Typography variant='body1' className='text-textSecondary hover:text-textPrimary'>
            {parent.label}
          </Typography>
        </Link>
        <Typography variant='body1' className='text-textPrimary font-medium'>
          {item.label}
        </Typography>
      </Breadcrumbs>
    )
  }

  // If it's a top-level menu item
  const itemIcon = 'icon' in item ? item.icon : undefined

  return (
    <Breadcrumbs aria-label='breadcrumb' className='flex items-center'>
      <div className='flex items-center gap-2'>
        {itemIcon && typeof itemIcon === 'string' && (
          <i className={itemIcon} style={{ fontSize: '1.5rem' }} />
        )}
        <Typography variant='body1' className='text-textPrimary font-medium'>
          {item.label}
        </Typography>
      </div>
    </Breadcrumbs>
  )
}

export default Breadcrumb

