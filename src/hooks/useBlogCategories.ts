import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  blogCategoryService,
  type BlogCategory,
  type CreateBlogCategoryInput,
  type UpdateBlogCategoryInput,
} from '@/services/blogCategoryService'

/**
 * Query key factory for blog categories
 */
export const blogCategoryKeys = {
  all: ['blogCategories'] as const,
  lists: () => [...blogCategoryKeys.all, 'list'] as const,
  list: (filters?: string) => [...blogCategoryKeys.lists(), { filters }] as const,
  details: () => [...blogCategoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogCategoryKeys.details(), id] as const,
}

/**
 * Hook to fetch all blog categories
 */
export const useBlogCategories = () => {
  return useQuery({
    queryKey: blogCategoryKeys.lists(),
    queryFn: () => blogCategoryService.list(),
  })
}

/**
 * Hook to fetch a single blog category by ID
 */
export const useBlogCategory = (id: string | null) => {
  return useQuery({
    queryKey: blogCategoryKeys.detail(id!),
    queryFn: () => blogCategoryService.getById(id!),
    enabled: !!id,
  })
}

/**
 * Hook to create a new blog category
 */
export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBlogCategoryInput) => blogCategoryService.create(data),
    onSuccess: () => {
      // Invalidate and refetch blog categories list
      queryClient.invalidateQueries({ queryKey: blogCategoryKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing blog category
 */
export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogCategoryInput }) =>
      blogCategoryService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch blog categories list
      queryClient.invalidateQueries({ queryKey: blogCategoryKeys.lists() })
      // Invalidate specific blog category detail
      queryClient.invalidateQueries({ queryKey: blogCategoryKeys.detail(variables.id) })
    },
  })
}

/**
 * Hook to delete a blog category
 */
export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blogCategoryService.delete(id),
    onSuccess: () => {
      // Invalidate and refetch blog categories list
      queryClient.invalidateQueries({ queryKey: blogCategoryKeys.lists() })
    },
  })
}

