"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  UserCog,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Building2,
  Shield,
  Mail,
  Phone,
  Clock,
  Plus,
  SearchX,
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { fetchUserList, UserItem } from "@/services/users/userListService";

const PAGE_SIZE = 15;

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dateStr;
  }
}

export default function UserListPage() {
  const router = useRouter();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Load Users from API
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const session = getAuthSession();
      if (!session || !session.accessToken) {
        throw new Error("No active authentication session found. Please log in again.");
      }
      const data = await fetchUserList(session.accessToken);
      setUsers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch user list.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.employee_id?.toLowerCase().includes(q) ||
        item.pf_number?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.mobile?.includes(q) ||
        item.branch_name?.toLowerCase().includes(q) ||
        item.branch_code?.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, selectedStatus]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  // Metrics summary
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const hqCount = users.filter((u) => u.branch_code === "HQ" || u.branch_name?.toLowerCase().includes("head")).length;
  const adminCount = users.filter((u) => u.roles && u.roles.some((r) => r.toLowerCase().includes("admin"))).length;

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "INACTIVE":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "BLOCKED":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-neutral-100 text-neutral-800 border border-neutral-200";
    }
  };

  return (
    <div className="p-3 max-w-[1400px] mx-auto space-y-3 font-manrope animate-fade-in">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-[18px] font-extrabold text-[#0089CF] tracking-tight flex items-center gap-2">
            <UserCog size={20} />
            User Management
          </h2>
          <p className="text-[11.5px] font-medium text-[#5e6272]">
            Overview of registered bank employees, portal administrators, and role permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Create User Primary Button */}
          <button
            onClick={() => router.push("/users/create")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12.5px] font-extrabold transition-all shadow-xs cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Create User</span>
          </button>
          <button
            onClick={loadUsers}
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
            <UserCog size={17} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5e6272] uppercase tracking-wide">Total Users</span>
            <span className="text-[19px] font-extrabold text-[#10142d] mt-0.5 leading-none">{totalCount}</span>
          </div>
        </div>

        <div className="bg-white border border-[#e3e4ee] rounded-[14px] p-3.5 flex items-center gap-3 shadow-[0_2px_8px_rgba(18,22,46,0.015)]">
          <div className="w-9 h-9 rounded-[9px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={17} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5e6272] uppercase tracking-wide">Active Users</span>
            <span className="text-[19px] font-extrabold text-[#10142d] mt-0.5 leading-none">{activeCount}</span>
          </div>
        </div>

        <div className="bg-white border border-[#e3e4ee] rounded-[14px] p-3.5 flex items-center gap-3 shadow-[0_2px_8px_rgba(18,22,46,0.015)]">
          <div className="w-9 h-9 rounded-[9px] bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Building2 size={17} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5e6272] uppercase tracking-wide">Head Office (HQ)</span>
            <span className="text-[19px] font-extrabold text-[#10142d] mt-0.5 leading-none">{hqCount}</span>
          </div>
        </div>

        <div className="bg-white border border-[#e3e4ee] rounded-[14px] p-3.5 flex items-center gap-3 shadow-[0_2px_8px_rgba(18,22,46,0.015)]">
          <div className="w-9 h-9 rounded-[9px] bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Shield size={17} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5e6272] uppercase tracking-wide">System Admins</span>
            <span className="text-[19px] font-extrabold text-[#10142d] mt-0.5 leading-none">{adminCount}</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Table Card */}
      <div className="bg-white border border-[#e3e4ee] rounded-[14px] p-4 shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-3">
        
        {/* Filters Bar */}
        <div className="flex flex-wrap gap-2.5 items-center justify-between border-b border-[#e3e4ee] pb-3">
          <div className="flex flex-1 min-w-0 flex-wrap gap-2 items-center">
            
            {/* Search Bar */}
            <div className="relative flex min-w-[260px] flex-1 items-center h-[36px] border border-[#e3e4ee] rounded-[9px] focus-within:border-[#0089CF] bg-white">
              <Search size={14} className="absolute left-3 text-[#5e6272]" />
              <input
                type="text"
                placeholder="Search by Name, Employee ID, PF, Email, Branch..."
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
            </select>

          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/users/create")}
              className="flex items-center gap-1.5 px-3 h-[36px] rounded-[9px] bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12px] font-extrabold cursor-pointer transition-all shadow-2xs"
            >
              <Plus size={14} />
              <span>Create User</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 h-[36px] border border-[#e3e4ee] rounded-[9px] text-[12px] font-bold text-[#10142d] hover:bg-neutral-50 cursor-pointer bg-white">
              <DownloadCloud size={13} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-14 flex flex-col items-center justify-center space-y-3">
            <RefreshCw size={34} className="text-[#0089CF] animate-spin" />
            <p className="text-[13px] font-bold text-[#5e6272]">Fetching bank &amp; system users...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-5 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center text-center space-y-2">
            <AlertCircle size={34} className="text-red-500" />
            <div>
              <h4 className="text-[14px] font-bold text-red-900">Failed to Load User List</h4>
              <p className="text-[12px] text-red-700 mt-0.5">{error}</p>
            </div>
            <button
              onClick={loadUsers}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          /* User Data Table */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e3e4ee] text-[10.5px] font-bold text-[#5e6272] uppercase text-left whitespace-nowrap">
                  <th className="py-2.5 px-3">Employee ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">PF Number</th>
                  <th className="py-2.5 px-3">Email &amp; Mobile</th>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Roles</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Login At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {paginatedUsers.map((item) => (
                  <tr
                    key={item.id}
                    className="text-[11.5px] font-semibold text-[#10142d] hover:bg-neutral-50/80 transition-colors select-none whitespace-nowrap"
                  >
                    {/* Employee ID */}
                    <td className="py-2.5 px-3 font-extrabold text-[#0089CF]">
                      {item.employee_id || `#${item.id}`}
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-3 font-extrabold">
                      {item.name || "-"}
                    </td>

                    {/* PF Number */}
                    <td className="py-2.5 px-3 text-[#5e6272]">
                      {item.pf_number || "-"}
                    </td>

                    {/* Email & Mobile */}
                    <td className="py-2.5 px-3 text-[#5e6272]">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#10142d] flex items-center gap-1">
                          <Mail size={11} className="text-[#0089CF]" />
                          {item.email || "-"}
                        </span>
                        {item.mobile && (
                          <span className="text-[10.5px] text-[#5e6272] flex items-center gap-1 mt-0.5">
                            <Phone size={10} />
                            {item.mobile}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-2.5 px-3 text-[#5e6272]">
                      <span className="font-bold text-[#10142d]">
                        {item.branch_name || "Head Office"}
                      </span>
                      {item.branch_code && (
                        <span className="ml-1 text-[10px] font-bold text-[#5e6272]">
                          ({item.branch_code})
                        </span>
                      )}
                    </td>

                    {/* Roles */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {item.roles && item.roles.length > 0 ? (
                          item.roles.map((r, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold uppercase"
                            >
                              {r}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                            User
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[5px] uppercase ${getStatusBadge(item.status)}`}>
                        {item.status || "ACTIVE"}
                      </span>
                    </td>

                    {/* Last Login At */}
                    <td className="py-2.5 px-3 text-[#5e6272] font-medium flex items-center gap-1">
                      <Clock size={12} className="text-[#9094a8]" />
                      <span>{formatDate(item.last_login_at)}</span>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto p-4 rounded-xl border border-dashed border-[#e3e4ee] bg-neutral-50/60">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0089CF] flex items-center justify-center">
                          <SearchX size={20} />
                        </div>
                        <div>
                          <h4 className="text-[13px] font-extrabold text-[#10142d]">No User Found</h4>
                          <p className="text-[11.5px] text-[#5e6272] font-medium mt-0.5">
                            {searchQuery
                              ? `No users match "${searchQuery}". Try a different keyword.`
                              : "No registered bank users found."}
                          </p>
                        </div>
                        <button
                          onClick={() => router.push("/users/create")}
                          className="mt-1 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12px] font-extrabold transition-colors cursor-pointer shadow-xs"
                        >
                          <UserPlus size={14} />
                          <span>Create New User</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#f1f5f9] pt-3 text-[12px] font-bold text-[#5e6272] gap-2">
            <span>
              Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredUsers.length)} to{" "}
              {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length} entries (15 per page)
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
                      ? "bg-[#0089CF] text-[#fff] shadow-xs"
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
    </div>
  );
}
