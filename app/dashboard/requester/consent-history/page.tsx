"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Boxes,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function ConsentHistoryPage() {
  const router = useRouter();
  const [searchEntityId, setSearchEntityId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchEntityId.trim()) {
      router.push(`/dashboard/requester/consent-details?entity_id=${encodeURIComponent(searchEntityId.trim())}`);
    }
  };

  return (
    <div className="p-4 max-w-[1200px] mx-auto space-y-5 font-manrope animate-fade-in">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-extrabold text-[#10142d] tracking-tight flex items-center gap-2.5">
            <Boxes className="text-[#0089CF]" size={22} />
            Consent History &amp; Records
          </h2>
          <p className="text-[12.5px] font-medium text-[#5e6272] mt-0.5">
            Lookup and review authorization lifecycles, granted entity consents, and audit trails
          </p>
        </div>
      </div>

      {/* Quick Lookup Card */}
      <div className="p-5 rounded-2xl bg-white border border-[#e3e4ee] shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-4">
        <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-[#5e6272] flex items-center gap-2">
          <Search size={15} className="text-[#0089CF]" />
          Lookup Consent Record
        </h3>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 max-w-[600px]">
          <input
            type="text"
            placeholder="Enter Entity ID (e.g. ENT-2026-0001)..."
            value={searchEntityId}
            onChange={(e) => setSearchEntityId(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-50 border border-[#e3e4ee] text-[13px] font-medium text-[#10142d] outline-none focus:border-[#0089CF] focus:bg-white transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12.5px] font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <span>View Record</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => router.push("/dashboard/requester/entity-list")}
          className="p-5 rounded-2xl bg-white border border-[#e3e4ee] hover:border-[#0089CF]/50 shadow-[0_2px_12px_rgba(18,22,46,0.03)] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0089CF]/10 text-[#0089CF] flex items-center justify-center shrink-0 group-hover:bg-[#0089CF] group-hover:text-white transition-colors">
              <Building2 size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-extrabold text-[#10142d] group-hover:text-[#0089CF] transition-colors">
                Entity Management
              </h4>
              <p className="text-[12px] text-[#5e6272] mt-0.5">
                Browse all registered entities and their live consent statuses
              </p>
            </div>
            <ExternalLink size={15} className="text-[#9094a8] group-hover:text-[#0089CF] transition-colors" />
          </div>
        </div>

        <div
          onClick={() => router.push("/dashboard/requester/shared-link-status")}
          className="p-5 rounded-2xl bg-white border border-[#e3e4ee] hover:border-[#0089CF]/50 shadow-[0_2px_12px_rgba(18,22,46,0.03)] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0089CF]/10 text-[#0089CF] flex items-center justify-center shrink-0 group-hover:bg-[#0089CF] group-hover:text-white transition-colors">
              <Clock size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-extrabold text-[#10142d] group-hover:text-[#0089CF] transition-colors">
                Shared Link Status
              </h4>
              <p className="text-[12px] text-[#5e6272] mt-0.5">
                Monitor authorization URLs delivered to customers
              </p>
            </div>
            <ExternalLink size={15} className="text-[#9094a8] group-hover:text-[#0089CF] transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}

