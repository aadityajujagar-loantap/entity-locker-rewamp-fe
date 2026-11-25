"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  Lock,
  User,
  Shield,
} from "lucide-react";
import { getAuthSession, getPortalApiBaseUrl } from "@/lib/auth";

export default function CreateUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    employee_id: "",
    pf_number: "",
    name: "",
    email: "",
    mobile: "",
    branch_code: "",
    branch_name: "",
    status: "ACTIVE",
    password: "",
    role: "branch_user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const session = getAuthSession();
    if (!session?.accessToken) {
      setError("Active session not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const baseUrl = getPortalApiBaseUrl();
      const response = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          employee_id: formData.employee_id,
          pf_number: formData.employee_id,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile || null,
          branch_code: formData.branch_code || null,
          branch_name: formData.branch_name || null,
          status: formData.status,
          password: formData.password,
          roles: [formData.role],
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        let msg = "Failed to create user.";
        if (payload && typeof payload === "object") {
          if (typeof payload.message === "string") msg = payload.message;
          if (payload.errors && typeof payload.errors === "object") {
            const firstErr = Object.values(payload.errors as Record<string, string[]>).flat()[0];
            if (firstErr) msg = firstErr;
          }
        }
        throw new Error(msg);
      }

      setSuccess("User created successfully!");
      setTimeout(() => {
        router.push("/users");
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mx-auto space-y-4 font-manrope animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/users")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e3e4ee] bg-white hover:bg-neutral-50 text-[12.5px] font-bold text-[#10142d] transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Back to Users</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#e3e4ee] shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0089CF]/10 text-[#0089CF] flex items-center justify-center shrink-0">
            <UserPlus size={22} />
          </div>
          <div>
            <h2 className="text-[18px] font-extrabold text-[#10142d]">Create New User</h2>
            <p className="text-[12px] font-medium text-[#5e6272]">
              Register a new portal user with branch assignments and role permissions
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12.5px] flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12.5px] flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
            <span>{success} Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12.5px]">
            <div>
              <label className="block font-bold text-[#10142d] mb-1">Employee ID *</label>
              <input
                type="text"
                name="employee_id"
                required
                value={formData.employee_id}
                onChange={handleChange}
                placeholder="e.g. EMP-1002"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-[#e3e4ee] outline-none focus:border-[#0089CF] focus:bg-white text-[12.5px]"
              />
            </div>

            {/* <div>
              <label className="block font-bold text-[#10142d] mb-1">PF Number *</label>
              <input
                type="text"
                name="pf_number"
                required
                value={formData.pf_number}
                onChange={handleChange}
                placeholder="e.g. PF-1002"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-[#e3e4ee] outline-none focus:border-[#0089CF] focus:bg-white text-[12.5px]"
              />
            </div> */}

            <div>
              <label className="block font-bold text-[#10142d] mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Amit Sharma"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-[#e3e4ee] outline-none focus:border-[#0089CF] focus:bg-white text-[12.5px]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#10142d] mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. amit.sharma@mahabank.com"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-[#e3e4ee] outline-none focus:border-[#0089CF] focus:bg-white text-[12.5px]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#10142d] mb-1">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-[#e3e4ee] outline-none focus:border-[#0089CF] focus:bg-white text-[12.5px]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#10142d] mb-1">Password *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-[#e3e4ee] outline-none focus:border-[#0089CF] focus:bg-white text-[12.5px]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#10142d] mb-1">Branch Code</label>
              <input
                type="text"
                name="branch_code"
                value={formData.branch_code}
                onChange={handleChange}
                placeholder="e.g. BOM001"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-[#e3e4ee] outline-none focus:border-[#0089CF] focus:bg-white text-[12.5px]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#10142d] mb-1">Branch Name</label>
              <input
                type="text"
                name="branch_name"
                value={formData.branch_name}
                onChange={handleChange}
                placeholder="e.g. Pune Main Branch"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-[#e3e4ee] outline-none focus:border-[#0089CF] focus:bg-white text-[12.5px]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#10142d] mb-1">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-[#e3e4ee] outline-none focus:border-[#0089CF] focus:bg-white text-[12.5px]"
              >
                <option value="branch_user">User</option>
                <option value="admin">Administrator</option>
                <option value="branch_manager">Requester</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#10142d] mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-[#e3e4ee] outline-none focus:border-[#0089CF] focus:bg-white text-[12.5px]"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => router.push("/users")}
              className="px-4 py-2 rounded-xl border border-[#e3e4ee] bg-white hover:bg-neutral-50 text-[12.5px] font-bold text-[#10142d] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12.5px] font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading && <RefreshCw size={14} className="animate-spin" />}
              <span>{loading ? "Creating User..." : "Save User"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

