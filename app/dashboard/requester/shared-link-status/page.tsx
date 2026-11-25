"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Hourglass,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  SlidersHorizontal,
  DownloadCloud,
  Eye,
  Send,
  MoreVertical,
  X,
  Copy,
  Check,
  Calendar,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import {
  fetchDashboardSummary,
  fetchConsentRequests,
  DashboardSummaryData,
  ConsentRequestItem,
} from "@/services/requestList";
import { sendConsentNotificationEmail } from "@/services/notificationService";

/* [OLD CODE - COMMENTED OUT AS PER REQUIREMENT: Mock Links Data]
const MOCK_LINKS = [
  {
    id: "REQ123456",
    name: "Rajesh Enterprises",
    mobile: "9876543210",
    email: "rajesh@enterprises.com",
    refNumber: "LN20240528001",
    linkId: "LK-9823A1B2",
    linkUrl: "https://mahabank.elocker.in/consent/abc123def456",
    sharedOn: "28/05/2024 10:15 AM",
    status: "Consent Approved",
    consentDate: "28/05/2024 10:32 AM",
    validTill: "04/06/2024 10:15 AM",
    sharedVia: "SMS, Email",
    purpose: "Loan Processing",
    docCategory: "KYC, Income Proof, Bank Statements",
    ipAddress: "103.21.45.67",
    userAgent: "Chrome / Windows 11",
  },
  {
    id: "REQ123457",
    name: "Shree Traders",
    mobile: "9823456789",
    email: "shree@traders.co.in",
    refNumber: "LN20240531002",
    linkId: "LK-7F91C2D3",
    linkUrl: "https://mahabank.elocker.in/consent/xyz789lmn012",
    sharedOn: "31/05/2024 11:20 AM",
    status: "Pending",
    consentDate: "-",
    validTill: "07/06/2024 11:20 AM",
    sharedVia: "SMS, Email",
    purpose: "Account Opening",
    docCategory: "KYC, GST Record",
    ipAddress: "-",
    userAgent: "-",
  },
  {
    id: "REQ123458",
    name: "ABC Pvt Ltd",
    mobile: "9765432101",
    email: "contact@abcpvt.com",
    refNumber: "LN20240531003",
    linkId: "LK-3D21E4F5",
    linkUrl: "https://mahabank.elocker.in/consent/qwe345rty678",
    sharedOn: "31/05/2024 09:05 AM",
    status: "Consent Rejected",
    consentDate: "31/05/2024 09:30 AM",
    validTill: "07/06/2024 09:05 AM",
    sharedVia: "WhatsApp",
    purpose: "Loan Processing",
    docCategory: "Corporate Registration, PAN",
    ipAddress: "103.44.12.98",
    userAgent: "Safari / iOS 17",
  },
  {
    id: "REQ123459",
    name: "Khandelwal & Co.",
    mobile: "9811122233",
    email: "info@khandelwal.com",
    refNumber: "TF20240530008",
    linkId: "LK-5G32H6I7",
    linkUrl: "https://mahabank.elocker.in/consent/asd567fgh890",
    sharedOn: "30/05/2024 04:18 PM",
    status: "Opened",
    consentDate: "-",
    validTill: "06/06/2024 04:18 PM",
    sharedVia: "SMS",
    purpose: "Trade Finance",
    docCategory: "Financial Statements, Import Export Certificate",
    ipAddress: "103.22.45.19",
    userAgent: "Firefox / macOS",
  },
  {
    id: "REQ123460",
    name: "M/s Global Supplies",
    mobile: "9933221100",
    email: "globalsupplies@gmail.com",
    refNumber: "LN20240525005",
    linkId: "LK-8J43K7L8",
    linkUrl: "https://mahabank.elocker.in/consent/zxc098vbn765",
    sharedOn: "25/05/2024 02:45 PM",
    status: "Expired",
    consentDate: "-",
    validTill: "01/06/2024 02:45 PM",
    sharedVia: "Email",
    purpose: "Loan Processing",
    docCategory: "ITR, Bank Statement",
    ipAddress: "-",
    userAgent: "-",
  },
  {
    id: "REQ123461",
    name: "PQR Solutions",
    mobile: "9898989898",
    email: "support@pqrsolutions.com",
    refNumber: "LN20240529014",
    linkId: "LK-1M54N8O9",
    linkUrl: "https://mahabank.elocker.in/consent/poi543lkj210",
    sharedOn: "29/05/2024 01:10 PM",
    status: "Failed",
    consentDate: "-",
    validTill: "05/06/2024 01:10 PM",
    sharedVia: "SMS",
    purpose: "Account Opening",
    docCategory: "Aadhaar Card, PAN",
    ipAddress: "-",
    userAgent: "-",
  },
  {
    id: "REQ123462",
    name: "NXT Logistics",
    mobile: "9845678901",
    email: "nxtlogistics@nxt.com",
    refNumber: "LN20240527011",
    linkId: "LK-9P65Q0R1",
    linkUrl: "https://mahabank.elocker.in/consent/mnb111lkj222",
    sharedOn: "27/05/2024 05:02 PM",
    status: "Consent Approved",
    consentDate: "27/05/2024 05:22 PM",
    validTill: "03/06/2024 05:02 PM",
    sharedVia: "Email",
    purpose: "Loan Processing",
    docCategory: "Bank Statements",
    ipAddress: "103.25.12.89",
    userAgent: "Chrome / Windows 10",
  },
  {
    id: "REQ123463",
    name: "Delta Industries",
    mobile: "9776655443",
    email: "operations@deltaind.com",
    refNumber: "KY20240531091",
    linkId: "LK-2S76T1U2",
    linkUrl: "https://mahabank.elocker.in/consent/qaz123wsx456",
    sharedOn: "31/05/2024 03:45 PM",
    status: "Pending",
    consentDate: "-",
    validTill: "07/06/2024 03:45 PM",
    sharedVia: "WhatsApp",
    purpose: "KYC Verification",
    docCategory: "Entity Registration Certificate",
    ipAddress: "-",
    userAgent: "-",
  }
];
*/

// Dynamic Data Model for Shared Link
export interface SharedLinkItem {
  id: string;
  consentId: number;
  entityId: string;
  name: string;
  mobile: string;
  email: string;
  refNumber: string;
  linkId: string;
  linkUrl: string;
  sharedOn: string;
  status: "Consent Approved" | "Pending" | "Consent Rejected" | "Opened" | "Expired" | "Failed" | string;
  rawStatus: string;
  consentDate: string;
  validTill: string;
  sharedVia: string;
  purpose: string;
  docCategory: string;
  notes: string;
  ipAddress: string;
  userAgent: string;
  rawDate: Date | null;
}

function formatDateTime(isoString?: string | null): string {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

function mapBackendStatusToLabel(status?: string | null): string {
  if (!status) return "Pending";
  const s = status.toLowerCase().trim();
  if (s === "authorized" || s === "approved") return "Consent Approved";
  if (s === "failed" || s === "rejected") return "Consent Rejected";
  if (s === "pending") return "Pending";
  if (s === "expired") return "Expired";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function extractPurposeFromUrl(url?: string | null): string {
  if (!url) return "Loan Processing";
  try {
    const urlObj = new URL(url);
    const purpose = urlObj.searchParams.get("purpose");
    if (purpose) {
      if (purpose.toLowerCase() === "kyc") return "KYC Verification";
      if (purpose.toLowerCase() === "loan") return "Loan Processing";
      if (purpose.toLowerCase() === "account_opening") return "Account Opening";
      return purpose.charAt(0).toUpperCase() + purpose.slice(1);
    }
  } catch {
    const match = url?.match(/[?&]purpose=([^&]+)/i);
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]);
      return decoded.charAt(0).toUpperCase() + decoded.slice(1);
    }
  }
  return "Loan Processing";
}

function transformConsentToSharedLink(item: ConsentRequestItem): SharedLinkItem {
  const entityName = item.entity_name || item.entity?.entity_name || "Unknown Entity";
  const mobile = item.entity_mobile || item.entity?.entity_mobile || "-";
  const email = item.entity_email || item.entity?.entity_email || "-";
  const linkId = item.state ? `LK-${item.state.substring(0, 8).toUpperCase()}` : `LK-${item.consent_id}`;
  const linkUrl = item.authorization_url || "-";

  let rawDate: Date | null = null;
  const dateStr = item.created_at || item.consent_created_at;
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) rawDate = d;
  }

  const anyItem = item as unknown as Record<string, unknown>;
  const purpose =
    typeof anyItem.purpose === "string" && anyItem.purpose.trim()
      ? anyItem.purpose
      : extractPurposeFromUrl(item.authorization_url);

  const docCategory =
    typeof anyItem.doc_category === "string" && anyItem.doc_category.trim()
      ? anyItem.doc_category
      : "KYC, Bank Statements";

  const notes =
    typeof anyItem.notes === "string" && anyItem.notes.trim()
      ? anyItem.notes
      : "-";

  return {
    id: `REQ${String(item.consent_id).padStart(6, "0")}`,
    consentId: item.consent_id,
    entityId: item.entity_id,
    name: entityName,
    mobile: mobile,
    email: email,
    refNumber: item.entity_id || "-",
    linkId: linkId,
    linkUrl: linkUrl,
    sharedOn: formatDateTime(item.created_at || item.consent_created_at),
    status: mapBackendStatusToLabel(item.status),
    rawStatus: item.status,
    consentDate: item.consent_provided_at ? formatDateTime(item.consent_provided_at) : "-",
    validTill: item.consent_valid_till ? formatDateTime(item.consent_valid_till) : "-",
    sharedVia: "SMS, Email",
    purpose: purpose,
    docCategory: docCategory,
    notes: notes,
    ipAddress: "-",
    userAgent: "-",
    rawDate: rawDate,
  };
}

export default function SharedLinkStatusPage() {
  const router = useRouter();

  // Dynamic Live State
  const [links, setLinks] = useState<SharedLinkItem[]>([]);
  const [summaryData, setSummaryData] = useState<DashboardSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Drawer & Selection
  const [selectedLink, setSelectedLink] = useState<SharedLinkItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Resend Feedback
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendStatusMsg, setResendStatusMsg] = useState<{ id: string; msg: string; success: boolean } | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch Live Data from Backend
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    const session = getAuthSession();
    let token = session?.accessToken || (session as any)?.token || "";

    // Fallback if session stored directly in localStorage
    if (!token && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("entityLocker.authSession");
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed?.accessToken || parsed?.token || "";
        }
      } catch {
        // ignore
      }
    }

    if (!token) {
      setIsLoading(false);
      setFetchError("User session not found or expired. Please sign in to view shared link records.");
      return;
    }

    try {
      const [consentItems, summaryRes] = await Promise.allSettled([
        fetchConsentRequests(token),
        fetchDashboardSummary(token),
      ]);

      if (consentItems.status === "fulfilled") {
        const transformed = consentItems.value.map(transformConsentToSharedLink);
        setLinks(transformed);
        if (transformed.length > 0) {
          setSelectedLink(transformed[0]);
        } else {
          setSelectedLink(null);
        }
      } else {
        const msg = consentItems.reason?.message || "Failed to load shared link records.";
        setFetchError(msg);
      }

      if (summaryRes.status === "fulfilled") {
        setSummaryData(summaryRes.value);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setFetchError(error.message || "An unexpected error occurred while loading shared links.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, startDate, endDate, pageSize]);

  // Filter Logic with Search, Status, and Interactive Date Range
  const filteredLinks = useMemo(() => {
    return links.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.linkId.toLowerCase().includes(q) ||
        item.mobile.includes(q) ||
        item.email.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;

      let matchesDate = true;
      if (startDate && item.rawDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (item.rawDate < start) matchesDate = false;
      }
      if (endDate && item.rawDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (item.rawDate > end) matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [links, searchQuery, selectedStatus, startDate, endDate]);

  // Paginated Slices
  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / pageSize));
  const paginatedLinks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLinks.slice(start, start + pageSize);
  }, [filteredLinks, currentPage, pageSize]);

  // Dynamic Metrics Cards Calculation
  const metrics = useMemo(() => {
    const total = summaryData?.consent_request_summary?.total_consent_requests ?? links.length;
    const pending = summaryData?.consent_request_summary?.status_wise?.pending ?? links.filter((l) => l.status === "Pending").length;
    const approved = summaryData?.consent_request_summary?.status_wise?.authorized ?? links.filter((l) => l.status === "Consent Approved").length;
    const rejected = summaryData?.consent_request_summary?.status_wise?.failed ?? links.filter((l) => l.status === "Consent Rejected").length;
    const expired = summaryData?.consent_request_summary?.status_wise?.expired ?? links.filter((l) => l.status === "Expired").length;
    // const failed = links.filter((l) => l.status === "Failed").length;

    return [
      { label: "Total Links Shared", value: String(total), icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "+18.6% this month", trendUp: true },
      { label: "Pending", value: String(pending), icon: Hourglass, color: "text-orange-500", bg: "bg-orange-50", trend: "-5.3% this month", trendUp: false },
      { label: "Consent Approved", value: String(approved), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", trend: "+22.1% this month", trendUp: true },
      { label: "Consent Rejected", value: String(rejected), icon: XCircle, color: "text-red-500", bg: "bg-red-50", trend: "-8.7% this month", trendUp: false },
      { label: "Expired", value: String(expired), icon: Clock, color: "text-neutral-500", bg: "bg-neutral-50", trend: "-2.1% this month", trendUp: false },
      // { label: "Failed", value: String(failed), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", trend: "+3.4% this month", trendUp: true },
    ];
  }, [summaryData, links]);

  // Copy Link URL
  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Resend Link via Notification API
  const handleResendLink = async (item: SharedLinkItem) => {
    if (!item.linkUrl || item.linkUrl === "-") {
      alert("No valid authorization link found for this request.");
      return;
    }
    const session = getAuthSession();
    let token = session?.accessToken || (session as any)?.token || "";
    if (!token && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("entityLocker.authSession");
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed?.accessToken || parsed?.token || "";
        }
      } catch {
        // ignore
      }
    }

    if (!token) {
      alert("Please login again to resend links.");
      return;
    }

    try {
      setResendingId(item.id);
      setResendStatusMsg(null);
      await sendConsentNotificationEmail(
        {
          entity_id: item.entityId,
          consent_url: item.linkUrl,
          email: item.email !== "-" ? item.email : null,
        },
        token
      );
      setResendStatusMsg({ id: item.id, msg: `Link successfully resent to ${item.name}!`, success: true });
      setTimeout(() => setResendStatusMsg(null), 3500);
    } catch (err: unknown) {
      const error = err as Error;
      setResendStatusMsg({ id: item.id, msg: error?.message || "Failed to resend link.", success: false });
      setTimeout(() => setResendStatusMsg(null), 4500);
    } finally {
      setResendingId(null);
    }
  };

  // CSV Export Handler
  const handleExportCsv = () => {
    if (filteredLinks.length === 0) {
      alert("No records available to export.");
      return;
    }

    const headers = [
      "Request ID",
      "Customer Name",
      "Mobile Number",
      "Email ID",
      "Entity Ref Number",
      "Link ID",
      "Authorization URL",
      "Shared On",
      "Status",
      "Consent Date",
      "Valid Till",
      "Shared Via",
      "Purpose",
      "Document Category",
      "Notes",
    ];

    const escapeCsv = (val: string | number | null | undefined) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [
      headers.join(","),
      ...filteredLinks.map((item) =>
        [
          escapeCsv(item.id),
          escapeCsv(item.name),
          escapeCsv(item.mobile),
          escapeCsv(item.email),
          escapeCsv(item.refNumber),
          escapeCsv(item.linkId),
          escapeCsv(item.linkUrl),
          escapeCsv(item.sharedOn),
          escapeCsv(item.status),
          escapeCsv(item.consentDate),
          escapeCsv(item.validTill),
          escapeCsv(item.sharedVia),
          escapeCsv(item.purpose),
          escapeCsv(item.docCategory),
          escapeCsv(item.notes || "-"),
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.href = url;
    link.setAttribute("download", `Shared_Link_Status_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Consent Approved":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Pending":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "Consent Rejected":
        return "bg-red-50 text-red-700 border border-red-200";
      case "Opened":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Expired":
        return "bg-neutral-50 text-neutral-600 border border-neutral-200";
      case "Failed":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <div className="p-2 mx-auto space-y-2 animate-fade-in">

      {/* Page Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-extrabold text-[#10142d] tracking-tight">
            Shared Link Status Overview
          </h2>
          <p className="text-[12px] font-semibold text-text-mid mt-0.5">
            Real-time tracking of generated DigiDoc consent links and authorizations
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e3e4ee] hover:bg-neutral-50 rounded-[10px] text-[12px] font-bold text-[#10142d] bg-white transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin text-[#1c4dbf]" : "text-text-mid"} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Global Fetch Error Alert */}
      {fetchError && (
        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-[12px] text-red-700 text-[12.5px] font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{fetchError}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/login")}
              className="px-2.5 py-1 bg-[#1c4dbf] hover:bg-[#0089CF] text-white text-[11.5px] font-bold rounded-[8px] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={loadData}
              className="text-[11.5px] font-bold underline hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Resend Action Toast Notification */}
      {resendStatusMsg && (
        <div
          className={`flex items-center gap-2 p-3 rounded-[12px] text-[12.5px] font-bold border transition-all ${resendStatusMsg.success
            ? "bg-green-50 text-green-800 border-green-200"
            : "bg-red-50 text-red-800 border-red-200"
            }`}
        >
          {resendStatusMsg.success ? <Check size={16} className="text-green-600" /> : <AlertTriangle size={16} className="text-red-600" />}
          <span>{resendStatusMsg.msg}</span>
        </div>
      )}

      {/* ══════════════ METRICS HEADER PANEL (DYNAMIC) ══════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {metrics.map((item, idx) => (
          <div key={idx} className="bg-white border border-[#e3e4ee] rounded-[16px] p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(18,22,46,0.015)]">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-[10px] ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon size={16} />
              </div>
              <span className="text-[10px] font-bold text-text-mid uppercase tracking-wide leading-tight">{item.label}</span>
            </div>
            <div className="mt-3">
              <span className="text-[20px] font-extrabold text-[#10142d] leading-none">
                {isLoading ? "..." : item.value}
              </span>
              {/* <p className={`text-[9.5px] font-bold mt-1 leading-none ${item.trendUp ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                {item.trend}
              </p> */}
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════ SPLIT WORKSPACE ══════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 items-start">

        {/* Table Area */}
        <div className={`${selectedLink ? "xl:col-span-3" : "xl:col-span-4"} space-y-4 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]`}>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2.5 items-center">

              {/* [OLD CODE - COMMENTED OUT: Static Calendar display]
              <div className="flex items-center gap-2 px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] bg-white cursor-pointer">
                <span>01/05/2024 - 31/05/2024</span>
                <Calendar size={15} className="text-text-mid" />
              </div>
              */}

              {/* Interactive Calendar Date Range Filter */}
              <div className="flex items-center gap-1.5 px-2.5 h-[38px] border border-[#e3e4ee] rounded-[10px] bg-white text-[12px] font-semibold text-[#10142d]">
                <Calendar size={14} className="text-text-mid shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-[12px] font-bold text-[#10142d] outline-none cursor-pointer"
                  title="From Date"
                />
                <span className="text-[#9094a8] text-[11px] font-bold">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-[12px] font-bold text-[#10142d] outline-none cursor-pointer"
                  title="To Date"
                />
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors"
                    title="Clear Date Filter"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Status Select Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] bg-white outline-none cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Consent Approved">Consent Approved</option>
                <option value="Pending">Pending</option>
                <option value="Consent Rejected">Consent Rejected</option>
                <option value="Opened">Opened</option>
                <option value="Expired">Expired</option>
                <option value="Failed">Failed</option>
              </select>

              {/* Search Bar */}
              <div className="relative flex items-center w-[250px] h-[38px] border border-[#e3e4ee] rounded-[10px] focus-within:border-[#1c4dbf]/50 bg-white">
                <Search size={15} className="absolute left-3 text-text-mid" />
                <input
                  type="text"
                  placeholder="Search by Name, Mobile, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-9 pr-3 text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] bg-transparent border-0 outline-none"
                />
              </div>

            </div>

            {/* Action Buttons: Export & (Commented Out) Filters */}
            <div className="flex items-center gap-2">

              {/* [OLD CODE - COMMENTED OUT AS PER REQUIREMENT: Filters button & functionality]
              <button className="flex items-center gap-2 px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] hover:bg-neutral-50 cursor-pointer bg-white">
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>
              */}

              {/* Dynamic Working CSV Export Button */}
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-2 px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] hover:bg-neutral-50 cursor-pointer bg-white transition-colors"
                title="Export Filtered Links to CSV"
              >
                <DownloadCloud size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e3e4ee] text-[11.5px] font-bold text-text-mid uppercase text-left">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Mobile Number</th>
                  <th className="py-3 px-4">Link ID</th>
                  <th className="py-3 px-4">Shared On</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Consent Date</th>
                  <th className="py-3 px-4">Valid Till</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-text-mid font-semibold">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw size={24} className="animate-spin text-[#1c4dbf]" />
                        <span>Loading shared link status records...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedLinks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-text-mid font-semibold">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText size={28} className="text-neutral-300" />
                        <span>No shared link records found matching your filters.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedLinks.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedLink(item)}
                      className={`text-[12.5px] font-semibold text-[#10142d] hover:bg-neutral-50 transition-colors cursor-pointer select-none ${selectedLink?.id === item.id ? "bg-blue-50/50" : ""
                        }`}
                    >
                      <td className="py-3.5 px-4 font-extrabold text-[#1c4dbf]">{item.id}</td>
                      <td className="py-3.5 px-4 text-[13px] font-extrabold">{item.name}</td>
                      <td className="py-3.5 px-4 text-[#5e6272]">{item.mobile}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-[#10142d]">
                          <span>{item.linkId}</span>
                          {item.linkUrl && item.linkUrl !== "-" && (
                            <button
                              onClick={(e) => handleCopy(item.linkId, item.linkUrl, e)}
                              className="p-1 rounded hover:bg-neutral-100 text-[#5e6272] transition-colors"
                              title="Copy URL"
                            >
                              {copiedId === item.linkId ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#5e6272]">{item.sharedOn}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[11.5px] font-bold px-2 py-0.5 rounded-[6px] ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5e6272]">{item.consentDate}</td>
                      <td className="py-3.5 px-4 text-[#5e6272]">{item.validTill.split(" ")[0]}</td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">

                          <button
                            onClick={() => setSelectedLink(item)}
                            className="p-1.5 rounded-md hover:bg-neutral-100 text-[#5e6272] hover:text-[#1c4dbf] cursor-pointer"
                            title="View Link Details"
                          >
                            <Eye size={15} />
                          </button>

                          {item.linkUrl && item.linkUrl !== "-" && (
                            <button
                              onClick={(e) => handleCopy(item.linkId, item.linkUrl, e)}
                              className="p-1.5 rounded-md hover:bg-neutral-100 text-[#5e6272] hover:text-[#1c4dbf] cursor-pointer"
                              title="Copy Link"
                            >
                              {copiedId === item.linkId ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
                            </button>
                          )}

                          <button
                            disabled={
                              item.status === "Consent Approved" ||
                              item.status === "Expired" ||
                              item.status === "Failed" ||
                              resendingId === item.id
                            }
                            onClick={() => handleResendLink(item)}
                            className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${item.status === "Consent Approved" ||
                              item.status === "Expired" ||
                              item.status === "Failed"
                              ? "text-neutral-300 pointer-events-none"
                              : "text-[#5e6272] hover:text-[#1c4dbf]"
                              }`}
                            title="Resend Link via Email"
                          >
                            <Send size={15} className={resendingId === item.id ? "animate-pulse text-[#1c4dbf]" : ""} />
                          </button>

                          {item.linkUrl && item.linkUrl !== "-" && (
                            <a
                              href={item.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-md hover:bg-neutral-100 text-[#5e6272] hover:text-[#1c4dbf] transition-colors"
                              title="Open Consent URL in New Tab"
                            >
                              <ExternalLink size={15} />
                            </a>
                          )}

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-4 text-[13px] font-bold text-text-mid">
            <span>
              Showing {filteredLinks.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredLinks.length)} of {filteredLinks.length} entries
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 3), currentPage + 2)
                  .map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px] cursor-pointer ${currentPage === pageNum ? "bg-[#0089CF] text-white" : "border border-[#e3e4ee] hover:bg-neutral-50 text-[#10142d]"
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  &gt;
                </button>
              </div>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 h-[34px] border border-[#e3e4ee] rounded-[8px] bg-white outline-none cursor-pointer"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>
          </div>

        </div>

        {/* ══════════════ DETAILS PANEL DRAWER ══════════════ */}
        {selectedLink && (
          <div className="xl:col-span-1 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-5 animate-slide-in-right relative">

            <button
              onClick={() => setSelectedLink(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-text-mid hover:text-[#10142d] hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[10px] font-bold text-text-mid uppercase">Link Details</span>
              <div className="flex items-center gap-2 mt-1.5">
                <h4 className="text-[14.5px] font-extrabold text-[#10142d] tracking-tight">{selectedLink.id}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[5px] ${getStatusBadge(selectedLink.status)}`}>
                  {selectedLink.status}
                </span>
              </div>
            </div>

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 1: Customer Details */}
            <div className="space-y-3">
              <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Customer Details</h5>
              <div className="space-y-2 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Name</span>
                  <span className="font-extrabold text-[#10142d]">{selectedLink.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Mobile Number</span>
                  <span className="font-extrabold text-[#10142d]">{selectedLink.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Email ID</span>
                  <span className="font-extrabold text-[#10142d] overflow-hidden text-ellipsis whitespace-nowrap max-w-[170px]" title={selectedLink.email}>
                    {selectedLink.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Reference / Entity ID</span>
                  <span className="font-extrabold text-[#10142d]">{selectedLink.refNumber}</span>
                </div>
              </div>
            </div>

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 2: Link Details */}
            <div className="space-y-3">
              <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Link Details</h5>
              <div className="space-y-2 text-[12.5px]">
                <div className="flex justify-between items-center">
                  <span className="text-text-mid font-semibold">Link ID</span>
                  <span className="font-extrabold text-[#10142d] flex items-center gap-1">
                    {selectedLink.linkId}
                    {selectedLink.linkUrl && selectedLink.linkUrl !== "-" && (
                      <button
                        onClick={(e) => handleCopy("drawer-lk", selectedLink.linkUrl, e)}
                        className="p-0.5 hover:bg-neutral-50 rounded text-[#1c4dbf]"
                        title="Copy Authorization URL"
                      >
                        {copiedId === "drawer-lk" ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                      </button>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Shared On</span>
                  <span className="font-extrabold text-[#10142d]">{selectedLink.sharedOn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Valid Till</span>
                  <span className="font-extrabold text-[#10142d]">{selectedLink.validTill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Shared Via</span>
                  <span className="font-extrabold text-[#10142d]">{selectedLink.sharedVia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Purpose</span>
                  <span className="font-extrabold text-[#10142d] text-right max-w-[170px] overflow-hidden text-ellipsis whitespace-nowrap" title={selectedLink.purpose}>
                    {selectedLink.purpose}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Document Category</span>
                  <span className="font-extrabold text-[#10142d] text-right max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={selectedLink.docCategory}>
                    {selectedLink.docCategory}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Consent Status</span>
                  <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-[5px] ${getStatusBadge(selectedLink.status)}`}>
                    {selectedLink.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Consent On</span>
                  <span className="font-extrabold text-[#10142d]">{selectedLink.consentDate}</span>
                </div>
                {selectedLink.notes && selectedLink.notes !== "-" && (
                  <div className="flex justify-between">
                    <span className="text-text-mid font-semibold">Notes</span>
                    <span className="font-bold text-[#10142d] text-right max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap" title={selectedLink.notes}>
                      {selectedLink.notes}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">IP Address</span>
                  <span className="font-extrabold text-[#10142d]">{selectedLink.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">User Agent</span>
                  <span className="font-extrabold text-[#10142d]">{selectedLink.userAgent}</span>
                </div>
              </div>
            </div>

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 3: Actions */}
            <div className="space-y-2">
              <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Actions</h5>
              <div className="flex gap-3">
                <button
                  disabled={
                    selectedLink.status === "Consent Approved" ||
                    selectedLink.status === "Expired" ||
                    selectedLink.status === "Failed" ||
                    resendingId === selectedLink.id
                  }
                  onClick={() => handleResendLink(selectedLink)}
                  className="flex-1 h-[36px] border border-[#e3e4ee] hover:border-[#1c4dbf]/40 hover:bg-neutral-50 rounded-[10px] text-[12.5px] font-bold text-[#10142d] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <Send size={13} className={resendingId === selectedLink.id ? "animate-pulse text-[#1c4dbf]" : ""} />
                  {resendingId === selectedLink.id ? "Sending..." : "Resend Link"}
                </button>
                {selectedLink.linkUrl && selectedLink.linkUrl !== "-" && (
                  <button
                    onClick={(e) => handleCopy("drawer-action", selectedLink.linkUrl, e)}
                    className="flex-1 h-[36px] border border-[#e3e4ee] hover:border-[#1c4dbf]/40 hover:bg-neutral-50 rounded-[10px] text-[12.5px] font-bold text-[#10142d] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedId === "drawer-action" ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                    Copy Link
                  </button>
                )}
              </div>
            </div>

            {selectedLink.status === "Consent Approved" && (
              <button
                onClick={() => router.push("/dashboard/requester/request-list")}
                className="w-full h-[38px] rounded-[10px] bg-[#1c4dbf] hover:bg-[#0089CF] text-white text-[13.5px] font-extrabold transition-all shadow-[0_4px_12px_rgba(28,77,191,0.2)] mt-2 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Documents</span>
                <ExternalLink size={14} />
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
