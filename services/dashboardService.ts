import { getPortalApiBaseUrl } from "@/lib/auth";
import { DashboardSummaryData, DashboardSummaryApiResponse } from "@/services/requestList";

export interface MonthlyTrendItem {
  month: string;
  year_month: string;
  document_requests: number;
  consent_requests: number;
  entities_registered: number;
}

export interface RequesterOverviewItem {
  user_id: number;
  name: string;
  employee_id?: string | null;
  pf_number?: string | null;
  email?: string | null;
  total_requests: number;
  last_request_at?: string | null;
}

export interface ApiGatewayOverviewData {
  total_api_requests: number;
  method_breakdown: Record<string, number>;
  top_endpoints: Array<{
    path: string;
    request_count: number;
    avg_duration_ms: number;
  }>;
  average_duration_ms: number;
}

export interface RecentActivityItem {
  id: number;
  action: string;
  user_id: number;
  user_name: string;
  employee_id?: string | null;
  ip_address?: string | null;
  status_code?: number | null;
  created_at?: string | null;
}

export interface RequestsByStatusDistribution {
  total_logged_requests: number;
  status_wise: Record<string, number>;
}

export interface DashboardReportsData {
  scope?: {
    type?: string;
    role?: string;
    branch_code?: string;
  };
  requests_trend_monthly: MonthlyTrendItem[];
  requester_overview: RequesterOverviewItem[];
  api_gateway_overview: ApiGatewayOverviewData;
  recent_activity: RecentActivityItem[];
  requests_by_status: RequestsByStatusDistribution;
}

export interface DashboardReportsApiResponse {
  status: string;
  statusCode: number;
  responseData: DashboardReportsData;
  success: boolean;
  message: string;
  meta?: {
    timestamp?: string;
    request_id?: string;
  };
}

/**
 * Fetch high-level summary counts for Dashboard.
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
    let errorMsg = `Error ${response.status}: Failed to fetch dashboard summary.`;
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
      errorMsg = payload.message;
    }
    throw new Error(errorMsg);
  }

  const apiRes = payload as DashboardSummaryApiResponse;
  if (!apiRes || !apiRes.responseData) {
    throw new Error("Invalid response format received from dashboard summary endpoint.");
  }

  return apiRes.responseData;
}

/**
 * Fetch comprehensive reporting metrics for Dashboard graphs, status distributions, and activity feeds.
 * Calls: GET /api/v1/portal/dashboard/reports
 */
export async function fetchDashboardReports(accessToken: string): Promise<DashboardReportsData> {
  const baseUrl = getPortalApiBaseUrl();
  const response = await fetch(`${baseUrl}/dashboard/reports`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: Failed to fetch dashboard reports.`;
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
      errorMsg = payload.message;
    }
    throw new Error(errorMsg);
  }

  const apiRes = payload as DashboardReportsApiResponse;
  if (!apiRes || !apiRes.responseData) {
    throw new Error("Invalid response format received from dashboard reports endpoint.");
  }

  return apiRes.responseData;
}
