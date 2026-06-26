"use client";
import React from "react";
import { Headphones } from "lucide-react";

// ── Shared AuthLayout (Refactored to Tailwind) ────────────────────────────────
// Uses bom_logo.svg (left panel, top), entityLocker-logo.svg (right panel, top-right)
// bom-watermark.svg (left panel, full-bleed bg watermark)
// No footer – fits in 100vh with no scroll

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex w-full h-screen h-[100dvh] overflow-hidden font-manrope text-text-primary bg-panel-bg">
      {/* ══════════════ LEFT PANEL ══════════════ */}
      <section className="relative flex-[0_0_38%] max-w-[45%] min-w-[440px] h-full flex flex-col p-[clamp(24px,3.5vh,44px)_clamp(28px,3.5vw,48px)] bg-[#0089CF] overflow-hidden z-10">

        {/* Watermark illustration – bottom, full width of left panel with no margins/padding */}
        <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/bom-watermark.svg"
            alt=""
            aria-hidden="true"
            className="w-full h-[400px] max-h-[500px] object-contain object-bottom block brightness-0 invert opacity-40"
          />
        </div>

        {/* BOM logo and text content */}
        <div className="relative z-10 flex flex-col h-full pt-10">

          {/* BOM Logo – top-left */}
          <div className="inline-flex items-center w-fit shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/bom_logo.svg"
              alt="Bank of Maharashtra"
              className="h-[clamp(72px,7.5vh,78px)] w-auto block"
            />
          </div>

          {/* Text content */}
          <div className="flex-1 flex flex-col justify-center items-start my-auto mb-[200px]">
            <p className="text-[13px] font-semibold text-[#7dd3fc] tracking-[0.06em] uppercase mb-2.5">Welcome to</p>
            <h1 className="text-[40px] font-extrabold text-white leading-[1.15] mb-3.5 tracking-tight">
              Mahabank Digital<br />Document Portal
            </h1>
            <div className="w-10 h-[3px] bg-[#7dd3fc] rounded-full mb-5" />
            <p className="text-[clamp(13px,1.1vw,15px)] text-white/70 leading-[1.72] max-w-[300px] font-medium">
              A secure and unified platform to manage Requester,
              Issuer, and API services integrated with Entity Locker.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <section className="relative flex-1 min-w-0 h-full flex flex-col items-center justify-center p-[clamp(24px,3vh,48px)_clamp(20px,4vw,60px)] bg-panel-bg overflow-hidden">

        {/* Entity Locker logo – pinned top-right */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/entityLocker-logo.svg"
          alt="Entity Locker"
          className="absolute top-[clamp(18px,2.5vh,30px)] right-[clamp(20px,2.5vw,36px)] z-50 block h-[40px] w-auto"
        />

        {/* Slot for login card / OTP card */}
        {children}

      </section>

    </main>
  );
}

// ── Support link (used below the card) ───────────────────────────────────────
export function SupportLink() {
  return (
    <div className="flex items-center gap-[7px] mt-5 text-text-mid text-[13px] font-medium z-10">
      <Headphones size={15} className="text-text-mid" />
      <span>Need help?</span>
      <a href="#" className="text-bom-blue-mid font-bold no-underline transition-colors duration-150 hover:text-bom-blue-dark">
        Contact Support
      </a>
    </div>
  );
}
