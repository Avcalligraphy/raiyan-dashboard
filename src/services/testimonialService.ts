import { apiFetchJson } from '@/services/apiClient'
import type {
  Testimonial,
  TestimonialListResponse,
  TestimonialListParams,
  CreateTestimonialPayload,
  UpdateTestimonialPayload
} from '@/types/testimonialTypes'

function buildQuery(params?: TestimonialListParams): string {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.limit != null) search.set('limit', String(params.limit))
  if (params.offset != null) search.set('offset', String(params.offset))
  if (params.is_published !== undefined) search.set('is_published', String(params.is_published))
  if (params.type) search.set('type', params.type)
  if (params.min_rating != null) search.set('min_rating', String(params.min_rating))
  const q = search.toString()
  return q ? `?${q}` : ''
}

export const testimonialService = {
  list: async (params?: TestimonialListParams): Promise<TestimonialListResponse> => {
    return apiFetchJson<TestimonialListResponse>(`/api/testimonials${buildQuery(params)}`)
  },

  getById: async (id: string): Promise<Testimonial> => {
    return apiFetchJson<Testimonial>(`/api/testimonials/${id}`)
  },

  create: async (data: CreateTestimonialPayload): Promise<Testimonial> => {
    return apiFetchJson<Testimonial>('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: UpdateTestimonialPayload): Promise<Testimonial> => {
    return apiFetchJson<Testimonial>(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<void> => {
    await apiFetchJson(`/api/testimonials/${id}`, {
      method: 'DELETE',
    })
  },

  publish: async (id: string, is_published: boolean): Promise<void> => {
    await apiFetchJson(`/api/testimonials/${id}/publish`, {
      method: 'PUT',
      body: JSON.stringify({ is_published }),
    })
  },
}
