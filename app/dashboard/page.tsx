"use client";

import React from "react";
import {
  FileText,
  Hourglass,
  CheckCircle2,
  XCircle,
  Download,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const lastUpdated = "31 May 2024 10:50 AM";
  const sessionTimeout = "29:45";

  return (
    <div className="p-2 max-w-[1400px] mx-auto space-y-2 animate-fade-in">

      {/* ══════════════ ROW 1: METRICS ══════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        
        {/* Metric 1: Total Requests */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-4.5 flex items-center justify-between shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-mid uppercase tracking-wide">Total Requests</span>
              <span className="text-[22px] font-extrabold text-[#10142d] mt-0.5 leading-none">1,248</span>
              <span className="text-[10px] font-bold text-[#16a34a] flex items-center gap-0.5 mt-1 leading-none">
                <TrendingUp size={11} /> +18.6% <span className="text-[#9094a8] font-semibold">this month</span>
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Pending Consents */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-4.5 flex items-center justify-between shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-[#fff7ed] text-[#ea580c] flex items-center justify-center shrink-0">
              <Hourglass size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-mid uppercase tracking-wide">Pending Consents</span>
              <span className="text-[22px] font-extrabold text-[#10142d] mt-0.5 leading-none">256</span>
              <span className="text-[10px] font-bold text-[#dc2626] flex items-center gap-0.5 mt-1 leading-none">
                <TrendingDown size={11} /> -5.3% <span className="text-[#9094a8] font-semibold">this month</span>
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Approved Consents */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-4.5 flex items-center justify-between shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-mid uppercase tracking-wide">Approved Consents</span>
              <span className="text-[22px] font-extrabold text-[#10142d] mt-0.5 leading-none">892</span>
              <span className="text-[10px] font-bold text-[#16a34a] flex items-center gap-0.5 mt-1 leading-none">
                <TrendingUp size={11} /> +22.1% <span className="text-[#9094a8] font-semibold">this month</span>
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Rejected Consents */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-4.5 flex items-center justify-between shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-[#fef2f2] text-[#dc2626] flex items-center justify-center shrink-0">
              <XCircle size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-mid uppercase tracking-wide">Rejected Consents</span>
              <span className="text-[22px] font-extrabold text-[#10142d] mt-0.5 leading-none">64</span>
              <span className="text-[10px] font-bold text-[#dc2626] flex items-center gap-0.5 mt-1 leading-none">
                <TrendingDown size={11} /> -8.7% <span className="text-[#9094a8] font-semibold">this month</span>
              </span>
            </div>
          </div>
        </div>

        {/* Metric 5: Documents Downloaded */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-4.5 flex items-center justify-between shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-[#f5f3ff] text-[#7c3aed] flex items-center justify-center shrink-0">
              <Download size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-mid uppercase tracking-wide">Docs Downloaded</span>
              <span className="text-[22px] font-extrabold text-[#10142d] mt-0.5 leading-none">2,157</span>
              <span className="text-[10px] font-bold text-[#16a34a] flex items-center gap-0.5 mt-1 leading-none">
                <TrendingUp size={11} /> +25.4% <span className="text-[#9094a8] font-semibold">this month</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════ ROW 2: DATA TABLE OVERVIEWS ══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        
        {/* Requester Overview */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e3e4ee]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] tracking-tight">Requester Overview</h3>
            <button className="text-[11.5px] font-extrabold text-[#1c4dbf] hover:underline cursor-pointer flex items-center">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3.5">
            {[
              { label: "Total Requests", value: "1,248", style: "text-[#10142d]", bg: "bg-blue-50" },
              { label: "Pending", value: "256", style: "text-[#ea580c]" },
              { label: "Approved", value: "892", style: "text-[#16a34a]" },
              { label: "Rejected", value: "64", style: "text-[#dc2626]" },
              { label: "Expired", value: "18", style: "text-neutral-500" },
              { label: "Failed", value: "18", style: "text-red-500 font-bold" },
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between text-[13px] font-semibold py-1.5 px-2 rounded-lg ${item.bg || ""}`}>
                <span className="text-[#5e6272]">{item.label}</span>
                <span className={`font-extrabold ${item.style}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Issuer Overview */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e3e4ee]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] tracking-tight">Issuer Overview</h3>
            <button className="text-[11.5px] font-extrabold text-[#1c4dbf] hover:underline cursor-pointer flex items-center">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3.5">
            {[
              { label: "Total Issuer Requests", value: "1,032", style: "text-[#10142d]", bg: "bg-blue-50" },
              { label: "Successful", value: "912", style: "text-[#16a34a]" },
              { label: "Failed", value: "86", style: "text-[#dc2626]" },
              { label: "Pending", value: "34", style: "text-[#ea580c]" },
              { label: "Documents Issued", value: "1,487", style: "text-[#7c3aed]" },
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between text-[13px] font-semibold py-1.5 px-2 rounded-lg ${item.bg || ""}`}>
                <span className="text-[#5e6272]">{item.label}</span>
                <span className={`font-extrabold ${item.style}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Gateway Overview */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e3e4ee]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] tracking-tight">API Gateway Overview</h3>
            <button className="text-[11.5px] font-extrabold text-[#1c4dbf] hover:underline cursor-pointer flex items-center">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3.5">
            {[
              { label: "Total API Calls", value: "5,642", style: "text-[#10142d]", bg: "bg-blue-50" },
              { label: "Successful", value: "5,102", style: "text-[#16a34a]" },
              { label: "Failed", value: "410", style: "text-[#dc2626]" },
              { label: "Active Clients", value: "28", style: "text-[#1c4dbf]" },
              { label: "Avg. Response Time", value: "320 ms", style: "text-[#e05c1a]" },
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between text-[13px] font-semibold py-1.5 px-2 rounded-lg ${item.bg || ""}`}>
                <span className="text-[#5e6272]">{item.label}</span>
                <span className={`font-extrabold ${item.style}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ══════════════ ROW 3: CHARTS & ACTIVITIES ══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        
        {/* Card 1: Requests Trend Chart (SVG Mock) */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e3e4ee]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] tracking-tight">Requests Trend</h3>
            <select className="text-[11.5px] font-bold text-text-mid bg-neutral-50 border border-[#e3e4ee] rounded-md px-2.5 py-1 cursor-pointer">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Year to Date</option>
            </select>
          </div>

          {/* Line Chart SVG Mockup */}
          <div className="relative h-[220px] w-full flex items-center justify-center">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="380" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="380" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="180" x2="380" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="30" y="24" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">400</text>
              <text x="30" y="64" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">300</text>
              <text x="30" y="104" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">200</text>
              <text x="30" y="144" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">100</text>
              <text x="30" y="184" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">0</text>

              {/* Chart Line - Total (Blue) */}
              <path
                d="M 50 150 L 100 130 L 150 110 L 200 90 L 250 110 L 300 70 L 350 90 L 380 75"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Chart Line - Approved (Green) */}
              <path
                d="M 50 170 L 100 155 L 150 135 L 200 120 L 250 140 L 300 100 L 350 125 L 380 110"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Chart Line - Rejected (Red) */}
              <path
                d="M 50 190 L 100 185 L 150 188 L 200 180 L 250 182 L 300 175 L 350 180 L 380 178"
                fill="none"
                stroke="#dc2626"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="300" cy="70" r="4.5" fill="#2563eb" stroke="white" strokeWidth="1.5" />
              <circle cx="300" cy="100" r="4" fill="#16a34a" stroke="white" strokeWidth="1.5" />

              {/* X Axis Labels */}
              <text x="50" y="195" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">1 May</text>
              <text x="100" y="195" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">5 May</text>
              <text x="150" y="195" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">10 May</text>
              <text x="200" y="195" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">15 May</text>
              <text x="250" y="195" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">20 May</text>
              <text x="300" y="195" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">25 May</text>
              <text x="350" y="195" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">31 May</text>
            </svg>
          </div>
          
          {/* Chart Legend */}
          <div className="flex justify-center gap-5 mt-2.5 text-[11px] font-bold text-text-mid">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-[#2563eb] rounded-full" /> Total</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-[#16a34a] rounded-full" /> Approved</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-[#dc2626] rounded-full" /> Rejected</span>
          </div>
        </div>

        {/* Card 2: Requests by Status Donut (SVG Mock) */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <h3 className="text-[14px] font-extrabold text-[#0089CF] mb-4 pb-3 border-b border-[#e3e4ee] tracking-tight">Requests by Status</h3>
          
          <div className="flex items-center gap-2.5 h-[220px]">
            {/* Donut Chart SVG */}
            <div className="relative w-[150px] h-[150px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Gray Base */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="11" />
                {/* Approved Segment (71.5%) - Length = 2 * pi * 40 * 0.715 = 179.7 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="11"
                  strokeDasharray="251.2"
                  strokeDashoffset="71.6"
                />
                {/* Pending Segment (20.5%) - Length = 51.5 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#ea580c"
                  strokeWidth="11"
                  strokeDasharray="251.2"
                  strokeDashoffset="201.0"
                />
                {/* Rejected Segment (5.1%) - Length = 12.8 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#dc2626"
                  strokeWidth="11"
                  strokeDasharray="251.2"
                  strokeDashoffset="233.8"
                />
                {/* Expired & Failed Segments (1.4% each) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#94a3b8"
                  strokeWidth="11"
                  strokeDasharray="251.2"
                  strokeDashoffset="246.6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="11"
                  strokeDasharray="251.2"
                  strokeDashoffset="250.1"
                />
              </svg>
              {/* Middle Label */}
              <div className="absolute inset-0 flex flex-col justify-center items-center select-none text-center">
                <span className="text-[17px] font-extrabold text-[#10142d] leading-none">1,248</span>
                <span className="text-[9.5px] font-bold text-[#9094a8] mt-1 leading-none uppercase">Total</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="flex-1 space-y-1.5 pl-2 text-[11px] font-bold text-text-mid">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#2563eb] rounded-full shrink-0" /> Approved</span>
                <span className="text-[#10142d] font-extrabold">892 (71.5%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#ea580c] rounded-full shrink-0" /> Pending</span>
                <span className="text-[#10142d] font-extrabold">256 (20.5%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#dc2626] rounded-full shrink-0" /> Rejected</span>
                <span className="text-[#10142d] font-extrabold">64 (5.1%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#94a3b8] rounded-full shrink-0" /> Expired</span>
                <span className="text-[#10142d] font-extrabold">18 (1.4%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#ef4444] rounded-full shrink-0" /> Failed</span>
                <span className="text-[#10142d] font-extrabold">18 (1.4%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Recent Activity Log */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e3e4ee]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] tracking-tight">Recent Activity</h3>
            <button className="text-[11.5px] font-extrabold text-[#1c4dbf] hover:underline cursor-pointer flex items-center">
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Act 1 */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#dcfce7] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <CheckCircle2 size={15} />
              </div>
              <div className="flex-1 flex justify-between gap-2.5 text-[12px]">
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#10142d]">Consent approved for request REQ12345</span>
                  <span className="text-[#5e6272] mt-0.5 font-medium">Customer: Rajesh Enterprises</span>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 shrink-0 whitespace-nowrap">10:45 AM</span>
              </div>
            </div>

            {/* Act 2 */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Download size={15} />
              </div>
              <div className="flex-1 flex justify-between gap-2.5 text-[12px]">
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#10142d]">Document downloaded</span>
                  <span className="text-[#5e6272] mt-0.5 font-medium">PAN Verification Record</span>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 shrink-0 whitespace-nowrap">10:32 AM</span>
              </div>
            </div>

            {/* Act 3 */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Hourglass size={15} />
              </div>
              <div className="flex-1 flex justify-between gap-2.5 text-[12px]">
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#10142d]">Consent link sent for request REQ12346</span>
                  <span className="text-[#5e6272] mt-0.5 font-medium">Customer: Shree Traders</span>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 shrink-0 whitespace-nowrap">10:15 AM</span>
              </div>
            </div>

            {/* Act 4 */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#f3e8ff] text-[#9333ea] border border-[#f3e8ff] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <FileText size={15} />
              </div>
              <div className="flex-1 flex justify-between gap-2.5 text-[12px]">
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#10142d]">Issuer document generated</span>
                  <span className="text-[#5e6272] mt-0.5 font-medium">Loan Account Statement</span>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 shrink-0 whitespace-nowrap">09:58 AM</span>
              </div>
            </div>

            {/* Act 5 */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#fef2f2] text-[#dc2626] border border-[#fee2e2] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <XCircle size={15} />
              </div>
              <div className="flex-1 flex justify-between gap-2.5 text-[12px]">
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#10142d]">Consent rejected for request REQ12344</span>
                  <span className="text-[#5e6272] mt-0.5 font-medium">Customer: ABC Pvt Ltd</span>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 shrink-0 whitespace-nowrap">09:30 AM</span>
              </div>
            </div>

          </div>
        </div>

        

      </div>

      <div className="flex justify-end items-center w-full">
        <div className="flex items-center gap-4 text-[12px] font-semibold text-text-mid">
          <span>Last Updated: <span className="text-[#10142d] font-bold">{lastUpdated}</span></span>
          <div className="w-[1.5px] h-3.5 bg-neutral-200" />
          <span className="flex items-center gap-1">
            <Clock size={13} className="text-[#e05c1a]" />
            Session Timeout: <span className="text-[#e05c1a] font-extrabold">{sessionTimeout}</span>
          </span>
        </div>
      </div>

    </div>
  );
}
