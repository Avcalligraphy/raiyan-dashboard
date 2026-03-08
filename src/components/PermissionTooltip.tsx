// React Imports
import type { ReactElement } from 'react'
import { cloneElement } from 'react'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'

// Hook Imports
import { useAuth } from '@core/hooks/useAuth'

// Type Imports
import type { Permission } from '@/configs/permissions'

export const DEFAULT_NO_PERMISSION_MESSAGE =
  'You don\'t have permission to perform this action.'

type PermissionTooltipProps = {
  /** Permission required to enable the action (e.g. users.write, blog.write). */
  permission: Permission
  /** The button or control to wrap. When permission is missing it is disabled and the tooltip is shown on hover. */
  children: ReactElement
  /** Optional custom tooltip when the user lacks permission. Default explains they don't have permission. */
  tooltip?: string
}

/**
 * Wraps a single element (e.g. Button). If the user has the given permission, the child is rendered as-is.
 * If not, the child is cloned with disabled=true and wrapped in a Tooltip so hovering shows why the action is unavailable.
 */
export function PermissionTooltip({ permission, children, tooltip }: PermissionTooltipProps) {
  const { hasPermission } = useAuth()
  const allowed = hasPermission(permission)
  const message =
    tooltip ??
    `${DEFAULT_NO_PERMISSION_MESSAGE} This action requires the ${permission} permission.`

  if (allowed) return children

  return (
    <Tooltip title={message} placement="top">
      <span className="inline-flex">
        {cloneElement(children, { disabled: true } as Record<string, unknown>)}
      </span>
    </Tooltip>
  )
}
