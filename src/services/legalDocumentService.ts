import { apiFetch, apiFetchJson } from '@/services/apiClient'
import type {
  LegalDocument,
  LegalDocumentListResponse,
  LegalDocumentListParams,
  CreateLegalDocumentPayload,
  UpdateLegalDocumentPayload
} from '@/types/legalDocumentTypes'

function buildQuery(params?: LegalDocumentListParams): string {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.limit != null) search.set('limit', String(params.limit))
  if (params.offset != null) search.set('offset', String(params.offset))
  if (params.document_type) search.set('document_type', params.document_type)
  if (params.is_active !== undefined) search.set('is_active', String(params.is_active))
  const q = search.toString()
  return q ? `?${q}` : ''
}

export const legalDocumentService = {
  list: async (params?: LegalDocumentListParams): Promise<LegalDocumentListResponse> => {
    return apiFetchJson<LegalDocumentListResponse>(`/api/legal-documents${buildQuery(params)}`)
  },

  getById: async (id: string): Promise<LegalDocument> => {
    return apiFetchJson<LegalDocument>(`/api/legal-documents/${id}`)
  },

  create: async (data: CreateLegalDocumentPayload): Promise<LegalDocument> => {
    return apiFetchJson<LegalDocument>('/api/legal-documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: UpdateLegalDocumentPayload): Promise<LegalDocument> => {
    return apiFetchJson<LegalDocument>(`/api/legal-documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/api/legal-documents/${id}`, { method: 'DELETE' })
  },

  /**
   * Upload PDF or JPG (max 10 MB). Returns file_url to use in create/update.
   * document_id = subfolder (e.g. ppiu, kemenag). Optional.
   */
  upload: async (file: File, document_id?: string): Promise<{ file_url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    if (document_id) formData.append('document_id', document_id)

    const res = await apiFetch('/api/legal-documents/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      const message = (errBody as { error?: string }).error || res.statusText || 'Upload failed'
      throw new Error(message)
    }

    return res.json() as Promise<{ file_url: string }>
  },
}
