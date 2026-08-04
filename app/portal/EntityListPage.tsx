"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Search,
  DownloadCloud,
  Eye,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Layers,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Mail,
  Phone,
  Hash,
  Plus,
  PlusCircle,
  SearchX,
  Link2,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { fetchEntityList, fetchEntityDetails, EntityItem } from "@/services/EntityListPage";
import { RegisterEntityModal } from "@/components/RegisterEntity";

const PAGE_SIZE = 15;

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function EntityListPage() {
  const router = useRouter();

  const [entities, setEntities] = useState<EntityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [navigatingConsent, setNavigatingConsent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search, Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedEntity, setSelectedEntity] = useState<EntityItem | null>(null);

  // Registration modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

  // Select entity & fetch full details (including consent_details) using entity_id string
  const handleSelectEntity = useCallback(async (entity: EntityItem) => {
    setSelectedEntity(entity);
    const session = getAuthSession();
    if (!session || !session.accessToken || !entity.entity_id) return;

    try {
      setDetailsLoading(true);
      const fullDetails = await fetchEntityDetails(entity.entity_id, session.accessToken);
      setSelectedEntity(fullDetails);
    } catch (err: unknown) {
      console.error("Failed to fetch entity details:", err);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  // Load Entities from API
  const loadEntities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const session = getAuthSession();
      if (!session || !session.accessToken) {
        throw new Error("No active authentication session found. Please log in again.");
      }
      const data = await fetchEntityList(session.accessToken);
      setEntities(data);
      if (data.length > 0) {
        handleSelectEntity(data[0]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch entity list.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [handleSelectEntity]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedType]);

  // Filter Logic
  const filteredEntities = useMemo(() => {
    return entities.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.entity_id?.toLowerCase().includes(q) ||
        item.entity_name?.toLowerCase().includes(q) ||
        item.entity_email?.toLowerCase().includes(q) ||
        item.entity_mobile?.includes(q);

      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;

      const matchesType =
        selectedType === "All Types" || item.entity_type === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [entities, searchQuery, selectedStatus, selectedType]);

  // Pagination Logic (15 per page)
  const totalPages = Math.ceil(filteredEntities.length / PAGE_SIZE) || 1;
  const paginatedEntities = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEntities.slice(start, start + PAGE_SIZE);
  }, [filteredEntities, currentPage]);

  // Metrics summary calculations
  const totalCount = entities.length;
  const activeCount = entities.filter((e) => e.status === "ACTIVE").length;
  const organizationCount = entities.filter((e) => e.entity_type === "ORGANIZATION").length;
  const verifiedCount = entities.filter((e) => e.verified_by !== null).length;

  const handleEntityCreatedSuccess = (newEntity: EntityItem) => {
    setEntities((prev) => [newEntity, ...prev]);
    handleSelectEntity(newEntity);
  };

  const handleGenerateConsentUrlClick = (entityIdStr: string) => {
    setNavigatingConsent(true);
    router.push(`/dashboard/requester/create-request?entity_id=${entityIdStr}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "INACTIVE":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "BLOCKED":
      case "DELETED":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-neutral-100 text-neutral-800 border border-neutral-200";
    }
  };

  const getConsentStatusBadge = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case "authorized":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "failed":
        return "bg-red-50 text-red-700 border border-red-200";
      case "expired":
        return "bg-neutral-100 text-neutral-600 border border-neutral-200";
      default:
        return "bg-neutral-100 text-neutral-500 border border-neutral-200";
    }
  };

  return (
    <div className="p-3 max-w-[1400px] mx-auto space-y-3 font-manrope animate-fade-in">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-[18px] font-extrabold text-[#0089CF] tracking-tight flex items-center gap-2">
            <Building2 size={20} />
            Entity Management
          </h2>
          <p className="text-[11.5px] font-medium text-[#5e6272]">
            Overview of all registered organizational and individual entities
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Register Entity Primary Button */}
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12.5px] font-extrabold transition-all shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>Register Entity</span>
          </button>
          <button
            onClick={loadEntities}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e3e4ee] bg-white hover:bg-neutral-50 text-[12px] font-bold text-[#10142d] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-[#0089CF]" : "text-[#5e6272]"} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Header Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-white border border-[#e3e4ee] rounded-[14px] p-3.5 flex items-center gap-3 shadow-[0_2px_8px_rgba(18,22,46,0.015)]">
          <div className="w-9 h-9 rounded-[9px] bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 size={17} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5e6272] uppercase tracking-wide">Total Entities</span>
            <span className="text-[19px] font-extrabold text-[#10142d] mt-0.5 leading-none">{totalCount}</span>
          </div>
        </div>

        <div className="bg-white border border-[#e3e4ee] rounded-[14px] p-3.5 flex items-center gap-3 shadow-[0_2px_8px_rgba(18,22,46,0.015)]">
          <div className="w-9 h-9 rounded-[9px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={17} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5e6272] uppercase tracking-wide">Active</span>
            <span className="text-[19px] font-extrabold text-[#10142d] mt-0.5 leading-none">{activeCount}</span>
          </div>
        </div>

        <div className="bg-white border border-[#e3e4ee] rounded-[14px] p-3.5 flex items-center gap-3 shadow-[0_2px_8px_rgba(18,22,46,0.015)]">
          <div className="w-9 h-9 rounded-[9px] bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Layers size={17} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5e6272] uppercase tracking-wide">Organizations</span>
            <span className="text-[19px] font-extrabold text-[#10142d] mt-0.5 leading-none">{organizationCount}</span>
          </div>
        </div>

        <div className="bg-white border border-[#e3e4ee] rounded-[14px] p-3.5 flex items-center gap-3 shadow-[0_2px_8px_rgba(18,22,46,0.015)]">
          <div className="w-9 h-9 rounded-[9px] bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={17} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5e6272] uppercase tracking-wide">Verified</span>
            <span className="text-[19px] font-extrabold text-[#10142d] mt-0.5 leading-none">{verifiedCount}</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 items-stretch">
        
        {/* Table Main Area */}
        <div className={`${selectedEntity ? "xl:col-span-3" : "xl:col-span-4"} h-full space-y-3 bg-white border border-[#e3e4ee] rounded-[14px] p-4 shadow-[0_2px_12px_rgba(18,22,46,0.03)]`}>
          
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-2.5 items-center justify-between border-b border-[#e3e4ee] pb-3">
            <div className="flex flex-1 min-w-0 flex-wrap gap-2 items-center">
              
              {/* Search Bar */}
              <div className="relative flex min-[#240px] flex-1 items-center h-[36px] border border-[#e3e4ee] rounded-[9px] focus-within:border-[#0089CF] bg-white">
                <Search size={14} className="absolute left-3 text-[#5e6272]" />
                <input
                  type="text"
                  placeholder="Search by Name, Entity ID, Email, Mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-8 pr-3 text-[12.5px] font-semibold text-[#10142d] placeholder-[#9094a8] bg-transparent border-0 outline-none"
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 h-[36px] border border-[#e3e4ee] rounded-[9px] text-[12px] font-bold text-[#10142d] bg-white outline-none cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 h-[36px] border border-[#e3e4ee] rounded-[9px] text-[12px] font-bold text-[#10142d] bg-white outline-none cursor-pointer"
              >
                <option value="All Types">All Types</option>
                <option value="ORGANIZATION">ORGANIZATION</option>
                <option value="INDIVIDUAL">INDIVIDUAL</option>
              </select>

            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="flex items-center gap-1.5 px-3 h-[36px] rounded-[9px] bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12px] font-extrabold cursor-pointer transition-all shadow-2xs"
              >
                <Plus size={14} />
                <span>Register Entity</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 h-[36px] border border-[#e3e4ee] rounded-[9px] text-[12px] font-bold text-[#10142d] hover:bg-neutral-50 cursor-pointer bg-white">
                <DownloadCloud size={13} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw size={32} className="text-[#0089CF] animate-spin" />
              <p className="text-[12.5px] font-bold text-[#5e6272]">Fetching entity records...</p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center text-center space-y-2">
              <AlertCircle size={32} className="text-red-500" />
              <div>
                <h4 className="text-[13.5px] font-bold text-red-900">Failed to Load Entities</h4>
                <p className="text-[12px] text-red-700 mt-0.5">{error}</p>
              </div>
              <button
                onClick={loadEntities}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11.5px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            /* Table Grid */
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#e3e4ee] text-[10.5px] font-bold text-[#5e6272] uppercase text-left whitespace-nowrap">
                    <th className="py-2.5 px-3">Entity ID</th>
                    <th className="py-2.5 px-3">Entity Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Mobile</th>
                    <th className="py-2.5 px-3">Created At</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {paginatedEntities.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectEntity(item)}
                      className={`text-[11.5px] font-semibold text-[#10142d] hover:bg-neutral-50 transition-colors cursor-pointer select-none whitespace-nowrap ${
                        selectedEntity?.id === item.id ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 font-extrabold text-[#0089CF]">{item.entity_id}</td>
                      <td className="py-2.5 px-3 font-extrabold">{item.entity_name}</td>
                      <td className="py-2.5 px-3 text-[#5e6272]">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10.5px] font-bold text-[#10142d]">
                          {item.entity_type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[5px] ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#5e6272]">{item.entity_email || "-"}</td>
                      <td className="py-2.5 px-3 text-[#5e6272]">{item.entity_mobile || "-"}</td>
                      <td className="py-2.5 px-3 text-[#5e6272]">{formatDate(item.created_at)}</td>
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectEntity(item)}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-[#5e6272] hover:text-[#0089CF] transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredEntities.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto p-4 rounded-xl border border-dashed border-[#e3e4ee] bg-neutral-50/60">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0089CF] flex items-center justify-center">
                            <SearchX size={20} />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-extrabold text-[#10142d]">No Entity Found</h4>
                            <p className="text-[11.5px] text-[#5e6272] font-medium mt-0.5">
                              {searchQuery
                                ? `No entities match "${searchQuery}". Register a new entity to add it to the portal.`
                                : "No entities are registered yet in the system."}
                            </p>
                          </div>
                          <button
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="mt-1 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12px] font-extrabold transition-colors cursor-pointer shadow-xs"
                          >
                            <PlusCircle size={14} />
                            <span>Register New Entity</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Bar (15 items per page) */}
          {!loading && !error && filteredEntities.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#f1f5f9] pt-3 text-[12px] font-bold text-[#5e6272] gap-2">
              <span>
                Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredEntities.length)} to{" "}
                {Math.min(currentPage * PAGE_SIZE, filteredEntities.length)} of {filteredEntities.length} entries (15 per page)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-[11.5px] font-bold flex items-center justify-center transition-all ${
                      currentPage === page
                        ? "bg-[#0089CF] text-white shadow-xs"
                        : "border border-[#e3e4ee] hover:bg-neutral-50 text-[#10142d] cursor-pointer"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-lg border border-[#e3e4ee] hover:bg-neutral-50 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Next Page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Details Sidebar Drawer */}
        {selectedEntity && (
          <div className="xl:col-span-1 flex flex-col h-full">
            <div className="relative h-full space-y-4 rounded-[14px] border border-[#e3e4ee] bg-white p-4 shadow-[0_2px_12px_rgba(18,22,46,0.03)]">
              {/* Close Button */}
              <button
                onClick={() => setSelectedEntity(null)}
                className="absolute top-3.5 right-3.5 p-1 rounded-md text-[#5e6272] hover:text-[#10142d] hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Close Drawer"
              >
                <X size={15} />
              </button>

              {/* Drawer Title Header */}
              <div className="pr-6">
                <span className="text-[10px] font-bold text-[#5e6272] uppercase tracking-wider">Entity Overview</span>
                <div className="flex items-center gap-2 mt-1">
                  <h4 className="text-[14px] font-extrabold text-[#10142d] tracking-tight truncate">
                    {selectedEntity.entity_name}
                  </h4>
                  {detailsLoading && <RefreshCw size={12} className="animate-spin text-[#0089CF]" />}
                </div>
                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-[5px] ${getStatusBadge(selectedEntity.status)}`}>
                  {selectedEntity.status}
                </span>
              </div>

              <hr className="border-0 border-t border-neutral-100 -mx-4" />

              {/* Prominent Loader when fetching details */}
              {detailsLoading ? (
                <div className="py-10 flex flex-col items-center justify-center space-y-3 bg-[#0089CF]/5 rounded-xl border border-[#0089CF]/20 text-[#0089CF] animate-pulse">
                  <RefreshCw size={26} className="animate-spin" />
                  <span className="text-[12px] font-extrabold">Loading Entity &amp; Consent Details...</span>
                </div>
              ) : (
                <>
                  {/* Block 1: Identity Info */}
                  <div className="space-y-2.5">
                    <h5 className="text-[11px] font-extrabold text-[#5e6272] uppercase tracking-wide flex items-center gap-1.5">
                      <Hash size={13} className="text-[#0089CF]" /> Identity Metadata
                    </h5>
                    <div className="space-y-1.5 text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-[#5e6272] font-semibold">Entity ID</span>
                        <span className="font-extrabold text-[#0089CF]">{selectedEntity.entity_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5e6272] font-semibold">Entity Type</span>
                        <span className="font-bold text-[#10142d]">{selectedEntity.entity_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5e6272] font-semibold">Locker ID</span>
                        <span className="font-bold text-[#10142d]">{selectedEntity.entitylockerid || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5e6272] font-semibold">DOI</span>
                        <span className="font-bold text-[#10142d]">{selectedEntity.doi || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-0 border-t border-neutral-100 -mx-4" />

                  {/* Block 2: Contact Information */}
                  <div className="space-y-2.5">
                    <h5 className="text-[11px] font-extrabold text-[#5e6272] uppercase tracking-wide flex items-center gap-1.5">
                      <Mail size={13} className="text-[#0089CF]" /> Contact Information
                    </h5>
                    <div className="space-y-1.5 text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-[#5e6272] font-semibold flex items-center gap-1">
                          <Mail size={11} /> Email
                        </span>
                        <span className="font-bold text-[#10142d] truncate max-w-[170px]">{selectedEntity.entity_email || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5e6272] font-semibold flex items-center gap-1">
                          <Phone size={11} /> Mobile
                        </span>
                        <span className="font-bold text-[#10142d]">{selectedEntity.entity_mobile || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-0 border-t border-neutral-100 -mx-4" />

                  {/* Block 3: Consent Status & Conditional Action Buttons */}
                  {(() => {
                    const rawConsentStatus =
                      selectedEntity.consent_details?.status || selectedEntity.consent_status;
                    const isExpired =
                      selectedEntity.consent_details?.is_consent_expired ||
                      rawConsentStatus?.toLowerCase() === "expired";
                    const displayConsentStatus = isExpired ? "expired" : (rawConsentStatus || null);

                    return (
                      <div className="space-y-2.5">
                        <h5 className="text-[11px] font-extrabold text-[#5e6272] uppercase tracking-wide flex items-center gap-1.5">
                          <ShieldCheck size={13} className="text-[#0089CF]" /> Consent Authorization
                        </h5>
                        <div className="space-y-2 text-[12px]">
                          <div className="flex justify-between items-center">
                            <span className="text-[#5e6272] font-semibold">Consent Status</span>
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[5px] uppercase ${getConsentStatusBadge(displayConsentStatus)}`}>
                              {displayConsentStatus || "Not Generated"}
                            </span>
                          </div>

                          {/* Conditional Action Buttons */}
                          {(!displayConsentStatus || displayConsentStatus.toLowerCase() === "expired") ? (
                            <div className="pt-1">
                              <button
                                onClick={() => handleGenerateConsentUrlClick(selectedEntity.entity_id)}
                                disabled={navigatingConsent}
                                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12px] font-extrabold transition-all shadow-xs cursor-pointer disabled:opacity-75"
                              >
                                {navigatingConsent ? (
                                  <>
                                    <RefreshCw size={14} className="animate-spin" />
                                    <span>Preparing Consent Request...</span>
                                  </>
                                ) : (
                                  <>
                                    <Link2 size={14} />
                                    <span>Generate Consent URL</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ) : (
                            <div className="pt-1">
                              <button
                                onClick={() => router.push(`/dashboard/requester/consent-details?entity_id=${selectedEntity.entity_id}`)}
                                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12px] font-extrabold transition-all shadow-xs cursor-pointer"
                              >
                                <Eye size={14} />
                                <span>View Consent Details</span>
                              </button>
                            </div>
                          )}

                          {(selectedEntity.consent_details?.authorization_url || selectedEntity.consent_url) && (
                            <div className="mt-1 p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                              <div className="text-[10px] font-semibold text-[#5e6272]">Active Consent Link</div>
                              <div className="text-[11px] font-mono text-[#0089CF] truncate mt-0.5">
                                {selectedEntity.consent_details?.authorization_url || selectedEntity.consent_url}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <hr className="border-0 border-t border-neutral-100 -mx-4" />

                  {/* Block 4: Timestamps & Verification */}
                  <div className="space-y-2.5">
                    <h5 className="text-[11px] font-extrabold text-[#5e6272] uppercase tracking-wide flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#0089CF]" /> Timestamps &amp; Status
                    </h5>
                    <div className="space-y-1.5 text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-[#5e6272] font-semibold">Verified By</span>
                        <span className="font-bold text-[#10142d]">{selectedEntity.verified_by || "Not Verified"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5e6272] font-semibold">Created At</span>
                        <span className="font-bold text-[#10142d]">{formatDate(selectedEntity.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5e6272] font-semibold">Updated At</span>
                        <span className="font-bold text-[#10142d]">{formatDate(selectedEntity.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Register Entity Modal Dialog */}
      <RegisterEntityModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleEntityCreatedSuccess}
        initialName={searchQuery.trim()}
      />
    </div>
  );
}
