import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  blogPostService,
  type BlogPostListParams,
  type CreateBlogPostInput,
  type UpdateBlogPostInput,
} from '@/services/blogPostService'

export const blogPostKeys = {
  all: ['blogPosts'] as const,
  lists: () => [...blogPostKeys.all, 'list'] as const,
  list: (params: BlogPostListParams) => [...blogPostKeys.lists(), params] as const,
  details: () => [...blogPostKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogPostKeys.details(), id] as const,
  postTags: (postId: string) => [...blogPostKeys.detail(postId), 'tags'] as const,
}

export const useBlogPostList = (params: BlogPostListParams = {}) => {
  return useQuery({
    queryKey: blogPostKeys.list(params),
    queryFn: () => blogPostService.list(params),
  })
}

export const useBlogPost = (id: string | null) => {
  return useQuery({
    queryKey: blogPostKeys.detail(id!),
    queryFn: () => blogPostService.getById(id!),
    enabled: !!id,
  })
}

export const useBlogPostTags = (postId: string | null) => {
  return useQuery({
    queryKey: blogPostKeys.postTags(postId!),
    queryFn: () => blogPostService.getPostTags(postId!),
    enabled: !!postId,
  })
}

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBlogPostInput) => blogPostService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogPostKeys.lists() })
    },
  })
}

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogPostInput }) =>
      blogPostService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogPostKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogPostKeys.detail(variables.id) })
    },
  })
}

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blogPostService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogPostKeys.lists() })
    },
  })
}
