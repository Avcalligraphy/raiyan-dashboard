/**
 * Types aligned with backend API (API_PHASE1_Auth_Users_CURL.md).
 */

export type User = {
  id: string;
  full_name: string;
  email: string;
  role_id?: string | null;
  is_active: boolean;
  last_login_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Role = {
  id: string;
  name: string;
  description?: string;
};

export type UpdateUserPayload = {
  full_name: string;
  email: string;
  role_id: string | null;
  is_active: boolean;
};

export type RegisterUserPayload = {
  full_name: string;
  email: string;
  password: string;
  role_id?: string | null;
};
