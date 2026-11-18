"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Copy,
  Check,
  Info,
  Smartphone,
  Mail,
  MessageCircle,
  Building2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Phone,
  Layers,
  Hash,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { fetchEntityDetails, fetchEntityList, EntityItem } from "@/services/EntityListPage";
import { generateAuthorizationUrl, GenerateAuthUrlApiError } from "@/services/createRequest";
import { sendConsentNotificationEmail } from "@/services/notificationService";

function generateRandomEntityId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ENT-${code}`;
}

function CreateRequestFormContent() {
  const searchParams = useSearchParams();
  const queryEntityId = searchParams.get("entity_id");

  // Entity Details Form States
  const [entityId, setEntityId] = useState<string>("");
  const [entityName, setEntityName] = useState<string>("");
  const [entityType, setEntityType] = useState<string>("ORGANIZATION");
  const [entityEmail, setEntityEmail] = useState<string>("");
  const [entityMobile, setEntityMobile] = useState<string>("");
  const [doi, setDoi] = useState<string>("");
  const [entityLockerId, setEntityLockerId] = useState<string>("");

  // Existing entity auto-detection states
  const [knownEntities, setKnownEntities] = useState<EntityItem[]>([]);
  const [isExistingEntity, setIsExistingEntity] = useState<boolean>(false);
  const [existingEntityMatchedBy, setExistingEntityMatchedBy] = useState<string | null>(null);

  // Request Details Form States
  const [purpose, setPurpose] = useState<string>("kyc");
  const [docCategory, setDocCategory] = useState<string>("Identity Verification Documents");
  const [validity, setValidity] = useState<string>("7 Days");
  const [notes, setNotes] = useState<string>("");

  // Communication Option Checkbox States
  const [sendSms, setSendSms] = useState<boolean>(true);
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const [sendWhatsapp, setSendWhatsapp] = useState<boolean>(false);

  // Submission & Link Preview States
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loadingEntity, setLoadingEntity] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Auto-fetch entity details if entity_id query parameter is present
  const loadInitialEntityDetails = useCallback(async (idToFetch: string) => {
    setLoadingEntity(true);
    try {
      const session = getAuthSession();
      if (!session || !session.accessToken) return;

      const details = await fetchEntityDetails(idToFetch, session.accessToken);
      if (details) {
        setEntityId(details.entity_id || idToFetch);
        setEntityName(details.entity_name || "");
        setEntityType(details.entity_type || "ORGANIZATION");
        setEntityEmail(details.entity_email || "");
        setEntityMobile(details.entity_mobile || "");
        setDoi(details.doi || "");
        setEntityLockerId(details.entitylockerid || "");
      }
    } catch (err: unknown) {
      console.warn("Could not pre-fill entity details:", err);
      setEntityId(idToFetch);
    } finally {
      setLoadingEntity(false);
    }
  }, []);

  // [NEW CODE]: Auto-generate Entity ID on mount and pre-fetch known entities for matching
  useEffect(() => {
    if (!queryEntityId) {
      setEntityId(generateRandomEntityId());
    }

    const session = getAuthSession();
    if (session?.accessToken) {
      fetchEntityList(session.accessToken)
        .then((list) => setKnownEntities(list))
        .catch((err) => console.warn("Could not pre-fetch entity list:", err));
    }
  }, [queryEntityId]);

  // [NEW CODE]: Auto-detect if entered mobile, email or ID belongs to an existing entity
  const checkExistingEntity = useCallback(
    (mobileVal: string, emailVal: string, currentIdVal?: string) => {
      const cleanMobile = mobileVal.replace(/\D/g, "").slice(0, 10);
      const cleanEmail = emailVal.trim().toLowerCase();
      const cleanId = (currentIdVal || "").trim().toUpperCase();

      if (knownEntities.length === 0) return;

      const found = knownEntities.find((ent) => {
        if (cleanMobile && ent.entity_mobile && ent.entity_mobile.replace(/\D/g, "") === cleanMobile) {
          return true;
        }
        if (cleanEmail && ent.entity_email && ent.entity_email.trim().toLowerCase() === cleanEmail) {
          return true;
        }
        if (cleanId && ent.entity_id && ent.entity_id.toUpperCase() === cleanId) {
          return true;
        }
        return false;
      });

      if (found) {
        setIsExistingEntity(true);
        setEntityId(found.entity_id);
        if (found.entity_name) setEntityName(found.entity_name);
        if (found.entity_type) setEntityType(found.entity_type);
        if (found.entity_mobile && !cleanMobile) setEntityMobile(found.entity_mobile);
        if (found.entity_email && !cleanEmail) setEntityEmail(found.entity_email);
        if (found.doi) setDoi(found.doi);
        if (found.entitylockerid) setEntityLockerId(found.entitylockerid);

        let matchedVia = "ID";
        if (cleanMobile && found.entity_mobile && found.entity_mobile.replace(/\D/g, "") === cleanMobile) {
          matchedVia = `Mobile (${cleanMobile})`;
        } else if (cleanEmail && found.entity_email && found.entity_email.trim().toLowerCase() === cleanEmail) {
          matchedVia = `Email (${cleanEmail})`;
        }
        setExistingEntityMatchedBy(matchedVia);
      } else {
        setIsExistingEntity(false);
        setExistingEntityMatchedBy(null);
      }
    },
    [knownEntities]
  );

  useEffect(() => {
    if (queryEntityId) {
      loadInitialEntityDetails(queryEntityId);
    }
  }, [queryEntityId, loadInitialEntityDetails]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const session = getAuthSession();
    if (!session || !session.accessToken) {
      setErrorMsg("No active authentication session. Please log in again.");
      return;
    }

    if (!entityId.trim()) {
      setErrorMsg("Entity ID is required.");
      return;
    }

    setSubmitting(true);

    try {
      // Map purpose string
      let mappedPurpose = "kyc";
      if (purpose.toLowerCase().includes("loan") || purpose.toLowerCase().includes("underwriting")) {
        mappedPurpose = "availing_services";
      } else if (purpose.toLowerCase().includes("verification") || purpose.toLowerCase().includes("compliance")) {
        mappedPurpose = "verification";
      }

      const daysMap: Record<string, number> = {
        "1 Day": 1,
        "3 Days": 3,
        "7 Days": 7,
        "15 Days": 15,
        "30 Days": 30,
        "60 Days": 60,
        "90 Days": 90,
      };
      const days = daysMap[validity] ?? 7;
      const consentValidTillTimestamp = Math.floor(Date.now() / 1000) + days * 86400;

      /*
      // [OLD CODE - COMMENTED OUT AS PER REQUIREMENT]
      const response = await generateAuthorizationUrl(
        {
          entity_id: entityId.trim(),
          purpose: mappedPurpose,
          doc_category: docCategory,
          notes: notes.trim() || undefined,
          consent_valid_till: consentValidTillTimestamp,
        },
        session.accessToken
      );
      */

      // [NEW CODE]: Pass entity details so entity is auto-registered or linked, enabling many requests per entity
      const response = await generateAuthorizationUrl(
        {
          entity_id: entityId.trim(),
          entity_name: entityName.trim() || undefined,
          entity_type: entityType,
          entity_mobile: entityMobile.trim() || undefined,
          entity_email: entityEmail.trim() || undefined,
          purpose: mappedPurpose,
          doc_category: docCategory,
          notes: notes.trim() || undefined,
          consent_valid_till: consentValidTillTimestamp,
        },
        session.accessToken
      );

      if (response.authorization_url) {
        setGeneratedLink(response.authorization_url);
      }

      let emailNotificationResult = null;
      let emailWarningMsg: string | null = null;

      // Dispatch Email Notification if Send via Email is selected
      if (sendEmail && response.authorization_url) {
        try {
          emailNotificationResult = await sendConsentNotificationEmail(
            {
              entity_id: entityId.trim(),
              consent_url: response.authorization_url,
              email: entityEmail.trim() || undefined,
            },
            session.accessToken
          );
        } catch (emailErr: unknown) {
          console.warn("Consent notification email dispatch warning:", emailErr);
          emailWarningMsg =
            emailErr instanceof Error ? emailErr.message : "Failed to deliver email notification.";
        }
      }

      if (emailNotificationResult) {
        setSuccessMsg(
          `Consent authorization URL generated and official notification email dispatched to ${emailNotificationResult.recipient_email}!`
        );
      } else if (emailWarningMsg) {
        setSuccessMsg(
          `Consent authorization URL generated successfully. (Note: Email dispatch pending/warning: ${emailWarningMsg})`
        );
      } else {
        setSuccessMsg(`Consent authorization URL generated successfully for ${entityName || entityId}!`);
      }
    } catch (err: unknown) {
      if (err instanceof GenerateAuthUrlApiError) {
        setErrorMsg(err.message);
      } else {
        const msg = err instanceof Error ? err.message : "Failed to generate authorization URL.";
        setErrorMsg(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2  mx-auto font-manrope animate-fade-in space-y-4">
      {/* Page Header */}
      <div>
        <h2 className="text-[18px] font-extrabold text-[#0089CF] tracking-tight">
          Create New Consent Request
        </h2>
        <p className="text-[13px] text-[#5e6272] mt-0.5 font-medium">
          Select entity details and generate a consent authorization link to fetch documents from Entity Locker.
        </p>
      </div>

      {/* Global Alerts */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[12.5px] font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[12.5px] font-bold flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 items-start">
        {/* ══════════════ LEFT COLUMN: FORM ══════════════ */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-2">

          {/* Section 1: Entity Details (Renamed from Customer Details) */}
          <div className="bg-white rounded-[16px] border border-[#e3e4ee] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-extrabold text-[#0089CF] flex items-center gap-2">
                <Building2 size={16} />
                1. Entity Details
              </h3>
              {loadingEntity && (
                <span className="text-[11.5px] font-bold text-[#0089CF] flex items-center gap-1.5 animate-pulse">
                  <RefreshCw size={13} className="animate-spin" /> Fetching Entity Data...
                </span>
              )}
            </div>

            {loadingEntity ? (
              <div className="py-10 flex flex-col items-center justify-center space-y-2 bg-[#0089CF]/5 rounded-xl border border-[#0089CF]/20 text-[#0089CF] animate-pulse">
                <RefreshCw size={24} className="animate-spin" />
                <span className="text-[12px] font-extrabold">Loading entity details from server...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* [NEW CODE]: Banner if an existing entity is matched via Mobile, Email or ID */}
                {isExistingEntity && (
                  <div className="col-span-full mb-1 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span className="text-[12px] font-bold text-emerald-800">
                        Existing Entity Identified via {existingEntityMatchedBy}: <strong>{entityName || entityId}</strong> ({entityId}). A new Consent Request will be created for this entity.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsExistingEntity(false);
                        setExistingEntityMatchedBy(null);
                        setEntityId(generateRandomEntityId());
                        setEntityName("");
                        setEntityMobile("");
                        setEntityEmail("");
                      }}
                      className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 underline ml-2 shrink-0 cursor-pointer"
                    >
                      Clear / Register New
                    </button>
                  </div>
                )}

                {/* [OLD CODE - COMMENTED OUT AS PER REQUIREMENT]
                <div className="flex flex-col">
                  <label htmlFor="entityId" className="text-[12px] font-bold text-[#10142d] mb-1.5 flex items-center gap-1">
                    <Hash size={13} className="text-[#0089CF]" />
                    Entity ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="entityId"
                    type="text"
                    required
                    placeholder="e.g. ENT-C72XVE"
                    value={entityId}
                    onChange={(e) => setEntityId(e.target.value)}
                    disabled={submitting}
                    className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 transition-all bg-white disabled:bg-neutral-100"
                  />
                </div>
                */}

                {/* [NEW CODE]: Auto-generated Entity ID with indicator badge and refresh button */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="entityId" className="text-[12px] font-bold text-[#10142d] flex items-center gap-1">
                      <Hash size={13} className="text-[#0089CF]" />
                      Entity ID <span className="text-red-500">*</span>
                    </label>
                    {isExistingEntity ? (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Existing Entity
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-[#0089CF] border border-blue-200">
                        Auto-Generated
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="entityId"
                      type="text"
                      required
                      value={entityId}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setEntityId(val);
                        checkExistingEntity(entityMobile, entityEmail, val);
                      }}
                      disabled={submitting}
                      placeholder="Auto-generated (e.g. ENT-ABC123)"
                      className={`w-full h-[38px] px-3 font-mono font-bold text-[13px] rounded-[10px] border transition-all outline-none ${isExistingEntity
                          ? "border-emerald-300 bg-emerald-50/40 text-emerald-800 focus:border-emerald-500"
                          : "border-[#e3e4ee] bg-neutral-50/70 text-[#10142d] focus:border-[#0089CF]"
                        }`}
                    />
                    {!isExistingEntity && (
                      <button
                        type="button"
                        onClick={() => setEntityId(generateRandomEntityId())}
                        title="Generate another Entity ID"
                        className="absolute right-2 p-1 text-[#9094a8] hover:text-[#0089CF] transition-colors cursor-pointer"
                      >
                        <RefreshCw size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Entity Name */}
                <div className="flex flex-col">
                  <label htmlFor="entityName" className="text-[12px] font-bold text-[#10142d] mb-1.5 flex items-center gap-1">
                    <Building2 size={13} className="text-[#0089CF]" />
                    Entity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="entityName"
                    type="text"
                    required
                    placeholder="Enter entity name"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    disabled={submitting}
                    className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 transition-all bg-white disabled:bg-neutral-100"
                  />
                </div>

                {/* Entity Type */}
                <div className="flex flex-col">
                  <label htmlFor="entityType" className="text-[12px] font-bold text-[#10142d] mb-1.5 flex items-center gap-1">
                    <Layers size={13} className="text-[#0089CF]" />
                    Entity Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="entityType"
                    required
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    disabled={submitting}
                    className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-white outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 cursor-pointer disabled:bg-neutral-100"
                  >
                    <option value="ORGANIZATION">ORGANIZATION</option>
                    <option value="INDIVIDUAL">INDIVIDUAL</option>
                  </select>
                </div>

                {/* Entity Mobile */}
                <div className="flex flex-col">
                  <label htmlFor="entityMobile" className="text-[12px] font-bold text-[#10142d] mb-1.5 flex items-center gap-1">
                    <Phone size={13} className="text-[#0089CF]" />
                    Entity Mobile <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-1.5 h-[38px]">
                    <select className="px-2.5 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-neutral-50 outline-none focus:border-[#0089CF] cursor-pointer">
                      <option value="+91">+91</option>
                    </select>
                    <input
                      id="entityMobile"
                      type="tel"
                      required
                      placeholder="Enter mobile number"
                      value={entityMobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setEntityMobile(val);
                        checkExistingEntity(val, entityEmail, entityId);
                      }}
                      disabled={submitting}
                      className="flex-1 px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 transition-all bg-white disabled:bg-neutral-100"
                    />
                  </div>
                </div>

                {/* Entity Email */}
                <div className="flex flex-col">
                  <label htmlFor="entityEmail" className="text-[12px] font-bold text-[#10142d] mb-1.5 flex items-center gap-1">
                    <Mail size={13} className="text-[#0089CF]" />
                    Entity Email
                  </label>
                  <input
                    id="entityEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={entityEmail}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEntityEmail(val);
                      checkExistingEntity(entityMobile, val, entityId);
                    }}
                    disabled={submitting}
                    className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 transition-all bg-white disabled:bg-neutral-100"
                  />
                </div>

                {/* Date of Incorporation (DOI) */}
                <div className="flex flex-col">
                  <label htmlFor="doi" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                    Date of Incorporation (DOI)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="doi"
                      type="date"
                      value={doi}
                      onChange={(e) => setDoi(e.target.value)}
                      disabled={submitting}
                      className="w-full h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 bg-white cursor-pointer pr-10 disabled:bg-neutral-100"
                    />
                    <Calendar size={16} className="absolute right-3.5 text-[#9094a8] pointer-events-none" />
                  </div>
                </div>

                {/* Entity Locker ID */}
                <div className="flex flex-col">
                  <label htmlFor="entityLockerId" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                    Entity Locker ID
                  </label>
                  <input
                    id="entityLockerId"
                    type="text"
                    placeholder="e.g. LCK-98214"
                    value={entityLockerId}
                    onChange={(e) => setEntityLockerId(e.target.value)}
                    disabled={submitting}
                    className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 transition-all bg-white disabled:bg-neutral-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Request Details (Unchanged) */}
          <div className="bg-white rounded-[16px] border border-[#e3e4ee] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] mb-4 flex items-center gap-2">
              2. Request Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Purpose of Consent */}
              <div className="flex flex-col">
                <label htmlFor="purpose" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  Purpose of Consent <span className="text-red-500">*</span>
                </label>
                <select
                  id="purpose"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  disabled={submitting}
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-white outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 cursor-pointer disabled:bg-neutral-100"
                >
                  <option value="kyc">KYC Verification</option>
                  <option value="verification">Identity Verification</option>
                  <option value="compliance">Regulatory Compliance</option>
                  <option value="availing_services">Availing Banking Services</option>
                  <option value="educational">Educational Verification</option>
                </select>
              </div>

              {/* Document Category */}
              <div className="flex flex-col">
                <label htmlFor="docCategory" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  Document Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="docCategory"
                  required
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  disabled={submitting}
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-white outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 cursor-pointer disabled:bg-neutral-100"
                >
                  <option value="Identity Verification Documents">Identity Verification</option>
                  <option value="Income Tax Returns">Income Tax Returns</option>
                  <option value="Bank Statements">Bank Statements</option>
                  <option value="Corporate Filings">Corporate Filings</option>
                </select>
              </div>

              {/* Consent Validity */}
              <div className="flex flex-col">
                <label htmlFor="validity" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  Consent Validity <span className="text-red-500">*</span>
                </label>
                <select
                  id="validity"
                  required
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                  disabled={submitting}
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-white outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 cursor-pointer disabled:bg-neutral-100"
                >
                  <option value="1 Day">1 Day</option>
                  <option value="3 Days">3 Days</option>
                  <option value="7 Days">7 Days</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col">
              <label htmlFor="notes" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                placeholder="Enter notes or remarks"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting}
                className="p-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#0089CF] focus:ring-1 focus:ring-[#0089CF]/25 transition-all bg-white resize-none disabled:bg-neutral-100"
              />
            </div>
          </div>

          {/* Section 3: Communication Options (Unchanged) */}
          <div className="bg-white rounded-[16px] border border-[#e3e4ee] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] mb-2 flex items-center gap-2">
              3. Communication Options
            </h3>
            <p className="text-[11.5px] text-[#5e6272] font-semibold mb-4">
              Select how you want to share the consent authorization link with the entity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Send via SMS */}
              <div className="flex flex-col border border-[#e3e4ee] rounded-[12px] p-3.5 bg-neutral-50/50">
                <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                    disabled={submitting}
                    className="w-4 h-4 text-[#0089CF] border-[#e3e4ee] rounded cursor-pointer"
                  />
                  <Smartphone size={15} className="text-[#5e6272] shrink-0" />
                  <span className="text-[12px] font-bold text-[#10142d]">Send via SMS</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={entityMobile ? `+91 ${entityMobile}` : ""}
                  className="h-[34px] px-3 bg-[#f3f4f6] border border-neutral-200 rounded-[8px] text-[12.5px] font-bold text-neutral-500 outline-none select-none"
                />
              </div>

              {/* Option 2: Send via Email */}
              <div className="flex flex-col border border-[#e3e4ee] rounded-[12px] p-3.5 bg-neutral-50/50">
                <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    disabled={submitting}
                    className="w-4 h-4 text-[#0089CF] border-[#e3e4ee] rounded cursor-pointer"
                  />
                  <Mail size={15} className="text-[#5e6272] shrink-0" />
                  <span className="text-[12px] font-bold text-[#10142d]">Send via Email</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={entityEmail || ""}
                  className="h-[34px] px-3 bg-[#f3f4f6] border border-neutral-200 rounded-[8px] text-[12.5px] font-bold text-neutral-500 outline-none select-none overflow-hidden text-ellipsis"
                />
              </div>

              {/* Option 3: Send via WhatsApp */}
              <div className="flex flex-col border border-[#e3e4ee] rounded-[12px] p-3.5 bg-neutral-50/50">
                <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendWhatsapp}
                    onChange={(e) => setSendWhatsapp(e.target.checked)}
                    disabled={submitting}
                    className="w-4 h-4 text-[#0089CF] border-[#e3e4ee] rounded cursor-pointer"
                  />
                  <MessageCircle size={15} className="text-[#5e6272] shrink-0" />
                  <span className="text-[12px] font-bold text-[#10142d]">Send via WhatsApp</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={entityMobile ? `+91 ${entityMobile}` : ""}
                  className="h-[34px] px-3 bg-[#f3f4f6] border border-neutral-200 rounded-[8px] text-[12.5px] font-bold text-neutral-500 outline-none select-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setEntityId("");
                setEntityName("");
                setEntityType("ORGANIZATION");
                setEntityEmail("");
                setEntityMobile("");
                setDoi("");
                setEntityLockerId("");
                setNotes("");
              }}
              disabled={submitting}
              className="px-6 h-[38px] rounded-[10px] border border-[#e3e4ee] text-[#10142d] text-[13.5px] font-bold bg-white hover:bg-neutral-50 cursor-pointer transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 h-[38px] rounded-[10px] bg-[#0089CF] hover:bg-[#0072ad] text-white text-[13.5px] font-extrabold cursor-pointer transition-all shadow-md active:scale-[0.985] flex items-center gap-2 disabled:opacity-75"
            >
              {submitting ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Generating Authorization URL...</span>
                </>
              ) : (
                <span>Generate &amp; Share Link</span>
              )}
            </button>
          </div>
        </form>

        {/* ══════════════ RIGHT COLUMN: INFO SIDEBAR ══════════════ */}
        <div className="bg-white rounded-[16px] border border-[#e3e4ee] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)] space-y-5">
          {/* Consent Link Preview */}
          <div>
            <h3 className="text-[14px] font-extrabold text-[#0089CF] mb-1 tracking-tight">
              Consent Link Preview
            </h3>
            <p className="text-[11.5px] text-[#5e6272] leading-[1.5] font-semibold mb-4">
              A consent authorization link will be generated and shared with the entity to authorize document access.
            </p>

            <div className="flex flex-col gap-1 mb-4">
              <span className="text-[10px] font-bold text-[#0089CF] uppercase">Generated Link</span>
              {submitting ? (
                <div className="flex items-center justify-center gap-2 bg-[#0089CF]/10 border border-[#0089CF]/20 rounded-[10px] p-3 text-[#0089CF] animate-pulse">
                  <RefreshCw size={14} className="animate-spin" />
                  <span className="text-[11.5px] font-extrabold">Generating URL from server...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-[#0089CF]/10 border border-[#0089CF]/20 rounded-[10px] p-2.5">
                  <span className="flex-1 text-[11.5px] font-extrabold text-[#0089CF] select-all overflow-hidden text-ellipsis whitespace-nowrap">
                    {generatedLink}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-1.5 rounded-[6px] hover:bg-[#0089CF]/20 text-[#0089CF] transition-all cursor-pointer"
                    title="Copy Link"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              )}
              <span className="text-[10px] text-[#9094a8] font-bold italic mt-0.5">
                (Link generated via /providers/entity-locker/authorization-url)
              </span>
            </div>

            <div className="border-t border-[#e3e4ee] pt-4 font-manrope">
              <span className="text-[10px] font-bold text-[#5e6272] uppercase block mb-1.5">Link Validity</span>
              <div className="flex items-center gap-2 text-[12.5px] font-bold text-[#10142d]">
                <Calendar size={16} className="text-[#0089CF]" />
                <span>{validity} <span className="text-[#5e6272] font-semibold">from generation</span></span>
              </div>
            </div>
          </div>

          {/* Stepper Guide */}
          <div className="border-t border-[#e3e4ee] pt-4">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] mb-3 tracking-tight">
              What happens next?
            </h3>

            <div className="relative pl-7 space-y-4">
              <div className="absolute top-2.5 bottom-2.5 left-3 w-[1.5px] bg-[#e3e4ee]" />

              <div className="relative">
                <div className="absolute -left-7 top-0.5 w-[20px] h-[20px] rounded-full bg-[#0089CF]/10 border border-[#0089CF]/30 flex items-center justify-center text-[10px] font-extrabold text-[#0089CF] z-10">
                  1
                </div>
                <div>
                  <h4 className="text-[12.5px] font-extrabold text-[#10142d] leading-none mb-1">
                    Entity receives the link
                  </h4>
                  <p className="text-[11.5px] text-[#5e6272] leading-[1.4] font-medium">
                    Entity will receive the consent link via selected communication channels.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-7 top-0.5 w-[20px] h-[20px] rounded-full bg-[#0089CF]/10 border border-[#0089CF]/30 flex items-center justify-center text-[10px] font-extrabold text-[#0089CF] z-10">
                  2
                </div>
                <div>
                  <h4 className="text-[12.5px] font-extrabold text-[#10142d] leading-none mb-1">
                    Entity approves consent
                  </h4>
                  <p className="text-[11.5px] text-[#5e6272] leading-[1.4] font-medium">
                    Entity will log in to Entity Locker and approve document access.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-7 top-0.5 w-[20px] h-[20px] rounded-full bg-[#0089CF]/10 border border-[#0089CF]/30 flex items-center justify-center text-[10px] font-extrabold text-[#0089CF] z-10">
                  3
                </div>
                <div>
                  <h4 className="text-[12.5px] font-extrabold text-[#10142d] leading-none mb-1">
                    Documents available
                  </h4>
                  <p className="text-[11.5px] text-[#5e6272] leading-[1.4] font-medium">
                    Once consent is authorized, documents become accessible in the portal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-3.5 flex gap-2.5 items-start">
            <Info size={16} className="text-[#0089CF] shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-[#0089CF] leading-[1.5] font-semibold">
              Entity details are used strictly for authorization and will expire after the validity period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw size={36} className="text-[#0089CF] animate-spin" />
          <p className="text-[13px] font-bold text-[#5e6272]">Loading create request form...</p>
        </div>
      }
    >
      <CreateRequestFormContent />
    </Suspense>
  );
}
