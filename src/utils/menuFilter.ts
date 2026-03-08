/**
 * Filters menu items by permission. Items without a `permission` field are shown to all
 * authenticated users. Items with `permission` are shown only when hasPermission(permission) is true.
 * Submenus are filtered recursively; a parent is hidden if it has no visible children.
 */
export function filterMenuByPermission<T extends { permission?: string; children?: T[] }>(
  items: T[],
  hasPermission: (permission: string) => boolean
): T[] {
  return items.reduce<T[]>((acc, item) => {
    if (item.permission != null && !hasPermission(item.permission)) return acc
    if (item.children && item.children.length > 0) {
      const filteredChildren = filterMenuByPermission(item.children, hasPermission)
      if (filteredChildren.length === 0) return acc
      acc.push({ ...item, children: filteredChildren } as T)
    } else {
      acc.push(item)
    }
    return acc
  }, [])
}
