"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  SlidersHorizontal,
  DownloadCloud,
  Eye,
  Download,
  MoreVertical,
  X,
  Calendar,
  Check,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import {
  fetchPortalDocumentList,
  fetchDocumentContent,
  normalizeMimeType,
  PortalDocumentItem,
  DocumentContentData,
} from "@/services/documentService";
import {
  fetchConsentRequests,
  fetchDashboardSummary,
  ConsentRequestItem,
  DashboardSummaryData,
} from "@/services/requestList";

/* [OLD CODE - COMMENTED OUT AS PER REQUIREMENT: Mock Documents Data]
const MOCK_DOCUMENTS = [
  {
    id: "REQ123456",
    customerName: "Rajesh Enterprises",
    docName: "PAN Verification Record",
    docType: "KYC",
    status: "Available",
    receivedOn: "28/05/2024 10:32 AM",
    isNew: true,
    fileSize: "256 KB",
    fileFormat: "PDF",
    source: "Entity Locker",
    hmacVerified: true,
    timeline: [
      { label: "Request Created", time: "28/05/2024 10:15 AM", completed: true },
      { label: "Link Shared", time: "28/05/2024 10:16 AM", completed: true },
      { label: "Consent Approved", time: "28/05/2024 10:32 AM", completed: true },
      { label: "Documents Fetched", time: "28/05/2024 10:32 AM", completed: true },
      { label: "Document Available", time: "28/05/2024 10:32 AM", completed: true },
    ]
  },
  {
    id: "REQ123456",
    customerName: "Rajesh Enterprises",
    docName: "MCA Master Data",
    docType: "Business Information",
    status: "Available",
    receivedOn: "28/05/2024 10:32 AM",
    isNew: false,
    fileSize: "1.2 MB",
    fileFormat: "PDF",
    source: "Entity Locker",
    hmacVerified: true,
    timeline: [
      { label: "Request Created", time: "28/05/2024 10:15 AM", completed: true },
      { label: "Link Shared", time: "28/05/2024 10:16 AM", completed: true },
      { label: "Consent Approved", time: "28/05/2024 10:32 AM", completed: true },
      { label: "Documents Fetched", time: "28/05/2024 10:32 AM", completed: true },
      { label: "Document Available", time: "28/05/2024 10:32 AM", completed: true },
    ]
  },
  {
    id: "REQ123457",
    customerName: "Shree Traders",
    docName: "Udyam Registration Certificate",
    docType: "Registration",
    status: "Available",
    receivedOn: "31/05/2024 11:20 AM",
    isNew: false,
    fileSize: "512 KB",
    fileFormat: "PDF",
    source: "Entity Locker",
    hmacVerified: true,
    timeline: [
      { label: "Request Created", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Link Shared", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Consent Approved", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Documents Fetched", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Document Available", time: "31/05/2024 11:20 AM", completed: true },
    ]
  },
  {
    id: "REQ123457",
    customerName: "Shree Traders",
    docName: "GST Certificate",
    docType: "Tax",
    status: "Available",
    receivedOn: "31/05/2024 11:21 AM",
    isNew: false,
    fileSize: "768 KB",
    fileFormat: "PDF",
    source: "Entity Locker",
    hmacVerified: true,
    timeline: [
      { label: "Request Created", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Link Shared", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Consent Approved", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Documents Fetched", time: "31/05/2024 11:21 AM", completed: true },
      { label: "Document Available", time: "31/05/2024 11:21 AM", completed: true },
    ]
  },
  {
    id: "REQ123457",
    customerName: "Shree Traders",
    docName: "ITR - AY 2022-23",
    docType: "Financial",
    status: "Processing",
    receivedOn: "-",
    isNew: false,
    fileSize: "-",
    fileFormat: "-",
    source: "-",
    hmacVerified: false,
    timeline: [
      { label: "Request Created", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Link Shared", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Consent Approved", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Documents Fetching", time: "Processing...", completed: true, processing: true },
    ]
  },
  {
    id: "REQ123458",
    customerName: "ABC Pvt Ltd",
    docName: "Bank Statement (Last 6 Months)",
    docType: "Financial",
    status: "Available",
    receivedOn: "31/05/2024 09:30 AM",
    isNew: false,
    fileSize: "2.4 MB",
    fileFormat: "PDF",
    source: "Entity Locker",
    hmacVerified: true,
    timeline: [
      { label: "Request Created", time: "31/05/2024 09:05 AM", completed: true },
      { label: "Link Shared", time: "31/05/2024 09:05 AM", completed: true },
      { label: "Consent Approved", time: "31/05/2024 09:30 AM", completed: true },
      { label: "Documents Fetched", time: "31/05/2024 09:30 AM", completed: true },
      { label: "Document Available", time: "31/05/2024 09:30 AM", completed: true },
    ]
  },
  {
    id: "REQ123459",
    customerName: "Khandelwal & Co.",
    docName: "Address Proof",
    docType: "Address",
    status: "Available",
    receivedOn: "30/05/2024 04:18 PM",
    isNew: false,
    fileSize: "180 KB",
    fileFormat: "PDF",
    source: "Entity Locker",
    hmacVerified: true,
    timeline: [
      { label: "Request Created", time: "30/05/2024 04:18 PM", completed: true },
      { label: "Link Shared", time: "30/05/2024 04:18 PM", completed: true },
      { label: "Consent Approved", time: "30/05/2024 04:18 PM", completed: true },
      { label: "Documents Fetched", time: "30/05/2024 04:18 PM", completed: true },
      { label: "Document Available", time: "30/05/2024 04:18 PM", completed: true },
    ]
  },
  {
    id: "REQ123460",
    customerName: "M/s Global Supplies",
    docName: "Cancelled Cheque",
    docType: "Bank Details",
    status: "Failed",
    receivedOn: "25/05/2024 02:45 PM",
    isNew: false,
    fileSize: "-",
    fileFormat: "-",
    source: "-",
    hmacVerified: false,
    timeline: [
      { label: "Request Created", time: "25/05/2024 02:45 PM", completed: true },
      { label: "Link Shared", time: "25/05/2024 02:45 PM", completed: true },
      { label: "Consent Approved", time: "25/05/2024 02:45 PM", completed: true },
      { label: "Fetch Failed", time: "25/05/2024 02:45 PM", completed: true, error: true },
    ]
  },
  {
    id: "REQ123461",
    customerName: "PQR Solutions",
    docName: "Loan Sanction Letter",
    docType: "Loan Document",
    status: "Available",
    receivedOn: "29/05/2024 01:10 PM",
    isNew: false,
    fileSize: "420 KB",
    fileFormat: "PDF",
    source: "Entity Locker",
    hmacVerified: true,
    timeline: [
      { label: "Request Created", time: "29/05/2024 01:10 PM", completed: true },
      { label: "Link Shared", time: "29/05/2024 01:10 PM", completed: true },
      { label: "Consent Approved", time: "29/05/2024 01:10 PM", completed: true },
      { label: "Documents Fetched", time: "29/05/2024 01:10 PM", completed: true },
      { label: "Document Available", time: "29/05/2024 01:10 PM", completed: true },
    ]
  },
  {
    id: "REQ123462",
    customerName: "NXT Logistics",
    docName: "Project Report",
    docType: "Business Information",
    status: "Expired",
    receivedOn: "27/05/2024 05:22 PM",
    isNew: false,
    fileSize: "3.5 MB",
    fileFormat: "PDF",
    source: "Entity Locker",
    hmacVerified: true,
    timeline: [
      { label: "Request Created", time: "27/05/2024 05:02 PM", completed: true },
      { label: "Link Shared", time: "27/05/2024 05:02 PM", completed: true },
      { label: "Consent Approved", time: "27/05/2024 05:22 PM", completed: true },
      { label: "Documents Fetched", time: "27/05/2024 05:22 PM", completed: true },
      { label: "Document Available", time: "27/05/2024 05:22 PM", completed: true },
      { label: "Document Expired", time: "03/06/2024 05:02 PM", completed: true, error: true },
    ]
  }
];
*/

// Dynamic Data Model for Transformed Document
export interface TransformedDocument {
  rawId?: number;
  id: string; // Unified 6-digit zero-padded Request ID: REQ000001
  consentId?: number;
  entityId: string;
  customerName: string;
  docName: string;
  docType: string;
  status: "Available" | "Processing" | "Failed" | "Expired" | string;
  receivedOn: string;
  isNew: boolean;
  fileSize: string;
  fileFormat: string;
  source: string;
  hmacVerified: boolean;
  uri?: string;
  storagePath?: string | null;
  rawDate: Date | null;
  timeline: { label: string; time: string; completed: boolean; error?: boolean; processing?: boolean }[];
}

function formatFileSize(sizeStr?: string | number | null): string {
  if (!sizeStr || sizeStr === "-") return "-";
  const num = typeof sizeStr === "number" ? sizeStr : parseInt(sizeStr, 10);
  if (isNaN(num) || num <= 0) return String(sizeStr);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
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

export default function DocumentListPage() {
  const router = useRouter();

  // Dynamic Live State
  const [documents, setDocuments] = useState<TransformedDocument[]>([]);
  const [summaryData, setSummaryData] = useState<DashboardSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedType, setSelectedType] = useState("All Document Type");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Drawer & Selection
  const [selectedDoc, setSelectedDoc] = useState<TransformedDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDocName, setPreviewDocName] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch Live Documents & Consent Requests
  const loadDocumentsData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    const session = getAuthSession();
    let token = session?.accessToken || (session as any)?.token || "";

    // Safe fallback in case getAuthSession dropped token due to expiry check
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
      setFetchError("User session not found or expired. Please sign in to view documents.");
      return;
    }

    try {
      const [docRes, consentRes, summaryRes] = await Promise.allSettled([
        fetchPortalDocumentList(token),
        fetchConsentRequests(token),
        fetchDashboardSummary(token),
      ]);

      const consentList: ConsentRequestItem[] =
        consentRes.status === "fulfilled" ? consentRes.value : [];

      const entityConsentMap: Record<string, ConsentRequestItem> = {};
      consentList.forEach((c) => {
        if (c.entity_id && !entityConsentMap[c.entity_id]) {
          entityConsentMap[c.entity_id] = c;
        }
      });

      if (summaryRes.status === "fulfilled") {
        setSummaryData(summaryRes.value);
      }

      const transformed: TransformedDocument[] = [];
      const seenDocKeys = new Set<string>();

      // 1. Process documents from portal repository
      if (docRes.status === "fulfilled" && Array.isArray(docRes.value)) {
        docRes.value.forEach((d) => {
          const consent = entityConsentMap[d.entity_id];
          const displayRequestId = consent
            ? `REQ${String(consent.consent_id).padStart(6, "0")}`
            : `ENT-${d.entity_id}`;
          const customerName =
            consent?.entity_name ||
            consent?.entity?.entity_name ||
            `Entity (${d.entity_id})`;

          const dateStr = d.downloaded_at || d.created_at || d.document_date;
          let rawDate: Date | null = null;
          if (dateStr) {
            const parsedD = new Date(dateStr);
            if (!isNaN(parsedD.getTime())) rawDate = parsedD;
          }

          const hasPhysicalFile = Boolean(d.has_file || d.storage_path || d.downloaded_at);
          let docStatus = "Available";
          if (!hasPhysicalFile) {
            docStatus = consent?.status === "failed" ? "Failed" : "Processing";
          }
          if (consent?.status === "expired") {
            docStatus = "Expired";
          }

          const docType = d.doctype || d.type || "KYC";
          const docName = d.name || d.description || `${docType} Document`;

          const isNew = rawDate
            ? Date.now() - rawDate.getTime() < 3 * 24 * 60 * 60 * 1000
            : false;

          const key = `${d.entity_id}-${d.id}-${d.uri}`;
          seenDocKeys.add(key);

          transformed.push({
            rawId: d.id,
            id: displayRequestId,
            consentId: consent?.consent_id,
            entityId: d.entity_id,
            customerName: customerName,
            docName: docName,
            docType: docType,
            status: docStatus,
            receivedOn: formatDateTime(d.downloaded_at || d.created_at || d.document_date),
            isNew: isNew,
            fileSize: formatFileSize(d.size),
            fileFormat: d.mime?.toLowerCase().includes("image") ? "Image" : "PDF",
            source: d.document_source === "SELF_UPLOADED" ? "Self Uploaded" : "Entity Locker",
            hmacVerified: hasPhysicalFile,
            uri: d.uri,
            storagePath: d.storage_path,
            rawDate: rawDate,
            timeline: [
              {
                label: "Request Created",
                time: formatDateTime(consent?.created_at || consent?.consent_created_at || d.created_at),
                completed: true,
              },
              {
                label: "Link Shared",
                time: formatDateTime(consent?.created_at || consent?.consent_created_at || d.created_at),
                completed: true,
              },
              {
                label: "Consent Approved",
                time: formatDateTime(consent?.consent_provided_at || consent?.created_at || d.created_at),
                completed: Boolean(consent?.consent_provided_at || consent?.status === "authorized"),
              },
              {
                label: hasPhysicalFile ? "Documents Fetched" : "Documents Fetching",
                time: formatDateTime(d.downloaded_at || d.created_at),
                completed: hasPhysicalFile,
                processing: !hasPhysicalFile,
              },
              {
                label: hasPhysicalFile ? "Document Available" : "Document Pending",
                time: formatDateTime(d.downloaded_at || d.created_at),
                completed: hasPhysicalFile,
              },
            ],
          });
        });
      }

      // 2. Also map documents nested inside consent requests if any
      consentList.forEach((c) => {
        if (c.documents && Array.isArray(c.documents)) {
          c.documents.forEach((cd) => {
            const key = `${c.entity_id}-${cd.id}`;
            if (!seenDocKeys.has(key)) {
              seenDocKeys.add(key);
              const displayRequestId = `REQ${String(c.consent_id).padStart(6, "0")}`;
              const customerName =
                c.entity_name || c.entity?.entity_name || `Entity (${c.entity_id})`;
              const dateStr = cd.downloaded_at || c.created_at;
              let rawDate: Date | null = null;
              if (dateStr) {
                const parsedD = new Date(dateStr);
                if (!isNaN(parsedD.getTime())) rawDate = parsedD;
              }

              const hasPhysicalFile = Boolean(cd.storage_path || cd.downloaded_at);
              const docType = cd.doctype || cd.type || "KYC";

              transformed.push({
                rawId: cd.id,
                id: displayRequestId,
                consentId: c.consent_id,
                entityId: c.entity_id,
                customerName: customerName,
                docName: cd.name || `${docType} Verification Document`,
                docType: docType,
                status: hasPhysicalFile ? "Available" : "Processing",
                receivedOn: formatDateTime(cd.downloaded_at || c.created_at),
                isNew: false,
                fileSize: formatFileSize(cd.size),
                fileFormat: cd.mime?.toLowerCase().includes("image") ? "Image" : "PDF",
                source: "Entity Locker",
                hmacVerified: hasPhysicalFile,
                storagePath: cd.storage_path,
                rawDate: rawDate,
                timeline: [
                  { label: "Request Created", time: formatDateTime(c.created_at), completed: true },
                  { label: "Link Shared", time: formatDateTime(c.created_at), completed: true },
                  { label: "Consent Approved", time: formatDateTime(c.consent_provided_at || c.created_at), completed: true },
                  { label: "Documents Fetched", time: formatDateTime(cd.downloaded_at || c.created_at), completed: hasPhysicalFile },
                  { label: "Document Available", time: formatDateTime(cd.downloaded_at || c.created_at), completed: hasPhysicalFile },
                ],
              });
            }
          });
        }
      });

      setDocuments(transformed);
      if (transformed.length > 0) {
        setSelectedDoc(transformed[0]);
        setPreviewDocName(transformed[0].docName);
      } else {
        setSelectedDoc(null);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setFetchError(error.message || "Failed to load document records.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocumentsData();
  }, [loadDocumentsData]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedType, startDate, endDate, pageSize]);

  // Filter Logic with Search, Status, Type, and Interactive Calendar Date Range
  const filteredDocuments = useMemo(() => {
    return documents.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.docName.toLowerCase().includes(q) ||
        item.docType.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === "All Status" || item.status.toLowerCase() === selectedStatus.toLowerCase();

      const matchesType =
        selectedType === "All Document Type" || item.docType.toLowerCase() === selectedType.toLowerCase();

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

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [documents, searchQuery, selectedStatus, selectedType, startDate, endDate]);

  // Dynamic Metrics Calculation
  const metrics = useMemo(() => {
    const total = summaryData?.document_request_summary?.total_documents ?? documents.length;
    const available = documents.filter((d) => d.status === "Available").length;
    const processing = documents.filter((d) => d.status === "Processing").length;
    // const failed = documents.filter((d) => d.status === "Failed").length;
    const expired = documents.filter((d) => d.status === "Expired").length;

    return [
      { label: "Total Documents", value: String(total), icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "+24.7% this month", trendUp: true },
      { label: "Available", value: String(available), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", trend: "+22.1% this month", trendUp: true },
      { label: "Processing", value: String(processing), icon: Clock, color: "text-orange-500", bg: "bg-orange-50", trend: "-5.3% this month", trendUp: false },
      // { label: "Failed", value: String(failed), icon: XCircle, color: "text-red-500", bg: "bg-red-50", trend: "-3.2% this month", trendUp: false },
      { label: "Expired", value: String(expired), icon: Download, color: "text-neutral-500", bg: "bg-neutral-50", trend: "-1.8% this month", trendUp: false },
    ];
  }, [summaryData, documents]);

  // Paginated Slices
  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / pageSize));
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocuments.slice(start, start + pageSize);
  }, [filteredDocuments, currentPage, pageSize]);

  // CSV Export Handler
  const handleExportCsv = () => {
    if (filteredDocuments.length === 0) {
      alert("No documents available to export.");
      return;
    }

    const headers = [
      "Request ID",
      "Customer Name",
      "Document Name",
      "Document Type",
      "Status",
      "Received On",
      "File Size",
      "File Format",
      "Source",
      "HMAC Verified",
      "Entity ID",
      "URI",
    ];

    const escapeCsv = (val: string | number | boolean | null | undefined) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [
      headers.join(","),
      ...filteredDocuments.map((item) =>
        [
          escapeCsv(item.id),
          escapeCsv(item.customerName),
          escapeCsv(item.docName),
          escapeCsv(item.docType),
          escapeCsv(item.status),
          escapeCsv(item.receivedOn),
          escapeCsv(item.fileSize),
          escapeCsv(item.fileFormat),
          escapeCsv(item.source),
          escapeCsv(item.hmacVerified ? "Yes" : "No"),
          escapeCsv(item.entityId),
          escapeCsv(item.uri || "-"),
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.href = url;
    link.setAttribute("download", `Documents_List_Report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Document File Download Handler
  const handleDownloadDocument = async (doc: TransformedDocument) => {
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
      alert("Please login again to download documents.");
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadSuccessMsg(null);

      const contentData = await fetchDocumentContent(token, {
        id: doc.rawId,
        uri: doc.uri,
      });

      if (!contentData.base64_content) {
        throw new Error("No file content received for this document.");
      }

      const cleanBase64 = contentData.base64_content.replace(/\s/g, "");
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const mime = normalizeMimeType(contentData.mime, cleanBase64, "application/pdf");
      const blob = new Blob([byteArray], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const ext = contentData.file_extension || (mime.includes("pdf") ? "pdf" : mime.includes("png") ? "png" : "jpg");
      let baseDocName = doc.docName.replace(/[^a-zA-Z0-9_-]/g, "_");
      if (!baseDocName.toLowerCase().endsWith(`.${ext}`)) {
        baseDocName = `${baseDocName}.${ext}`;
      }
      link.href = url;
      link.setAttribute("download", baseDocName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccessMsg(`Downloaded ${doc.docName} successfully!`);
      setTimeout(() => setDownloadSuccessMsg(null), 3500);
    } catch (err: unknown) {
      const error = err as Error;
      alert(`Download failed: ${error.message || "Document file could not be retrieved."}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Processing":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Failed":
        return "bg-red-50 text-red-700 border border-red-200";
      case "Expired":
        return "bg-neutral-50 text-neutral-600 border border-neutral-200";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const openDocumentPreview = (doc: TransformedDocument) => {
    setSelectedDoc(doc);
    setPreviewDocName(doc.docName);
    setIsPreviewOpen(true);
  };

  const previewDocuments = useMemo(() => {
    return documents.slice(0, 6);
  }, [documents]);

  return (
    <div className="p-2 mx-auto space-y-2 animate-fade-in font-manrope">

      {/* Page Title & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-extrabold text-[#10142d] tracking-tight">
            Document List Overview
          </h2>
          <p className="text-[12px] font-semibold text-text-mid mt-0.5">
            Real-time repository of verified DigiDoc entity documents and certificates
          </p>
        </div>
        <button
          onClick={loadDocumentsData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e3e4ee] hover:bg-neutral-50 rounded-[10px] text-[12px] font-bold text-[#10142d] bg-white transition-colors cursor-pointer"
          title="Refresh Documents"
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
              onClick={loadDocumentsData}
              className="text-[11.5px] font-bold underline hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Download Toast Notification */}
      {downloadSuccessMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-[12px] text-green-800 text-[12.5px] font-bold">
          <Check size={16} className="text-green-600 shrink-0" />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* ══════════════ METRICS HEADER PANEL (DYNAMIC) ══════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
        <div className={`${selectedDoc ? "xl:col-span-3" : "xl:col-span-4"} space-y-4 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]`}>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2.5 items-center">

              {/* [OLD CODE - COMMENTED OUT: Static Calendar display]
              <div className="flex items-center gap-2 px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] bg-white cursor-pointer">
                <span>01/05/2024 - 31/05/2024</span>
                <Calendar size={15} className="text-text-mid" />
              </div>
              */}

              {/* Working Interactive Calendar Date Range Filter */}
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
                <option value="Available">Available</option>
                <option value="Processing">Processing</option>
                <option value="Failed">Failed</option>
                <option value="Expired">Expired</option>
              </select>

              {/* Document Type Select Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] bg-white outline-none cursor-pointer"
              >
                <option value="All Document Type">All Document Type</option>
                <option value="KYC">KYC</option>
                <option value="Business Information">Business Information</option>
                <option value="Registration">Registration</option>
                <option value="Tax">Tax</option>
                <option value="Financial">Financial</option>
                <option value="Address">Address</option>
                <option value="Bank Details">Bank Details</option>
                <option value="Loan Document">Loan Document</option>
              </select>

              {/* Search Bar */}
              <div className="relative flex items-center w-[240px] h-[38px] border border-[#e3e4ee] rounded-[10px] focus-within:border-[#1c4dbf]/50 bg-white">
                <Search size={15} className="absolute left-3 text-text-mid" />
                <input
                  type="text"
                  placeholder="Search ID, Customer, File..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-9 pr-3 text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] bg-transparent border-0 outline-none"
                />
              </div>

            </div>

            {/* Action Buttons: Export & (Commented Out) Filters */}
            <div className="flex items-center gap-2">
              {/* [OLD CODE - COMMENTED OUT: Filters button]
              <button className="flex items-center gap-2 px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] hover:bg-neutral-50 cursor-pointer bg-white">
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>
              */}

              {/* Working CSV Export Button */}
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-2 px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] hover:bg-neutral-50 cursor-pointer bg-white transition-colors"
                title="Export Filtered Documents to CSV"
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
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Received On</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-text-mid font-semibold">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw size={24} className="animate-spin text-[#1c4dbf]" />
                        <span>Loading verified documents repository...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-text-mid font-semibold">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText size={28} className="text-neutral-300" />
                        <span>No documents found matching your filter criteria.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedDocuments.map((item, idx) => (
                    <tr
                      key={item.id + item.docName + idx}
                      onClick={() => setSelectedDoc(item)}
                      className={`text-[12.5px] font-semibold text-[#10142d] hover:bg-neutral-50 transition-colors cursor-pointer select-none ${selectedDoc?.docName === item.docName && selectedDoc?.id === item.id ? "bg-blue-50/50" : ""
                        }`}
                    >
                      <td className="py-3.5 px-4 font-extrabold text-[#1c4dbf]">{item.id}</td>
                      <td className="py-3.5 px-4 text-[13px] font-extrabold">{item.customerName}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 font-bold text-[#10142d]">
                          <span>{item.docName}</span>
                          {item.isNew && (
                            <span className="text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 tracking-wide uppercase">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#5e6272]">{item.docType}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[11.5px] font-bold px-2 py-0.5 rounded-[6px] ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5e6272]">{item.receivedOn}</td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">

                          <button
                            disabled={item.status !== "Available" && item.status !== "Expired"}
                            onClick={() => openDocumentPreview(item)}
                            className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${item.status !== "Available" && item.status !== "Expired"
                              ? "text-neutral-300 pointer-events-none"
                              : "text-[#5e6272] hover:text-[#1c4dbf]"
                              }`}
                            title="View Document"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            disabled={item.status !== "Available" || isDownloading}
                            onClick={() => handleDownloadDocument(item)}
                            className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${item.status !== "Available"
                              ? "text-neutral-300 pointer-events-none"
                              : "text-[#5e6272] hover:text-[#1c4dbf]"
                              }`}
                            title="Download Document"
                          >
                            <Download size={15} />
                          </button>

                          <button
                            onClick={() => setSelectedDoc(item)}
                            className="p-1.5 rounded-md hover:bg-neutral-100 text-[#5e6272] transition-colors cursor-pointer shrink-0"
                            title="Show Document Details"
                          >
                            <MoreVertical size={15} />
                          </button>

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
              Showing {filteredDocuments.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredDocuments.length)} of {filteredDocuments.length} entries
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
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px] cursor-pointer ${currentPage === pageNum
                        ? "bg-[#0089CF] text-white"
                        : "border border-[#e3e4ee] hover:bg-neutral-50 text-[#10142d]"
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
        {selectedDoc && (
          <div className="xl:col-span-1 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-5 animate-slide-in-right relative">

            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-text-mid hover:text-[#10142d] hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X size={16} />
            </button>

            {/* Sub-header File info */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-[50px] bg-red-50 text-red-500 rounded-lg flex flex-col items-center justify-center shrink-0 border border-red-100 font-extrabold text-[9px] relative select-none">
                <span className="text-[12px]">📄</span>
                <span className="uppercase text-[8px] font-black -mt-1">{selectedDoc.fileFormat}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[13px] font-extrabold text-[#10142d] tracking-tight leading-tight break-words">
                  {selectedDoc.docName}
                </h4>
                <span className="text-[10px] font-bold text-text-mid mt-0.5">{selectedDoc.fileSize}</span>
                <div className="mt-1">
                  <span className={`inline-block text-[9.5px] font-bold px-1.5 py-0.5 rounded-[5px] ${getStatusBadge(selectedDoc.status)}`}>
                    {selectedDoc.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            {selectedDoc.status === "Available" && (
              <div className="flex gap-3">
                <button
                  onClick={() => openDocumentPreview(selectedDoc)}
                  className="flex-1 h-[36px] bg-[#1c4dbf] hover:bg-[#153ca0] text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5 rounded-[10px] cursor-pointer shadow-sm transition-colors"
                >
                  <Eye size={14} />
                  View Document
                </button>
                <button
                  disabled={isDownloading}
                  onClick={() => handleDownloadDocument(selectedDoc)}
                  className="flex-1 h-[36px] border border-[#e3e4ee] hover:border-[#1c4dbf]/40 hover:bg-neutral-50 rounded-[10px] text-[12.5px] font-bold text-[#10142d] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download size={14} />
                  {isDownloading ? "Downloading..." : "Download"}
                </button>
              </div>
            )}

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 1: Details */}
            <div className="space-y-3">
              <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Details</h5>
              <div className="space-y-2 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Request ID</span>
                  <span className="font-extrabold text-[#10142d]">{selectedDoc.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Customer Name</span>
                  <span className="font-extrabold text-[#10142d] text-right max-w-[170px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {selectedDoc.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Document Type</span>
                  <span className="font-extrabold text-[#10142d]">{selectedDoc.docType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Received On</span>
                  <span className="font-extrabold text-[#10142d]">{selectedDoc.receivedOn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Source</span>
                  <span className="font-extrabold text-[#10142d]">{selectedDoc.source}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-mid font-semibold">HMAC Verified</span>
                  {selectedDoc.hmacVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-[5px] border border-green-200">
                      <CheckCircle2 size={12} className="text-green-600" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-text-mid font-bold">-</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">File Format</span>
                  <span className="font-extrabold text-[#10142d]">{selectedDoc.fileFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">File Size</span>
                  <span className="font-extrabold text-[#10142d]">{selectedDoc.fileSize}</span>
                </div>
              </div>
            </div>

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 2: Document Timeline */}
            <div className="space-y-4">
              <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Document Timeline</h5>
              <div className="relative pl-6 space-y-4.5">

                {/* Vertical line */}
                <div className="absolute top-2 bottom-2 left-2.5 w-[1.5px] bg-[#e3e4ee]" />

                {selectedDoc.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex justify-between items-start text-[12px]">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center z-10 shadow-sm border border-neutral-200 bg-white">
                      {step.completed ? (
                        "error" in step && step.error ? (
                          <XCircle size={12} className="text-red-500" />
                        ) : (
                          <Check size={12} className="text-green-600 stroke-[3px]" />
                        )
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-bold ${step.completed
                        ? "error" in step && step.error
                          ? "text-red-600 font-extrabold"
                          : "text-[#10142d]"
                        : "text-text-mid"
                        }`}>
                        {step.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 shrink-0 whitespace-nowrap pl-2">
                      {step.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ══════════════ DOCUMENT PREVIEW MODAL ══════════════ */}
        {isPreviewOpen && selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10142d]/55 p-6 animate-fade-in">
            <div className="flex h-[82vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_24px_70px_rgba(16,20,45,0.26)]">
              <div className="flex items-start justify-between border-b border-[#e3e4ee] px-5 py-4">
                <div>
                  <h3 className="text-[16px] font-extrabold text-[#0089CF]">View Document</h3>
                  <p className="mt-1 text-[12px] font-semibold text-[#5e6272]">
                    Request ID: {selectedDoc.id}
                    <span className="mx-2 text-[#9094a8]">|</span>
                    Customer: {selectedDoc.customerName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="rounded-md p-1 text-text-mid transition-colors hover:bg-neutral-100 hover:text-[#10142d]"
                  aria-label="Close document preview"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-[300px_minmax(0,1fr)]">
                <aside className="flex min-h-0 flex-col border-r border-[#e3e4ee]">
                  <div className="px-4 py-4">
                    <h4 className="text-[13px] font-extrabold text-[#10142d]">
                      Documents ({previewDocuments.length})
                    </h4>
                  </div>
                  <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
                    {previewDocuments.map((doc) => {
                      const isActive = doc.docName === previewDocName;
                      return (
                        <button
                          key={doc.docName + (doc.rawId || "")}
                          type="button"
                          onClick={() => {
                            setPreviewDocName(doc.docName);
                            setSelectedDoc(doc);
                          }}
                          className={`flex w-full gap-3 rounded-[8px] border p-3 text-left transition-colors cursor-pointer ${isActive
                            ? "border-[#0089CF] bg-[#eef6ff]"
                            : "border-transparent hover:border-[#e3e4ee] hover:bg-neutral-50"
                            }`}
                        >
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[7px] bg-red-50 text-red-500">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-[11.5px] font-extrabold text-[#10142d]">{doc.docName}</span>
                              <span
                                className={`rounded-[5px] px-1.5 py-0.5 text-[9px] font-extrabold ${doc.status === "Processing" ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700"
                                  }`}
                              >
                                {doc.status}
                              </span>
                            </div>
                            <dl className="mt-2 grid grid-cols-[72px_1fr] gap-y-1 text-[10px] font-semibold">
                              <dt className="text-[#5e6272]">Type</dt>
                              <dd className="truncate text-[#10142d]">{doc.docType}</dd>
                              <dt className="text-[#5e6272]">Received On</dt>
                              <dd className="text-[#10142d]">{doc.receivedOn}</dd>
                              <dt className="text-[#5e6272]">Size</dt>
                              <dd className="text-[#10142d]">{doc.fileSize}</dd>
                            </dl>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-[#e3e4ee] p-4">
                    <button
                      onClick={() => handleDownloadDocument(selectedDoc)}
                      className="flex w-full items-center justify-center gap-2 text-[12px] font-extrabold text-[#0089CF] hover:underline cursor-pointer"
                    >
                      <Download size={14} />
                      Download Document
                    </button>
                  </div>
                </aside>

                <section className="flex min-w-0 flex-col p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <h4 className="truncate text-[15px] font-extrabold text-[#10142d]">{previewDocName}</h4>
                      <span className="rounded-[5px] bg-green-50 px-2 py-0.5 text-[10px] font-extrabold text-green-700">
                        {selectedDoc.hmacVerified ? "Verified" : selectedDoc.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadDocument(selectedDoc)}
                        className="flex h-8 items-center gap-2 rounded-[8px] border border-[#e3e4ee] px-3 text-[12px] font-bold text-[#10142d] hover:bg-neutral-50 cursor-pointer"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-hidden rounded-[8px] border border-[#1f2937] bg-[#24282d]">
                    <div className="flex h-9 items-center justify-between bg-[#2f3439] px-4 text-[11px] font-bold text-white/80">
                      <span>{selectedDoc.docName}</span>
                      <span>{selectedDoc.fileFormat}</span>
                      <span>Verified DigiDoc</span>
                    </div>
                    <div className="flex h-[calc(100%-36px)]">
                      <div className="min-w-0 flex-1 overflow-auto bg-[#f8fafc] p-7">
                        <div className="mx-auto min-h-[500px] max-w-[650px] bg-white p-8 shadow-[0_2px_12px_rgba(18,22,46,0.16)] rounded-lg">
                          <div className="flex items-start justify-between border-b border-[#e3e4ee] pb-4">
                            <div className="flex h-12 w-36 items-center justify-center bg-[#0089CF] text-[10px] font-extrabold text-white rounded">
                              Bank of Maharashtra
                            </div>
                            <div className="text-right">
                              <h5 className="text-[13px] font-extrabold text-[#0089CF] uppercase">{selectedDoc.docType}</h5>
                              <p className="text-[10px] text-text-mid font-semibold mt-0.5">DigiDoc Verification Gateway</p>
                            </div>
                          </div>
                          <div className="mt-7 grid grid-cols-2 gap-8 text-[11px] font-semibold text-[#10142d]">
                            <div className="space-y-1">
                              <p className="font-extrabold text-[12.5px] text-[#1c4dbf]">{selectedDoc.customerName}</p>
                              <p>Entity ID: {selectedDoc.entityId}</p>
                              <p>Request Reference: {selectedDoc.id}</p>
                              <p>Source: {selectedDoc.source}</p>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-y-2">
                              <span>Document Name</span><span className="font-bold">{selectedDoc.docName}</span>
                              <span>Document Type</span><span>{selectedDoc.docType}</span>
                              <span>File Format</span><span>{selectedDoc.fileFormat}</span>
                              <span>Received Date</span><span>{selectedDoc.receivedOn}</span>
                              <span>Verification</span><span className="text-green-700 font-extrabold">HMAC Validated</span>
                            </div>
                          </div>
                          <div className="mt-10 p-4 rounded-lg bg-neutral-50 border border-[#e3e4ee] text-[11px]">
                            <p className="font-bold text-[#10142d]">Digital Certification Notice</p>
                            <p className="text-[#5e6272] mt-1 text-[10.5px]">
                              This document record has been digitally acquired via the Entity Locker / DigiDoc secure gateway under explicit customer consent and authenticated for official banking workflows.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(false)}
                      className="h-8 rounded-[8px] border border-[#e3e4ee] px-4 text-[12px] font-bold text-[#10142d] hover:bg-neutral-50 cursor-pointer"
                    >
                      Close
                    </button>
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
