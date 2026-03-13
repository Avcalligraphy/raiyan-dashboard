import { apiFetch, apiFetchJson } from '@/services/apiClient'

export type BlogPost = {
  id: string
  title: string
  slug: string
  category_id?: string | null
  content: string
  featured_image?: string | null
  meta_title?: string | null
  meta_description?: string | null
  status: string
  scheduled_at?: string | null
  author_id: string
  created_at?: string | null
  updated_at?: string | null
}

export type BlogPostListParams = {
  limit?: number
  offset?: number
  status?: string
  category_id?: string
  tag_id?: string
  sort_by?: 'newest' | 'oldest'
}

export type BlogPostListResponse = {
  data: BlogPost[]
  total: number
}

export type CreateBlogPostInput = {
  title: string
  slug: string
  category_id?: string | null
  content?: string
  featured_image?: string | null
  meta_title?: string | null
  meta_description?: string | null
  status: string
  scheduled_at?: string | null
  tag_ids?: string[]
}

export type UpdateBlogPostInput = Partial<CreateBlogPostInput>

export const blogPostService = {
  list: async (params: BlogPostListParams = {}): Promise<BlogPostListResponse> => {
    const sp = new URLSearchParams()
    if (params.limit != null) sp.set('limit', String(params.limit))
    if (params.offset != null) sp.set('offset', String(params.offset))
    if (params.status) sp.set('status', params.status)
    if (params.category_id) sp.set('category_id', params.category_id)
    if (params.tag_id) sp.set('tag_id', params.tag_id)
    if (params.sort_by) sp.set('sort_by', params.sort_by)
    const q = sp.toString()
    return apiFetchJson<BlogPostListResponse>(`/api/blog/posts${q ? `?${q}` : ''}`)
  },

  getById: async (id: string): Promise<BlogPost> => {
    return apiFetchJson<BlogPost>(`/api/blog/posts/${id}`)
  },

  getPostTags: async (postId: string) => {
    return apiFetchJson<{ id: string; name: string; slug: string }[]>(
      `/api/blog/posts/${postId}/tags`
    )
  },

  create: async (data: CreateBlogPostInput): Promise<BlogPost> => {
    return apiFetchJson<BlogPost>('/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        slug: data.slug,
        category_id: data.category_id || undefined,
        content: data.content ?? '',
        featured_image: data.featured_image || undefined,
        meta_title: data.meta_title || undefined,
        meta_description: data.meta_description || undefined,
        status: data.status,
        scheduled_at: data.scheduled_at || undefined,
        tag_ids: data.tag_ids ?? [],
      }),
    })
  },

  update: async (id: string, data: UpdateBlogPostInput): Promise<BlogPost> => {
    return apiFetchJson<BlogPost>(`/api/blog/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: data.title,
        slug: data.slug,
        category_id: data.category_id ?? undefined,
        content: data.content,
        featured_image: data.featured_image ?? undefined,
        meta_title: data.meta_title ?? undefined,
        meta_description: data.meta_description ?? undefined,
        status: data.status,
        scheduled_at: data.scheduled_at ?? undefined,
        tag_ids: data.tag_ids,
      }),
    })
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/api/blog/posts/${id}`, { method: 'DELETE' })
  },
}
