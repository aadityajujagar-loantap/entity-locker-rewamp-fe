import { getPortalApiBaseUrl } from "@/lib/auth";

export interface ConsentDetailsData {
  consent_id: number;
  entity_id: string;
  user_id: number;
  status: string;
  state: string | null;
  code_challenge: string | null;
  authorization_url: string | null;
  code: string | null;
  consent_created_at: string | null;
  consent_provided_at: string | null;
  consent_valid_till: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsentDetailsApiResponse {
  status: string;
  statusCode: number;
  responseData: ConsentDetailsData;
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export class ConsentDetailsApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ConsentDetailsApiError";
  }
}

export async function fetchConsentDetails(
  params: { consent_id?: number | string; entity_id?: string },
  accessToken: string
): Promise<ConsentDetailsData> {
  const baseUrl = getPortalApiBaseUrl();
  const queryParts: string[] = [];

  if (params.consent_id) {
    queryParts.push(`consent_id=${encodeURIComponent(String(params.consent_id))}`);
  }
  if (params.entity_id) {
    queryParts.push(`entity_id=${encodeURIComponent(params.entity_id)}`);
  }

  if (queryParts.length === 0) {
    throw new ConsentDetailsApiError("Either consent_id or entity_id parameter is required.");
  }

  const response = await fetch(`${baseUrl}/show-consent-details?${queryParts.join("&")}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const resJson: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to fetch consent details.`;
    let fieldErrors: Record<string, string[]> | undefined = undefined;

    if (resJson && typeof resJson === "object") {
      const obj = resJson as Record<string, unknown>;
      if (typeof obj.message === "string" && obj.message.trim()) {
        errorMsg = obj.message;
      }
      if (obj.errors && typeof obj.errors === "object") {
        fieldErrors = obj.errors as Record<string, string[]>;
      }
    }
    throw new ConsentDetailsApiError(errorMsg, response.status, fieldErrors);
  }

  const successRes = resJson as ConsentDetailsApiResponse;
  if (!successRes || !successRes.responseData) {
    throw new ConsentDetailsApiError("Invalid response format received from consent details endpoint.");
  }

  return successRes.responseData;
}
