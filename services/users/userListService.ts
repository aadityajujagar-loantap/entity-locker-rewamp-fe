import { getPortalApiBaseUrl } from "@/lib/auth";

export interface UserItem {
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
  roles: string[];
  created_at: string | null;
  updated_at: string | null;
}

export interface UserListApiResponse {
  status: string;
  statusCode: number;
  responseData: UserItem[];
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export async function fetchUserList(accessToken: string): Promise<UserItem[]> {
  const baseUrl = getPortalApiBaseUrl();
  const response = await fetch(`${baseUrl}/users`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to fetch user list.`;
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
      errorMsg = payload.message;
    }
    throw new Error(errorMsg);
  }

  const apiRes = payload as UserListApiResponse;
  if (!apiRes || !Array.isArray(apiRes.responseData)) {
    throw new Error("Invalid response format received from users endpoint.");
  }

  return apiRes.responseData;
}
