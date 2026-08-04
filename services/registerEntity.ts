import { getPortalApiBaseUrl } from "@/lib/auth";
import { EntityItem } from "@/services/EntityListPage";

export interface RegisterEntityPayload {
  entity_name: string;
  entity_type: string;
  entity_email?: string | null;
  entity_mobile: string;
  entity_status: string;
}

export interface RegisterEntitySuccessResponse {
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

export class RegisterEntityApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "RegisterEntityApiError";
  }
}

export async function registerEntity(
  payload: RegisterEntityPayload,
  accessToken: string
): Promise<EntityItem> {
  const baseUrl = getPortalApiBaseUrl();
  const response = await fetch(`${baseUrl}/register-entity`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      entity_name: payload.entity_name,
      entity_type: payload.entity_type,
      entity_email: payload.entity_email || null,
      entity_mobile: payload.entity_mobile,
      entity_status: payload.entity_status,
    }),
    cache: "no-store",
  });

  const resJson: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to register entity.`;
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
    throw new RegisterEntityApiError(errorMsg, response.status, fieldErrors);
  }

  const successRes = resJson as RegisterEntitySuccessResponse;
  if (!successRes || !successRes.responseData) {
    throw new RegisterEntityApiError("Invalid response format received from register entity endpoint.");
  }

  return successRes.responseData;
}
