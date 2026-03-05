

// React Imports
import { forwardRef } from 'react'

// React Router Imports
import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'

// Type Imports
import type { ChildrenType } from '../types'

type RouterLinkProps = Omit<LinkProps, 'to'> &
  Partial<ChildrenType> & {
    href?: string
    className?: string
  }

export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => {
  // Props
  const { href, className, ...other } = props

  return (
    <Link ref={ref} to={href || '/'} className={className} {...other}>
      {props.children}
    </Link>
  )
})
