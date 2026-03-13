import { apiFetch, apiFetchJson } from "@/services/apiClient";
import type {
  Lead,
  LeadListParams,
  LeadListResponse,
  LeadActivity,
} from "@/types/leadTypes";

function buildQuery(params?: LeadListParams): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.owner_id) sp.set("owner_id", params.owner_id);
  if (params.search) sp.set("search", params.search);
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.offset != null) sp.set("offset", String(params.offset));
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export const leadService = {
  list: async (params?: LeadListParams): Promise<LeadListResponse> => {
    return apiFetchJson<LeadListResponse>(`/api/leads${buildQuery(params)}`);
  },

  getById: async (id: string): Promise<Lead> => {
    return apiFetchJson<Lead>(`/api/leads/${id}`);
  },

  update: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    return apiFetchJson<Lead>(`/api/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id: string, status: string): Promise<{ status: string }> => {
    return apiFetchJson<{ status: string }>(`/api/leads/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  assignOwner: async (id: string, owner_id: string): Promise<{ owner_id: string }> => {
    return apiFetchJson<{ owner_id: string }>(`/api/leads/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ owner_id }),
    });
  },

  addNote: async (id: string, note: string): Promise<void> => {
    await apiFetchJson(`/api/leads/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
    });
  },

  getActivities: async (id: string): Promise<LeadActivity[]> => {
    return apiFetchJson<LeadActivity[]>(`/api/leads/${id}/activities`);
  },

  exportCsv: async (params?: LeadListParams): Promise<Blob> => {
    const res = await apiFetch(`/api/leads/export${buildQuery(params)}`);
    if (!res.ok) throw new Error("Export failed");
    return res.blob();
  },
};
