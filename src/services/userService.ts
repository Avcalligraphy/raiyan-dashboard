import { apiFetchJson, apiFetch } from '@/services/apiClient'
import type { User, Role, UpdateUserPayload, RegisterUserPayload } from '@/types/userTypes'

export type { User, Role }

function buildQuery(params?: { limit?: number; offset?: number }): string {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.limit != null) search.set('limit', String(params.limit))
  if (params.offset != null) search.set('offset', String(params.offset))
  const q = search.toString()
  return q ? `?${q}` : ''
}

export const userService = {
  list: async (params?: { limit?: number; offset?: number }): Promise<User[]> => {
    return apiFetchJson<User[]>(`/api/users${buildQuery(params)}`)
  },

  getById: async (id: string): Promise<User> => {
    return apiFetchJson<User>(`/api/users/${id}`)
  },

  update: async (id: string, data: UpdateUserPayload): Promise<User> => {
    return apiFetchJson<User>(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/api/users/${id}`, { method: 'DELETE' })
  },

  assignRole: async (userId: string, roleId: string): Promise<void> => {
    await apiFetch(`/api/users/${userId}/assign-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id: roleId }),
    })
  },

  /** Create user (calls public register endpoint with role_id). */
  register: async (data: RegisterUserPayload): Promise<User> => {
    return apiFetchJson<User>('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: data.full_name.trim(),
        email: data.email.trim(),
        password: data.password,
        role_id: data.role_id || undefined,
      }),
    })
  },
}

export const roleService = {
  list: async (): Promise<Role[]> => {
    return apiFetchJson<Role[]>('/api/roles')
  },
}
