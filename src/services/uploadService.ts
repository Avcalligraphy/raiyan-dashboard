import { apiFetch } from '@/services/apiClient'

const UPLOAD_PREFIX = 'packages'

export type UploadResponse = { url: string }

/**
 * Upload a file to backend (POST /api/upload). Uses multipart/form-data.
 * Returns the URL to store (e.g. thumbnail_url, media_url).
 */
export async function uploadFile(
  file: File,
  prefix: string = UPLOAD_PREFIX
): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  if (prefix) formData.append('prefix', prefix)

  const res = await apiFetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    const message = (errBody as { error?: string }).error || res.statusText || 'Upload failed'
    throw new Error(message)
  }

  return res.json() as Promise<UploadResponse>
}
