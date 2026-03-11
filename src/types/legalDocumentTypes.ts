/**
 * Types aligned with backend API (API_PHASE5_Legal_Documents_CURL.md).
 */

export type LegalDocumentType = 'PPIU' | 'Kemenag'

export type LegalDocument = {
  id: string
  document_name: string
  document_number: string
  document_type: LegalDocumentType
  file_url?: string | null
  issued_date?: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export type CreateLegalDocumentPayload = {
  document_name: string
  document_number: string
  document_type: LegalDocumentType
  file_url?: string
  issued_date?: string
  is_active: boolean
}

export type UpdateLegalDocumentPayload = CreateLegalDocumentPayload

export type LegalDocumentListResponse = {
  data: LegalDocument[]
  total: number
}

export type LegalDocumentListParams = {
  limit?: number
  offset?: number
  document_type?: LegalDocumentType
  is_active?: boolean
}
