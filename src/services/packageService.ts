import { apiFetchJson } from '@/services/apiClient'
import type {
  Package,
  PackageWithRelations,
  PackageListResponse,
  PackageListParams,
  CreatePackagePayload,
  UpdatePackagePayload
} from '@/types/packageTypes'

function buildQuery(params?: PackageListParams): string {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.limit != null) search.set('limit', String(params.limit))
  if (params.offset != null) search.set('offset', String(params.offset))
  if (params.category) search.set('category', params.category)
  if (params.status) search.set('status', params.status)
  if (params.is_published !== undefined) search.set('is_published', String(params.is_published))
  if (params.min_price != null) search.set('min_price', String(params.min_price))
  if (params.max_price != null) search.set('max_price', String(params.max_price))
  if (params.departure_month) search.set('departure_month', params.departure_month)
  if (params.sort_by) search.set('sort_by', params.sort_by)
  const q = search.toString()
  return q ? `?${q}` : ''
}

export const packageService = {
  /**
   * List packages (CMS: use with Bearer token; optional filters).
   */
  list: async (params?: PackageListParams): Promise<PackageListResponse> => {
    return apiFetchJson<PackageListResponse>(`/api/packages${buildQuery(params)}`)
  },

  /**
   * Get package by ID (CMS, packages.read).
   */
  getById: async (id: string): Promise<Package> => {
    return apiFetchJson<Package>(`/api/packages/${id}`)
  },

  /**
   * Get package with relations for edit (departures, hotels, facilities, gallery).
   */
  getWithRelations: async (id: string): Promise<PackageWithRelations> => {
    return apiFetchJson<PackageWithRelations>(`/api/packages/${id}/relations`)
  },

  /**
   * Create package (CMS, packages.write).
   */
  create: async (data: CreatePackagePayload): Promise<Package> => {
    return apiFetchJson<Package>('/api/packages', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /**
   * Update package (CMS, packages.write).
   */
  update: async (id: string, data: UpdatePackagePayload): Promise<Package> => {
    return apiFetchJson<Package>(`/api/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  /**
   * Delete package (soft delete) (CMS, packages.write).
   */
  delete: async (id: string): Promise<void> => {
    await apiFetchJson(`/api/packages/${id}`, {
      method: 'DELETE'
    })
  }
}
