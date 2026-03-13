export type Lead = {
  id: string;
  full_name: string;
  whatsapp_number: string;
  package_id?: string | null;
  departure_id?: string | null;
  city: string;
  notes: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  status: string;
  owner_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  package_name?: string;
  owner_name?: string;
};

export type LeadListParams = {
  status?: string;
  owner_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export type LeadListResponse = {
  data: Lead[];
  total: number;
};

export type LeadActivity = {
  id: string;
  lead_id: string;
  user_id: string;
  note: string;
  activity_type: string;
  created_at?: string | null;
  user_name?: string;
};

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Follow Up",
  "Closing",
  "Lost",
] as const;
