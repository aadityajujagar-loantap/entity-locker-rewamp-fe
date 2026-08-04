"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  X,
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
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import {
  fetchCurrentUserProfile,
  changePassword,
  CurrentUserProfile,
  ChangePasswordApiError,
} from "@/services/users/userDetails";

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

  // Change Password Form States
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  const [changePassSuccess, setChangePassSuccess] = useState<string | null>(null);
  const [changePassError, setChangePassError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

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
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangePassSuccess(null);
      setChangePassError(null);
      setFieldErrors({});
    }
  }, [isOpen, loadData]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !changingPassword) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, changingPassword]);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError(null);
    setChangePassSuccess(null);
    setFieldErrors({});

    if (!currentPassword) {
      setFieldErrors({ current_password: ["The current password field is required."] });
      return;
    }
    if (!newPassword) {
      setFieldErrors({ password: ["The password field is required."] });
      return;
    }
    if (newPassword.length < 8) {
      setFieldErrors({ password: ["The password field must be at least 8 characters."] });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFieldErrors({ password: ["The password confirmation does not match."] });
      return;
    }

    setChangingPassword(true);

    try {
      const msg = await changePassword(
        {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
        accessToken
      );

      setChangePassSuccess(msg);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Auto hide form after 2 seconds
      setTimeout(() => {
        setShowChangePassword(false);
        setChangePassSuccess(null);
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof ChangePasswordApiError) {
        setChangePassError(err.message);
        if (err.errors) {
          setFieldErrors(err.errors);
        }
      } else {
        const msg = err instanceof Error ? err.message : "Failed to change password.";
        setChangePassError(msg);
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName]?.[0];
  };

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
            disabled={changingPassword}
            className="p-1 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
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
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${profile.status === "ACTIVE"
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

              {/* Section 4: Change Password Expandable Section */}
              <div className="pt-1">
                <div className="border border-[#e3e4ee] rounded-xl overflow-hidden bg-neutral-50/50">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(!showChangePassword);
                      setChangePassSuccess(null);
                      setChangePassError(null);
                      setFieldErrors({});
                    }}
                    className="w-full px-4 py-2.5 bg-white hover:bg-neutral-50 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2 text-[12.5px] font-bold text-[#10142d]">
                      <Lock size={15} className="text-[#0089CF]" />
                      <span>Update Account Password</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11.5px] font-extrabold text-[#0089CF]">
                      <span>{showChangePassword ? "Hide Form" : "Change Password"}</span>
                      {showChangePassword ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {showChangePassword && (
                    <form onSubmit={handleChangePasswordSubmit} className="p-4 border-t border-[#e3e4ee] bg-white space-y-3 text-[12.5px]">
                      {changePassSuccess && (
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[12px] font-bold flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          <span>{changePassSuccess}</span>
                        </div>
                      )}

                      {changePassError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[12px] font-semibold flex items-center gap-2">
                          <AlertCircle size={16} className="text-red-600 shrink-0" />
                          <span>{changePassError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Current Password */}
                        <div>
                          <label className="block mb-1 font-bold text-[#10142d]">
                            Current Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={changingPassword}
                            className={`w-full px-3 py-2 border rounded-lg text-[13px] font-semibold outline-none transition-all ${
                              getFieldError("current_password")
                                ? "border-red-500 bg-red-50/20 focus:border-red-600"
                                : "border-[#e3e4ee] focus:border-[#0089CF]"
                            }`}
                          />
                          {getFieldError("current_password") && (
                            <p className="mt-1 text-[11px] font-bold text-red-600">
                              {getFieldError("current_password")}
                            </p>
                          )}
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block mb-1 font-bold text-[#10142d]">
                            New Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Min 8 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={changingPassword}
                            className={`w-full px-3 py-2 border rounded-lg text-[13px] font-semibold outline-none transition-all ${
                              getFieldError("password")
                                ? "border-red-500 bg-red-50/20 focus:border-red-600"
                                : "border-[#e3e4ee] focus:border-[#0089CF]"
                            }`}
                          />
                          {getFieldError("password") && (
                            <p className="mt-1 text-[11px] font-bold text-red-600">
                              {getFieldError("password")}
                            </p>
                          )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                          <label className="block mb-1 font-bold text-[#10142d]">
                            Confirm New Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={changingPassword}
                            className="w-full px-3 py-2 border border-[#e3e4ee] rounded-lg text-[13px] font-semibold outline-none focus:border-[#0089CF] transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowChangePassword(false);
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                            setChangePassError(null);
                            setFieldErrors({});
                          }}
                          disabled={changingPassword}
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-[#10142d] font-bold cursor-pointer transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={changingPassword}
                          className="px-4 py-1.5 rounded-lg bg-[#0089CF] hover:bg-[#0072ad] text-white font-extrabold cursor-pointer transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {changingPassword ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Updating...</span>
                            </>
                          ) : (
                            <span>Change Password</span>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 px-5 py-2.5 border-t border-[#e3e4ee] flex items-center justify-between shrink-0">
          <button
            onClick={loadData}
            disabled={loading || changingPassword}
            className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#0089CF] hover:text-[#0072ad] disabled:opacity-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={onClose}
            disabled={changingPassword}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-[#10142d] text-[12px] font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
