"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  AlertCircle,
  Layers,
  Building2,
  Activity,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import {
  fetchDashboardSummary,
  fetchDashboardReports,
  DashboardReportsData,
  MonthlyTrendItem,
} from "@/services/dashboardService";
import { DashboardSummaryData } from "@/services/requestList";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryData | null>(null);
  const [reports, setReports] = useState<DashboardReportsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("-");
  const sessionTimeout = "29:45";

  // Fetch real-time dashboard data from both summary & reports APIs
  const loadDashboardData = useCallback(async () => {
    const session = getAuthSession();
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const [summaryRes, reportsRes] = await Promise.all([
        fetchDashboardSummary(session.accessToken).catch((err) => {
          console.warn("Summary fetch error:", err);
          return null;
        }),
        fetchDashboardReports(session.accessToken).catch((err) => {
          console.warn("Reports fetch error:", err);
          return null;
        }),
      ]);

      if (summaryRes) setSummary(summaryRes);
      if (reportsRes) setReports(reportsRes);

      setLastUpdated(
        new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load dashboard metrics.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Derived metrics from live API response
  const totalRequests = summary?.consent_request_summary?.total_consent_requests ?? 0;
  const pendingConsents = summary?.consent_request_summary?.status_wise?.pending ?? 0;
  const approvedConsents =
    (summary?.consent_request_summary?.status_wise?.authorized ?? 0) +
    (summary?.consent_request_summary?.status_wise?.approved ?? 0);
  const failedConsents = summary?.consent_request_summary?.status_wise?.failed ?? 0;
  const expiredConsents = summary?.consent_request_summary?.status_wise?.expired ?? 0;
  const rejectedConsents = failedConsents + expiredConsents + (summary?.consent_request_summary?.status_wise?.rejected ?? 0);

  const totalDocuments = summary?.document_request_summary?.total_documents ?? 0;
  const docsDownloaded = summary?.document_request_summary?.download_status_wise?.DOWNLOADED ?? 0;
  const docsPendingDownload = summary?.document_request_summary?.download_status_wise?.PENDING_DOWNLOAD ?? 0;
  const issuedDocs = summary?.document_request_summary?.source_wise?.ISSUED ?? 0;
  const selfUploadedDocs = summary?.document_request_summary?.source_wise?.SELF_UPLOADED ?? 0;

  // Compute Donut Chart Angles & Segments dynamically
  const donutTotal = totalRequests > 0 ? totalRequests : 1;
  const circumference = 251.2; // 2 * PI * 40
  const approvedPct = (approvedConsents / donutTotal) * 100;
  const pendingPct = (pendingConsents / donutTotal) * 100;
  const rejectedPct = (failedConsents / donutTotal) * 100;
  const expiredPct = (expiredConsents / donutTotal) * 100;

  const approvedOffset = circumference - (circumference * approvedPct) / 100;
  const pendingOffset = approvedOffset - (circumference * pendingPct) / 100;
  const rejectedOffset = pendingOffset - (circumference * rejectedPct) / 100;

  // Compute Line Chart SVG Paths dynamically based on 6-month reports
  const trendItems: MonthlyTrendItem[] =
    reports?.requests_trend_monthly && reports.requests_trend_monthly.length > 0
      ? reports.requests_trend_monthly
      : [
          { month: "Month 1", year_month: "1", document_requests: 0, consent_requests: 0, entities_registered: 0 },
          { month: "Month 2", year_month: "2", document_requests: 0, consent_requests: 0, entities_registered: 0 },
          { month: "Month 3", year_month: "3", document_requests: 0, consent_requests: 0, entities_registered: 0 },
          { month: "Month 4", year_month: "4", document_requests: 0, consent_requests: 0, entities_registered: 0 },
          { month: "Month 5", year_month: "5", document_requests: 0, consent_requests: 0, entities_registered: 0 },
          { month: "Month 6", year_month: "6", document_requests: 0, consent_requests: 0, entities_registered: 0 },
        ];

  const maxVal = Math.max(
    10,
    ...trendItems.map((item) =>
      Math.max(item.consent_requests || 0, item.document_requests || 0, item.entities_registered || 0)
    )
  );

  const getPoints = (accessor: (it: MonthlyTrendItem) => number) => {
    const xStart = 50;
    const xStep = 66; // (380 - 50) / 5
    return trendItems.map((item, idx) => {
      const x = xStart + idx * xStep;
      const val = accessor(item);
      const y = 180 - (val / maxVal) * 150;
      return { x, y, val };
    });
  };

  const consentPoints = getPoints((it) => it.consent_requests || 0);
  const docPoints = getPoints((it) => it.document_requests || 0);

  const consentPath =
    consentPoints.length > 0
      ? `M ${consentPoints.map((p) => `${p.x} ${p.y}`).join(" L ")}`
      : "M 50 180 L 380 180";

  const docPath =
    docPoints.length > 0
      ? `M ${docPoints.map((p) => `${p.x} ${p.y}`).join(" L ")}`
      : "M 50 180 L 380 180";

  return (
    <div className="p-2 mx-auto space-y-3 animate-fade-in">
      {/* ══════════════ TOP CONTROLS & REFRESH ══════════════ */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-[17px] font-extrabold text-[#10142d] tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-[11.5px] font-medium text-[#5e6272]">
            Real-time analytics for Entity Locker consents, requests, and verified documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e3e4ee] bg-white hover:bg-neutral-50 text-[12px] font-bold text-[#10142d] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-[#0089CF]" : "text-[#5e6272]"} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-[12px] font-semibold flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ══════════════ ROW 1: DYNAMIC METRICS ══════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {/* Metric 1: Total Requests */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-mid uppercase tracking-wide">Total Requests</span>
              <span className="text-[22px] font-extrabold text-[#10142d] mt-0.5 leading-none">
                {loading ? <span className="inline-block w-12 h-5 bg-neutral-200 animate-pulse rounded" /> : totalRequests.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-[#0089CF] flex items-center gap-0.5 mt-1 leading-none">
                <Activity size={10} /> Live sync
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Pending Consents */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-[#fff7ed] text-[#ea580c] flex items-center justify-center shrink-0">
              <Hourglass size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-mid uppercase tracking-wide">Pending Consents</span>
              <span className="text-[22px] font-extrabold text-[#10142d] mt-0.5 leading-none">
                {loading ? <span className="inline-block w-12 h-5 bg-neutral-200 animate-pulse rounded" /> : pendingConsents.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-[#ea580c] flex items-center gap-0.5 mt-1 leading-none">
                Awaiting approval
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Approved Consents */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-mid uppercase tracking-wide">Approved Consents</span>
              <span className="text-[22px] font-extrabold text-[#10142d] mt-0.5 leading-none">
                {loading ? <span className="inline-block w-12 h-5 bg-neutral-200 animate-pulse rounded" /> : approvedConsents.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-[#16a34a] flex items-center gap-0.5 mt-1 leading-none">
                Ready for documents
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Rejected / Expired */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-[#fef2f2] text-[#dc2626] flex items-center justify-center shrink-0">
              <XCircle size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-mid uppercase tracking-wide">Rejected / Expired</span>
              <span className="text-[22px] font-extrabold text-[#10142d] mt-0.5 leading-none">
                {loading ? <span className="inline-block w-12 h-5 bg-neutral-200 animate-pulse rounded" /> : rejectedConsents.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-[#dc2626] flex items-center gap-0.5 mt-1 leading-none">
                {expiredConsents} Expired
              </span>
            </div>
          </div>
        </div>

        {/* Metric 5: Docs Downloaded */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-[#f5f3ff] text-[#7c3aed] flex items-center justify-center shrink-0">
              <Download size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-mid uppercase tracking-wide">Docs Downloaded</span>
              <span className="text-[22px] font-extrabold text-[#10142d] mt-0.5 leading-none">
                {loading ? <span className="inline-block w-12 h-5 bg-neutral-200 animate-pulse rounded" /> : docsDownloaded.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-[#7c3aed] flex items-center gap-0.5 mt-1 leading-none">
                Of {totalDocuments} total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ ROW 2: DYNAMIC DATA TABLE OVERVIEWS ══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Requester Overview */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <div className="flex justify-between items-center mb-3.5 pb-2.5 border-b border-[#e3e4ee]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] tracking-tight">Requester Overview</h3>
            <span className="text-[11px] font-bold text-neutral-400">Consent Lifecycle</span>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Total Requests", value: totalRequests, style: "text-[#10142d]", bg: "bg-blue-50/60" },
              { label: "Pending Consents", value: pendingConsents, style: "text-[#ea580c]" },
              { label: "Approved Consents", value: approvedConsents, style: "text-[#16a34a]" },
              { label: "Rejected Consents", value: failedConsents, style: "text-[#dc2626]" },
              { label: "Expired Consents", value: expiredConsents, style: "text-neutral-500" },
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between text-[13px] font-semibold py-1.5 px-2.5 rounded-lg ${item.bg || ""}`}>
                <span className="text-[#5e6272]">{item.label}</span>
                <span className={`font-extrabold ${item.style}`}>
                  {loading ? "..." : item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Issuer Overview */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <div className="flex justify-between items-center mb-3.5 pb-2.5 border-b border-[#e3e4ee]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] tracking-tight">Issuer & Document Overview</h3>
            <span className="text-[11px] font-bold text-neutral-400">Vault Breakdown</span>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Total Documents", value: totalDocuments, style: "text-[#10142d]", bg: "bg-blue-50/60" },
              { label: "Official Issued Documents", value: issuedDocs, style: "text-[#16a34a]" },
              { label: "Self Uploaded Documents", value: selfUploadedDocs, style: "text-[#2563eb]" },
              { label: "Downloaded to Portal Storage", value: docsDownloaded, style: "text-[#7c3aed]" },
              { label: "Pending Download from Locker", value: docsPendingDownload, style: "text-[#ea580c]" },
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between text-[13px] font-semibold py-1.5 px-2.5 rounded-lg ${item.bg || ""}`}>
                <span className="text-[#5e6272]">{item.label}</span>
                <span className={`font-extrabold ${item.style}`}>
                  {loading ? "..." : item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════ ROW 3: DYNAMIC CHARTS & ACTIVITIES ══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Card 1: Dynamic Monthly Requests Trend Chart */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <div className="flex justify-between items-center mb-3.5 pb-2.5 border-b border-[#e3e4ee]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] tracking-tight">Requests Trend (Last 6 Months)</h3>
            <span className="text-[11px] font-bold text-[#5e6272]">Monthly Activity</span>
          </div>

          <div className="relative h-[220px] w-full flex items-center justify-center">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="40" y1="30" x2="380" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="380" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="110" x2="380" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="150" x2="380" y2="150" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="180" x2="380" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="32" y="34" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">{maxVal}</text>
              <text x="32" y="110" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">{Math.round(maxVal / 2)}</text>
              <text x="32" y="184" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">0</text>

              {/* Dynamic Path: Consents (Blue) */}
              <path
                d={consentPath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-500"
              />

              {/* Dynamic Path: Documents (Green) */}
              <path
                d={docPath}
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-500"
              />

              {/* Circles on Points */}
              {consentPoints.map((p, i) => (
                <circle key={`cp-${i}`} cx={p.x} cy={p.y} r="3.5" fill="#2563eb" stroke="white" strokeWidth="1.5" />
              ))}

              {/* X Axis Month Labels */}
              {trendItems.map((item, idx) => {
                const x = 50 + idx * 66;
                return (
                  <text key={idx} x={x} y="196" fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    {item.month ? item.month.split(" ")[0] : `M${idx + 1}`}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-center gap-5 mt-2.5 text-[11px] font-bold text-text-mid">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-[#2563eb] rounded-full" /> Consent Requests</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-[#16a34a] rounded-full" /> Documents Synced</span>
          </div>
        </div>

        {/* Card 2: Dynamic Requests by Status Donut Chart */}
        <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <h3 className="text-[14px] font-extrabold text-[#0089CF] mb-3.5 pb-2.5 border-b border-[#e3e4ee] tracking-tight">
            Requests by Status Distribution
          </h3>

          <div className="flex items-center gap-2.5 h-[220px]">
            {/* Donut Chart SVG */}
            <div className="relative w-[150px] h-[150px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Gray Base */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="11" />

                {/* Approved Segment */}
                {approvedPct > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#16a34a"
                    strokeWidth="11"
                    strokeDasharray={circumference}
                    strokeDashoffset={approvedOffset}
                    className="transition-all duration-700"
                  />
                )}

                {/* Pending Segment */}
                {pendingPct > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#ea580c"
                    strokeWidth="11"
                    strokeDasharray={circumference}
                    strokeDashoffset={pendingOffset}
                    className="transition-all duration-700"
                  />
                )}

                {/* Rejected Segment */}
                {rejectedPct > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#dc2626"
                    strokeWidth="11"
                    strokeDasharray={circumference}
                    strokeDashoffset={rejectedOffset}
                    className="transition-all duration-700"
                  />
                )}
              </svg>

              {/* Middle Label */}
              <div className="absolute inset-0 flex flex-col justify-center items-center select-none text-center">
                <span className="text-[17px] font-extrabold text-[#10142d] leading-none">
                  {loading ? "..." : totalRequests.toLocaleString()}
                </span>
                <span className="text-[9.5px] font-bold text-[#9094a8] mt-1 leading-none uppercase">
                  Total
                </span>
              </div>
            </div>

            {/* Donut Legend with Real Live Data */}
            <div className="flex-1 space-y-2 pl-2 text-[11.5px] font-bold text-text-mid">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#16a34a] rounded-full shrink-0" /> Approved
                </span>
                <span className="text-[#10142d] font-extrabold">
                  {approvedConsents} ({approvedPct.toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#ea580c] rounded-full shrink-0" /> Pending
                </span>
                <span className="text-[#10142d] font-extrabold">
                  {pendingConsents} ({pendingPct.toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#dc2626] rounded-full shrink-0" /> Rejected / Failed
                </span>
                <span className="text-[#10142d] font-extrabold">
                  {failedConsents} ({rejectedPct.toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#94a3b8] rounded-full shrink-0" /> Expired
                </span>
                <span className="text-[#10142d] font-extrabold">
                  {expiredConsents} ({expiredPct.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Recent Activity Log */}
        {/* <div className="bg-white border border-[#e3e4ee] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e3e4ee]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] tracking-tight">Recent Activity</h3>
            <button className="text-[11.5px] font-extrabold text-[#1c4dbf] hover:underline cursor-pointer flex items-center">
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-4">

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
        </div> */}



      </div>

      {/* ══════════════ FOOTER TIMESTAMP ══════════════ */}
      <div className="flex justify-end items-center w-full pt-1">
        <div className="flex items-center gap-4 text-[12px] font-semibold text-text-mid">
          <span>
            Last Updated: <span className="text-[#10142d] font-bold">{lastUpdated}</span>
          </span>
          <div className="w-[1.5px] h-3.5 bg-neutral-200" />
          <span className="flex items-center gap-1">
            <Clock size={13} className="text-[#e05c1a]" />
            Session Timeout: <span className="text-[#e05c1a] font-extrabold">{sessionTimeout}</span>
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* [OLD CODE - COMMENTED OUT AS PER REQUIREMENT - PRESERVED FOR REFERENCE] */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/*
      <div className="hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
          <span className="text-[22px] font-extrabold text-[#10142d]">1,248</span>
          <span className="text-[22px] font-extrabold text-[#10142d]">256</span>
          <span className="text-[22px] font-extrabold text-[#10142d]">892</span>
          <span className="text-[22px] font-extrabold text-[#10142d]">64</span>
          <span className="text-[22px] font-extrabold text-[#10142d]">2,157</span>
        </div>
      </div>
      */}
    </div>
  );
}
