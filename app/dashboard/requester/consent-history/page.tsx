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
  Smartphone,
  Mail,
  MessageCircle,
} from "lucide-react";

// Mock Consent History Data
const MOCK_HISTORY = [
  {
    id: "REQ123456",
    name: "Rajesh Enterprises",
    mobile: "9876543210",
    email: "rajesh@enterprises.com",
    refNumber: "LN20240528001",
    linkId: "LK-9823A1B2",
    linkUrl: "https://mahabank.elocker.in/consent/abc123def456",
    status: "Approved",
    consentDate: "28/05/2024 10:32 AM",
    channel: "SMS",
    sharedOn: "28/05/2024 10:15 AM",
    validTill: "04/06/2024 10:15 AM",
    purpose: "Loan Processing",
    docCategory: "KYC, Income Proof, Bank Statements",
    timeline: [
      { label: "Link Shared", time: "28/05/2024 10:15 AM", completed: true },
      { label: "Link Delivered", time: "28/05/2024 10:15 AM", completed: true },
      { label: "Link Opened", time: "28/05/2024 10:21 AM", completed: true },
      { label: "Consent Approved", time: "28/05/2024 10:32 AM", completed: true },
      { label: "Documents Available", time: "28/05/2024 10:33 AM", completed: true },
    ]
  },
  {
    id: "REQ123457",
    name: "Shree Traders",
    mobile: "9823456789",
    email: "shree@traders.co.in",
    refNumber: "LN20240531002",
    linkId: "LK-7F91C2D3",
    linkUrl: "https://mahabank.elocker.in/consent/xyz789lmn012",
    status: "Pending",
    consentDate: "-",
    channel: "Email",
    sharedOn: "31/05/2024 11:20 AM",
    validTill: "07/06/2024 11:20 AM",
    purpose: "Account Opening",
    docCategory: "KYC, GST Record",
    timeline: [
      { label: "Link Shared", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Link Delivered", time: "31/05/2024 11:20 AM", completed: true },
      { label: "Link Opened", time: "-", completed: false },
      { label: "Consent Approved", time: "-", completed: false },
      { label: "Documents Available", time: "-", completed: false },
    ]
  },
  {
    id: "REQ123458",
    name: "ABC Pvt Ltd",
    mobile: "9765432101",
    email: "contact@abcpvt.com",
    refNumber: "LN20240531003",
    linkId: "LK-3D21E4F5",
    linkUrl: "https://mahabank.elocker.in/consent/qwe345rty678",
    status: "Rejected",
    consentDate: "31/05/2024 09:30 AM",
    channel: "WhatsApp",
    sharedOn: "31/05/2024 09:05 AM",
    validTill: "07/06/2024 09:05 AM",
    purpose: "Loan Processing",
    docCategory: "Corporate Registration, PAN",
    timeline: [
      { label: "Link Shared", time: "31/05/2024 09:05 AM", completed: true },
      { label: "Link Delivered", time: "31/05/2024 09:05 AM", completed: true },
      { label: "Link Opened", time: "31/05/2024 09:12 AM", completed: true },
      { label: "Consent Rejected", time: "31/05/2024 09:30 AM", completed: true, error: true },
    ]
  },
  {
    id: "REQ123459",
    name: "Khandelwal & Co.",
    mobile: "9811122233",
    email: "info@khandelwal.com",
    refNumber: "TF20240530008",
    linkId: "LK-5G32H6I7",
    linkUrl: "https://mahabank.elocker.in/consent/asd567fgh890",
    status: "Opened",
    consentDate: "-",
    channel: "SMS",
    sharedOn: "30/05/2024 04:18 PM",
    validTill: "06/06/2024 04:18 PM",
    purpose: "Trade Finance",
    docCategory: "Financial Statements",
    timeline: [
      { label: "Link Shared", time: "30/05/2024 04:18 PM", completed: true },
      { label: "Link Delivered", time: "30/05/2024 04:18 PM", completed: true },
      { label: "Link Opened", time: "30/05/2024 05:01 PM", completed: true },
      { label: "Consent Approved", time: "-", completed: false },
      { label: "Documents Available", time: "-", completed: false },
    ]
  },
  {
    id: "REQ123460",
    name: "M/s Global Supplies",
    mobile: "9933221100",
    email: "globalsupplies@gmail.com",
    refNumber: "LN20240525005",
    linkId: "LK-8J43K7L8",
    linkUrl: "https://mahabank.elocker.in/consent/zxc098vbn765",
    status: "Expired",
    consentDate: "-",
    channel: "Email",
    sharedOn: "25/05/2024 02:45 PM",
    validTill: "01/06/2024 02:45 PM",
    purpose: "Loan Processing",
    docCategory: "ITR, Bank Statement",
    timeline: [
      { label: "Link Shared", time: "25/05/2024 02:45 PM", completed: true },
      { label: "Link Delivered", time: "25/05/2024 02:45 PM", completed: true },
      { label: "Link Expired", time: "01/06/2024 02:45 PM", completed: true, error: true },
    ]
  },
  {
    id: "REQ123461",
    name: "PQR Solutions",
    mobile: "9898989898",
    email: "support@pqrsolutions.com",
    refNumber: "LN20240529014",
    linkId: "LK-1M54N8O9",
    linkUrl: "https://mahabank.elocker.in/consent/poi543lkj210",
    status: "Failed",
    consentDate: "-",
    channel: "SMS",
    sharedOn: "29/05/2024 01:10 PM",
    validTill: "05/06/2024 01:10 PM",
    purpose: "Account Opening",
    docCategory: "Aadhaar Card, PAN",
    timeline: [
      { label: "Link Shared", time: "29/05/2024 01:10 PM", completed: true },
      { label: "Link Delivery Failed", time: "29/05/2024 01:11 PM", completed: true, error: true },
    ]
  },
  {
    id: "REQ123462",
    name: "NXT Logistics",
    mobile: "9845678901",
    email: "nxtlogistics@nxt.com",
    refNumber: "LN20240527011",
    linkId: "LK-9P65Q0R1",
    linkUrl: "https://mahabank.elocker.in/consent/mnb111lkj222",
    status: "Approved",
    consentDate: "27/05/2024 05:22 PM",
    channel: "Email",
    sharedOn: "27/05/2024 05:02 PM",
    validTill: "03/06/2024 05:02 PM",
    purpose: "Loan Processing",
    docCategory: "Bank Statements",
    timeline: [
      { label: "Link Shared", time: "27/05/2024 05:02 PM", completed: true },
      { label: "Link Delivered", time: "27/05/2024 05:02 PM", completed: true },
      { label: "Link Opened", time: "27/05/2024 05:11 PM", completed: true },
      { label: "Consent Approved", time: "27/05/2024 05:22 PM", completed: true },
      { label: "Documents Available", time: "27/05/2024 05:23 PM", completed: true },
    ]
  },
  {
    id: "REQ123463",
    name: "Delta Industries",
    mobile: "9776655443",
    email: "operations@deltaind.com",
    refNumber: "KY20240531091",
    linkId: "LK-2S76T1U2",
    linkUrl: "https://mahabank.elocker.in/consent/qaz123wsx456",
    status: "Pending",
    consentDate: "-",
    channel: "WhatsApp",
    sharedOn: "31/05/2024 03:45 PM",
    validTill: "07/06/2024 03:45 PM",
    purpose: "KYC Verification",
    docCategory: "Entity Registration Certificate",
    timeline: [
      { label: "Link Shared", time: "31/05/2024 03:45 PM", completed: true },
      { label: "Link Delivered", time: "31/05/2024 03:45 PM", completed: true },
      { label: "Link Opened", time: "-", completed: false },
      { label: "Consent Approved", time: "-", completed: false },
      { label: "Documents Available", time: "-", completed: false },
    ]
  }
];

export default function ConsentHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedChannel, setSelectedChannel] = useState("All Channels");
  const [selectedConsent, setSelectedConsent] = useState<typeof MOCK_HISTORY[0] | null>(MOCK_HISTORY[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter Logic
  const filteredHistory = useMemo(() => {
    return MOCK_HISTORY.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.linkId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mobile.includes(searchQuery);

      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;

      const matchesChannel =
        selectedChannel === "All Channels" || item.channel === selectedChannel;

      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [searchQuery, selectedStatus, selectedChannel]);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Pending":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "Rejected":
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

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "SMS":
        return <Smartphone size={14} className="text-[#5e6272] shrink-0" />;
      case "Email":
        return <Mail size={14} className="text-[#5e6272] shrink-0" />;
      case "WhatsApp":
        return <MessageCircle size={14} className="text-green-600 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-2 max-w-[1400px] mx-auto space-y-2 animate-fade-in">
      
      {/* Page Title */}
      <div>
        <h2 className="text-[20px] font-extrabold text-[#10142d] tracking-tight">
          Consent History Overview
        </h2>
      </div>

      {/* ══════════════ METRICS HEADER PANEL ══════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { label: "Total Consents", value: "1,248", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "+18.6% this month", trendUp: true },
          { label: "Approved", value: "892", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", trend: "+22.1% this month", trendUp: true },
          { label: "Rejected", value: "64", icon: XCircle, color: "text-red-500", bg: "bg-red-50", trend: "-8.7% this month", trendUp: false },
          { label: "Pending", value: "256", icon: Hourglass, color: "text-orange-500", bg: "bg-orange-50", trend: "-5.3% this month", trendUp: false },
          { label: "Expired", value: "18", icon: Clock, color: "text-neutral-500", bg: "bg-neutral-50", trend: "-2.1% this month", trendUp: false },
          { label: "Failed", value: "18", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", trend: "+3.4% this month", trendUp: true },
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
        <div className={`${selectedConsent ? "xl:col-span-3" : "xl:col-span-4"} space-y-4 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]`}>
          
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
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Opened">Opened</option>
                <option value="Expired">Expired</option>
                <option value="Failed">Failed</option>
              </select>

              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="px-3.5 h-[38px] border border-[#e3e4ee] rounded-[10px] text-[13px] font-bold text-[#10142d] bg-white outline-none cursor-pointer"
              >
                <option value="All Channels">All Channels</option>
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>

              <div className="relative flex items-center w-[240px] h-[38px] border border-[#e3e4ee] rounded-[10px] focus-within:border-[#1c4dbf]/50 bg-white">
                <Search size={15} className="absolute left-3 text-text-mid" />
                <input
                  type="text"
                  placeholder="Search by Name, Mobile, Request ID..."
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
                  <th className="py-3 px-4">Consent Status</th>
                  <th className="py-3 px-4">Consent Date &amp; Time</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id + item.linkId}
                    onClick={() => setSelectedConsent(item)}
                    className={`text-[12.5px] font-semibold text-[#10142d] hover:bg-neutral-50 transition-colors cursor-pointer select-none ${
                      selectedConsent?.linkId === item.linkId ? "bg-blue-50/50" : ""
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
                          className="p-0.5 rounded hover:bg-neutral-100 text-[#5e6272]"
                        >
                          {copiedId === item.linkId ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[11.5px] font-bold px-2 py-0.5 rounded-[6px] ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5e6272]">{item.consentDate}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-[#10142d]">
                        {getChannelIcon(item.channel)}
                        <span>{item.channel}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        
                        <button
                          onClick={() => setSelectedConsent(item)}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-[#5e6272] hover:text-[#1c4dbf] cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          disabled={item.status === "Approved" || item.status === "Expired" || item.status === "Failed"}
                          onClick={() => alert(`Resending link to ${item.name}`)}
                          className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 ${
                            item.status === "Approved" || item.status === "Expired" || item.status === "Failed"
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
            <span>Showing 1 to {filteredHistory.length} of {filteredHistory.length} entries</span>
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
        {selectedConsent && (
          <div className="xl:col-span-1 bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-5 animate-slide-in-right relative">
            
            <button
              onClick={() => setSelectedConsent(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-text-mid hover:text-[#10142d] hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[10px] font-bold text-text-mid uppercase">Consent Details</span>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[5px] ${getStatusBadge(selectedConsent.status)}`}>
                  Status {selectedConsent.status}
                </span>
              </div>
            </div>

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 1: Customer Details */}
            <div className="space-y-3">
              <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Customer Details</h5>
              <div className="space-y-2 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Customer Name</span>
                  <span className="font-extrabold text-[#10142d]">{selectedConsent.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Mobile Number</span>
                  <span className="font-extrabold text-[#10142d]">{selectedConsent.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Email ID</span>
                  <span className="font-extrabold text-[#10142d] overflow-hidden text-ellipsis whitespace-nowrap max-w-[170px]">{selectedConsent.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Reference Number</span>
                  <span className="font-extrabold text-[#10142d]">{selectedConsent.refNumber}</span>
                </div>
              </div>
            </div>

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 2: Request & Links */}
            <div className="space-y-3">
              <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Request &amp; Links</h5>
              <div className="space-y-2 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Request ID</span>
                  <span className="font-extrabold text-[#10142d]">{selectedConsent.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-mid font-semibold">Link ID</span>
                  <span className="font-extrabold text-[#10142d] flex items-center gap-1">
                    {selectedConsent.linkId}
                    <button
                      onClick={(e) => handleCopy("drawer-lk", selectedConsent.linkUrl, e)}
                      className="p-0.5 hover:bg-neutral-50 rounded text-[#1c4dbf]"
                    >
                      {copiedId === "drawer-lk" ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                    </button>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Purpose</span>
                  <span className="font-extrabold text-[#10142d] overflow-hidden text-ellipsis whitespace-nowrap max-w-[170px] text-right">{selectedConsent.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Document Category</span>
                  <span className="font-extrabold text-[#10142d] overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px] text-right" title={selectedConsent.docCategory}>{selectedConsent.docCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Shared On</span>
                  <span className="font-extrabold text-[#10142d]">{selectedConsent.sharedOn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Valid Till</span>
                  <span className="font-extrabold text-[#10142d]">{selectedConsent.validTill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Channel</span>
                  <span className="font-extrabold text-[#10142d]">{selectedConsent.channel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid font-semibold">Shared Via</span>
                  <span className="font-extrabold text-[#10142d]">{selectedConsent.mobile}</span>
                </div>
              </div>
            </div>

            <hr className="border-0 border-t border-neutral-100 -mx-5" />

            {/* Block 3: Consent Timeline */}
            <div className="space-y-4">
              <h5 className="text-[12px] font-extrabold text-text-mid uppercase tracking-wide">Consent Timeline</h5>
              <div className="relative pl-6 space-y-4.5">
                
                {/* Vertical connecting line */}
                <div className="absolute top-2 bottom-2 left-2.5 w-[1.5px] bg-[#e3e4ee]" />

                {selectedConsent.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex justify-between items-start text-[12px]">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center z-10 shadow-sm border border-neutral-200 bg-white">
                      {step.completed ? (
                        step.error ? (
                          <XCircle size={12} className="text-red-500" />
                        ) : (
                          <Check size={12} className="text-green-600 stroke-[3px]" />
                        )
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-bold ${step.completed ? (step.error ? "text-red-600 font-extrabold" : "text-[#10142d]") : "text-text-mid"}`}>
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

            {selectedConsent.status === "Approved" && (
              <button
                onClick={() => alert(`Navigating to View Documents for request ${selectedConsent.id}`)}
                className="w-full h-[38px] rounded-[10px] bg-[#0089CF] hover:bg-[#153ca0] text-white text-[13.5px] font-extrabold transition-all shadow-[0_4px_12px_rgba(28,77,191,0.2)] mt-2 cursor-pointer flex items-center justify-center"
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
