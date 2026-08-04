"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  Layers,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { registerEntity, RegisterEntityApiError } from "@/services/registerEntity";
import { EntityItem } from "@/services/EntityListPage";

interface RegisterEntityProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newEntity: EntityItem) => void;
  initialName?: string;
}

export function RegisterEntityModal({
  isOpen,
  onClose,
  onSuccess,
  initialName = "",
}: RegisterEntityProps) {
  const [entityName, setEntityName] = useState<string>("");
  const [entityType, setEntityType] = useState<string>("ORGANIZATION");
  const [entityEmail, setEntityEmail] = useState<string>("");
  const [entityMobile, setEntityMobile] = useState<string>("");
  const [entityStatus, setEntityStatus] = useState<string>("ACTIVE");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEntityName(initialName);
      setEntityType("ORGANIZATION");
      setEntityEmail("");
      setEntityMobile("");
      setEntityStatus("ACTIVE");
      setGeneralError(null);
      setFieldErrors({});
      setSuccessMsg(null);
    }
  }, [isOpen, initialName]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !submitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, submitting]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setSuccessMsg(null);

    const session = getAuthSession();
    if (!session || !session.accessToken) {
      setGeneralError("No active authentication session. Please log in again.");
      return;
    }

    if (!entityName.trim()) {
      setFieldErrors({ entity_name: ["The entity name field is required."] });
      return;
    }

    if (!entityMobile.trim()) {
      setFieldErrors({ entity_mobile: ["The entity mobile field is required."] });
      return;
    }

    setSubmitting(true);

    try {
      const createdEntity = await registerEntity(
        {
          entity_name: entityName.trim(),
          entity_type: entityType,
          entity_email: entityEmail.trim() || null,
          entity_mobile: entityMobile.trim(),
          entity_status: entityStatus,
        },
        session.accessToken
      );

      setSuccessMsg(`Entity "${createdEntity.entity_name}" registered successfully!`);
      onSuccess(createdEntity);

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof RegisterEntityApiError) {
        setGeneralError(err.message);
        if (err.errors) {
          setFieldErrors(err.errors);
        }
      } else {
        const msg = err instanceof Error ? err.message : "Failed to register entity.";
        setGeneralError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName]?.[0];
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e3e4ee]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0089CF] px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle size={18} />
            <h3 className="text-[15.5px] font-bold">Register New Entity</h3>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-[12.5px] font-manrope">
          {successMsg ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center space-y-2">
              <CheckCircle2 size={32} className="text-emerald-600" />
              <p className="text-[13px] font-bold text-emerald-900">{successMsg}</p>
            </div>
          ) : (
            <>
              {/* General error alert */}
              {generalError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[12px] font-semibold flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span>{generalError}</span>
                </div>
              )}

              {/* Entity Name */}
              <div>
                <label className="block mb-1 font-bold text-[#10142d] flex items-center gap-1">
                  <Building2 size={13} className="text-[#0089CF]" />
                  Entity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahabank Enterprise"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  disabled={submitting}
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] font-semibold outline-none transition-all ${
                    getFieldError("entity_name")
                      ? "border-red-500 bg-red-50/20 focus:border-red-600"
                      : "border-[#e3e4ee] focus:border-[#0089CF]"
                  }`}
                />
                {getFieldError("entity_name") && (
                  <p className="mt-1 text-[11px] font-bold text-red-600">
                    {getFieldError("entity_name")}
                  </p>
                )}
              </div>

              {/* Entity Type */}
              <div>
                <label className="block mb-1 font-bold text-[#10142d] flex items-center gap-1">
                  <Layers size={13} className="text-[#0089CF]" />
                  Entity Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-[#e3e4ee] rounded-lg text-[13px] font-semibold outline-none focus:border-[#0089CF] bg-white cursor-pointer"
                >
                  <option value="ORGANIZATION">ORGANIZATION</option>
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                </select>
                {getFieldError("entity_type") && (
                  <p className="mt-1 text-[11px] font-bold text-red-600">
                    {getFieldError("entity_type")}
                  </p>
                )}
              </div>

              {/* Entity Email */}
              <div>
                <label className="block mb-1 font-bold text-[#10142d] flex items-center gap-1">
                  <Mail size={13} className="text-[#0089CF]" />
                  Entity Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. entity@mahabank.in"
                  value={entityEmail}
                  onChange={(e) => setEntityEmail(e.target.value)}
                  disabled={submitting}
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] font-semibold outline-none transition-all ${
                    getFieldError("entity_email")
                      ? "border-red-500 bg-red-50/20 focus:border-red-600"
                      : "border-[#e3e4ee] focus:border-[#0089CF]"
                  }`}
                />
                {getFieldError("entity_email") && (
                  <p className="mt-1 text-[11px] font-bold text-red-600">
                    {getFieldError("entity_email")}
                  </p>
                )}
              </div>

              {/* Entity Mobile */}
              <div>
                <label className="block mb-1 font-bold text-[#10142d] flex items-center gap-1">
                  <Phone size={13} className="text-[#0089CF]" />
                  Entity Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={entityMobile}
                  onChange={(e) => setEntityMobile(e.target.value)}
                  disabled={submitting}
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] font-semibold outline-none transition-all ${
                    getFieldError("entity_mobile")
                      ? "border-red-500 bg-red-50/20 focus:border-red-600"
                      : "border-[#e3e4ee] focus:border-[#0089CF]"
                  }`}
                />
                {getFieldError("entity_mobile") && (
                  <p className="mt-1 text-[11px] font-bold text-red-600">
                    {getFieldError("entity_mobile")}
                  </p>
                )}
              </div>

              {/* Entity Status */}
              <div>
                <label className="block mb-1 font-bold text-[#10142d]">Entity Status</label>
                <select
                  value={entityStatus}
                  onChange={(e) => setEntityStatus(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-[#e3e4ee] rounded-lg text-[13px] font-semibold outline-none focus:border-[#0089CF] bg-white cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
                {getFieldError("entity_status") && (
                  <p className="mt-1 text-[11px] font-bold text-red-600">
                    {getFieldError("entity_status")}
                  </p>
                )}
              </div>

              {/* Form Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-[#10142d] font-bold cursor-pointer transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-[#0089CF] hover:bg-[#0072ad] text-white font-extrabold cursor-pointer disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <span>Register Entity</span>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
