import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  blogTagService,
  type BlogTag,
  type CreateBlogTagInput,
  type UpdateBlogTagInput,
} from '@/services/blogTagService'

export const blogTagKeys = {
  all: ['blogTags'] as const,
  lists: () => [...blogTagKeys.all, 'list'] as const,
  list: (filters?: string) => [...blogTagKeys.lists(), { filters }] as const,
  details: () => [...blogTagKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogTagKeys.details(), id] as const,
}

export const useBlogTags = () => {
  return useQuery({
    queryKey: blogTagKeys.lists(),
    queryFn: () => blogTagService.list(),
  })
}

export const useBlogTag = (id: string | null) => {
  return useQuery({
    queryKey: blogTagKeys.detail(id!),
    queryFn: () => blogTagService.getById(id!),
    enabled: !!id,
  })
}

export const useCreateBlogTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBlogTagInput) => blogTagService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogTagKeys.lists() })
    },
  })
}

export const useUpdateBlogTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogTagInput }) =>
      blogTagService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogTagKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogTagKeys.detail(variables.id) })
    },
  })
}

export const useDeleteBlogTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blogTagService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogTagKeys.lists() })
    },
  })
}
