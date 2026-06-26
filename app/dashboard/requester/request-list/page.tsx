"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Hourglass,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
  SlidersHorizontal,
  DownloadCloud,
  Eye,
  Send,
  MoreVertical,
  X,
  Edit2,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

// Mock Requests Data
const MOCK_REQUESTS = [
  {
    id: "REQ123456",
    name: "Rajesh Enterprises",
    mobile: "9876543210",
    email: "rajesh@enterprises.com",
    refNumber: "LN20240528001",
    purpose: "Loan Processing",
    status: "Consent Approved",
    consentDate: "28/05/2024 10:32 AM",
    sharedOn: "28/05/2024 10:15 AM",
    validTill: "27/06/2024",
    documents: [
      { type: "PAN Verification Record", count: 1 },
      { type: "MCA Documents", count: 3 },
      { type: "Udyam Certificate", count: 1 },
      { type: "GST Certificate", count: 2 },
      { type: "Others", count: 4 },
    ]
  },
  {
    id: "REQ123457",
    name: "Shree Traders",
    mobile: "9823456789",
    email: "shree@traders.co.in",
    refNumber: "LN20240531002",
    purpose: "Account Opening",
    status: "Pending",
    consentDate: "-",
    sharedOn: "31/05/2024 11:20 AM",
    validTill: "30/06/2024",
    documents: [
      { type: "Aadhaar Verification Record", count: 1 },
      { type: "GST Certificate", count: 1 },
      { type: "Others", count: 2 },
    ]
  },
  {
    id: "REQ123458",
    name: "ABC Pvt Ltd",
    mobile: "9765432101",
    email: "contact@abcpvt.com",
    refNumber: "LN20240531003",
    purpose: "Loan Processing",
    status: "Consent Rejected",
    consentDate: "31/05/2024 09:30 AM",
    sharedOn: "31/05/2024 09:05 AM",
    validTill: "30/06/2024",
    documents: []
  },
  {
    id: "REQ123459",
    name: "Khandelwal & Co.",
    mobile: "9811122233",
    email: "info@khandelwal.com",
    refNumber: "TF20240530008",
    purpose: "Trade Finance",
    status: "Opened",
    consentDate: "-",
    sharedOn: "30/05/2024 04:18 PM",
    validTill: "29/06/2024",
    documents: [
      { type: "Financial Statements", count: 2 },
      { type: "Import Export Code Record", count: 1 },
    ]
  },
  {
    id: "REQ123460",
    name: "M/s Global Supplies",
    mobile: "9933221100",
    email: "globalsupplies@gmail.com",
    refNumber: "LN20240525005",
    purpose: "Loan Processing",
    status: "Expired",
    consentDate: "-",
    sharedOn: "25/05/2024 02:45 PM",
    validTill: "01/06/2024",
    documents: []
  },
  {
    id: "REQ123461",
    name: "PQR Solutions",
    mobile: "9898989898",
    email: "support@pqrsolutions.com",
    refNumber: "LN20240529014",
    purpose: "Account Opening",
    status: "Failed",
    consentDate: "-",
    sharedOn: "29/05/2024 01:10 PM",
    validTill: "28/06/2024",
    documents: []
  },
  {
    id: "REQ123462",
    name: "NXT Logistics",
    mobile: "9845678901",
    email: "nxtlogistics@nxt.com",
    refNumber: "LN20240527011",
    purpose: "Loan Processing",
    status: "Consent Approved",
    consentDate: "27/05/2024 05:22 PM",
    sharedOn: "27/05/2024 05:02 PM",
    validTill: "26/06/2024",
    documents: [
      { type: "PAN Verification Record", count: 1 },
      { type: "Bank Statement", count: 1 },
    ]
  },
  {
    id: "REQ123463",
    name: "Delta Industries",
    mobile: "9776655443",
    email: "operations@deltaind.com",
    refNumber: "KY20240531091",
    purpose: "KYC Verification",
    status: "Pending",
    consentDate: "-",
    sharedOn: "31/05/2024 03:45 PM",
    validTill: "30/06/2024",
    documents: []
  },
  {
    id: "REQ123464",
    name: "Omkar Textiles",
    mobile: "9867012345",
    email: "accounts@omkartextiles.com",
    refNumber: "LN20240531092",
    purpose: "Loan Processing",
    status: "Consent Approved",
    consentDate: "30/05/2024 01:40 PM",
    sharedOn: "30/05/2024 01:05 PM",
    validTill: "29/06/2024",
    documents: [
      { type: "GST Certificate", count: 1 },
      { type: "Bank Statement", count: 2 },
    ]
  },
  {
    id: "REQ123465",
    name: "Sunrise Agro",
    mobile: "9822019988",
    email: "finance@sunriseagro.in",
    refNumber: "KY20240531093",
    purpose: "KYC Verification",
    status: "Opened",
    consentDate: "-",
    sharedOn: "31/05/2024 04:10 PM",
    validTill: "30/06/2024",
    documents: [
      { type: "PAN Verification Record", count: 1 },
    ]
  }
];

const SAMPLE_DOCUMENTS = [
  {
    name: "HDFC Statement",
    type: "Bank Statement",
    size: "106 KB",
    status: "Verified",
    url: "/samples/docs/hdfc.pdf",
    fileKind: "pdf",
  },
  {
    name: "CIBIL Report",
    type: "Credit Report",
    size: "261 KB",
    status: "Verified",
    url: "/samples/docs/sample_cibil.pdf",
    fileKind: "pdf",
  },
  {
    name: "SBI Statement",
    type: "Bank Statement",
    size: "78 KB",
    status: "Verified",
    url: "/samples/docs/sbi.pdf",
    fileKind: "pdf",
  },
  {
    name: "Identity Document",
    type: "Image File",
    size: "134 KB",
    status: "Verified",
    url: "/samples/files/1.jpg",
    fileKind: "image",
  },
];

export default function RequestListPage() {
  const router = useRouter();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Selected Request for Right Drawer (Default first row selected)
  const [selectedRequest, setSelectedRequest] = useState<typeof MOCK_REQUESTS[0] | null>(MOCK_REQUESTS[0]);
  const [isDocumentsPreviewOpen, setIsDocumentsPreviewOpen] = useState(false);
  const [selectedSampleDocument, setSelectedSampleDocument] = useState(SAMPLE_DOCUMENTS[0]);

  // Filter Logic
  const filteredRequests = useMemo(() => {
    return MOCK_REQUESTS.filter((req) => {
      const matchesSearch =
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.mobile.includes(searchQuery);

      const matchesStatus =
        selectedStatus === "All Status" || req.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

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
  const getDateOnly = (dateTime: string) => dateTime === "-" ? "-" : dateTime.split(" ")[0];
  const getSampleFileExtension = (url: string) => url.split(".").pop()?.toUpperCase() ?? "FILE";
  const openDocumentsPreview = () => {
    setSelectedSampleDocument(SAMPLE_DOCUMENTS[0]);
    setIsDocumentsPreviewOpen(true);
  };

  return (
    <div className="p-2 max-w-[1400px] mx-auto space-y-2 animate-fade-in">
      
      {/* Page Title Header */}
      <div>
        <h2 className="text-[18px] font-extrabold text-[#0089CF] tracking-tight">
          Requester Overview
        </h2>
      </div>

      {/* ══════════════ METRICS HEADER PANEL ══════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { label: "Total Requests", value: "1,248", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending", value: "256", icon: Hourglass, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Consent Approved", value: "892", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Consent Rejected", value: "64", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
          { label: "Expired", value: "18", icon: Clock, color: "text-neutral-500", bg: "bg-neutral-50" },
          { label: "Docs Downloaded", value: "2,157", icon: Download, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-[#e3e4ee] rounded-[16px] p-4 flex items-start gap-2.5 shadow-[0_2px_8px_rgba(18,22,46,0.015)]">
              <div className={`w-9 h-9 rounded-[10px] ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon size={16} />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-[10px] font-bold text-text-mid uppercase tracking-wide leading-tight">{item.label}</span>
                <span className="text-[20px] font-extrabold text-[#10142d] mt-1.5 leading-none">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════ MAIN WORKSPACE: SPLIT GRID ══════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 items-stretch">
        
        {/* Table Column (75% or 100% width) */}
        <div className={`${selectedRequest ? "xl:col-span-3" : "xl:col-span-4"} h-full space-y-4 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]`}>
          
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 items-center justify-between border-b border-[#e3e4ee] pb-4">
            <div className="flex flex-1 min-w-0 flex-wrap gap-2.5 items-center">
              {/* Date Range Picker Placeholder */}
              <div className="flex items-center gap-2 px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] cursor-pointer bg-white">
                <span>01/05/2024 - 31/05/2024</span>
                <Calendar size={15} className="text-text-mid" />
              </div>

              {/* Status Filter */}
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
              <div className="relative flex min-w-[240px] flex-1 items-center h-[38px] border border-[#e3e4ee] rounded-[10px] focus-within:border-[#1c4dbf]/50 bg-white">
                <Search size={15} className="absolute left-3 text-text-mid" />
                <input
                  type="text"
                  placeholder="Search by Name, Mobile, Request ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-9 pr-3 text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] bg-transparent border-0 outline-none"
                />
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
              <button className="flex items-center gap-2 px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] hover:bg-neutral-50 cursor-pointer bg-white">
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>
              <button className="flex items-center gap-2 px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] hover:bg-neutral-50 cursor-pointer bg-white">
                <DownloadCloud size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e3e4ee] text-[10.5px] font-bold text-text-mid uppercase text-left whitespace-nowrap">
                  <th className="py-2.5 px-3">Request ID</th>
                  <th className="py-2.5 px-3">Customer Name</th>
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
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`text-[11.5px] font-semibold text-[#10142d] hover:bg-neutral-50 transition-colors cursor-pointer select-none whitespace-nowrap ${
                      selectedRequest?.id === req.id ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <td className="py-2.5 px-3 font-extrabold text-[#0089CF]">{req.id}</td>
                    <td className="py-2.5 px-3 font-extrabold">{req.name}</td>
                    <td className="py-2.5 px-3 text-[#5e6272]">{req.mobile}</td>
                    <td className="py-2.5 px-3 text-[#5e6272]">{req.purpose}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] ${getStatusBadge(req.status)}`}>
                        {getStatusLabel(req.status)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#5e6272]">{getDateOnly(req.consentDate)}</td>
                    <td className="py-2.5 px-3 text-[#5e6272]">{getDateOnly(req.sharedOn)}</td>
                    <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        
                        {/* Action View */}
                        <button
                          disabled={req.status === "Pending"}
                          onClick={() => setSelectedRequest(req)}
                          className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${
                            req.status === "Pending" ? "text-neutral-300 pointer-events-none" : "text-[#5e6272] hover:text-[#1c4dbf]"
                          }`}
                          title="View Request"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Action Resend */}
                        <button
                          disabled={req.status === "Consent Approved" || req.status === "Expired" || req.status === "Failed"}
                          onClick={() => alert(`Consent link resent to ${req.name}`)}
                          className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${
                            req.status === "Consent Approved" || req.status === "Expired" || req.status === "Failed"
                              ? "text-neutral-300 pointer-events-none"
                              : "text-[#5e6272] hover:text-[#1c4dbf]"
                          }`}
                          title="Resend Link"
                        >
                          <Send size={15} />
                        </button>

                        {/* Action Download */}
                        <button
                          disabled={req.status !== "Consent Approved"}
                          onClick={() => alert(`Downloading documents for ${req.id}`)}
                          className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${
                            req.status !== "Consent Approved" ? "text-neutral-300 pointer-events-none" : "text-[#5e6272] hover:text-[#1c4dbf]"
                          }`}
                          title="Download Documents"
                        >
                          <Download size={15} />
                        </button>

                        <button className="p-1.5 rounded-md hover:bg-neutral-100 text-[#5e6272] transition-colors cursor-pointer shrink-0">
                          <MoreVertical size={15} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-text-mid font-semibold italic">
                      No requests found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-4 text-[13px] font-bold text-text-mid">
            <span>
              Showing {filteredRequests.length > 0 ? 1 : 0} to {filteredRequests.length} of {filteredRequests.length} entries
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer transition-colors">&lt;</button>
                <button className="w-8 h-8 rounded-lg bg-[#0089CF] text-white flex items-center justify-center shadow-sm">1</button>
                <button className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer transition-colors">2</button>
                <button className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer transition-colors">3</button>
                <button className="w-8 h-8 rounded-lg border border-[#e3e4ee] flex items-center justify-center select-none opacity-50">...</button>
                <button className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer transition-colors">156</button>
                <button className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer transition-colors">&gt;</button>
              </div>
              <select className="px-2 h-[34px] border border-[#e3e4ee] rounded-[8px] bg-white outline-none cursor-pointer">
                <option>10 / page</option>
                <option>25 / page</option>
                <option>50 / page</option>
              </select>
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
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[5px] ${getStatusBadge(selectedRequest.status)}`}>
                  {getStatusLabel(selectedRequest.status)}
                </span>
              </div>
            </div>

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 1: Customer Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Customer Details</h5>
                <button className="p-1 hover:bg-neutral-50 rounded-md text-text-mid hover:text-[#1c4dbf] cursor-pointer">
                  <Edit2 size={13} />
                </button>
              </div>
              <div className="space-y-2 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Name</span>
                  <span className="font-extrabold text-[#10142d]">{selectedRequest.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Mobile Number</span>
                  <span className="font-extrabold text-[#10142d]">{selectedRequest.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Email ID</span>
                  <span className="font-extrabold text-[#10142d]">{selectedRequest.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Reference Number</span>
                  <span className="font-extrabold text-[#10142d]">{selectedRequest.refNumber}</span>
                </div>
              </div>
            </div>

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 2: Request Details */}
            <div className="space-y-3">
              <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Request Details</h5>
              <div className="space-y-2 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Purpose</span>
                  <span className="font-extrabold text-[#10142d]">{selectedRequest.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Consent Valid Till</span>
                  <span className="font-extrabold text-[#10142d]">{selectedRequest.validTill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Shared On</span>
                  <span className="font-extrabold text-[#10142d]">{selectedRequest.sharedOn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Consent Date &amp; Time</span>
                  <span className="font-extrabold text-[#10142d]">{selectedRequest.consentDate}</span>
                </div>
              </div>
            </div>

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 3: Documents Checklist */}
            <div className="space-y-3">
              <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Documents</h5>
              {selectedRequest.documents && selectedRequest.documents.length > 0 ? (
                <div className="max-h-[142px] space-y-2.5 overflow-y-auto pr-1">
                  {selectedRequest.documents.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#f8fafc] border border-neutral-100 rounded-[10px] p-2.5">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-[#10142d]">
                        <FileText size={15} className="text-[#0089CF] shrink-0" />
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">{doc.type}</span>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-[#e6f4fc] text-[#0089CF] text-[10px] font-extrabold flex items-center justify-center shrink-0">
                        {doc.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed border-[#e3e4ee] rounded-[10px] bg-neutral-50/50">
                  <span className="text-[11.5px] font-semibold text-text-mid italic">No documents collected yet</span>
                </div>
              )}
            </div>

            {/* Drawer Action Button */}
            {selectedRequest.status === "Consent Approved" && (
              <button
                onClick={openDocumentsPreview}
                className="w-full h-[38px] rounded-[10px] bg-[#0089CF] hover:bg-[#153ca0] text-white text-[13.5px] font-extrabold transition-all shadow-[0_4px_12px_rgba(28,77,191,0.2)] hover:shadow-[0_6px_18px_rgba(28,77,191,0.3)] mt-2 cursor-pointer flex items-center justify-center"
              >
                View Documents
              </button>
            )}

            </div>
          </div>
        )}

        {isDocumentsPreviewOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10142d]/55 p-6">
            <div className="flex h-[82vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_24px_70px_rgba(16,20,45,0.26)]">
              <div className="flex items-start justify-between border-b border-[#e3e4ee] px-5 py-4">
                <div>
                  <h3 className="text-[16px] font-extrabold text-[#0089CF]">View Documents</h3>
                  <p className="mt-1 text-[12px] font-semibold text-[#5e6272]">
                    Request ID: {selectedRequest.id}
                    <span className="mx-2 text-[#9094a8]">|</span>
                    Customer: {selectedRequest.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDocumentsPreviewOpen(false)}
                  className="rounded-md p-1 text-text-mid transition-colors hover:bg-neutral-100 hover:text-[#10142d]"
                  aria-label="Close document preview"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-[300px_minmax(0,1fr)]">
                <aside className="flex min-h-0 flex-col border-r border-[#e3e4ee]">
                  <div className="px-4 py-4">
                    <h4 className="text-[13px] font-extrabold text-[#0089CF]">
                      Documents ({SAMPLE_DOCUMENTS.length})
                    </h4>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                    {SAMPLE_DOCUMENTS.map((doc, idx) => {
                      const isActive = doc.url === selectedSampleDocument.url;

                      return (
                        <div key={doc.url} className={idx > 0 ? "border-t border-[#e3e4ee] pt-2 mt-2" : ""}>
                        <button
                          type="button"
                          onClick={() => setSelectedSampleDocument(doc)}
                          className={`flex w-full gap-3 rounded-[8px] border p-3 text-left transition-colors ${
                            isActive
                              ? "border-[#0089CF] bg-[#eef6ff]"
                              : "border-transparent hover:border-[#e3e4ee] hover:bg-neutral-50"
                          }`}
                        >
                          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-[7px] ${
                            doc.fileKind === "image" ? "bg-purple-50 text-purple-600" : "bg-red-50 text-red-500"
                          }`}>
                            {doc.fileKind === "image" ? <ImageIcon size={18} /> : <FileText size={18} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-[11.5px] font-extrabold text-[#10142d]">{doc.name}</span>
                              <span className="rounded-[5px] bg-green-50 px-1.5 py-0.5 text-[9px] font-extrabold text-green-700">
                                {doc.status}
                              </span>
                            </div>
                            <dl className="mt-2 grid grid-cols-[72px_1fr] gap-y-1 text-[10px] font-semibold">
                              <dt className="text-[#5e6272]">Type</dt>
                              <dd className="truncate text-[#10142d]">{doc.type}</dd>
                              <dt className="text-[#5e6272]">Format</dt>
                              <dd className="text-[#10142d]">{getSampleFileExtension(doc.url)}</dd>
                              <dt className="text-[#5e6272]">Received On</dt>
                              <dd className="text-[#10142d]">{getDateOnly(selectedRequest.consentDate)}</dd>
                              <dt className="text-[#5e6272]">Size</dt>
                              <dd className="text-[#10142d]">{doc.size}</dd>
                            </dl>
                          </div>
                        </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-[#e3e4ee] p-4">
                    <a
                      href={selectedSampleDocument.url}
                      download
                      className="flex w-full items-center justify-center gap-2 text-[12px] font-extrabold text-[#0089CF]"
                    >
                      <Download size={14} />
                      Download Selected
                    </a>
                  </div>
                </aside>

                <section className="flex min-w-0 flex-col p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <h4 className="truncate text-[15px] font-extrabold text-[#0089CF]">
                        {selectedSampleDocument.name}
                      </h4>
                      <span className="rounded-[5px] bg-green-50 px-2 py-0.5 text-[10px] font-extrabold text-green-700">
                        {selectedSampleDocument.status}
                      </span>
                    </div>
                    <a
                      href={selectedSampleDocument.url}
                      download
                      className="flex h-8 items-center gap-2 rounded-[8px] border border-[#e3e4ee] px-3 text-[12px] font-bold text-[#10142d] hover:bg-neutral-50"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>

                  <div className="min-h-0 flex-1 overflow-hidden rounded-[8px] border border-[#e3e4ee] bg-[#f8fafc]">
                    {selectedSampleDocument.fileKind === "pdf" ? (
                      <iframe
                        title={selectedSampleDocument.name}
                        src={selectedSampleDocument.url}
                        className="h-full w-full border-0 bg-white"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center overflow-auto p-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedSampleDocument.url}
                          alt={selectedSampleDocument.name}
                          className="max-h-full max-w-full rounded-[8px] object-contain shadow-[0_2px_12px_rgba(18,22,46,0.16)]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsDocumentsPreviewOpen(false)}
                      className="h-8 rounded-[8px] border border-[#e3e4ee] px-4 text-[12px] font-bold text-[#10142d] hover:bg-neutral-50"
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
