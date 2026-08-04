"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Calendar,
  ArrowLeft,
  Clock,
  Key,
  Hash,
  User,
  CheckCircle2,
  Hourglass,
  XCircle,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { fetchConsentDetails, ConsentDetailsData, ConsentDetailsApiError } from "@/services/consentDetails";

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

export default function ConsentDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const consentId = searchParams.get("consent_id");
  const entityId = searchParams.get("entity_id");

  const [data, setData] = useState<ConsentDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const loadConsentDetails = useCallback(async () => {
    if (!consentId && !entityId) {
      setError("No consent ID or entity ID provided in query parameters.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const session = getAuthSession();
      if (!session || !session.accessToken) {
        throw new Error("No active authentication session found. Please log in again.");
      }

      const res = await fetchConsentDetails(
        { consent_id: consentId || undefined, entity_id: entityId || undefined },
        session.accessToken
      );
      setData(res);
    } catch (err: unknown) {
      if (err instanceof ConsentDetailsApiError) {
        setError(err.message);
      } else {
        const msg = err instanceof Error ? err.message : "Failed to fetch consent details.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [consentId, entityId]);

  useEffect(() => {
    loadConsentDetails();
  }, [loadConsentDetails]);

  const handleCopyUrl = () => {
    if (!data?.authorization_url) return;
    navigator.clipboard.writeText(data.authorization_url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getStatusBadge = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case "authorized":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 size={13} />,
        };
      case "pending":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Hourglass size={13} />,
        };
      case "failed":
        return {
          bg: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle size={13} />,
        };
      case "expired":
        return {
          bg: "bg-neutral-100 text-neutral-600 border-neutral-200",
          icon: <Clock size={13} />,
        };
      default:
        return {
          bg: "bg-neutral-100 text-neutral-800 border-neutral-200",
          icon: <ShieldCheck size={13} />,
        };
    }
  };

  const badgeStyle = getStatusBadge(data?.status);

  return (
    <div className="p-4 max-w-[1200px] mx-auto space-y-4 font-manrope animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard/requester/entity-list")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e3e4ee] bg-white hover:bg-neutral-50 text-[12.5px] font-bold text-[#10142d] transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Back to Entity List</span>
        </button>

        <button
          onClick={loadConsentDetails}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e3e4ee] bg-white hover:bg-neutral-50 text-[12px] font-bold text-[#10142d] transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? "animate-spin text-[#0089CF]" : "text-[#5e6272]"} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-[#e3e4ee] flex flex-col items-center justify-center space-y-3 shadow-xs">
          <RefreshCw size={36} className="text-[#0089CF] animate-spin" />
          <p className="text-[13px] font-bold text-[#5e6272]">Fetching consent details from server...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-white rounded-2xl border border-red-200 flex flex-col items-center text-center space-y-3 shadow-xs">
          <AlertCircle size={40} className="text-red-500" />
          <div>
            <h3 className="text-[16px] font-extrabold text-red-900">Consent Record Failed</h3>
            <p className="text-[13px] text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={loadConsentDetails}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Retry Loading</span>
          </button>
        </div>
      ) : data ? (
        <div className="space-y-4">
          {/* Hero Banner */}
          <div className="p-5 rounded-2xl bg-white border border-[#e3e4ee] shadow-[0_2px_12px_rgba(18,22,46,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#0089CF]/10 text-[#0089CF] flex items-center justify-center shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[18px] font-extrabold text-[#10142d] tracking-tight">
                    Consent Record #{data.consent_id}
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase border ${badgeStyle.bg}`}>
                    {badgeStyle.icon}
                    {data.status}
                  </span>
                </div>
                <p className="text-[12.5px] text-[#5e6272] font-semibold mt-0.5">
                  Entity ID: <strong className="text-[#0089CF]">{data.entity_id}</strong> &bull; User ID: #{data.user_id}
                </p>
              </div>
            </div>

            {data.authorization_url && (
              <a
                href={data.authorization_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0089CF] hover:bg-[#0072ad] text-white text-[12.5px] font-extrabold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>Open Authorization URL</span>
              </a>
            )}
          </div>

          {/* Grid 1: Authorization Details */}
          <div className="bg-white rounded-2xl border border-[#e3e4ee] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-4">
            <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-[#5e6272] flex items-center gap-2">
              <Key size={15} className="text-[#0089CF]" />
              Authorization &amp; Security Tokens
            </h3>

            {/* Authorization URL Row */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
              <div className="text-[11px] font-semibold text-[#5e6272]">Authorization URL</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={data.authorization_url || "N/A"}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#e3e4ee] text-[12.5px] font-mono text-[#0089CF] font-bold outline-none select-all"
                />
                {data.authorization_url && (
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#e3e4ee] bg-white hover:bg-neutral-100 text-[12px] font-bold text-[#10142d] transition-colors cursor-pointer shrink-0"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{isCopied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <div className="text-[11px] font-semibold text-[#5e6272]">State Identifier</div>
                <div className="text-[13px] font-extrabold text-[#10142d] mt-0.5">{data.state || "N/A"}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <div className="text-[11px] font-semibold text-[#5e6272]">Code Challenge</div>
                <div className="text-[12.5px] font-mono font-extrabold text-[#10142d] mt-0.5 truncate">{data.code_challenge || "N/A"}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <div className="text-[11px] font-semibold text-[#5e6272]">Authorization Code</div>
                <div className="text-[12.5px] font-mono font-extrabold text-[#10142d] mt-0.5 truncate">{data.code || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Grid 2: Timestamps */}
          <div className="bg-white rounded-2xl border border-[#e3e4ee] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-4">
            <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-[#5e6272] flex items-center gap-2">
              <Calendar size={15} className="text-[#0089CF]" />
              Consent Lifecycle &amp; Validity Timestamps
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5">
                <Clock size={16} className="text-[#0089CF] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#5e6272]">Consent Created At</div>
                  <div className="font-bold text-[#10142d] mt-0.5">{formatDate(data.consent_created_at)}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5">
                <Clock size={16} className="text-[#0089CF] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#5e6272]">Consent Provided At</div>
                  <div className="font-bold text-[#10142d] mt-0.5">{formatDate(data.consent_provided_at)}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5">
                <Calendar size={16} className="text-[#0089CF] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#5e6272]">Consent Valid Till</div>
                  <div className="font-bold text-[#10142d] mt-0.5">{formatDate(data.consent_valid_till)}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5">
                <Calendar size={16} className="text-[#0089CF] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#5e6272]">Created At</div>
                  <div className="font-bold text-[#10142d] mt-0.5">{formatDate(data.created_at)}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5">
                <Calendar size={16} className="text-[#0089CF] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#5e6272]">Updated At</div>
                  <div className="font-bold text-[#10142d] mt-0.5">{formatDate(data.updated_at)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
