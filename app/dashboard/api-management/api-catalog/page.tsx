"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Star,
  ExternalLink,
  Plus,
  X,
  Check,
  Clock,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  ShieldCheck,
  Activity,
  Boxes,
  Globe,
  Eye,
} from "lucide-react";

interface ApiItem {
  id: string;
  name: string;
  description: string;
  category: "Document" | "Verification" | "Account" | "Utility";
  version: string;
  status: "Active" | "Inactive";
  rating: number;
  calls: number;
  tags: string[];
  features: string[];
  rateLimit: string;
  authentication: string;
}

const API_DATA: ApiItem[] = [
  {
    id: "document-retrieval",
    name: "Document Retrieval API",
    description: "Retrieve digitally signed documents from Entity Locker using Document ID or Reference Number.",
    category: "Document",
    version: "v1.2.0",
    status: "Active",
    rating: 4.8,
    calls: 1256,
    tags: ["documents", "retrieval", "pdf", "json"],
    features: [
      "Retrieve documents in PDF/JSON format",
      "Supports multiple identifiers",
      "Digitally signed & tamper-proof",
      "Real-time response",
    ],
    rateLimit: "100 requests per minute",
    authentication: "API Key / OAuth 2.0",
  },
  {
    id: "ekyc-verification",
    name: "eKYC Verification API",
    description: "Verify PAN, Aadhaar, and other KYC documents in real-time.",
    category: "Verification",
    version: "v1.1.0",
    status: "Active",
    rating: 4.6,
    calls: 1025,
    tags: ["kyc", "verification", "aadhaar", "pan"],
    features: [
      "Real-time verification with UIDAI/NSDL",
      "Aadhaar OTP & Biometric support",
      "PAN status & details fetch",
      "Highly secure & compliant",
    ],
    rateLimit: "150 requests per minute",
    authentication: "API Key / OAuth 2.0",
  },
  {
    id: "account-statement",
    name: "Account Statement API",
    description: "Fetch account statement for a given account number and date range.",
    category: "Account",
    version: "v1.0.3",
    status: "Active",
    rating: 4.5,
    calls: 876,
    tags: ["account", "statement", "pdf", "json"],
    features: [
      "Statement retrieval up to 5 years",
      "Multiple formats (PDF, JSON, XML)",
      "Real-time transaction updates",
      "Secure banking channel integration",
    ],
    rateLimit: "80 requests per minute",
    authentication: "API Key / OAuth 2.0",
  },
  {
    id: "loan-document",
    name: "Loan Document API",
    description: "Access loan agreement, sanction letter and related documents.",
    category: "Document",
    version: "v1.0.1",
    status: "Active",
    rating: 4.2,
    calls: 642,
    tags: ["loan", "documents", "agreement"],
    features: [
      "Sanction letter generation",
      "E-sign integration",
      "Secure document storage",
      "Multi-party signing workflow",
    ],
    rateLimit: "50 requests per minute",
    authentication: "API Key / OAuth 2.0",
  },
  {
    id: "bank-branch-locator",
    name: "Bank Branch Locator API",
    description: "Get details of bank branches based on IFSC code, location or branch ID.",
    category: "Utility",
    version: "v1.0.0",
    status: "Active",
    rating: 4.0,
    calls: 512,
    tags: ["utility", "branch", "location"],
    features: [
      "IFSC code lookup & validation",
      "Branch address & contact details",
      "Geographic coordinates mapping",
      "ATM availability status",
    ],
    rateLimit: "200 requests per minute",
    authentication: "API Key / Public Access",
  },
  {
    id: "cibil-score-check",
    name: "CIBIL Score Check API",
    description: "Fetch CIBIL credit score and detailed credit history report for individuals.",
    category: "Verification",
    version: "v2.0.1",
    status: "Active",
    rating: 4.7,
    calls: 945,
    tags: ["cibil", "credit", "verification"],
    features: [
      "Instant credit score retrieval",
      "Detailed credit history report",
      "Dedupe checks & verification",
      "Secure bureau connection",
    ],
    rateLimit: "60 requests per minute",
    authentication: "API Key / OAuth 2.0",
  },
  {
    id: "penny-drop-verification",
    name: "Penny Drop Verification API",
    description: "Verify bank account details by depositing a penny and checking beneficiary name.",
    category: "Verification",
    version: "v1.0.0",
    status: "Active",
    rating: 4.4,
    calls: 780,
    tags: ["penny-drop", "bank-verification", "kyc"],
    features: [
      "Instant name match with bank records",
      "Support for IMPS transfer",
      "Low latency verification",
      "Detailed success/failure logs",
    ],
    rateLimit: "120 requests per minute",
    authentication: "API Key / OAuth 2.0",
  },
  {
    id: "gstin-verification",
    name: "GSTIN Verification API",
    description: "Validate GST registration number and retrieve business filing status.",
    category: "Verification",
    version: "v1.1.2",
    status: "Active",
    rating: 4.3,
    calls: 430,
    tags: ["gstin", "business", "tax"],
    features: [
      "GSTIN format validation",
      "Business legal name & trade name",
      "Filing frequency & status",
      "Address & tax jurisdiction details",
    ],
    rateLimit: "100 requests per minute",
    authentication: "API Key / OAuth 2.0",
  },
  {
    id: "balance-enquiry",
    name: "Balance Enquiry API",
    description: "Real-time balance enquiry for linked savings or current bank accounts.",
    category: "Account",
    version: "v1.2.1",
    status: "Active",
    rating: 4.6,
    calls: 1120,
    tags: ["balance", "account", "enquiry"],
    features: [
      "Real-time ledger balance",
      "Available balance check",
      "Multi-currency support",
      "High-availability banking API",
    ],
    rateLimit: "150 requests per minute",
    authentication: "API Key / OAuth 2.0",
  },
  {
    id: "forex-rate-api",
    name: "Forex Rates API",
    description: "Get live foreign exchange rates and currency conversion data.",
    category: "Utility",
    version: "v1.0.5",
    status: "Active",
    rating: 4.1,
    calls: 310,
    tags: ["forex", "rates", "utility"],
    features: [
      "Live exchange rates feed",
      "Historical rate queries",
      "Supports 150+ currencies",
      "Auto-refresh every 60 seconds",
    ],
    rateLimit: "300 requests per minute",
    authentication: "API Key / Public Access",
  },
];

export default function ApiCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedApiId, setSelectedApiId] = useState<string>("document-retrieval");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarActiveTab, setSidebarActiveTab] = useState<"Overview" | "Endpoints" | "Request/Response" | "Schema" | "Changelog">("Overview");

  // Filter logic
  const filteredApis = useMemo(() => {
    return API_DATA.filter((api) => {
      const matchesSearch =
        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" ||
        api.category.toLowerCase() === selectedCategory.toLowerCase().replace(" apis", "").trim();

      const matchesStatus =
        selectedStatus === "All" || api.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Selected API details
  const selectedApi = useMemo(() => {
    return API_DATA.find((api) => api.id === selectedApiId) || API_DATA[0];
  }, [selectedApiId]);

  const handleApiSelect = (apiId: string) => {
    setSelectedApiId(apiId);
    setIsSidebarOpen(true);
  };

  // Icon mapping helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Document":
        return { icon: FileText, bg: "bg-[#eff6ff]", text: "text-[#2563eb]" };
      case "Verification":
        return { icon: ShieldCheck, bg: "bg-[#ecfdf3]", text: "text-[#16a34a]" };
      case "Account":
        return { icon: Activity, bg: "bg-[#f3e8ff]", text: "text-[#9333ea]" };
      case "Utility":
        return { icon: Globe, bg: "bg-[#e0f2fe]", text: "text-[#0369a1]" };
      default:
        return { icon: Boxes, bg: "bg-[#f1f5f9]", text: "text-[#475569]" };
    }
  };

  const getCategoryPillClass = (category: string) => {
    switch (category) {
      case "Document":
        return "bg-[#eff6ff] text-[#2563eb]";
      case "Verification":
        return "bg-[#ecfdf3] text-[#16a34a]";
      case "Account":
        return "bg-[#f5f3ff] text-[#7c3aed]";
      case "Utility":
        return "bg-[#e0f2fe] text-[#0369a1]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-2 p-2 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#10142d]">API Catalog</h1>
          <p className="text-[13px] font-semibold text-[#5e6272] mt-0.5">
            Browse and explore all APIs exposed by Mahabank. Subscribe to APIs to integrate with your applications.
          </p>
        </div>
        <button className="flex items-center justify-center gap-1.5 rounded-[6px] bg-[#0072ad] px-4 py-2 text-[12px] font-extrabold text-white shadow-[0_3px_10px_rgba(0,114,173,0.2)] hover:bg-[#005f91] transition-all cursor-pointer h-[36px] shrink-0 self-start sm:self-center">
          <Plus size={15} strokeWidth={2.5} />
          <span>Create New API</span>
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2 rounded-[16px] border border-[#e3e4ee] bg-white p-4.5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9094a8]" size={16} />
          <input
            type="text"
            placeholder="Search APIs by name, keyword, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[36px] rounded-[6px] border border-[#e3e4ee] pl-9 pr-3 text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] focus:border-[#0089CF] focus:outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-[36px] appearance-none rounded-[6px] border border-[#e3e4ee] bg-white pl-3.5 pr-8 text-[13px] font-semibold text-[#10142d] focus:border-[#0089CF] focus:outline-none cursor-pointer min-w-[150px]"
          >
            <option value="All">All Categories</option>
            <option value="Document">Document</option>
            <option value="Verification">Verification</option>
            <option value="Account">Account</option>
            <option value="Utility">Utility</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e6272] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-[36px] appearance-none rounded-[6px] border border-[#e3e4ee] bg-white pl-3.5 pr-8 text-[13px] font-semibold text-[#10142d] focus:border-[#0089CF] focus:outline-none cursor-pointer min-w-[130px]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e6272] pointer-events-none" />
        </div>

        <button className="flex h-[36px] items-center gap-1.5 rounded-[6px] border border-[#e3e4ee] bg-white px-3.5 text-[12px] font-bold text-[#5e6272] hover:bg-[#f8fafc] cursor-pointer">
          <SlidersHorizontal size={13.5} />
          <span>More Filters</span>
        </button>

        {(searchQuery || selectedCategory !== "All" || selectedStatus !== "All") && (
          <button
            onClick={handleClearAll}
            className="text-[13px] font-bold text-[#0089CF] hover:underline ml-1.5 cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Tabs Row */}
      <div className="border-b border-[#e3e4ee] flex gap-6 overflow-x-auto scrollbar-none bg-transparent">
        {[
          { id: "All", label: "All APIs", count: 24 },
          { id: "Document", label: "Document APIs", count: 10 },
          { id: "Verification", label: "Verification APIs", count: 8 },
          { id: "Account", label: "Account APIs", count: 4 },
          { id: "Utility", label: "Utility APIs", count: 2 },
        ].map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`h-[36px] border-b-2 px-1 text-[13px] font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "border-[#0089CF] text-[#0089CF]"
                  : "border-transparent text-[#5e6272] hover:text-[#10142d]"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* Main Split Layout */}
      <div className={`grid gap-2 transition-all duration-300 ${isSidebarOpen ? "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]" : "grid-cols-1"}`}>
        
        {/* Left Column - List */}
        <div className="space-y-2">
          <div className="overflow-hidden rounded-[16px] border border-[#e3e4ee] bg-white shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="h-[40px] border-b border-[#e3e4ee] bg-[#f8fafc] text-[11px] font-bold text-[#10142d] uppercase tracking-wide">
                    <th className="px-4 py-2 w-[48%]">API Name & Description</th>
                    <th className="px-4 py-2 w-[12%]">Category</th>
                    <th className="px-4 py-2 w-[10%]">Version</th>
                    <th className="px-4 py-2 w-[10%]">Status</th>
                    <th className="px-4 py-2 w-[12%]">Popularity</th>
                    <th className="px-4 py-2 w-[8%] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e4ee]">
                  {filteredApis.length > 0 ? (
                    filteredApis.map((api) => {
                      const isSelected = selectedApiId === api.id && isSidebarOpen;
                      const { icon: IconComponent, bg: iconBg, text: iconText } = getCategoryIcon(api.category);

                      return (
                        <tr
                          key={api.id}
                          onClick={() => handleApiSelect(api.id)}
                          className={`group cursor-pointer transition-all hover:bg-slate-50/75 ${
                            isSelected ? "bg-[#f0f7ff] hover:bg-[#f0f7ff]" : ""
                          }`}
                          style={{
                            borderLeft: isSelected ? "3px solid #0089CF" : "3px solid transparent",
                          }}
                        >
                          {/* Name & Description */}
                          <td className="p-4">
                            <div className="flex items-start gap-3.5">
                              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ${iconBg} ${iconText}`}>
                                <IconComponent size={19} />
                              </div>
                              <div className="space-y-1.5 min-w-0">
                                <h3 className="font-bold text-[14px] text-[#10142d] group-hover:text-[#0089CF] transition-colors truncate">
                                  {api.name}
                                </h3>
                                <p className="text-[13px] font-semibold text-[#5e6272] leading-[1.45] line-clamp-2 max-w-[580px]">
                                  {api.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {api.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded-[4px] bg-[#f1f3f9] px-2 py-0.5 text-[10.5px] font-bold text-[#5e6272]"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-[4px] px-2.5 py-0.5 text-[10.5px] font-extrabold ${getCategoryPillClass(api.category)}`}>
                              {api.category}
                            </span>
                          </td>

                          {/* Version */}
                          <td className="px-4 py-4 text-[#5e6272] font-bold text-[13px]">
                            {api.version}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-[4px] border border-[#bbf7d0] bg-[#ecfdf3] px-2 py-0.5 text-[10px] font-extrabold text-[#15803d]">
                              {api.status}
                            </span>
                          </td>

                          {/* Popularity */}
                          <td className="px-4 py-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-0.5 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={11.5}
                                    fill={i < Math.floor(api.rating) ? "#eab308" : "none"}
                                    className={i < Math.floor(api.rating) ? "text-[#eab308]" : "text-slate-300"}
                                    strokeWidth={2}
                                  />
                                ))}
                                <span className="ml-1 text-[12px] font-extrabold text-[#10142d]">{api.rating}</span>
                              </div>
                              <p className="text-[11px] font-bold text-[#5e6272]">({api.calls} calls)</p>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-2.5 text-[#0089CF]">
                              <button
                                onClick={() => handleApiSelect(api.id)}
                                title="View Details"
                                className="cursor-pointer p-1 rounded hover:bg-slate-100 transition-colors"
                              >
                                <Eye size={15} />
                              </button>
                              <Link
                                href={`/dashboard/api-management/api-catalog/${api.id}/documentation`}
                                title="View Documentation"
                                className="cursor-pointer p-1 rounded hover:bg-slate-100 transition-colors"
                              >
                                <FileText size={15} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-[13px] font-bold text-[#5e6272]">
                        No APIs found matching the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Panel */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#e3e4ee] px-4 py-3 bg-white">
              <span className="text-[12px] font-bold text-[#5e6272]">
                Showing 1 to {filteredApis.length} of 24 APIs
              </span>
              <div className="flex items-center gap-3.5">
                <div className="flex items-center gap-1">
                  <button className="grid h-[28px] w-[28px] place-items-center rounded-[4px] border border-[#e3e4ee] text-[#9094a8] hover:bg-[#f8fafc] disabled:opacity-40 cursor-pointer" disabled>
                    <ChevronLeft size={14} />
                  </button>
                  <button className="grid h-[28px] w-[28px] place-items-center rounded-[4px] bg-[#0072ad] text-white text-[12px] font-extrabold shadow-[0_2px_6px_rgba(0,114,173,0.15)] cursor-pointer">
                    1
                  </button>
                  <button className="grid h-[28px] w-[28px] place-items-center rounded-[4px] border border-[#e3e4ee] text-[#5e6272] text-[12px] font-bold hover:bg-[#f8fafc] cursor-pointer">
                    2
                  </button>
                  <button className="grid h-[28px] w-[28px] place-items-center rounded-[4px] border border-[#e3e4ee] text-[#5e6272] text-[12px] font-bold hover:bg-[#f8fafc] cursor-pointer">
                    3
                  </button>
                  <span className="text-[12px] text-[#5e6272] font-bold px-0.5">...</span>
                  <button className="grid h-[28px] w-[28px] place-items-center rounded-[4px] border border-[#e3e4ee] text-[#5e6272] hover:bg-[#f8fafc] cursor-pointer">
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="relative">
                  <select className="h-[28px] appearance-none rounded-[4px] border border-[#e3e4ee] bg-white pl-2.5 pr-6 text-[12px] font-bold text-[#10142d] focus:outline-none cursor-pointer">
                    <option>10 / page</option>
                    <option>20 / page</option>
                    <option>50 / page</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5e6272] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details Drawer */}
        {isSidebarOpen && (
          <aside className="rounded-[16px] border border-[#e3e4ee] bg-white shadow-[0_2px_12px_rgba(18,22,46,0.02)] flex flex-col h-fit overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-[#e3e4ee] px-5 py-4 bg-[#fafbfc]">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-extrabold text-[14px] text-[#10142d] truncate">
                    {selectedApi.name}
                  </h2>
                  <span className="inline-flex rounded-[4px] bg-[#ecfdf3] px-1.5 py-0.2 text-[9px] font-bold text-[#16a34a]">
                    {selectedApi.status}
                  </span>
                </div>
                <span className="inline-flex mt-1 rounded-[4px] bg-[#eff6ff] px-1.5 py-0.5 text-[10.5px] font-extrabold text-[#2563eb]">
                  {selectedApi.version}
                </span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-[#9094a8] hover:text-[#10142d] p-1 rounded-full hover:bg-slate-100 cursor-pointer transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Sub-tabs */}
            <div className="border-b border-[#e3e4ee] flex px-5 gap-5 overflow-x-auto scrollbar-none bg-[#fafbfc]">
              {(["Overview", "Endpoints", "Request/Response", "Schema", "Changelog"] as const).map((tab) => {
                const isActive = sidebarActiveTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSidebarActiveTab(tab)}
                    className={`h-[34px] border-b-2 text-[12px] font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? "border-[#0089CF] text-[#0089CF]"
                        : "border-transparent text-[#5e6272] hover:text-[#10142d]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Drawer Content */}
            <div className="p-5 space-y-4.5 text-[13px] bg-white">
              {sidebarActiveTab === "Overview" ? (
                <>
                  {/* Description */}
                  <p className="text-[#5e6272] leading-[1.5] font-semibold">
                    {selectedApi.description}
                  </p>

                  {/* Category */}
                  <div>
                    <h4 className="font-extrabold text-[#10142d] uppercase text-[11px] tracking-wide mb-1.5">
                      Category
                    </h4>
                    <span className={`inline-flex rounded-[4px] px-2.5 py-0.5 text-[10.5px] font-extrabold ${getCategoryPillClass(selectedApi.category)}`}>
                      {selectedApi.category}
                    </span>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h4 className="font-extrabold text-[#10142d] uppercase text-[11px] tracking-wide mb-2">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {selectedApi.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 font-semibold text-[#10142d]">
                          <div className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#ecfdf3] text-[#16a34a] mt-0.5">
                            <Check size={11} strokeWidth={3} />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rate Limit */}
                  <div className="flex items-center gap-3 border-t border-b border-[#e3e4ee] py-3.5">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-[#5e6272]">
                      <Clock size={16} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#5e6272] text-[11px] uppercase">
                        Rate Limit
                      </h4>
                      <p className="font-extrabold text-[#10142d] mt-0.5">
                        {selectedApi.rateLimit}
                      </p>
                    </div>
                  </div>

                  {/* Authentication */}
                  <div className="flex items-center gap-3 pb-1">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-[#5e6272]">
                      <KeyRound size={16} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#5e6272] text-[11px] uppercase">
                        Authentication
                      </h4>
                      <p className="font-extrabold text-[#10142d] mt-0.5">
                        {selectedApi.authentication}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="font-extrabold text-[#10142d] uppercase text-[11px] tracking-wide mb-2">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApi.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-[4px] bg-[#f1f3f9] px-2 py-0.5 text-[10.5px] font-bold text-[#5e6272]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-3">
                    <Link
                      href={`/dashboard/api-management/api-catalog/${selectedApi.id}/documentation`}
                      className="flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#0072ad] py-2 text-[12px] font-extrabold text-white shadow-[0_2px_8px_rgba(0,114,173,0.15)] hover:bg-[#005f91] transition-all cursor-pointer h-[38px]"
                    >
                      <span>View Documentation</span>
                      <ExternalLink size={14} />
                    </Link>
                    <button className="flex w-full items-center justify-center gap-1.5 rounded-[6px] border border-[#0072ad] bg-white py-2 text-[12px] font-extrabold text-[#0072ad] hover:bg-[#0072ad]/5 transition-all cursor-pointer h-[38px]">
                      <Plus size={14} strokeWidth={2.5} />
                      <span>Subscribe to API</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-400 font-bold">
                  {sidebarActiveTab} details will be shown on the full documentation page.
                </div>
              )}
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
