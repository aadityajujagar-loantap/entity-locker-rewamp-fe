"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  User,
  Mail,
  Building2,
  Shield,
  Clock,
  Phone,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  IdCard,
  Calendar,
  Layers,
  UserCheck,
} from "lucide-react";
import { fetchCurrentUserProfile, CurrentUserProfile } from "@/services/user.service";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  } catch {
    return dateStr;
  }
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function UserProfileModal({ isOpen, onClose, accessToken }: UserProfileModalProps) {
  const [profile, setProfile] = useState<CurrentUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentUserProfile(accessToken);
      setProfile(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load user profile.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e3e4ee] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0089CF] px-5 py-3 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md">
              <UserCheck size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-[15.5px] font-bold leading-tight">User Account Profile</h2>
              <p className="text-[11px] text-white/80 font-medium">
                Detailed user profile metadata &amp; active session permissions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 scrollbar-thin">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <RefreshCw size={30} className="text-[#0089CF] animate-spin" />
              <p className="text-[12.5px] font-bold text-[#5e6272]">Fetching profile details from server...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center text-center space-y-2">
              <AlertCircle size={30} className="text-red-500" />
              <div>
                <h4 className="text-[13.5px] font-bold text-red-900">Failed to Load Profile</h4>
                <p className="text-[12px] text-red-700 mt-0.5">{error}</p>
              </div>
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11.5px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Retry</span>
              </button>
            </div>
          ) : profile ? (
            <>
              {/* User Hero Badge Banner */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-100/80">
                <div className="w-11 h-11 rounded-full bg-[#0089CF] text-white font-extrabold text-[16px] flex items-center justify-center shadow-md shrink-0">
                  {getInitials(profile.name)}
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0 space-y-0.5">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h3 className="text-[15.5px] font-extrabold text-[#10142d] tracking-tight truncate">{profile.name || "N/A"}</h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                        profile.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <CheckCircle2 size={11} />
                      {profile.status || "ACTIVE"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[12px] text-[#5e6272] font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-[#0089CF] shrink-0" />
                      <span>{profile.email || "No email address"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-[#5e6272]/80 font-medium">
                      <Building2 size={13} className="text-[#0089CF] shrink-0" />
                      <span>
                        Branch: <strong className="text-[#10142d] font-bold">{profile.branch_name || "N/A"}</strong> ({profile.branch_code || "N/A"})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 1: Basic Identifiers */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#5e6272] mb-1.5 flex items-center gap-1.5">
                  <IdCard size={13} className="text-[#0089CF]" />
                  Employee &amp; Identity Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70">
                    <div className="text-[10.5px] font-semibold text-[#5e6272]">User ID</div>
                    <div className="text-[12.5px] font-extrabold text-[#10142d] mt-0.5">#{profile.id}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70">
                    <div className="text-[10.5px] font-semibold text-[#5e6272]">Employee ID</div>
                    <div className="text-[12.5px] font-extrabold text-[#10142d] mt-0.5">{profile.employee_id || "N/A"}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70">
                    <div className="text-[10.5px] font-semibold text-[#5e6272]">PF Number</div>
                    <div className="text-[12.5px] font-extrabold text-[#10142d] mt-0.5">{profile.pf_number || "N/A"}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70">
                    <div className="text-[10.5px] font-semibold text-[#5e6272] flex items-center gap-1">
                      <Phone size={11} className="text-[#5e6272]" /> Mobile Number
                    </div>
                    <div className="text-[12.5px] font-extrabold text-[#10142d] mt-0.5">{profile.mobile || "N/A"}</div>
                  </div>
                </div>
              </div>

              {/* Grid 2: Roles & Permissions */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#5e6272] mb-1.5 flex items-center gap-1.5">
                  <Shield size={13} className="text-[#0089CF]" />
                  Assigned Security Roles
                </h4>
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70">
                  {profile.roles && profile.roles.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {profile.roles.map((role) => (
                        <div
                          key={role.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#0072ad] text-[11.5px] font-bold"
                        >
                          <Layers size={12} />
                          <span>{role.name}</span>
                          {role.guard_name && (
                            <span className="text-[9.5px] uppercase tracking-wider font-semibold text-blue-500/80 bg-white px-1 py-0.2 rounded border border-blue-100">
                              {role.guard_name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11.5px] text-[#5e6272]">No specific roles assigned</p>
                  )}
                </div>
              </div>

              {/* Grid 3: Security & Session Metadata */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#5e6272] mb-1.5 flex items-center gap-1.5">
                  <Clock size={13} className="text-[#0089CF]" />
                  Session &amp; Security Timestamps
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11.5px]">
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 flex items-start gap-2">
                    <Clock size={14} className="text-[#0089CF] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10.5px] font-semibold text-[#5e6272]">Last Login At</div>
                      <div className="font-bold text-[#10142d] mt-0.5 leading-snug">{formatDate(profile.last_login_at)}</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 flex items-start gap-2">
                    <KeyRound size={14} className="text-[#0089CF] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10.5px] font-semibold text-[#5e6272]">Password Changed</div>
                      <div className="font-bold text-[#10142d] mt-0.5 leading-snug">{formatDate(profile.password_changed_at)}</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 flex items-start gap-2">
                    <Calendar size={14} className="text-[#0089CF] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10.5px] font-semibold text-[#5e6272]">Created At</div>
                      <div className="font-bold text-[#10142d] mt-0.5 leading-snug">{formatDate(profile.created_at)}</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 flex items-start gap-2">
                    <Calendar size={14} className="text-[#0089CF] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10.5px] font-semibold text-[#5e6272]">Updated At</div>
                      <div className="font-bold text-[#10142d] mt-0.5 leading-snug">{formatDate(profile.updated_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 px-5 py-2.5 border-t border-[#e3e4ee] flex items-center justify-between shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#0089CF] hover:text-[#0072ad] disabled:opacity-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-[#10142d] text-[12px] font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
