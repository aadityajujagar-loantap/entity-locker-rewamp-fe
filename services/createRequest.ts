import { getPortalApiBaseUrl } from "@/lib/auth";

export interface GenerateAuthUrlParams {
  entity_id: string;
  dl_flow?: string;
  acr?: string;
  purpose?: string;
  consent_valid_till?: number;
}

export interface AuthUrlData {
  authorization_url: string;
  state?: string | null;
  code_challenge?: string | null;
  consent_created_at?: string | null;
  consent_valid_till?: string | null;
  [key: string]: unknown;
}

export interface GenerateAuthUrlApiResponse {
  status: string;
  statusCode: number;
  responseData: AuthUrlData;
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export class GenerateAuthUrlApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "GenerateAuthUrlApiError";
  }
}

export async function generateAuthorizationUrl(
  params: GenerateAuthUrlParams,
  accessToken: string
): Promise<AuthUrlData> {
  const baseUrl = getPortalApiBaseUrl();
  const queryParts: string[] = [];

  if (params.entity_id) {
    queryParts.push(`entity_id=${encodeURIComponent(params.entity_id)}`);
  }
  if (params.dl_flow) {
    queryParts.push(`dl_flow=${encodeURIComponent(params.dl_flow)}`);
  }
  if (params.acr) {
    queryParts.push(`acr=${encodeURIComponent(params.acr)}`);
  }
  if (params.purpose) {
    queryParts.push(`purpose=${encodeURIComponent(params.purpose)}`);
  }
  if (params.consent_valid_till) {
    queryParts.push(`consent_valid_till=${encodeURIComponent(String(params.consent_valid_till))}`);
  }

  const url = `${baseUrl}/providers/entity-locker/authorization-url?${queryParts.join("&")}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to generate authorization URL.`;
    let fieldErrors: Record<string, string[]> | undefined = undefined;

    if (payload && typeof payload === "object") {
      const obj = payload as Record<string, unknown>;
      if (typeof obj.message === "string" && obj.message.trim()) {
        errorMsg = obj.message;
      }
      if (obj.errors && typeof obj.errors === "object") {
        fieldErrors = obj.errors as Record<string, string[]>;
      }
    }
    throw new GenerateAuthUrlApiError(errorMsg, response.status, fieldErrors);
  }

  const apiRes = payload as GenerateAuthUrlApiResponse;
  if (!apiRes || !apiRes.responseData) {
    throw new GenerateAuthUrlApiError("Invalid response format received from authorization url endpoint.");
  }

  return apiRes.responseData;
}
