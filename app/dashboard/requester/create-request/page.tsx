"use client";

import React, { useState } from "react";
import {
  Calendar,
  Copy,
  Check,
  Info,
  Smartphone,
  Mail,
  MessageCircle,
} from "lucide-react";

export default function CreateRequestPage() {
  // Form Input States
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [refNumber, setRefNumber] = useState("");

  const [purpose, setPurpose] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const [validity, setValidity] = useState("7 Days");
  const [notes, setNotes] = useState("");

  // Communication Option Checkbox States
  const [sendSms, setSendSms] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsapp, setSendWhatsapp] = useState(false);

  // Link Preview States
  const [isCopied, setIsCopied] = useState(false);
  const mockConsentLink = "https://mahabank.elocker.in/consent/abc123def456";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockConsentLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Consent link request generated successfully! (Mock Action)");
  };

  return (
    <div className="p-2 max-w-[1400px] mx-auto animate-fade-in">
      
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="text-[18px]  font-extrabold text-[#0089CF] tracking-tight">
          Create New Requester
        </h2>
        <p className="text-[13px] text-[#5e6272] mt-0.5 font-medium">
          Enter customer details and share consent link to fetch documents from Entity Locker.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 items-start">
        
        {/* ══════════════ LEFT COLUMN: FORM ══════════════ */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-2">
          
          {/* Section 1: Customer Details */}
          <div className="bg-white rounded-[16px] border border-[#e3e4ee] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] mb-4 flex items-center gap-2">
              <span className="" />
              1. Customer Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Customer Name */}
              <div className="flex flex-col">
                <label htmlFor="customerName" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="customerName"
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 transition-all bg-white"
                />
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col">
                <label htmlFor="mobileNumber" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1.5 h-[38px]">
                  <select className="px-2.5 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-neutral-50 outline-none focus:border-[#1c4dbf] cursor-pointer">
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>
                  <input
                    id="mobileNumber"
                    type="tel"
                    required
                    placeholder="Enter mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="flex-1 px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Email ID */}
              <div className="flex flex-col">
                <label htmlFor="emailId" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  Email ID
                </label>
                <input
                  id="emailId"
                  type="email"
                  placeholder="Enter email address"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 transition-all bg-white"
                />
              </div>

              {/* Customer Type */}
              <div className="flex flex-col">
                <label htmlFor="customerType" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  Customer Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="customerType"
                  required
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-white outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 cursor-pointer"
                >
                  <option value="" disabled>Select Customer Type</option>
                  <option value="Retail">Retail</option>
                  <option value="Corporate">Corporate</option>
                  <option value="SME">SME</option>
                </select>
              </div>

              {/* ID Type */}
              <div className="flex flex-col">
                <label htmlFor="idType" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  ID Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="idType"
                  required
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-white outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 cursor-pointer"
                >
                  <option value="" disabled>Select ID Type</option>
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Voter ID">Voter ID</option>
                </select>
              </div>

              {/* ID Number */}
              <div className="flex flex-col">
                <label htmlFor="idNumber" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  ID Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="idNumber"
                  type="text"
                  required
                  placeholder="Enter ID number"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 transition-all bg-white"
                />
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col">
                <label htmlFor="dob" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  Date of Birth
                </label>
                <div className="relative flex items-center">
                  <input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 bg-white cursor-pointer pr-10"
                  />
                  <Calendar size={16} className="absolute right-3.5 text-[#9094a8] pointer-events-none" />
                </div>
              </div>

              {/* PAN Number */}
              <div className="flex flex-col">
                <label htmlFor="panNumber" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  PAN Number
                </label>
                <input
                  id="panNumber"
                  type="text"
                  placeholder="Enter PAN number"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase().slice(0, 10))}
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 transition-all bg-white uppercase"
                />
              </div>

              {/* Reference Number */}
              <div className="flex flex-col">
                <label htmlFor="refNumber" className="text-[12px] font-bold text-[#10142d] mb-1.5">
                  Reference Number / Application No. <span className="text-red-500">*</span>
                </label>
                <input
                  id="refNumber"
                  type="text"
                  required
                  placeholder="Enter reference / application no."
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 transition-all bg-white"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Request Details */}
          <div className="bg-white rounded-[16px] border border-[#e3e4ee] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] mb-4 flex items-center gap-2">
              <span className="" />
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
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-white outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 cursor-pointer"
                >
                  <option value="" disabled>Select Purpose</option>
                  <option value="Loan Underwriting">Loan Underwriting</option>
                  <option value="KYC Verification">KYC Verification</option>
                  <option value="Account Opening">Account Opening</option>
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
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-white outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 cursor-pointer"
                >
                  <option value="" disabled>Select Document Category</option>
                  <option value="Income Tax Returns">Income Tax Returns</option>
                  <option value="Bank Statements">Bank Statements</option>
                  <option value="Identity Verification Documents">Identity Verification</option>
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
                  className="h-[38px] px-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] bg-white outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 cursor-pointer"
                >
                  <option value="1 Day">1 Day</option>
                  <option value="3 Days">3 Days</option>
                  <option value="7 Days">7 Days</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                </select>
              </div>

            </div>

            {/* Notes (Optional) */}
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
                className="p-3 border border-[#e3e4ee] rounded-[10px] text-[13px] font-semibold text-[#10142d] placeholder-[#9094a8] outline-none focus:border-[#1c4dbf] focus:ring-1 focus:ring-[#1c4dbf]/25 transition-all bg-white resize-none"
              />
            </div>
          </div>

          {/* Section 3: Communication Options */}
          <div className="bg-white rounded-[16px] border border-[#e3e4ee] p-5 shadow-[0_2px_12px_rgba(18,22,46,0.03)]">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] mb-2 flex items-center gap-2">
              <span className="" />
              3. Communication Options
            </h3>
            <p className="text-[11.5px] text-[#5e6272] font-semibold mb-4">
              Select how you want to share the consent link with the customer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Option 1: Send via SMS */}
              <div className="flex flex-col border border-[#e3e4ee] rounded-[12px] p-3.5 bg-neutral-50/50">
                <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                    className="w-4 h-4 text-[#1c4dbf] border-[#e3e4ee] rounded focus:ring-[#1c4dbf]/30 cursor-pointer"
                  />
                  <Smartphone size={15} className="text-[#5e6272] shrink-0" />
                  <span className="text-[12px] font-bold text-[#10142d]">Send via SMS</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={mobileNumber ? `+91 ${mobileNumber}` : "+91 9876543210"}
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
                    className="w-4 h-4 text-[#1c4dbf] border-[#e3e4ee] rounded focus:ring-[#1c4dbf]/30 cursor-pointer"
                  />
                  <Mail size={15} className="text-[#5e6272] shrink-0" />
                  <span className="text-[12px] font-bold text-[#10142d]">Send via Email</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={emailId || "rajesh.enterprises@gmail.com"}
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
                    className="w-4 h-4 text-[#1c4dbf] border-[#e3e4ee] rounded focus:ring-[#1c4dbf]/30 cursor-pointer"
                  />
                  <MessageCircle size={15} className="text-[#5e6272] shrink-0" />
                  <span className="text-[12px] font-bold text-[#10142d]">Send via WhatsApp</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={mobileNumber ? `+91 ${mobileNumber}` : "+91 9876543210"}
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
                setCustomerName("");
                setMobileNumber("");
                setEmailId("");
                setCustomerType("");
                setIdType("");
                setIdNumber("");
                setDob("");
                setPanNumber("");
                setRefNumber("");
                setPurpose("");
                setDocCategory("");
                setNotes("");
              }}
              className="px-6 h-[38px] rounded-[10px] border border-[#e3e4ee] text-[#10142d] text-[13.5px] font-bold bg-white hover:bg-neutral-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 h-[38px] rounded-[10px] bg-[#0089CF] hover:bg-[#153ca0] text-white text-[13.5px] font-extrabold cursor-pointer transition-all shadow-[0_4px_14px_rgba(28,77,191,0.25)] hover:shadow-[0_6px_20px_rgba(28,77,191,0.35)] active:scale-[0.985]"
            >
              Generate &amp; Share Link
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
              A consent link will be generated and shared with the customer to access their documents from Entity Locker.
            </p>

            <div className="flex flex-col gap-1 mb-4">
              <span className="text-[10px] font-bold text-[#0089CF] uppercase">Link Preview</span>
              <div className="flex items-center gap-2 bg-[#eef2ff] border border-[#dbeafe] rounded-[10px] p-2.5">
                <span className="flex-1 text-[11.5px] font-extrabold text-[#0089CF] select-all overflow-hidden text-ellipsis whitespace-nowrap">
                  {mockConsentLink}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-[6px] hover:bg-[#dbeafe]/80 text-[#1c4dbf] transition-all cursor-pointer"
                  title="Copy Link"
                >
                  {isCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
              </div>
              <span className="text-[10px] text-[#9094a8] font-bold italic mt-0.5">
                (Link will be active once generated)
              </span>
            </div>

            <div className="border-t border-[#e3e4ee] pt-4.5">
              <span className="text-[10px] font-bold text-[#5e6272] uppercase block mb-2">Link Validity</span>
              <div className="flex items-center gap-2 text-[12.5px] font-bold text-[#10142d]">
                <Calendar size={16} className="text-[#5e6272]" />
                <span>7 Days <span className="text-[#5e6272] font-semibold">from the time of generation</span></span>
              </div>
            </div>
          </div>

          {/* What happens next? */}
          <div className="border-t border-[#e3e4ee] pt-5">
            <h3 className="text-[14px] font-extrabold text-[#0089CF] mb-4 tracking-tight">
              What happens next?
            </h3>

            {/* Stepper Steps */}
            <div className="relative pl-7 space-y-5">
              {/* Vertical connecting line */}
              <div className="absolute top-2.5 bottom-2.5 left-3 w-[1.5px] bg-[#e3e4ee]" />

              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-7 top-0.5 w-[20px] h-[20px] rounded-full bg-[#eef2ff] border border-[#dbeafe] flex items-center justify-center text-[10px] font-extrabold text-[#0089CF] z-10 shadow-sm">
                  1
                </div>
                <div>
                  <h4 className="text-[12.5px] font-extrabold text-[#10142d] leading-none mb-1">
                    Customer receives the link
                  </h4>
                  <p className="text-[11.5px] text-[#5e6272] leading-[1.4] font-medium">
                    Customer will receive the consent link via selected communication channel.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-7 top-0.5 w-[20px] h-[20px] rounded-full bg-[#eef2ff] border border-[#dbeafe] flex items-center justify-center text-[10px] font-extrabold text-[#0089CF] z-10 shadow-sm">
                  2
                </div>
                <div>
                  <h4 className="text-[12.5px] font-extrabold text-[#10142d] leading-none mb-1">
                    Customer gives consent
                  </h4>
                  <p className="text-[11.5px] text-[#5e6272] leading-[1.4] font-medium">
                    Customer will login to Entity Locker and approve the consent.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-7 top-0.5 w-[20px] h-[20px] rounded-full bg-[#eef2ff] border border-[#dbeafe] flex items-center justify-center text-[10px] font-extrabold text-[#0089CF] z-10 shadow-sm">
                  3
                </div>
                <div>
                  <h4 className="text-[12.5px] font-extrabold text-[#10142d] leading-none mb-1">
                    Documents available
                  </h4>
                  <p className="text-[11.5px] text-[#5e6272] leading-[1.4] font-medium">
                    Once consent is approved, you can view and download the documents.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Alert Box: Note */}
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[12px] p-4 flex gap-3 items-start shadow-sm">
            <Info size={16} className="text-[#0089CF] shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-[#0089CF] leading-[1.5] font-semibold">
              Customer details will be used only for consent purpose and will not be stored beyond the validity period as per policy.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
