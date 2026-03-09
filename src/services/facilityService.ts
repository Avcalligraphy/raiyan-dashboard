import { apiFetchJson } from '@/services/apiClient'

export type Facility = {
  id: string
  name: string
  description: string
  created_at?: string
  updated_at?: string
}

export type CreateFacilityInput = {
  name: string
  description: string
}

export type UpdateFacilityInput = Partial<CreateFacilityInput>

export const facilityService = {
  /**
   * List all facilities
   */
  list: async (): Promise<Facility[]> => {
    return apiFetchJson<Facility[]>('/api/facilities')
  },

  /**
   * Get facility by ID
   */
  getById: async (id: string): Promise<Facility> => {
    return apiFetchJson<Facility>(`/api/facilities/${id}`)
  },

  /**
   * Create a new facility
   */
  create: async (data: CreateFacilityInput): Promise<Facility> => {
    return apiFetchJson<Facility>('/api/facilities', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update an existing facility
   */
  update: async (id: string, data: UpdateFacilityInput): Promise<Facility> => {
    return apiFetchJson<Facility>(`/api/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete a facility
   */
  delete: async (id: string): Promise<void> => {
    await apiFetchJson(`/api/facilities/${id}`, {
      method: 'DELETE',
    })
  },
}

