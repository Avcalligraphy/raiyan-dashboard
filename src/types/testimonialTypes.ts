/**
 * Types aligned with backend API (API_PHASE4_Testimonials_Galleries_CURL.md).
 */

export type TestimonialMediaType = 'text' | 'video' | 'image'

export type Testimonial = {
  id: string
  name: string
  city: string
  media_type: TestimonialMediaType
  content: string
  media_url?: string | null
  rating: number
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export type CreateTestimonialPayload = {
  name: string
  city: string
  media_type: TestimonialMediaType
  content: string
  media_url?: string
  rating: number
  is_published: boolean
}

export type UpdateTestimonialPayload = CreateTestimonialPayload

export type TestimonialListResponse = {
  data: Testimonial[]
  total: number
}

export type TestimonialListParams = {
  limit?: number
  offset?: number
  is_published?: boolean
  type?: TestimonialMediaType
  min_rating?: number
}
