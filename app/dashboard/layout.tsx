"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Database,
  Cpu,
  Activity,
  BarChart3,
  UserCog,
  UserPlus,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  ChevronRight,
  FilePlus2,
  ClipboardList,
  PanelTop,
  Boxes,
  FileText,
  Building2,
} from "lucide-react";
import { clearAuthSession, getAuthSession, logoutFromPortal, subscribeAuthSession } from "@/lib/auth";
import { UserProfileModal } from "@/app/users/UserProfileModal";

interface LayoutProps {
  children: React.ReactNode;
}

const COPYRIGHT_YEAR = "2026";

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return initials || "U";
}

export default function DashboardLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const authSession = useSyncExternalStore(subscribeAuthSession, getAuthSession, () => null);

  // Accordion Menu State (only one open at a time, closed by default on reload/login)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (!authSession) {
      router.replace("/login");
    }
  }, [authSession, router]);

  const toggleAccordion = (name: string) => {
    setOpenAccordion((prev) => (prev === name ? null : name));
  };

  const handleNavigation = (path: string) => {
    if (path.includes("/dashboard/requester")) {
      setOpenAccordion("requester");
    } else if (path.includes("/dashboard/api-management")) {
      setOpenAccordion("api");
    } else if (path.includes("/users")) {
      setOpenAccordion("users");
    } else {
      setOpenAccordion(null);
    }
    router.push(path);
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      if (authSession) {
        await logoutFromPortal(authSession);
      }
    } finally {
      clearAuthSession();
      router.replace("/login");
    }
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
      "users": "Users",
      "create": "Create User",
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
  const userDisplayName = authSession?.user.name || authSession?.user.employeeId || "User";
  const userInitials = getInitials(userDisplayName);

  const isRequesterOpen = openAccordion === "requester";
  const isIssuerOpen = openAccordion === "issuer";
  const isApiOpen = openAccordion === "api";
  const isApiLogsOpen = openAccordion === "apiLogs";
  const isReportsOpen = openAccordion === "reports";
  const isUsersOpen = openAccordion === "users";
  const isSettingsOpen = openAccordion === "settings";

  if (!authSession) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f4f7fe] font-manrope text-[13px] font-bold text-[#5e6272]">
        Checking session...
      </div>
    );
  }

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

            {/* Submenu Items for Requester */}
            <div
              className={`mt-1 pl-3.5 space-y-0.5 transition-all duration-300 overflow-hidden ${
                isRequesterOpen ? "max-h-[310px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              {[
                { label: "Entity List", path: "/dashboard/requester/entity-list", icon: Building2 },
                { label: "Request List", path: "/dashboard/requester/request-list", icon: ClipboardList },
                { label: "Consent Details", path: "/dashboard/requester/consent-details", icon: PanelTop },
                { label: "Consent History", path: "/dashboard/requester/consent-history", icon: Boxes },
                { label: "Shared Link Status", path: "/dashboard/requester/shared-link-status", icon: Activity },
                { label: "Document List", path: "/dashboard/requester/document-list", icon: FileText },
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

          {/* 3. Issuer */}
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
                <BarChart3 size={17} className="shrink-[#0] shrink-0" />
                <span>Reports</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isReportsOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* 7. Users & Roles (With Submenus: Users, Create User) */}
          <div>
            <button
              onClick={() => toggleAccordion("users")}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-[9px] text-[13.5px] font-bold transition-all duration-150 cursor-pointer ${
                pathname.includes("/users")
                  ? "text-white bg-white/5"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCog size={17} className="shrink-0" />
                <span>Users &amp; Roles</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isUsersOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Submenu Items for Users & Roles */}
            <div
              className={`mt-1 pl-3.5 space-y-0.5 transition-all duration-300 overflow-hidden ${
                isUsersOpen ? "max-h-[150px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              {[
                { label: "Users", path: "/users", icon: Users },
                { label: "Create User", path: "/users/create", icon: UserPlus },
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
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 w-full py-2 text-[12.5px] font-extrabold text-[#fecaca] hover:text-white hover:bg-red-500/20 rounded-[8px] transition-colors cursor-pointer mb-2 disabled:opacity-50"
          >
            <LogOut size={15} />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>

          {/* Copyright Text */}
          <div className="text-[10px] text-white/40 text-center font-medium leading-normal mb-1">
            Copyright &copy; {COPYRIGHT_YEAR} Bank of Maharashtra. All rights reserved.
          </div>
        </div>

      </aside>

      {/* ══════════════ MAIN CONTENT WRAPPER ══════════════ */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-[60px] bg-white border-b border-[#e3e4ee] px-5 flex items-center justify-between shrink-0 z-10 shadow-xs">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] font-bold text-[#5e6272]">
            <span className="text-[#0089CF] font-extrabold">Portal</span>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.path}>
                <ChevronRight size={13} className="text-[#9094a8]" />
                <span className={crumb.isLast ? "text-[#10142d] font-extrabold" : "text-[#5e6272]"}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              className="relative p-2 rounded-full hover:bg-neutral-100 text-[#5e6272] transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="h-5 w-[1px] bg-[#e3e4ee]" />

            {/* Profile Avatar Pill */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer border border-transparent hover:border-[#e3e4ee]"
              title="User Account Profile"
            >
              <div className="w-8 h-8 rounded-full bg-[#0089CF] text-white font-extrabold text-[12.5px] flex items-center justify-center shadow-xs">
                {userInitials}
              </div>
              <div className="flex flex-col text-left leading-tight hidden sm:flex">
                <span className="text-[12.5px] font-extrabold text-[#10142d] truncate max-w-[140px]">
                  {userDisplayName}
                </span>
                <span className="text-[10px] font-bold text-[#0089CF]">
                  {authSession?.branch?.branchCode ? `Branch: ${authSession.branch.branchCode}` : "System Admin"}
                </span>
              </div>
              <ChevronDown size={14} className="text-[#5e6272] hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Main Content Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#f4f7fe]">
          {children}
        </main>
      </div>

      {/* User Account Profile Modal Dialog */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        accessToken={authSession?.accessToken || ""}
      />
    </div>
  );
}
