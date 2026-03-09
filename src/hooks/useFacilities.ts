import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { facilityService, type Facility, type CreateFacilityInput, type UpdateFacilityInput } from '@/services/facilityService'

/**
 * Query key factory for facilities
 */
export const facilityKeys = {
  all: ['facilities'] as const,
  lists: () => [...facilityKeys.all, 'list'] as const,
  list: (filters?: string) => [...facilityKeys.lists(), { filters }] as const,
  details: () => [...facilityKeys.all, 'detail'] as const,
  detail: (id: string) => [...facilityKeys.details(), id] as const,
}

/**
 * Hook to fetch all facilities
 */
export const useFacilities = () => {
  return useQuery({
    queryKey: facilityKeys.lists(),
    queryFn: () => facilityService.list(),
  })
}

/**
 * Hook to fetch a single facility by ID
 */
export const useFacility = (id: string | null) => {
  return useQuery({
    queryKey: facilityKeys.detail(id!),
    queryFn: () => facilityService.getById(id!),
    enabled: !!id,
  })
}

/**
 * Hook to create a new facility
 */
export const useCreateFacility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFacilityInput) => facilityService.create(data),
    onSuccess: () => {
      // Invalidate and refetch facilities list
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing facility
 */
export const useUpdateFacility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFacilityInput }) =>
      facilityService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch facilities list
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() })
      // Invalidate specific facility detail
      queryClient.invalidateQueries({ queryKey: facilityKeys.detail(variables.id) })
    },
  })
}

/**
 * Hook to delete a facility
 */
export const useDeleteFacility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => facilityService.delete(id),
    onSuccess: () => {
      // Invalidate and refetch facilities list
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() })
    },
  })
}

