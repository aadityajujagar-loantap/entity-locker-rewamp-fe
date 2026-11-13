import { getPortalApiBaseUrl } from "@/lib/auth";

export interface StatusWiseConsentCounts {
  pending?: number;
  authorized?: number;
  failed?: number;
  expired?: number;
  [key: string]: number | undefined;
}

export interface DownloadStatusWiseCounts {
  DOWNLOADED?: number;
  PENDING_DOWNLOAD?: number;
  [key: string]: number | undefined;
}

export interface DashboardSummaryData {
  scope?: {
    type?: string;
    role?: string;
    branch_code?: string;
    user_id?: number;
  };
  entity_status_summary?: {
    total_entities: number;
    status_wise: Record<string, number>;
  };
  consent_request_summary?: {
    total_consent_requests: number;
    status_wise: StatusWiseConsentCounts;
  };
  document_request_summary?: {
    total_documents: number;
    source_wise?: Record<string, number>;
    download_status_wise?: DownloadStatusWiseCounts;
  };
}

export interface DashboardSummaryApiResponse {
  status: string;
  statusCode: number;
  responseData: DashboardSummaryData;
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export interface ConsentDocumentItem {
  id: number;
  name?: string;
  type?: string;
  doctype?: string;
  mime?: string;
  size?: string;
  storage_path?: string | null;
  downloaded_at?: string | null;
}

export interface EntitySummary {
  id?: number;
  entity_id: string;
  entity_name: string;
  entity_type?: string;
  entity_email?: string | null;
  entity_mobile?: string | null;
  status?: string;
}

export interface ConsentRequestItem {
  consent_id: number;
  entity_id: string;
  user_id: number;
  status: "pending" | "authorized" | "failed" | "expired" | string;
  state?: string | null;
  code_challenge?: string | null;
  authorization_url?: string | null;
  code?: string | null;
  consent_created_at?: string | null;
  consent_provided_at?: string | null;
  consent_valid_till?: string | null;
  created_at?: string;
  updated_at?: string;
  // Entity relationship info
  entity_name?: string | null;
  entity_email?: string | null;
  entity_mobile?: string | null;
  entity_type?: string | null;
  entity?: EntitySummary | null;
  // Associated documents
  documents_count?: number;
  documents?: ConsentDocumentItem[];
}

export interface ConsentListApiResponse {
  status: string;
  statusCode: number;
  responseData: ConsentRequestItem[];
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export interface ConsentListFilters {
  entity_id?: string;
  status?: string;
}

export class RequestListApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "RequestListApiError";
  }
}

/**
 * Fetch real-time metrics summary for the Dashboard (Total Requests, Pending, Approved, Rejected, Expired, Docs Downloaded).
 * Calls: GET /api/v1/portal/dashboard/summary
 */
export async function fetchDashboardSummary(accessToken: string): Promise<DashboardSummaryData> {
  const baseUrl = getPortalApiBaseUrl();
  const response = await fetch(`${baseUrl}/dashboard/summary`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to fetch dashboard summary metrics.`;
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
      errorMsg = payload.message;
    }
    throw new RequestListApiError(errorMsg, response.status);
  }

  const apiRes = payload as DashboardSummaryApiResponse;
  if (!apiRes || !apiRes.responseData) {
    throw new RequestListApiError("Invalid response format received from dashboard summary endpoint.");
  }

  return apiRes.responseData;
}

/**
 * Fetch list of consent requests records with optional filters.
 * Calls: GET /api/v1/portal/consent-list
 */
export async function fetchConsentRequests(
  accessToken: string,
  filters?: ConsentListFilters
): Promise<ConsentRequestItem[]> {
  const baseUrl = getPortalApiBaseUrl();
  const queryParts: string[] = [];

  if (filters?.entity_id && filters.entity_id.trim()) {
    queryParts.push(`entity_id=${encodeURIComponent(filters.entity_id.trim())}`);
  }

  if (filters?.status && filters.status !== "All Status") {
    let normalized = filters.status.toLowerCase().trim();
    if (normalized.startsWith("consent ")) {
      normalized = normalized.replace(/^consent\s+/, "");
    }
    if (normalized === "approved") {
      normalized = "authorized";
    } else if (normalized === "rejected") {
      normalized = "failed";
    }
    queryParts.push(`status=${encodeURIComponent(normalized)}`);
  }

  const url = `${baseUrl}/consent-list${queryParts.length > 0 ? `?${queryParts.join("&")}` : ""}`;

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
    let errorMsg = `Error ${response.status}: Failed to fetch consent requests list.`;
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
    throw new RequestListApiError(errorMsg, response.status, fieldErrors);
  }

  const apiRes = payload as ConsentListApiResponse;
  if (!apiRes || !Array.isArray(apiRes.responseData)) {
    throw new RequestListApiError("Invalid response format received from consent-list endpoint.");
  }

  return apiRes.responseData;
}

