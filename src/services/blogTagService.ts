import { apiFetch, apiFetchJson } from '@/services/apiClient'

export type BlogTag = {
  id: string
  name: string
  slug: string
}

export type CreateBlogTagInput = {
  name: string
  slug: string
}

export type UpdateBlogTagInput = Partial<CreateBlogTagInput>

export const blogTagService = {
  list: async (): Promise<BlogTag[]> => {
    return apiFetchJson<BlogTag[]>('/api/blog/tags')
  },

  getById: async (id: string): Promise<BlogTag> => {
    return apiFetchJson<BlogTag>(`/api/blog/tags/${id}`)
  },

  create: async (data: CreateBlogTagInput): Promise<BlogTag> => {
    return apiFetchJson<BlogTag>('/api/blog/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: UpdateBlogTagInput): Promise<BlogTag> => {
    return apiFetchJson<BlogTag>(`/api/blog/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/api/blog/tags/${id}`, { method: 'DELETE' })
  },
}
