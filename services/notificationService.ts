import { getPortalApiBaseUrl } from "@/lib/auth";

export interface SendConsentNotificationParams {
  entity_id: string;
  consent_url: string;
  email?: string | null;
}

export interface ConsentNotificationResult {
  entity_id: string;
  entity_name: string;
  recipient_email: string;
  consent_url: string;
  sent_at: string;
}

export interface SendNotificationApiResponse {
  status: string;
  statusCode: number;
  responseData: ConsentNotificationResult;
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export class NotificationApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "NotificationApiError";
  }
}

/**
 * Dispatch an official Consent Authorization email to the customer or entity.
 * Endpoint: POST /api/v1/portal/send-notification
 */
export async function sendConsentNotificationEmail(
  params: SendConsentNotificationParams,
  accessToken: string
): Promise<ConsentNotificationResult> {
  const baseUrl = getPortalApiBaseUrl();

  const bodyPayload: Record<string, string> = {
    entity_id: params.entity_id.trim(),
    consent_url: params.consent_url.trim(),
  };

  if (params.email && params.email.trim()) {
    bodyPayload.email = params.email.trim();
  }

  const response = await fetch(`${baseUrl}/send-notification`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bodyPayload),
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to send consent notification email.`;
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
    throw new NotificationApiError(errorMsg, response.status, fieldErrors);
  }

  const apiRes = payload as SendNotificationApiResponse;
  if (!apiRes || !apiRes.responseData) {
    throw new NotificationApiError("Invalid response format received from send-notification endpoint.");
  }

  return apiRes.responseData;
}
