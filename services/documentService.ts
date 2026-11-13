import { getPortalApiBaseUrl } from "@/lib/auth";

export interface PortalDocumentItem {
  id: number;
  entity_id: string;
  document_source: "ISSUED" | "SELF_UPLOADED" | string;
  uri: string;
  name: string;
  type?: string;
  item_id?: string | null;
  parent_id?: string | null;
  size?: string | null;
  mime?: string | null;
  doctype?: string | null;
  description?: string | null;
  issuer_id?: string | null;
  issuer?: string | null;
  document_date?: string | null;
  storage_path?: string | null;
  has_file?: boolean;
  downloaded_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PortalDocumentListApiResponse {
  status: string;
  statusCode: number;
  responseData: PortalDocumentItem[];
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export interface DocumentContentData {
  id: number;
  entity_id: string;
  document_source?: string;
  uri?: string;
  name: string;
  file_name: string;
  file_extension: string;
  file_size: number;
  type?: string;
  mime: string;
  doctype?: string;
  description?: string;
  issuer_id?: string | null;
  issuer?: string | null;
  document_date?: string | null;
  storage_path?: string;
  downloaded_at?: string | null;
  base64_content: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface GetDocumentApiResponse {
  status: string;
  statusCode: number;
  responseData: DocumentContentData;
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

export class DocumentApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "DocumentApiError";
  }
}

/**
 * Fetch verified documents for an entity from the portal repository.
 * Endpoint: GET /api/v1/portal/portal-document-list?entity_id=...
 */
export async function fetchPortalDocumentList(
  accessToken: string,
  entityId?: string
): Promise<PortalDocumentItem[]> {
  const baseUrl = getPortalApiBaseUrl();
  const queryParams = new URLSearchParams();
  if (entityId && entityId.trim()) {
    queryParams.set("entity_id", entityId.trim());
  }

  const url = `${baseUrl}/portal-document-list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

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
    let errorMsg = `Error ${response.status}: Failed to fetch documents list.`;
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
      errorMsg = payload.message;
    }
    throw new DocumentApiError(errorMsg, response.status);
  }

  const apiRes = payload as PortalDocumentListApiResponse;
  if (!apiRes || !Array.isArray(apiRes.responseData)) {
    throw new DocumentApiError("Invalid response format received from portal-document-list endpoint.");
  }

  return apiRes.responseData;
}

/**
 * Fetch full document file details and Base64 content for viewing or download.
 * Endpoint: POST /api/v1/portal/get-document
 */
export async function fetchDocumentContent(
  accessToken: string,
  params: { id?: number; uri?: string }
): Promise<DocumentContentData> {
  const baseUrl = getPortalApiBaseUrl();

  if (!params.id && !params.uri) {
    throw new DocumentApiError("Either document ID or URI is required to fetch content.");
  }

  const response = await fetch(`${baseUrl}/get-document`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      id: params.id,
      uri: params.uri,
    }),
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to fetch document file content.`;
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
      errorMsg = payload.message;
    }
    throw new DocumentApiError(errorMsg, response.status);
  }

  const apiRes = payload as GetDocumentApiResponse;
  if (!apiRes || !apiRes.responseData || !apiRes.responseData.base64_content) {
    throw new DocumentApiError("Document content not found or invalid format returned.");
  }

  return apiRes.responseData;
}

