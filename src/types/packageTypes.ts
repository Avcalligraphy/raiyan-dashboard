/**
 * Types aligned with backend API (API_PHASE2_Packages_CURL.md).
 */

export type PackageStatus = 'Available' | 'Full' | 'Coming Soon'
export type PackageCategory = 'Reguler' | 'Premium' | 'Berbakti' | 'Ramadhan' | string

export type Package = {
  id: string
  name: string
  category: PackageCategory
  price: number
  duration_days: number
  itinerary: string
  status: PackageStatus
  badge: string
  thumbnail_url?: string | null
  slug: string
  meta_title?: string | null
  meta_description?: string | null
  og_image_url?: string | null
  is_published: boolean
  popular_order?: number | null
  created_by?: string | null
  created_at?: string
  updated_at?: string
}

export type PackageDeparture = {
  id?: string
  package_id?: string
  departure_date: string // YYYY-MM-DD
  quota: number
  remaining_quota: number
  created_at?: string
  updated_at?: string
}

export type PackageGalleryItem = {
  id?: string
  package_id?: string
  media_url: string
  created_at?: string
}

export type PackageWithRelations = {
  package: Package
  departures: PackageDeparture[]
  hotels: Array<{ package_id: string; hotel_id: string; hotel_type: string; hotel: unknown }>
  facilities: Array<{ package_id: string; facility_id: string; facility_type: string; facility: unknown }>
  gallery: PackageGalleryItem[]
}

export type CreatePackagePayload = {
  name: string
  category: string
  price: number
  duration_days: number
  itinerary: string
  status: PackageStatus
  badge: string
  slug: string
  is_published: boolean
  thumbnail_url?: string
  meta_title?: string
  meta_description?: string
  og_image_url?: string
  popular_order?: number
  departures?: Array<{ departure_date: string; quota: number; remaining_quota: number }>
  gallery?: Array<{ media_url: string }>
}

export type UpdatePackagePayload = CreatePackagePayload

export type PackageListResponse = {
  data: Package[]
  total: number
}

export type PackageListParams = {
  limit?: number
  offset?: number
  category?: string
  status?: string
  is_published?: boolean
  min_price?: number
  max_price?: number
  departure_month?: string
  sort_by?: 'cheapest' | 'popular_order' | 'newest'
}

/** Form state for Add/Edit package (single source of truth). */
export type PackageFormState = {
  name: string
  category: string
  price: number
  duration_days: number
  itinerary: string
  status: PackageStatus
  badge: string
  slug: string
  is_published: boolean
  meta_title: string
  meta_description: string
  thumbnail_url: string
  departures: Array<{ departure_date: string; quota: number; remaining_quota: number }>
  gallery: Array<{ media_url: string }>
}

export const initialPackageFormState: PackageFormState = {
  name: '',
  category: 'Reguler',
  price: 0,
  duration_days: 9,
  itinerary: '',
  status: 'Available',
  badge: '',
  slug: '',
  is_published: false,
  meta_title: '',
  meta_description: '',
  thumbnail_url: '',
  departures: [],
  gallery: []
}

/** Map API package with relations to form state for edit. */
export function packageWithRelationsToFormState(data: PackageWithRelations): PackageFormState {
  const p = data.package
  return {
    name: p.name,
    category: p.category,
    price: p.price,
    duration_days: p.duration_days,
    itinerary: p.itinerary ?? '',
    status: p.status,
    badge: p.badge ?? '',
    slug: p.slug,
    is_published: p.is_published,
    meta_title: p.meta_title ?? '',
    meta_description: p.meta_description ?? '',
    thumbnail_url: p.thumbnail_url ?? '',
    departures: (data.departures ?? []).map((d) => ({
      departure_date: d.departure_date,
      quota: d.quota,
      remaining_quota: d.remaining_quota,
    })),
    gallery: (data.gallery ?? []).map((g) => ({ media_url: g.media_url })),
  }
}
