import { apiFetchJson } from '@/services/apiClient'

export type BlogCategory = {
  id: string
  name: string
  slug: string
  created_at?: string
  updated_at?: string
}

export type CreateBlogCategoryInput = {
  name: string
  slug: string
}

export type UpdateBlogCategoryInput = Partial<CreateBlogCategoryInput>

export const blogCategoryService = {
  /**
   * List all blog categories
   */
  list: async (): Promise<BlogCategory[]> => {
    return apiFetchJson<BlogCategory[]>('/api/blog/categories')
  },

  /**
   * Get blog category by ID
   */
  getById: async (id: string): Promise<BlogCategory> => {
    return apiFetchJson<BlogCategory>(`/api/blog/categories/${id}`)
  },

  /**
   * Create a new blog category
   */
  create: async (data: CreateBlogCategoryInput): Promise<BlogCategory> => {
    return apiFetchJson<BlogCategory>('/api/blog/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update an existing blog category
   */
  update: async (id: string, data: UpdateBlogCategoryInput): Promise<BlogCategory> => {
    return apiFetchJson<BlogCategory>(`/api/blog/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete a blog category
   */
  delete: async (id: string): Promise<void> => {
    await apiFetchJson(`/api/blog/categories/${id}`, {
      method: 'DELETE',
    })
  },
}

