"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Database,
  Cpu,
  Activity,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Bell,
  ChevronRight,
  FilePlus2,
  ClipboardList,
  PanelTop,
  Boxes,
  Link2,
  UserRoundPlus,
  ChartNoAxesCombined,
  ScrollText,
  KeyRound,
  FileText,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const COPYRIGHT_YEAR = "2026";

export default function DashboardLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Accordion Menu State (only one open at a time, closed by default on reload/login)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (name: string) => {
    setOpenAccordion((prev) => (prev === name ? null : name));
  };

  const handleNavigation = (path: string) => {
    if (path.includes("/dashboard/requester")) {
      setOpenAccordion("requester");
    } else if (path.includes("/dashboard/api-management")) {
      setOpenAccordion("api");
    } else {
      setOpenAccordion(null);
    }
    router.push(path);
  };

  // Helper to detect active main menu item
  const isActiveMain = (path: string) => {
    return pathname === path;
  };

  // Helper to detect active sub menu item
  const isActiveSub = (path: string) => {
    if (path === "/dashboard/api-management/documentation") {
      return pathname === path || pathname.includes("/documentation");
    }
    if (path === "/dashboard/api-management/api-catalog") {
      return pathname === path || (pathname.startsWith(path) && !pathname.includes("/documentation"));
    }
    return pathname === path;
  };

  // Breadcrumbs builder
  const getBreadcrumbs = () => {
    const BREADCRUMB_MAP: Record<string, string> = {
      "api-management": "API Management",
      "api-catalog": "API Catalog",
      "document-retrieval": "Document Retrieval API",
      "ekyc-verification": "eKYC Verification API",
      "account-statement": "Account Statement API",
      "loan-document": "Loan Document API",
      "bank-branch-locator": "Bank Branch Locator API",
      "overview": "Overview",
    };

    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, index) => {
      const label = BREADCRUMB_MAP[part] || (part.charAt(0).toUpperCase() + part.slice(1).replace("-", " "));
      return {
        label,
        isLast: index === parts.length - 1,
        path: "/" + parts.slice(0, index + 1).join("/"),
      };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const isRequesterOpen = openAccordion === "requester";
  const isIssuerOpen = openAccordion === "issuer";
  const isApiOpen = openAccordion === "api";
  const isApiLogsOpen = openAccordion === "apiLogs";
  const isReportsOpen = openAccordion === "reports";
  const isUsersOpen = openAccordion === "users";
  const isSettingsOpen = openAccordion === "settings";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f7fe] font-manrope">
      {/* ══════════════ LEFT SIDEBAR ══════════════ */}
      <aside className="relative flex flex-col w-[250px] h-full bg-[#0089CF] text-white shrink-0 z-20 shadow-[4px_0_24px_rgba(0,137,207,0.15)] select-none overflow-hidden">
        
        {/* Sidebar Watermark Background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/bom-watermark.svg"
          alt=""
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-[36px] w-full h-[150px] object-contain object-bottom brightness-0 invert opacity-40 pointer-events-none z-0"
        />

        {/* Top Logo Panel */}
        <div className="relative z-10 px-4 pt-4 pb-3 flex justify-center items-center border-b border-white/8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/bom_logo.svg"
            alt="Bank of Maharashtra"
            className="w-full h-auto max-h-[64px] object-contain"
          />
        </div>

        {/* Navigation Menu Scroll Container */}
        <nav className="relative z-10 flex-1 overflow-y-auto px-2.5 pt-3 pb-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
          
          {/* 1. Dashboard Link */}
          <button
            onClick={() => handleNavigation("/dashboard")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-[9px] text-[13.5px] font-bold transition-all duration-150 cursor-pointer ${
              isActiveMain("/dashboard")
                ? "bg-[#0072ad] text-white shadow-[0_4px_12px_rgba(0,114,173,0.3)]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard size={17} className="shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* 2. Requester Menu (Accordion) */}
          <div>
            <button
              onClick={() => toggleAccordion("requester")}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-[9px] text-[13.5px] font-bold transition-all duration-150 cursor-pointer ${
                pathname.includes("/dashboard/requester")
                  ? "text-white bg-white/5"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={17} className="shrink-0" />
                <span>Requester</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isRequesterOpen ? "rotate-180" : ""}`} />
            </button>
            
            {/* Requester Submenu */}
            <div
              className={`mt-1 pl-3.5 space-y-0.5 transition-all duration-300 overflow-hidden ${
                isRequesterOpen ? "max-h-[250px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              {[
                { label: "Create Request", path: "/dashboard/requester/create-request", icon: FilePlus2 },
                { label: "Request List", path: "/dashboard/requester/request-list", icon: ClipboardList },
                // { label: "Shared Link Status", path: "/dashboard/requester/shared-link-status", icon: Link2 },
                // { label: "Consent History", path: "/dashboard/requester/consent-history", icon: History },
                // { label: "Document List", path: "/dashboard/requester/document-list", icon: FileStack },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = isActiveSub(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center gap-2.5 w-full px-3 py-1.5 rounded-[8px] text-[12.5px] font-semibold transition-all duration-150 text-left cursor-pointer ${
                      isActive
                        ? "bg-[#0072ad] text-white shadow-[0_3px_10px_rgba(0,114,173,0.2)]"
                        : "text-white/60 hover:bg-white/4 hover:text-white"
                    }`}
                  >
                    <Icon size={14} aria-hidden="true" className="shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Issuer Menu (Accordion) */}
          <div>
            <button
              onClick={() => toggleAccordion("issuer")}
              className="flex items-center justify-between w-full px-3 py-2 rounded-[9px] text-[13.5px] font-bold text-white/70 hover:bg-white/5 hover:text-white transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Database size={17} className="shrink-0" />
                <span>Issuer</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isIssuerOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`mt-1 pl-3.5 space-y-0.5 overflow-hidden transition-all duration-200 ${isIssuerOpen ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"}`}>
              <button className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-[8px] text-[12.5px] text-white/60 hover:text-white text-left cursor-pointer">
                <PanelTop size={14} aria-hidden="true" className="shrink-0" />
                <span>Issuer Panel</span>
              </button>
            </div>
          </div>

          {/* 4. API Management */}
          <div>
            <button
              onClick={() => toggleAccordion("api")}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-[9px] text-[13.5px] font-bold transition-all duration-150 cursor-pointer ${
                pathname.includes("/dashboard/api-management")
                  ? "text-white bg-white/5"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu size={17} className="shrink-0" />
                <span>API Management</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isApiOpen ? "rotate-180" : ""}`} />
            </button>

            <div
              className={`mt-1 pl-3.5 space-y-0.5 transition-all duration-300 overflow-hidden ${
                isApiOpen ? "max-h-[310px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              {[
                { label: "Overview", path: "/dashboard/api-management/overview", icon: PanelTop },
                { label: "API Catalog", path: "/dashboard/api-management/api-catalog", icon: Boxes },
                { label: "Documentation", path: "/dashboard/api-management/documentation", icon: FileText },
                // { label: "Subscriptions", path: "/dashboard/api-management/subscriptions", icon: Link2 },
                // { label: "Vendor/Client Onboarding", path: "/dashboard/api-management/vendor-onboarding", icon: UserRoundPlus },
                // { label: "API Analytics", path: "/dashboard/api-management/analytics", icon: ChartNoAxesCombined },
                // { label: "API Logs", path: "/dashboard/api-management/logs", icon: ScrollText },
                // { label: "API Keys", path: "/dashboard/api-management/keys", icon: KeyRound },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = isActiveSub(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center gap-2.5 w-full px-3 py-1.5 rounded-[8px] text-[12.5px] font-semibold transition-all duration-150 text-left cursor-pointer ${
                      isActive
                        ? "bg-[#0072ad] text-white shadow-[0_3px_10px_rgba(0,114,173,0.2)]"
                        : "text-white/60 hover:bg-white/4 hover:text-white"
                    }`}
                  >
                    <Icon size={14} aria-hidden="true" className="shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. API Logs & Monitoring */}
          <div>
            <button
              onClick={() => toggleAccordion("apiLogs")}
              className="flex items-center justify-between w-full px-3 py-2 rounded-[9px] text-[13.5px] font-bold text-white/70 hover:bg-white/5 hover:text-white transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Activity size={17} className="shrink-0" />
                <span>API Logs &amp; Mon.</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isApiLogsOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* 6. Reports */}
          <div>
            <button
              onClick={() => toggleAccordion("reports")}
              className="flex items-center justify-between w-full px-3 py-2 rounded-[9px] text-[13.5px] font-bold text-white/70 hover:bg-white/5 hover:text-white transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={17} className="shrink-0" />
                <span>Reports</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isReportsOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* 7. Users & Roles */}
          <div>
            <button
              onClick={() => toggleAccordion("users")}
              className="flex items-center justify-between w-full px-3 py-2 rounded-[9px] text-[13.5px] font-bold text-white/70 hover:bg-white/5 hover:text-white transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <UserCog size={17} className="shrink-0" />
                <span>Users &amp; Roles</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isUsersOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* 8. Settings */}
          <div>
            <button
              onClick={() => toggleAccordion("settings")}
              className="flex items-center justify-between w-full px-3 py-2 rounded-[9px] text-[13.5px] font-bold text-white/70 hover:bg-white/5 hover:text-white transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Settings size={17} className="shrink-0" />
                <span>Settings</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isSettingsOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

        </nav>

        {/* Footer Info Area */}
        <div className="relative z-10 mt-auto px-3 pt-3 pb-1 shrink-0 flex flex-col items-center select-none border-t border-white/8">
          {/* Logout Link */}
          <button
            onClick={() => handleNavigation("/login")}
            className="flex items-center gap-3 w-full px-3 py-1.5 rounded-[9px] text-[13px] font-bold text-white/80 hover:bg-white/5 hover:text-red-300 transition-colors duration-150 mb-[116px] cursor-pointer"
          >
            <LogOut size={17} className="shrink-0" />
            <span>Logout</span>
          </button>

          <span className="self-start px-1 text-[10px] text-white/70 font-medium leading-[1.45] flex flex-col justify-center items-center">
            &copy; {COPYRIGHT_YEAR} LoanTap Financial Technologies.
            <span>All rights reserved.</span>
          </span>
        </div>
      </aside>

      {/* ══════════════ MAIN WORKSPACE ══════════════ */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-[70px] bg-white border-b border-[#e3e4ee] px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
          
          {/* Breadcrumbs */}
          <div className="flex flex-col">
            <h1 className="text-[17px] font-extrabold text-text-primary tracking-tight leading-tight">
              Mahabank Digital Document Portal
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-semibold text-text-mid">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.path}>
                  {idx > 0 && <ChevronRight size={10} className="text-text-mid/50" />}
                  {crumb.isLast ? (
                    <span className="text-bom-blue-mid">{crumb.label}</span>
                  ) : (
                    <button
                      onClick={() => handleNavigation(crumb.path)}
                      className="hover:text-text-primary transition-colors cursor-pointer"
                    >
                      {crumb.label}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-5">
            
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full border border-[#e3e4ee] hover:bg-neutral-50 text-[#5e6272] transition-colors shrink-0 cursor-pointer">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9.5px] font-extrabold flex items-center justify-center rounded-full border border-white">
                8
              </span>
            </button>

            {/* Vertical Divider */}
            <div className="w-[1.5px] h-[34px] bg-neutral-200 shrink-0" />

            {/* Profile Dropdown */}
            <button className="flex items-center gap-2.5 text-left border-0 bg-transparent p-0 hover:opacity-90 transition-opacity cursor-pointer shrink-0">
              <div className="w-[36px] h-[36px] rounded-full bg-neutral-100 flex items-center justify-center border border-[#e3e4ee] text-bom-blue-mid font-extrabold text-[14px]">
                AU
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-mid uppercase leading-none mb-0.5">Welcome,</span>
                <span className="text-[13px] font-extrabold text-text-primary leading-none">Admin User</span>
              </div>
              <ChevronDown size={14} className="text-text-mid ml-1" />
            </button>

            {/* Entity Locker Brand Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/entityLocker-logo.svg"
              alt="Entity Locker"
              className="h-[32px] w-auto block object-contain shrink-0"
            />
          </div>
        </header>

        {/* Page Content Scroll Area */}
        <main className="flex-1 overflow-y-auto bg-[#f4f7fe]">
          {children}
        </main>
      </div>
    </div>
  );
}
