import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hotelService, type Hotel, type CreateHotelInput, type UpdateHotelInput } from '@/services/hotelService'

/**
 * Query key factory for hotels
 */
export const hotelKeys = {
  all: ['hotels'] as const,
  lists: () => [...hotelKeys.all, 'list'] as const,
  list: (filters?: string) => [...hotelKeys.lists(), { filters }] as const,
  details: () => [...hotelKeys.all, 'detail'] as const,
  detail: (id: string) => [...hotelKeys.details(), id] as const,
}

/**
 * Hook to fetch all hotels
 */
export const useHotels = () => {
  return useQuery({
    queryKey: hotelKeys.lists(),
    queryFn: () => hotelService.list(),
  })
}

/**
 * Hook to fetch a single hotel by ID
 */
export const useHotel = (id: string | null) => {
  return useQuery({
    queryKey: hotelKeys.detail(id!),
    queryFn: () => hotelService.getById(id!),
    enabled: !!id,
  })
}

/**
 * Hook to create a new hotel
 */
export const useCreateHotel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateHotelInput) => hotelService.create(data),
    onSuccess: () => {
      // Invalidate and refetch hotels list
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing hotel
 */
export const useUpdateHotel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHotelInput }) =>
      hotelService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch hotels list
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() })
      // Invalidate specific hotel detail
      queryClient.invalidateQueries({ queryKey: hotelKeys.detail(variables.id) })
    },
  })
}

/**
 * Hook to delete a hotel
 */
export const useDeleteHotel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => hotelService.delete(id),
    onSuccess: () => {
      // Invalidate and refetch hotels list
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() })
    },
  })
}

