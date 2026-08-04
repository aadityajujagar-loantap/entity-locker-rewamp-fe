import { getPortalApiBaseUrl } from "@/lib/auth";

export interface EntityUser {
  id?: number;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export interface ConsentDetails {
  state?: string | null;
  authorization_url?: string | null;
  status?: "pending" | "authorized" | "failed" | "expired" | string | null;
  consent_created_at?: string | null;
  consent_provided_at?: string | null;
  consent_valid_till?: string | null;
  is_consent_expired?: boolean;
}

export interface EntityItem {
  id: number;
  entity_id: string;
  entity_name: string;
  entity_type: string;
  status: string;
  consent_details?: ConsentDetails | null;
  consent_status?: "pending" | "authorized" | "failed" | "expired" | string | null;
  consent_url?: string | null;
  entitylockerid: string | null;
  doi: string | null;
  entity_email: string | null;
  entity_mobile: string | null;
  verified_by: string | null;
  entity_user: EntityUser | null;
  entity_users: EntityUser[];
  created_at: string;
  updated_at: string;
}

export interface EntityListApiResponse {
  status: string;
  statusCode: number;
  responseData: EntityItem[];
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export interface EntityDetailsApiResponse {
  status: string;
  statusCode: number;
  responseData: EntityItem;
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export async function fetchEntityList(accessToken: string): Promise<EntityItem[]> {
  const baseUrl = getPortalApiBaseUrl();
  const response = await fetch(`${baseUrl}/entities`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to fetch entities list.`;
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
      errorMsg = payload.message;
    }
    throw new Error(errorMsg);
  }

  const apiRes = payload as EntityListApiResponse;
  if (!apiRes || !Array.isArray(apiRes.responseData)) {
    throw new Error("Invalid response format received from entities endpoint.");
  }

  return apiRes.responseData;
}

export async function fetchEntityDetails(
  entityId: string,
  accessToken: string
): Promise<EntityItem> {
  const baseUrl = getPortalApiBaseUrl();
  const response = await fetch(
    `${baseUrl}/show-entity-details?entity_id=${encodeURIComponent(entityId)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to fetch entity details.`;
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
      errorMsg = payload.message;
    }
    throw new Error(errorMsg);
  }

  const apiRes = payload as EntityDetailsApiResponse;
  if (!apiRes || !apiRes.responseData) {
    throw new Error("Invalid response format received from entity details endpoint.");
  }

  return apiRes.responseData;
}
