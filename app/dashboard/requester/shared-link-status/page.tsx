"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";

// Mock Links Data
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

export default function SharedLinkStatusPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedLink, setSelectedLink] = useState<typeof MOCK_LINKS[0] | null>(MOCK_LINKS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter Logic
  const filteredLinks = useMemo(() => {
    return MOCK_LINKS.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.linkId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mobile.includes(searchQuery);

      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
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
    <div className="p-2 max-w-[1400px] mx-auto space-y-2 animate-fade-in">
      
      {/* Page Title */}
      <div>
        <h2 className="text-[20px] font-extrabold text-[#10142d] tracking-tight">
          Shared Link Status Overview
        </h2>
      </div>

      {/* ══════════════ METRICS HEADER PANEL ══════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { label: "Total Links Shared", value: "1,248", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "+18.6% this month", trendUp: true },
          { label: "Pending", value: "256", icon: Hourglass, color: "text-orange-500", bg: "bg-orange-50", trend: "-5.3% this month", trendUp: false },
          { label: "Consent Approved", value: "892", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", trend: "+22.1% this month", trendUp: true },
          { label: "Consent Rejected", value: "64", icon: XCircle, color: "text-red-500", bg: "bg-red-50", trend: "-8.7% this month", trendUp: false },
          { label: "Expired", value: "18", icon: Clock, color: "text-neutral-500", bg: "bg-neutral-50", trend: "-2.1% this month", trendUp: false },
          { label: "Failed", value: "18", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", trend: "+3.4% this month", trendUp: true },
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
        <div className={`${selectedLink ? "xl:col-span-3" : "xl:col-span-4"} space-y-4 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]`}>
          
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
                <option value="Consent Approved">Consent Approved</option>
                <option value="Pending">Pending</option>
                <option value="Consent Rejected">Consent Rejected</option>
                <option value="Opened">Opened</option>
                <option value="Expired">Expired</option>
                <option value="Failed">Failed</option>
              </select>

              <div className="relative flex items-center w-[250px] h-[38px] border border-[#e3e4ee] rounded-[10px] focus-within:border-[#1c4dbf]/50 bg-white">
                <Search size={15} className="absolute left-3 text-text-mid" />
                <input
                  type="text"
                  placeholder="Search by Name, Mobile, Request ID, Link"
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
                {filteredLinks.map((item) => (
                  <tr
                    key={item.linkId}
                    onClick={() => setSelectedLink(item)}
                    className={`text-[12.5px] font-semibold text-[#10142d] hover:bg-neutral-50 transition-colors cursor-pointer select-none ${
                      selectedLink?.linkId === item.linkId ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-extrabold text-[#1c4dbf]">{item.id}</td>
                    <td className="py-3.5 px-4 text-[13px] font-extrabold">{item.name}</td>
                    <td className="py-3.5 px-4 text-[#5e6272]">{item.mobile}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-[#10142d]">
                        <span>{item.linkId}</span>
                        <button
                          onClick={(e) => handleCopy(item.linkId, item.linkUrl, e)}
                          className="p-1 rounded hover:bg-neutral-100 text-[#5e6272] transition-colors"
                          title="Copy URL"
                        >
                          {copiedId === item.linkId ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                        </button>
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
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={(e) => handleCopy(item.linkId, item.linkUrl, e)}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-[#5e6272] hover:text-[#1c4dbf] cursor-pointer"
                          title="Copy Link"
                        >
                          <Copy size={15} />
                        </button>

                        <button
                          disabled={item.status === "Consent Approved" || item.status === "Expired" || item.status === "Failed"}
                          onClick={() => alert(`Resending link to ${item.name}`)}
                          className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${
                            item.status === "Consent Approved" || item.status === "Expired" || item.status === "Failed"
                              ? "text-neutral-300 pointer-events-none"
                              : "text-[#5e6272] hover:text-[#1c4dbf]"
                          }`}
                          title="Resend Link"
                        >
                          <Send size={15} />
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
            <span>Showing 1 to {filteredLinks.length} of {filteredLinks.length} entries</span>
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
        {selectedLink && (
          <div className="xl:col-span-1 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-5 animate-slide-in-right relative">
            
            <button
              onClick={() => setSelectedLink(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-text-mid hover:text-[#10142d] hover:bg-neutral-100 transition-colors cursor-pointer"
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
                  <span className="font-extrabold text-[#10142d] overflow-hidden text-ellipsis whitespace-nowrap max-w-[170px]">{selectedLink.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Reference Number</span>
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
                    <button
                      onClick={(e) => handleCopy("drawer-lk", selectedLink.linkUrl, e)}
                      className="p-0.5 hover:bg-neutral-50 rounded text-[#1c4dbf]"
                    >
                      {copiedId === "drawer-lk" ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                    </button>
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
                  <span className="font-extrabold text-[#10142d] text-right max-w-[170px] overflow-hidden text-ellipsis whitespace-nowrap">{selectedLink.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Document Category</span>
                  <span className="font-extrabold text-[#10142d] text-right max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={selectedLink.docCategory}>{selectedLink.docCategory}</span>
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
                  disabled={selectedLink.status === "Consent Approved" || selectedLink.status === "Expired" || selectedLink.status === "Failed"}
                  onClick={() => alert(`Resending link to ${selectedLink.name}`)}
                  className="flex-1 h-[36px] border border-[#e3e4ee] hover:border-[#1c4dbf]/40 hover:bg-neutral-50 rounded-[10px] text-[12.5px] font-bold text-[#10142d] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Send size={13} />
                  Resend Link
                </button>
                <button
                  onClick={(e) => handleCopy("drawer-action", selectedLink.linkUrl, e)}
                  className="flex-1 h-[36px] border border-[#e3e4ee] hover:border-[#1c4dbf]/40 hover:bg-neutral-50 rounded-[10px] text-[12.5px] font-bold text-[#10142d] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === "drawer-action" ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                  Copy Link
                </button>
              </div>
            </div>

            {selectedLink.status === "Consent Approved" && (
              <button
                onClick={() => alert(`Navigating to View Documents for request ${selectedLink.id}`)}
                className="w-full h-[38px] rounded-[10px] bg-[#1c4dbf] hover:bg-[#0089CF] text-white text-[13.5px] font-extrabold transition-all shadow-[0_4px_12px_rgba(28,77,191,0.2)] mt-2 cursor-pointer flex items-center justify-center"
              >
                View Documents
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
