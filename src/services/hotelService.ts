import { apiFetchJson } from '@/services/apiClient'

export type Hotel = {
  id: string
  name: string
  city: string // Makkah / Madinah
  star_rating: number
  address: string
  created_at?: string
  updated_at?: string
}

export type CreateHotelInput = {
  name: string
  city: string
  star_rating: number
  address: string
}

export type UpdateHotelInput = Partial<CreateHotelInput>

export const hotelService = {
  /**
   * List all hotels
   */
  list: async (): Promise<Hotel[]> => {
    return apiFetchJson<Hotel[]>('/api/hotels')
  },

  /**
   * Get hotel by ID
   */
  getById: async (id: string): Promise<Hotel> => {
    return apiFetchJson<Hotel>(`/api/hotels/${id}`)
  },

  /**
   * Create a new hotel
   */
  create: async (data: CreateHotelInput): Promise<Hotel> => {
    return apiFetchJson<Hotel>('/api/hotels', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update an existing hotel
   */
  update: async (id: string, data: UpdateHotelInput): Promise<Hotel> => {
    return apiFetchJson<Hotel>(`/api/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete a hotel
   */
  delete: async (id: string): Promise<void> => {
    await apiFetchJson(`/api/hotels/${id}`, {
      method: 'DELETE',
    })
  },
}

