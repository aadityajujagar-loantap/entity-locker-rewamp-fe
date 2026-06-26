"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";

// Mock Documents Data
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

export default function DocumentListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedType, setSelectedType] = useState("All Document Type");
  const [selectedDoc, setSelectedDoc] = useState<typeof MOCK_DOCUMENTS[0] | null>(MOCK_DOCUMENTS[0]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDocName, setPreviewDocName] = useState(MOCK_DOCUMENTS[0].docName);

  // Filter Logic
  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.docName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;

      const matchesType =
        selectedType === "All Document Type" || item.docType === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, selectedStatus, selectedType]);

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

  const openDocumentPreview = (doc: typeof MOCK_DOCUMENTS[0]) => {
    setSelectedDoc(doc);
    setPreviewDocName(doc.docName);
    setIsPreviewOpen(true);
  };

  const previewDocuments = useMemo(() => {
    const fallbackDocs = [
      { docName: "ITR AY 2022-23", docType: "Income Tax Return", fileSize: "1.2 MB", status: "Verified" },
      { docName: "PAN Card", docType: "Identity Proof", fileSize: "512 KB", status: "Verified" },
      { docName: "GST Certificate", docType: "GST Certificate", fileSize: "420 KB", status: "Verified" },
      { docName: "Board Resolution", docType: "Legal Document", fileSize: "-", status: "Pending" },
      { docName: "Cancelled Cheque", docType: "Bank Document", fileSize: "312 KB", status: "Verified" },
    ];

    const current = selectedDoc
      ? {
          docName: selectedDoc.docName,
          docType: selectedDoc.docType,
          fileSize: selectedDoc.fileSize,
          status: selectedDoc.hmacVerified ? "Verified" : selectedDoc.status,
        }
      : {
          docName: MOCK_DOCUMENTS[0].docName,
          docType: MOCK_DOCUMENTS[0].docType,
          fileSize: MOCK_DOCUMENTS[0].fileSize,
          status: "Verified",
        };

    return [current, ...fallbackDocs.filter((doc) => doc.docName !== current.docName)].slice(0, 6);
  }, [selectedDoc]);

  return (
    <div className="p-2 max-w-[1400px] mx-auto space-y-2 animate-fade-in">
      
      {/* Page Title */}
      <div>
        <h2 className="text-[20px] font-extrabold text-[#10142d] tracking-tight">
          Document List Overview
        </h2>
      </div>

      {/* ══════════════ METRICS HEADER PANEL ══════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Documents", value: "5,842", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "+24.7% this month", trendUp: true },
          { label: "Available", value: "5,216", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", trend: "+22.1% this month", trendUp: true },
          { label: "Processing", value: "256", icon: Clock, color: "text-orange-500", bg: "bg-orange-50", trend: "-5.3% this month", trendUp: false },
          { label: "Failed", value: "64", icon: XCircle, color: "text-red-500", bg: "bg-red-50", trend: "-3.2% this month", trendUp: false },
          { label: "Expired", value: "306", icon: Download, color: "text-neutral-500", bg: "bg-neutral-50", trend: "-1.8% this month", trendUp: false },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-[#e3e4ee] rounded-[16px] p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(18,22,46,0.015)]">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-[10px] ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon size={16} />
              </div>
              <span className="text-[10px] font-bold text-text-mid uppercase tracking-wide leading-tight">{item.label}</span>
            </div>
            <div className="mt-3">
              <span className="text-[20px] font-extrabold text-[#10142d] leading-none">{item.value}</span>
              <p className={`text-[9.5px] font-bold mt-1 leading-none ${item.trendUp ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                {item.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════ SPLIT WORKSPACE ══════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 items-start">
        
        {/* Table Area */}
        <div className={`${selectedDoc ? "xl:col-span-3" : "xl:col-span-4"} space-y-4 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]`}>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2.5 items-center">
              
              <div className="flex items-center gap-2 px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] bg-white cursor-pointer">
                <span>01/05/2024 - 31/05/2024</span>
                <Calendar size={15} className="text-text-mid" />
              </div>

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

              <div className="relative flex items-center w-[240px] h-[38px] border border-[#e3e4ee] rounded-[10px] focus-within:border-[#1c4dbf]/50 bg-white">
                <Search size={15} className="absolute left-3 text-text-mid" />
                <input
                  type="text"
                  placeholder="Search Request ID, Customer, File..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-9 pr-3 text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] bg-transparent border-0 outline-none"
                />
              </div>

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
                {filteredDocuments.map((item, idx) => (
                  <tr
                    key={item.id + item.docName + idx}
                    onClick={() => setSelectedDoc(item)}
                    className={`text-[12.5px] font-semibold text-[#10142d] hover:bg-neutral-50 transition-colors cursor-pointer select-none ${
                      selectedDoc?.docName === item.docName && selectedDoc?.id === item.id ? "bg-blue-50/50" : ""
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
                          onClick={() => setSelectedDoc(item)}
                          className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${
                            item.status !== "Available" && item.status !== "Expired" ? "text-neutral-300 pointer-events-none" : "text-[#5e6272] hover:text-[#1c4dbf]"
                          }`}
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          disabled={item.status !== "Available"}
                          onClick={() => alert(`Downloading ${item.docName}`)}
                          className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${
                            item.status !== "Available" ? "text-neutral-300 pointer-events-none" : "text-[#5e6272] hover:text-[#1c4dbf]"
                          }`}
                          title="Download File"
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
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-4 text-[13px] font-bold text-text-mid">
            <span>Showing 1 to {filteredDocuments.length} of {filteredDocuments.length} entries</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer">&lt;</button>
                <button className="w-8 h-8 rounded-lg bg-[#0089CF] text-white flex items-center justify-center">1</button>
                <button className="w-8 h-8 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer">&gt;</button>
              </div>
              <select className="px-2 h-[34px] border border-[#e3e4ee] rounded-[8px] bg-white outline-none cursor-pointer">
                <option>10 / page</option>
              </select>
            </div>
          </div>

        </div>

        {/* Details Panel Drawer */}
        {selectedDoc && (
          <div className="xl:col-span-1 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-5 animate-slide-in-right relative">
            
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-text-mid hover:text-[#10142d] hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Sub-header File info */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-[50px] bg-red-50 text-red-500 rounded-lg flex flex-col items-center justify-center shrink-0 border border-red-100 font-extrabold text-[9px] relative select-none">
                <span className="text-[12px]">📄</span>
                <span className="uppercase text-[8px] font-black -mt-1">PDF</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[13px] font-extrabold text-[#10142d] tracking-tight leading-tight break-words">
                  {selectedDoc.docName}.pdf
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
                  className="flex-1 h-[36px] bg-[#1c4dbf] hover:bg-[#153ca0] text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5 rounded-[10px] cursor-pointer shadow-sm"
                >
                  <Eye size={14} />
                  View Document
                </button>
                <button
                  onClick={() => alert(`Downloading ${selectedDoc.docName}.pdf`)}
                  className="flex-1 h-[36px] border border-[#e3e4ee] hover:border-[#1c4dbf]/40 hover:bg-neutral-50 rounded-[10px] text-[12.5px] font-bold text-[#10142d] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  Download
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
                  <span className="font-extrabold text-[#10142d] text-right max-w-[170px] overflow-hidden text-ellipsis whitespace-nowrap">{selectedDoc.customerName}</span>
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
                      <span className={`font-bold ${step.completed ? ("error" in step && step.error ? "text-red-600 font-extrabold" : "text-[#10142d]") : "text-text-mid"}`}>
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

        {isPreviewOpen && selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10142d]/55 p-6">
            <div className="flex h-[82vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_24px_70px_rgba(16,20,45,0.26)]">
              <div className="flex items-start justify-between border-b border-[#e3e4ee] px-5 py-4">
                <div>
                  <h3 className="text-[16px] font-extrabold text-[#0089CF]">View Documents</h3>
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
                    <h4 className="text-[13px] font-extrabold text-[#10142d]">Documents ({previewDocuments.length})</h4>
                  </div>
                  <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
                    {previewDocuments.map((doc) => {
                      const isActive = doc.docName === previewDocName;
                      return (
                        <button
                          key={doc.docName}
                          type="button"
                          onClick={() => setPreviewDocName(doc.docName)}
                          className={`flex w-full gap-3 rounded-[8px] border p-3 text-left transition-colors ${
                            isActive
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
                              <span className={`rounded-[5px] px-1.5 py-0.5 text-[9px] font-extrabold ${
                                doc.status === "Pending" ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700"
                              }`}>
                                {doc.status}
                              </span>
                            </div>
                            <dl className="mt-2 grid grid-cols-[72px_1fr] gap-y-1 text-[10px] font-semibold">
                              <dt className="text-[#5e6272]">Type</dt>
                              <dd className="truncate text-[#10142d]">{doc.docType}</dd>
                              <dt className="text-[#5e6272]">Received On</dt>
                              <dd className="text-[#10142d]">{selectedDoc.receivedOn}</dd>
                              <dt className="text-[#5e6272]">Size</dt>
                              <dd className="text-[#10142d]">{doc.fileSize}</dd>
                            </dl>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-[#e3e4ee] p-4">
                    <button className="flex w-full items-center justify-center gap-2 text-[12px] font-extrabold text-[#0089CF]">
                      <Download size={14} />
                      Download All
                    </button>
                  </div>
                </aside>

                <section className="flex min-w-0 flex-col p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <h4 className="truncate text-[15px] font-extrabold text-[#10142d]">{previewDocName}</h4>
                      <span className="rounded-[5px] bg-green-50 px-2 py-0.5 text-[10px] font-extrabold text-green-700">
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex h-8 items-center gap-2 rounded-[8px] border border-[#e3e4ee] px-3 text-[12px] font-bold text-[#10142d] hover:bg-neutral-50">
                        <Download size={14} />
                        Download
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-[8px] border border-[#e3e4ee] text-[#5e6272] hover:bg-neutral-50">
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-hidden rounded-[8px] border border-[#1f2937] bg-[#24282d]">
                    <div className="flex h-9 items-center justify-between bg-[#2f3439] px-4 text-[11px] font-bold text-white/80">
                      <span>Page 1 / 3</span>
                      <span>100%</span>
                      <span>Download</span>
                    </div>
                    <div className="flex h-[calc(100%-36px)]">
                      <div className="w-[104px] shrink-0 space-y-4 overflow-y-auto bg-[#202428] p-4">
                        {[1, 2, 3].map((page) => (
                          <div key={page} className={`mx-auto h-[104px] w-[72px] rounded-sm border ${page === 1 ? "border-[#0089CF]" : "border-white/20"} bg-white p-1`}>
                            <div className="mb-1 h-3 w-8 bg-[#0089CF]" />
                            <div className="space-y-1">
                              <div className="h-1 w-full bg-neutral-200" />
                              <div className="h-1 w-10/12 bg-neutral-200" />
                              <div className="h-1 w-8/12 bg-neutral-200" />
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-1">
                              <div className="h-8 bg-neutral-100" />
                              <div className="h-8 bg-neutral-100" />
                            </div>
                            <div className="mt-1 text-center text-[8px] font-bold text-[#10142d]">{page}</div>
                          </div>
                        ))}
                      </div>

                      <div className="min-w-0 flex-1 overflow-auto bg-[#f8fafc] p-7">
                        <div className="mx-auto min-h-[640px] max-w-[650px] bg-white p-8 shadow-[0_2px_12px_rgba(18,22,46,0.16)]">
                          <div className="flex items-start justify-between">
                            <div className="flex h-12 w-36 items-center justify-center bg-[#0089CF] text-[10px] font-extrabold text-white">
                              Bank of Maharashtra
                            </div>
                            <h5 className="text-[13px] font-extrabold text-[#0089CF]">STATEMENT OF ACCOUNT</h5>
                          </div>
                          <div className="mt-7 grid grid-cols-2 gap-8 text-[11px] font-semibold text-[#10142d]">
                            <div className="space-y-1">
                              <p>{selectedDoc.customerName}</p>
                              <p>123, MG Road</p>
                              <p>Pune - 411001</p>
                              <p>Maharashtra, India</p>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-y-2">
                              <span>Account Number</span><span>6012 3456 7890</span>
                              <span>Customer ID</span><span>CUST123456</span>
                              <span>Account Type</span><span>Current Account</span>
                              <span>Statement Period</span><span>01/01/2024 to 31/01/2024</span>
                              <span>Currency</span><span>INR</span>
                            </div>
                          </div>
                          <h6 className="mt-8 text-[12px] font-extrabold text-[#0089CF]">Account Summary</h6>
                          <table className="mt-3 w-full border-collapse text-[10px]">
                            <tbody>
                              {[
                                ["Opening Balance", "Rs 12,45,678.00", "Total Debits", "Rs 22,35,456.00"],
                                ["Total Credits", "Rs 25,67,890.00", "Closing Balance", "Rs 15,78,112.00"],
                              ].map((row) => (
                                <tr key={row.join("-")}>
                                  {row.map((cell) => (
                                    <td key={cell} className="border border-[#e3e4ee] px-3 py-2 font-semibold">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <h6 className="mt-8 text-[12px] font-extrabold text-[#0089CF]">Transaction Details</h6>
                          <table className="mt-3 w-full border-collapse text-[9.5px]">
                            <thead className="bg-[#f4f7fe]">
                              <tr>
                                {["Date", "Description", "Ref No", "Debit", "Credit", "Balance"].map((heading) => (
                                  <th key={heading} className="border border-[#e3e4ee] px-2 py-2 text-left font-extrabold">{heading}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                ["01/01/2024", "Opening Balance", "-", "-", "-", "12,45,678.00"],
                                ["03/01/2024", "NEFT from ABC Pvt Ltd", "ABN123456789", "-", "5,00,000.00", "17,45,678.00"],
                                ["05/01/2024", "Cheque Paid to John & Co.", "000123", "1,25,000.00", "-", "16,20,678.00"],
                                ["07/01/2024", "RTGS to XYZ Suppliers", "ICICR420240107123", "2,00,000.00", "-", "14,20,678.00"],
                                ["10/01/2024", "Cash Deposit", "-", "-", "1,50,000.00", "15,70,678.00"],
                              ].map((row) => (
                                <tr key={row.join("-")}>
                                  {row.map((cell) => (
                                    <td key={cell} className="border border-[#e3e4ee] px-2 py-2">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(false)}
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
