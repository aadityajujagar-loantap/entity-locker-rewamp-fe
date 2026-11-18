"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Hourglass,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
  DownloadCloud,
  Eye,
  Send,
  X,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Image as ImageIcon,
  FileQuestion,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import {
  fetchDashboardSummary,
  fetchConsentRequests,
  DashboardSummaryData,
  ConsentRequestItem,
} from "@/services/requestList";
import {
  fetchPortalDocumentList,
  fetchDocumentContent,
  PortalDocumentItem,
  DocumentContentData,
} from "@/services/documentService";
import { sendConsentNotificationEmail } from "@/services/notificationService";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export interface TransformedRequest {
  raw: ConsentRequestItem;
  id: string;
  consentId: number;
  entityId: string;
  name: string;
  mobile: string;
  email: string;
  refNumber: string;
  purpose: string;
  status: "Consent Approved" | "Pending" | "Consent Rejected" | "Expired" | string;
  rawStatus: string;
  consentDate: string;
  sharedOn: string;
  validTill: string;
  authorizationUrl?: string | null;
  documents: { type: string; count: number }[];
}

const SAMPLE_FALLBACK_DOCUMENTS = [
  {
    name: "PAN Verification Record (Sample)",
    type: "KYC / Tax Record",
    size: "106 KB",
    status: "Verified",
    url: `${basePath}/samples/docs/hdfc.pdf`,
    fileKind: "pdf",
  },
  {
    name: "Commercial Credit Report (Sample)",
    type: "Credit Information",
    size: "261 KB",
    status: "Verified",
    url: `${basePath}/samples/docs/sample_cibil.pdf`,
    fileKind: "pdf",
  },
  {
    name: "GST Registration Certificate (Sample)",
    type: "Tax Registration",
    size: "78 KB",
    status: "Verified",
    url: `${basePath}/samples/docs/sbi.pdf`,
    fileKind: "pdf",
  },
  {
    name: "Signatory Identity Proof (Sample)",
    type: "Image Proof",
    size: "134 KB",
    status: "Verified",
    url: `${basePath}/samples/files/1.jpg`,
    fileKind: "image",
  },
];

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

function formatDateOnly(isoString?: string | null): string {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
  if (!url) return "Verification";
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
    const match = url.match(/[?&]purpose=([^&]+)/i);
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]);
      return decoded.charAt(0).toUpperCase() + decoded.slice(1);
    }
  }
  return "KYC Verification";
}

export default function RequestListPage() {
  const router = useRouter();

  // Dynamic API state
  const [summary, setSummary] = useState<DashboardSummaryData | null>(null);
  const [requests, setRequests] = useState<TransformedRequest[]>([]);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Selected Request for Right Drawer
  const [selectedRequest, setSelectedRequest] = useState<TransformedRequest | null>(null);

  // ══════════════ DYNAMIC VIEW DOCUMENTS MODAL STATE ══════════════
  const [isDocumentsPreviewOpen, setIsDocumentsPreviewOpen] = useState(false);
  const [documentModalRequest, setDocumentModalRequest] = useState<TransformedRequest | null>(null);
  const [dynamicDocuments, setDynamicDocuments] = useState<PortalDocumentItem[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<PortalDocumentItem | null>(null);
  const [documentContent, setDocumentContent] = useState<DocumentContentData | null>(null);
  const [loadingDocList, setLoadingDocList] = useState<boolean>(false);
  const [loadingDocContent, setLoadingDocContent] = useState<boolean>(false);
  const [docModalError, setDocModalError] = useState<string | null>(null);
  const [useSampleFallback, setUseSampleFallback] = useState<boolean>(false);
  const [selectedSampleDoc, setSelectedSampleDoc] = useState(SAMPLE_FALLBACK_DOCUMENTS[0]);

  // Transform raw API consent records into table presentation format
  const transformConsentItems = useCallback((items: ConsentRequestItem[]): TransformedRequest[] => {
    return items.map((item) => {
      const displayId = `REQ${String(item.consent_id).padStart(6, "0")}`;
      const customerName = item.entity_name || item.entity?.entity_name || `Entity (${item.entity_id})`;
      const mobile = item.entity_mobile || item.entity?.entity_mobile || "-";
      const email = item.entity_email || item.entity?.entity_email || "-";
      const refNumber = item.state ? item.state.slice(0, 14) : item.entity_id;
      const purpose = extractPurposeFromUrl(item.authorization_url);
      const statusLabel = mapBackendStatusToLabel(item.status);

      // Group documents if available
      const docs: { type: string; count: number }[] = [];
      if (item.documents && item.documents.length > 0) {
        const typeMap: Record<string, number> = {};
        for (const doc of item.documents) {
          const t = doc.doctype || doc.type || doc.name || "Verified Document";
          typeMap[t] = (typeMap[t] || 0) + 1;
        }
        for (const [type, count] of Object.entries(typeMap)) {
          docs.push({ type, count });
        }
      }

      return {
        raw: item,
        id: displayId,
        consentId: item.consent_id,
        entityId: item.entity_id,
        name: customerName,
        mobile,
        email,
        refNumber,
        purpose,
        status: statusLabel,
        rawStatus: item.status,
        consentDate: formatDateTime(item.consent_provided_at),
        sharedOn: formatDateTime(item.consent_created_at || item.created_at),
        validTill: formatDateOnly(item.consent_valid_till),
        authorizationUrl: item.authorization_url,
        documents: docs,
      };
    });
  }, []);

  // Fetch Dashboard Summary Metrics
  const loadSummaryData = useCallback(async () => {
    try {
      const session = getAuthSession();
      if (!session || !session.accessToken) {
        return;
      }
      setLoadingSummary(true);
      const summaryData = await fetchDashboardSummary(session.accessToken);
      setSummary(summaryData);
    } catch (err: unknown) {
      console.error("Failed to load dashboard summary metrics:", err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Fetch Consent Requests List
  const loadRequestsData = useCallback(async () => {
    try {
      const session = getAuthSession();
      if (!session || !session.accessToken) {
        setError("User session expired or not authenticated. Please log in.");
        return;
      }
      setLoadingRequests(true);
      setError(null);

      const items = await fetchConsentRequests(session.accessToken);
      const transformed = transformConsentItems(items);
      setRequests(transformed);

      // Default select the first row if available and nothing is selected
      if (transformed.length > 0) {
        setSelectedRequest((prev) => {
          if (!prev) return transformed[0];
          const matched = transformed.find((t) => t.consentId === prev.consentId);
          return matched || transformed[0];
        });
      } else {
        setSelectedRequest(null);
      }
    } catch (err: unknown) {
      console.error("Failed to load consent requests list:", err);
      const msg = err instanceof Error ? err.message : "Failed to load consent requests.";
      setError(msg);
    } finally {
      setLoadingRequests(false);
    }
  }, [transformConsentItems]);

  // Initial Load
  useEffect(() => {
    loadSummaryData();
    loadRequestsData();
  }, [loadSummaryData, loadRequestsData]);

  // Combined Refresh
  const handleRefresh = useCallback(() => {
    loadSummaryData();
    loadRequestsData();
  }, [loadSummaryData, loadRequestsData]);

  // Filter Logic (Search by Request ID, Name, Mobile, or Entity ID)
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        req.id.toLowerCase().includes(q) ||
        req.name.toLowerCase().includes(q) ||
        req.mobile.includes(q) ||
        req.entityId.toLowerCase().includes(q) ||
        req.refNumber.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === "All Status" || req.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, selectedStatus]);

  // Status badge style helper
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
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getStatusLabel = (status: string) => status.replace(/^Consent\s+/, "");
  const getDateOnly = (dateTime: string) => (dateTime === "-" ? "-" : dateTime.split(",")[0] || dateTime.split(" ")[0]);

  // ══════════════ DYNAMIC DOCUMENT CONTENT LOADER ══════════════
  const loadSingleDocumentContent = async (doc: PortalDocumentItem, token?: string) => {
    setSelectedDocument(doc);
    const session = getAuthSession();
    const accessToken = token || session?.accessToken;
    if (!accessToken) return;

    setLoadingDocContent(true);
    setDocModalError(null);
    try {
      const content = await fetchDocumentContent(accessToken, { id: doc.id, uri: doc.uri });
      setDocumentContent(content);
    } catch (err: unknown) {
      console.error("Failed to load document content:", err);
      const msg = err instanceof Error ? err.message : "Failed to load document content.";
      setDocModalError(msg);
      setDocumentContent(null);
    } finally {
      setLoadingDocContent(false);
    }
  };

  // Open Document Modal dynamically using real API
  const openDocumentsPreview = async (req?: TransformedRequest | null) => {
    const targetReq = req || selectedRequest;
    if (!targetReq) return;

    setDocumentModalRequest(targetReq);
    setIsDocumentsPreviewOpen(true);
    setLoadingDocList(true);
    setDocModalError(null);
    setSelectedDocument(null);
    setDocumentContent(null);
    setDynamicDocuments([]);
    setUseSampleFallback(false);

    const session = getAuthSession();
    if (!session || !session.accessToken) {
      setDocModalError("Authentication session expired. Please sign in again.");
      setLoadingDocList(false);
      return;
    }

    try {
      const docs = await fetchPortalDocumentList(session.accessToken, targetReq.entityId);
      setDynamicDocuments(docs);

      if (docs.length > 0) {
        setSelectedDocument(docs[0]);
        await loadSingleDocumentContent(docs[0], session.accessToken);
      }
    } catch (err: unknown) {
      console.error("Failed to load portal documents:", err);
      const msg = err instanceof Error ? err.message : "Failed to load documents list from portal.";
      setDocModalError(msg);
    } finally {
      setLoadingDocList(false);
    }
  };

  // Download Action Handler (Converts Base64 to blob or downloads fallback sample)
  const handleDownloadActiveDocument = () => {
    if (useSampleFallback) {
      const a = document.createElement("a");
      a.href = selectedSampleDoc.url;
      a.download = selectedSampleDoc.name + ".pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (!selectedDocument || !documentContent?.base64_content) {
      alert("Document file content is not loaded yet or unavailable.");
      return;
    }

    try {
      const byteCharacters = atob(documentContent.base64_content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const mime = documentContent.mime || "application/pdf";
      const blob = new Blob([byteArray], { type: mime });
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = documentContent.file_name || selectedDocument.name || "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Error creating download blob:", e);
      alert("Failed to process document file download.");
    }
  };

  // Resend / Copy Consent Link Handler
  const handleCopyOrOpenConsentLink = async (req: TransformedRequest) => {
    if (!req.authorizationUrl) {
      alert(`No authorization URL registered for Request ${req.id}`);
      return;
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(req.authorizationUrl);
        setCopiedUrlId(req.id);
        setTimeout(() => setCopiedUrlId(null), 3000);
      }
    } catch {
      // Fallback
    }

    const session = getAuthSession();
    if (session?.accessToken && req.email && req.email !== "-") {
      const confirmAction = window.confirm(
        `Consent URL copied to clipboard!\n\nWould you like to dispatch the official consent notification email to ${req.name} (${req.email}) now?`
      );
      if (confirmAction) {
        try {
          await sendConsentNotificationEmail(
            {
              entity_id: req.entityId,
              consent_url: req.authorizationUrl,
              email: req.email,
            },
            session.accessToken
          );
          alert(`Official consent email dispatched successfully to ${req.email}!`);
          return;
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to send email.";
          alert(`Email dispatch failed: ${msg}`);
          return;
        }
      }
    }

    const confirmOpen = window.confirm(
      `Consent Authorization URL copied to clipboard!\n\nWould you like to open it in a new window now for testing?\n\n${req.authorizationUrl}`
    );
    if (confirmOpen) {
      window.open(req.authorizationUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Derive metric card values from summary
  const totalRequestsCount = summary?.consent_request_summary?.total_consent_requests ?? requests.length;
  const pendingCount = summary?.consent_request_summary?.status_wise?.pending ?? 0;
  const approvedCount = summary?.consent_request_summary?.status_wise?.authorized ?? 0;
  const rejectedCount =
    (summary?.consent_request_summary?.status_wise?.failed ?? 0) +
    (summary?.consent_request_summary?.status_wise?.rejected ?? 0);
  const expiredCount = summary?.consent_request_summary?.status_wise?.expired ?? 0;
  const docsDownloadedCount =
    summary?.document_request_summary?.download_status_wise?.DOWNLOADED ?? 0;

  return (
    <div className="p-2  mx-auto space-y-2 animate-fade-in">
      {/* Page Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-extrabold text-[#0089CF] tracking-tight">
            Requester Overview
          </h2>
          <p className="text-[11.5px] font-semibold text-[#5e6272] mt-0.5">
            Manage real-time customer consent requests, track statuses, and access authorized documents.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loadingSummary || loadingRequests}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-[#0089CF] bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 rounded-[8px] transition-all cursor-pointer disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw size={13} className={loadingSummary || loadingRequests ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-3 flex items-center justify-between text-red-800 text-[12.5px] font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="text-red-700 underline text-[12px] font-extrabold hover:text-red-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* ══════════════ METRICS HEADER PANEL ══════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          {
            label: "Total Requests",
            value: totalRequestsCount.toLocaleString("en-IN"),
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Pending",
            value: pendingCount.toLocaleString("en-IN"),
            icon: Hourglass,
            color: "text-orange-500",
            bg: "bg-orange-50",
          },
          {
            label: "Consent Approved",
            value: approvedCount.toLocaleString("en-IN"),
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Consent Rejected",
            value: rejectedCount.toLocaleString("en-IN"),
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50",
          },
          {
            label: "Expired",
            value: expiredCount.toLocaleString("en-IN"),
            icon: Clock,
            color: "text-neutral-500",
            bg: "bg-neutral-50",
          },
          {
            label: "Docs Downloaded",
            value: docsDownloadedCount.toLocaleString("en-IN"),
            icon: Download,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#e3e4ee] rounded-[16px] p-4 flex items-start gap-2.5 shadow-[0_2px_8px_rgba(18,22,46,0.015)]"
          >
            <div
              className={`w-9 h-9 rounded-[10px] ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
            >
              <item.icon size={16} />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] font-bold text-text-mid uppercase tracking-wide leading-tight">
                {item.label}
              </span>
              <span className="text-[20px] font-extrabold text-[#10142d] mt-1.5 leading-none">
                {loadingSummary ? (
                  <span className="inline-block w-12 h-5 bg-neutral-200 rounded animate-pulse" />
                ) : (
                  item.value
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════ MAIN WORKSPACE: SPLIT GRID ══════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 items-stretch">
        {/* Table Column (75% or 100% width) */}
        <div
          className={`${selectedRequest ? "xl:col-span-3" : "xl:col-span-4"
            } h-full space-y-4 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]`}
        >
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 items-center justify-between border-b border-[#e3e4ee] pb-4">
            <div className="flex flex-1 min-w-0 flex-wrap gap-2.5 items-center">
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] bg-white outline-none cursor-pointer focus:border-[#0089CF]"
              >
                <option value="All Status">All Status ({requests.length})</option>
                <option value="Consent Approved">Consent Approved</option>
                <option value="Pending">Pending</option>
                <option value="Consent Rejected">Consent Rejected</option>
                <option value="Expired">Expired</option>
              </select>

              {/* Search Bar */}
              <div className="relative flex min-w-[240px] flex-1 items-center h-[38px] border border-[#e3e4ee] rounded-[10px] focus-within:border-[#0089CF] bg-white">
                <Search size={15} className="absolute left-3 text-text-mid" />
                <input
                  type="text"
                  placeholder="Search by Name, Mobile, Request ID, Entity ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-9 pr-3 text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] bg-transparent border-0 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mr-2 text-text-mid hover:text-black"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {!selectedRequest && (
                <button
                  onClick={() => router.push("/dashboard/requester/create-request")}
                  className="px-3.5 h-[38px] rounded-[10px] bg-[#0089CF] hover:bg-[#153ca0] text-white text-[13px] font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span className="text-lg leading-none">+</span> Create New Request
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/dashboard/requester/create-request")}
                className="flex items-center gap-2 px-3.5 h-[38px] rounded-[10px] bg-[#0089CF] hover:bg-[#153ca0] text-white text-[13px] font-extrabold shadow-sm transition-all cursor-pointer"
              >
                <span className="text-base leading-none">+</span> New Request
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto min-h-[320px]">
            {loadingRequests ? (
              <div className="space-y-3 py-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-neutral-100/70 rounded-[8px] animate-pulse flex items-center px-4 gap-4"
                  >
                    <div className="w-20 h-4 bg-neutral-200 rounded" />
                    <div className="w-32 h-4 bg-neutral-200 rounded" />
                    <div className="w-24 h-4 bg-neutral-200 rounded" />
                    <div className="w-28 h-4 bg-neutral-200 rounded" />
                    <div className="w-20 h-4 bg-neutral-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#e3e4ee] text-[10.5px] font-bold text-text-mid uppercase text-left whitespace-nowrap">
                    <th className="py-2.5 px-3">Request ID</th>
                    <th className="py-2.5 px-3">Customer / Entity</th>
                    <th className="py-2.5 px-3">Mobile Number</th>
                    <th className="py-2.5 px-3">Purpose</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Consent Date</th>
                    <th className="py-2.5 px-3">Shared On</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.consentId}
                      onClick={() => setSelectedRequest(req)}
                      className={`text-[11.5px] font-semibold text-[#10142d] hover:bg-neutral-50 transition-colors cursor-pointer select-none whitespace-nowrap ${selectedRequest?.consentId === req.consentId ? "bg-blue-50/50" : ""
                        }`}
                    >
                      <td className="py-2.5 px-3 font-extrabold text-[#0089CF]">
                        <div className="flex flex-col">
                          <span>{req.id}</span>
                          <span className="text-[9.5px] font-normal text-text-mid">{req.entityId}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-extrabold">
                        <div className="flex flex-col max-w-[180px] truncate">
                          <span className="truncate">{req.name}</span>
                          <span className="text-[10px] font-normal text-[#5e6272] truncate">{req.email}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[#5e6272]">{req.mobile}</td>
                      <td className="py-2.5 px-3 text-[#5e6272]">{req.purpose}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] ${getStatusBadge(
                            req.status
                          )}`}
                        >
                          {getStatusLabel(req.status)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#5e6272]">{getDateOnly(req.consentDate)}</td>
                      <td className="py-2.5 px-3 text-[#5e6272]">{getDateOnly(req.sharedOn)}</td>
                      <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          {/* Action View */}
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 text-[#5e6272] hover:text-[#0089CF]"
                            title="View Request Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Action Resend / Copy Link */}
                          <button
                            disabled={req.status === "Consent Approved" || req.status === "Expired"}
                            onClick={() => handleCopyOrOpenConsentLink(req)}
                            className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${req.status === "Consent Approved" || req.status === "Expired"
                                ? "text-neutral-300 pointer-events-none"
                                : copiedUrlId === req.id
                                  ? "text-green-600 bg-green-50"
                                  : "text-[#5e6272] hover:text-[#0089CF]"
                              }`}
                            title={
                              req.authorizationUrl
                                ? copiedUrlId === req.id
                                  ? "Link Copied!"
                                  : "Copy / Open Consent Link"
                                : "No URL Available"
                            }
                          >
                            {copiedUrlId === req.id ? <Check size={15} /> : <Send size={15} />}
                          </button>

                          {/* Action Dynamic View / Download Documents */}
                          <button
                            disabled={req.status !== "Consent Approved"}
                            onClick={() => openDocumentsPreview(req)}
                            className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${req.status !== "Consent Approved"
                                ? "text-neutral-300 pointer-events-none"
                                : "text-[#5e6272] hover:text-[#0089CF]"
                              }`}
                            title="View & Download Real Documents"
                          >
                            <Download size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-text-mid font-semibold">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText size={32} className="text-neutral-300" />
                          <p className="text-[13px] font-bold text-[#10142d]">No requests found</p>
                          <p className="text-[11.5px] text-[#5e6272]">
                            {searchQuery || selectedStatus !== "All Status"
                              ? "Try adjusting your search query or status filter."
                              : "No consent requests exist yet in this environment."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Pagination */}
          <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-4 text-[13px] font-bold text-text-mid">
            <span>
              Showing {filteredRequests.length > 0 ? 1 : 0} to {filteredRequests.length} of{" "}
              {filteredRequests.length} entries
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer transition-colors">
                  &lt;
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#0089CF] text-white flex items-center justify-center shadow-sm">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer transition-colors">
                  &gt;
                </button>
              </div>
              <span className="text-[12px] text-text-mid font-normal">Page 1 of 1</span>
            </div>
          </div>
        </div>

        {/* ══════════════ DETAILS SIDEBAR (DRAWER) ══════════════ */}
        {selectedRequest && (
          <div className="xl:col-span-1 flex h-full flex-col gap-2">
            <button
              onClick={() => router.push("/dashboard/requester/create-request")}
              className="w-full h-[38px] rounded-[10px] bg-[#0089CF] hover:bg-[#153ca0] text-white text-[13px] font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="text-lg leading-none">+</span> Create New Request
            </button>

            <div className="relative h-full space-y-5 rounded-[16px] border border-[#e3e4ee] bg-white p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)] animate-slide-in-right">
              {/* Close Button */}
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute top-4 right-4 p-1 rounded-md text-text-mid hover:text-[#10142d] hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Title / Header */}
              <div className="pr-7">
                <span className="text-[10px] font-bold text-text-mid uppercase">Request Details</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <h4 className="text-[14.5px] font-extrabold text-[#10142d] tracking-tight">
                    {selectedRequest.id}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-[5px] ${getStatusBadge(
                      selectedRequest.status
                    )}`}
                  >
                    {getStatusLabel(selectedRequest.status)}
                  </span>
                </div>
                <div className="text-[10.5px] font-semibold text-text-mid mt-0.5">
                  Entity ID: <span className="text-[#10142d] font-bold">{selectedRequest.entityId}</span>
                </div>
              </div>

              <hr className="border-0 border-t border-neutral-100 -mx-5" />

              {/* Block 1: Customer Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">
                    Customer / Entity Details
                  </h5>
                </div>
                <div className="space-y-2 text-[12.5px]">
                  <div className="flex justify-between">
                    <span className="text-text-mid font-semibold">Name</span>
                    <span className="font-extrabold text-[#10142d] text-right truncate max-w-[160px]">
                      {selectedRequest.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-mid font-semibold">Mobile Number</span>
                    <span className="font-extrabold text-[#10142d]">{selectedRequest.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-mid font-semibold">Email ID</span>
                    <span className="font-extrabold text-[#10142d] text-right truncate max-w-[170px]">
                      {selectedRequest.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-mid font-semibold">Reference (State)</span>
                    <span
                      className="font-mono text-[11px] font-bold text-[#10142d] text-right truncate max-w-[160px]"
                      title={selectedRequest.refNumber}
                    >
                      {selectedRequest.refNumber}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-0 border-t border-neutral-100 -mx-5" />

              {/* Block 2: Request Details */}
              <div className="space-y-3">
                <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">
                  Request Metadata
                </h5>
                <div className="space-y-2 text-[12.5px]">
                  <div className="flex justify-between">
                    <span className="text-text-mid font-semibold">Purpose</span>
                    <span className="font-extrabold text-[#10142d]">{selectedRequest.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-mid font-semibold">Shared On</span>
                    <span className="font-extrabold text-[#10142d]">{selectedRequest.sharedOn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-mid font-semibold">Consent Date</span>
                    <span className="font-extrabold text-[#10142d]">{selectedRequest.consentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-mid font-semibold">Consent Valid Till</span>
                    <span className="font-extrabold text-[#10142d]">{selectedRequest.validTill}</span>
                  </div>
                </div>
              </div>

              {/* Consent URL Action Box */}
              {selectedRequest.authorizationUrl && (
                <div className="bg-[#f0f9ff] border border-blue-200 rounded-[10px] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0089CF] uppercase">
                      Consent Authorization Link
                    </span>
                    <a
                      href={selectedRequest.authorizationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0089CF] hover:underline flex items-center gap-1 text-[11px] font-extrabold"
                    >
                      Open <ExternalLink size={11} />
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={selectedRequest.authorizationUrl}
                      className="w-full text-[11px] font-mono bg-white border border-blue-200 rounded px-2 py-1 text-neutral-700 truncate outline-none select-all"
                    />
                    <button
                      onClick={() => handleCopyOrOpenConsentLink(selectedRequest)}
                      className="p-1.5 bg-[#0089CF] text-white rounded hover:bg-[#153ca0] transition-colors shrink-0 cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedUrlId === selectedRequest.id ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              )}

              <hr className="border-0 border-t border-neutral-100 -mx-5" />

              {/* Block 3: Documents Checklist */}
              <div className="space-y-3">
                <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">
                  Documents
                </h5>
                {selectedRequest.documents && selectedRequest.documents.length > 0 ? (
                  <div className="max-h-[142px] space-y-2.5 overflow-y-auto pr-1">
                    {selectedRequest.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-[#f8fafc] border border-neutral-100 rounded-[10px] p-2.5"
                      >
                        <div className="flex items-center gap-2 text-[12px] font-bold text-[#10142d]">
                          <FileText size={15} className="text-[#0089CF] shrink-0" />
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                            {doc.type}
                          </span>
                        </div>
                        <span className="w-5 h-5 rounded-full bg-[#e6f4fc] text-[#0089CF] text-[10px] font-extrabold flex items-center justify-center shrink-0">
                          {doc.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 border border-dashed border-[#e3e4ee] rounded-[10px] bg-neutral-50/50">
                    <span className="text-[11.5px] font-semibold text-text-mid italic">
                      {selectedRequest.status === "Consent Approved"
                        ? "Click below to view verified documents"
                        : "No documents collected yet"}
                    </span>
                  </div>
                )}
              </div>

              {/* Drawer Action Button */}
              {selectedRequest.status === "Consent Approved" && (
                <button
                  onClick={() => openDocumentsPreview(selectedRequest)}
                  className="w-full h-[38px] rounded-[10px] bg-[#0089CF] hover:bg-[#153ca0] text-white text-[13.5px] font-extrabold transition-all shadow-[0_4px_12px_rgba(28,77,191,0.2)] hover:shadow-[0_6px_18px_rgba(28,77,191,0.3)] mt-2 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  <span>View Documents</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ DYNAMIC VIEW DOCUMENTS MODAL ══════════════ */}
        {isDocumentsPreviewOpen && (documentModalRequest || selectedRequest) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10142d]/55 p-6 animate-fade-in">
            <div className="flex h-[84vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_24px_70px_rgba(16,20,45,0.26)]">
              {/* Modal Top Bar */}
              <div className="flex items-start justify-between border-b border-[#e3e4ee] px-5 py-3.5 bg-neutral-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-extrabold text-[#0089CF]">
                      Verified Customer Documents
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-[5px] bg-green-50 text-green-700 border border-green-200">
                      Consent Approved
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] font-semibold text-[#5e6272]">
                    Request ID:{" "}
                    <span className="font-extrabold text-[#10142d]">
                      {documentModalRequest?.id || selectedRequest?.id}
                    </span>
                    <span className="mx-2 text-[#9094a8]">|</span>
                    Entity:{" "}
                    <span className="font-extrabold text-[#10142d]">
                      {documentModalRequest?.name || selectedRequest?.name}
                    </span>
                    <span className="mx-2 text-[#9094a8]">|</span>
                    Entity ID:{" "}
                    <span className="font-mono text-[11px] text-[#0089CF]">
                      {documentModalRequest?.entityId || selectedRequest?.entityId}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDocumentsPreviewOpen(false)}
                  className="rounded-md p-1.5 text-text-mid transition-colors hover:bg-neutral-200 hover:text-[#10142d] cursor-pointer"
                  aria-label="Close document preview"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body: Split Sidebar & Content Preview */}
              <div className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)]">
                {/* Left Document List Sidebar */}
                <aside className="flex min-h-0 flex-col border-r border-[#e3e4ee] bg-[#fcfdfe]">
                  <div className="p-3.5 border-b border-[#e3e4ee] flex items-center justify-between">
                    <h4 className="text-[12.5px] font-extrabold text-[#10142d]">
                      Available Files ({useSampleFallback ? SAMPLE_FALLBACK_DOCUMENTS.length : dynamicDocuments.length})
                    </h4>
                    {dynamicDocuments.length === 0 && !loadingDocList && (
                      <button
                        onClick={() => setUseSampleFallback(!useSampleFallback)}
                        className="text-[10.5px] font-bold text-[#0089CF] hover:underline cursor-pointer"
                      >
                        {useSampleFallback ? "Back to Live" : "Show Samples"}
                      </button>
                    )}
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-2">
                    {loadingDocList ? (
                      <div className="py-12 flex flex-col items-center justify-center space-y-2 text-[#5e6272]">
                        <RefreshCw size={24} className="text-[#0089CF] animate-spin" />
                        <span className="text-[12px] font-semibold">Fetching documents list...</span>
                      </div>
                    ) : docModalError && dynamicDocuments.length === 0 && !useSampleFallback ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-[10px] space-y-2 text-center">
                        <AlertCircle size={20} className="text-red-500 mx-auto" />
                        <p className="text-[11.5px] text-red-700 font-semibold">{docModalError}</p>
                        <button
                          onClick={() => setUseSampleFallback(true)}
                          className="mt-1 px-3 py-1 bg-white border border-red-200 text-red-700 rounded-[6px] text-[11px] font-bold hover:bg-red-50"
                        >
                          View Sample Files Instead
                        </button>
                      </div>
                    ) : dynamicDocuments.length === 0 && !useSampleFallback ? (
                      <div className="py-12 px-3 text-center space-y-3">
                        <FileQuestion size={32} className="text-neutral-300 mx-auto" />
                        <p className="text-[12.5px] font-bold text-[#10142d]">No Documents in Repository</p>
                        <p className="text-[11px] text-[#5e6272] leading-relaxed">
                          This entity has not uploaded or issued documents in the portal vault yet.
                        </p>
                        <button
                          onClick={() => setUseSampleFallback(true)}
                          className="px-3.5 py-1.5 bg-[#0089CF] text-white rounded-[8px] text-[11.5px] font-extrabold hover:bg-[#153ca0] shadow-sm cursor-pointer"
                        >
                          View Sample Files
                        </button>
                      </div>
                    ) : useSampleFallback ? (
                      SAMPLE_FALLBACK_DOCUMENTS.map((doc) => {
                        const isActive = selectedSampleDoc.url === doc.url;
                        return (
                          <button
                            key={doc.url}
                            type="button"
                            onClick={() => setSelectedSampleDoc(doc)}
                            className={`flex w-full gap-2.5 rounded-[10px] border p-2.5 text-left transition-all cursor-pointer ${isActive
                                ? "border-[#0089CF] bg-[#eef6ff] shadow-sm"
                                : "border-neutral-200/80 bg-white hover:border-[#0089CF]/40 hover:bg-neutral-50"
                              }`}
                          >
                            <div
                              className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ${doc.fileKind === "image"
                                  ? "bg-purple-50 text-purple-600"
                                  : "bg-blue-50 text-[#0089CF]"
                                }`}
                            >
                              {doc.fileKind === "image" ? <ImageIcon size={16} /> : <FileText size={16} />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-[12px] font-extrabold text-[#10142d]">
                                {doc.name}
                              </span>
                              <div className="flex items-center justify-between text-[10px] text-text-mid mt-1 font-semibold">
                                <span>{doc.type}</span>
                                <span>{doc.size}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      dynamicDocuments.map((doc) => {
                        const isActive = selectedDocument?.id === doc.id;
                        const isPdf =
                          doc.mime?.includes("pdf") ||
                          doc.name.toLowerCase().endsWith(".pdf") ||
                          doc.doctype !== "IMAGE";

                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => loadSingleDocumentContent(doc)}
                            className={`flex w-full gap-2.5 rounded-[10px] border p-2.5 text-left transition-all cursor-pointer ${isActive
                                ? "border-[#0089CF] bg-[#eef6ff] shadow-sm"
                                : "border-neutral-200/80 bg-white hover:border-[#0089CF]/40 hover:bg-neutral-50"
                              }`}
                          >
                            <div
                              className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ${isPdf ? "bg-red-50 text-red-600" : "bg-purple-50 text-purple-600"
                                }`}
                            >
                              {isPdf ? <FileText size={16} /> : <ImageIcon size={16} />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="truncate text-[12px] font-extrabold text-[#10142d]">
                                  {doc.name}
                                </span>
                                <span className="rounded-[4px] bg-green-50 px-1 py-0.2 text-[8.5px] font-extrabold text-green-700 shrink-0">
                                  {doc.has_file ? "Verified" : "In Locker"}
                                </span>
                              </div>
                              <dl className="mt-1 grid grid-cols-[60px_1fr] gap-y-0.5 text-[10px] font-semibold">
                                <dt className="text-text-mid">Source</dt>
                                <dd className="truncate text-[#10142d]">
                                  {doc.document_source === "ISSUED" ? "Govt Issued" : "Self Uploaded"}
                                </dd>
                                <dt className="text-text-mid">Doctype</dt>
                                <dd className="truncate text-[#10142d]">{doc.doctype || doc.type || "Document"}</dd>
                                <dt className="text-text-mid">Size</dt>
                                <dd className="text-[#10142d]">{doc.size || "-"}</dd>
                              </dl>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Sidebar Bottom Download Button */}
                  <div className="border-t border-[#e3e4ee] p-3 bg-white">
                    <button
                      onClick={handleDownloadActiveDocument}
                      disabled={loadingDocContent || (!selectedDocument && !useSampleFallback)}
                      className="flex w-full items-center justify-center gap-2 py-2 text-[12px] font-extrabold text-[#0089CF] bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 rounded-[8px] transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Download size={14} />
                      Download Selected File
                    </button>
                  </div>
                </aside>

                {/* Right Document Preview Section */}
                <section className="flex min-w-0 flex-col p-4 bg-white">
                  {/* Preview Top Header */}
                  <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#e3e4ee] pb-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded-[6px] bg-blue-50 text-[#0089CF] shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-[14px] font-extrabold text-[#10142d]">
                          {useSampleFallback
                            ? selectedSampleDoc.name
                            : selectedDocument?.name || "Select a document from the left list"}
                        </h4>
                        <p className="text-[10.5px] font-semibold text-text-mid truncate">
                          {useSampleFallback
                            ? `${selectedSampleDoc.type} • ${selectedSampleDoc.size}`
                            : selectedDocument
                              ? `${selectedDocument.doctype || selectedDocument.type || "Official Document"} • Size: ${selectedDocument.size || "-"
                              } • Issuer: ${selectedDocument.issuer || "DigiLocker"}`
                              : "Click any item on the left to inspect file content."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleDownloadActiveDocument}
                        disabled={loadingDocContent || (!selectedDocument && !useSampleFallback)}
                        className="flex h-8 items-center gap-1.5 rounded-[8px] border border-[#e3e4ee] px-3 text-[12px] font-bold text-[#10142d] hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsDocumentsPreviewOpen(false)}
                        className="h-8 rounded-[8px] bg-neutral-100 px-3 text-[12px] font-bold text-[#5e6272] hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Document Viewer Frame */}
                  <div className="min-h-0 flex-1 overflow-hidden rounded-[8px] border border-[#e3e4ee] bg-[#f8fafc]">
                    {loadingDocContent ? (
                      <div className="flex h-full w-full flex-col items-center justify-center space-y-3">
                        <RefreshCw size={32} className="text-[#0089CF] animate-spin" />
                        <p className="text-[13px] font-bold text-[#10142d]">Loading document file content...</p>
                        <p className="text-[11px] text-[#5e6272]">Fetching secure Base64 payload from portal vault</p>
                      </div>
                    ) : useSampleFallback ? (
                      selectedSampleDoc.fileKind === "pdf" ? (
                        <iframe
                          title={selectedSampleDoc.name}
                          src={selectedSampleDoc.url}
                          className="h-full w-full border-0 bg-white"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center overflow-auto p-6">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedSampleDoc.url}
                            alt={selectedSampleDoc.name}
                            className="max-h-full max-w-full rounded-[8px] object-contain shadow-[0_2px_12px_rgba(18,22,46,0.16)]"
                          />
                        </div>
                      )
                    ) : documentContent?.base64_content ? (
                      documentContent.mime?.includes("image") ||
                        documentContent.file_extension === "jpg" ||
                        documentContent.file_extension === "png" ? (
                        <div className="flex h-full items-center justify-center overflow-auto p-6">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`data:${documentContent.mime || "image/jpeg"};base64,${documentContent.base64_content}`}
                            alt={documentContent.name || "Document Preview"}
                            className="max-h-full max-w-full rounded-[8px] object-contain shadow-[0_2px_12px_rgba(18,22,46,0.16)]"
                          />
                        </div>
                      ) : (
                        <iframe
                          title={documentContent.name || "PDF Document"}
                          src={`data:${documentContent.mime || "application/pdf"};base64,${documentContent.base64_content}`}
                          className="h-full w-full border-0 bg-white"
                        />
                      )
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center space-y-3 p-8 text-center">
                        <FileQuestion size={40} className="text-neutral-300" />
                        <h5 className="text-[14px] font-extrabold text-[#10142d]">
                          {selectedDocument ? "File Not Cached on Disk" : "No Document Selected"}
                        </h5>
                        <p className="max-w-[420px] text-[12px] text-[#5e6272] leading-relaxed">
                          {selectedDocument
                            ? "This document record is registered in the database, but its binary file content has not been downloaded from the Entity Locker gateway yet."
                            : "Select any document from the left list to render the preview."}
                        </p>
                        <button
                          onClick={() => setUseSampleFallback(true)}
                          className="mt-2 px-4 py-2 bg-[#0089CF] text-white rounded-[8px] text-[12px] font-extrabold hover:bg-[#153ca0] shadow-sm cursor-pointer"
                        >
                          View Sample Document Preview
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
