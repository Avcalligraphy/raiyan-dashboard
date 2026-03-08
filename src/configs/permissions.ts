/**
 * Single source of truth for permission constants, aligned with backend-raiyan
 * (seed + RequirePermission middleware). Use for RBAC: menu filtering, route
 * guards, and feature visibility. Import Permission type or ALL_PERMISSIONS for
 * typed permission strings.
 */
export const SUPER_ADMIN_ROLE_ID = 'a0000001-0000-0000-0000-000000000001'

export const ALL_PERMISSIONS = [
  'users.read',
  'users.write',
  'packages.read',
  'packages.write',
  'leads.read',
  'leads.write',
  'blog.read',
  'blog.write',
  'legal.read',
  'legal.write',
  'audit.read',
  'testimonials.read',
  'testimonials.write',
  'galleries.read',
  'galleries.write'
] as const

export type Permission = (typeof ALL_PERMISSIONS)[number]

/**
 * Returns permissions for a given role_id.
 * Only super_admin has all permissions in the seed; other roles get permissions
 * from backend role_permissions (could be extended with a "my permissions" API later).
 */
export function getPermissionsForRoleId(roleId: string | null | undefined): string[] {
  if (!roleId) return []
  if (roleId === SUPER_ADMIN_ROLE_ID) return [...ALL_PERMISSIONS]
  // Other roles (marketing, sales, viewer): backend may assign permissions via role_permissions.
  // For now we don't have a "my permissions" endpoint, so non–super_admin gets none.
  // You can add a roleId -> permissions map here if backend doesn't expose permissions in login/me.
  return []
}
