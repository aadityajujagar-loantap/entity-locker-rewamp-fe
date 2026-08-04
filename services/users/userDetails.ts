import { getPortalApiBaseUrl } from "@/lib/auth";

export interface UserRolePivot {
  model_type?: string;
  model_id?: number;
  role_id?: number;
}

export interface UserRole {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  pivot?: UserRolePivot;
}

export interface CurrentUserProfile {
  id: number;
  employee_id: string | null;
  pf_number: string | null;
  name: string | null;
  email: string | null;
  mobile: string | null;
  branch_code: string | null;
  branch_name: string | null;
  status: string | null;
  last_login_at: string | null;
  password_changed_at: string | null;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  roles: UserRole[];
}

export interface CurrentUserApiResponse {
  status: string;
  statusCode: number;
  responseData: CurrentUserProfile;
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordApiResponse {
  status: string;
  statusCode: number;
  responseData: unknown;
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export class ChangePasswordApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ChangePasswordApiError";
  }
}

export async function fetchCurrentUserProfile(accessToken: string): Promise<CurrentUserProfile> {
  const baseUrl = getPortalApiBaseUrl();
  const response = await fetch(`${baseUrl}/auth/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to fetch user details.`;
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
      errorMsg = payload.message;
    }
    throw new Error(errorMsg);
  }

  const apiRes = payload as CurrentUserApiResponse;
  if (!apiRes || !apiRes.responseData) {
    throw new Error("Invalid response format received from user profile endpoint.");
  }

  return apiRes.responseData;
}

export async function changePassword(
  payload: ChangePasswordPayload,
  accessToken: string
): Promise<string> {
  const baseUrl = getPortalApiBaseUrl();
  const response = await fetch(`${baseUrl}/auth/change-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const resJson: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to change password.`;
    let fieldErrors: Record<string, string[]> | undefined = undefined;

    if (resJson && typeof resJson === "object") {
      const obj = resJson as Record<string, unknown>;
      if (typeof obj.message === "string" && obj.message.trim()) {
        errorMsg = obj.message;
      }
      if (obj.errors && typeof obj.errors === "object") {
        fieldErrors = obj.errors as Record<string, string[]>;
        const firstErr = Object.values(fieldErrors).flat()[0];
        if (firstErr) {
          errorMsg = firstErr;
        }
      }
    }
    throw new ChangePasswordApiError(errorMsg, response.status, fieldErrors);
  }

  const apiRes = resJson as ChangePasswordApiResponse;
  return apiRes?.message || "Password changed successfully.";
}
