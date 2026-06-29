"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Network,
  ShieldCheck,
  Users,
  FileSpreadsheet,
  TrendingUp,
  XCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  MoreVertical,
  ChevronRight,
  BookOpen,
  PlusCircle,
  KeyRound,
  FileText,
  CheckCircle2,
  FileKey2,
} from "lucide-react";

const metrics = [
  {
    label: "Total APIs",
    value: "24",
    trend: "12%",
    direction: "up",
    icon: Network,
    iconClass: "bg-[#eff6ff] text-[#2563eb]",
  },
  {
    label: "Active APIs",
    value: "18",
    trend: "10%",
    direction: "up",
    icon: ShieldCheck,
    iconClass: "bg-[#ecfdf3] text-[#16a34a]",
  },
  {
    label: "Total Vendors/Clients",
    value: "32",
    trend: "8%",
    direction: "up",
    icon: Users,
    iconClass: "bg-[#eff6ff] text-[#2563eb]",
  },
  {
    label: "Active Subscriptions",
    value: "56",
    trend: "15%",
    direction: "up",
    icon: FileSpreadsheet,
    iconClass: "bg-[#f0fdfa] text-[#0d9488]",
  },
  {
    label: "Total API Calls (This Month)",
    value: "1,25,000",
    trend: "18%",
    direction: "up",
    icon: TrendingUp,
    iconClass: "bg-[#eff6ff] text-[#2563eb]",
  },
  {
    label: "Failed API Calls (This Month)",
    value: "3,456",
    trend: "5%",
    direction: "down",
    icon: XCircle,
    iconClass: "bg-[#fef2f2] text-[#dc2626]",
  },
] as const;

const subscriptions = [
  ["SUBS001240", "Document Retrieval API", "FinTech Solutions Pvt. Ltd.", "Active", "28/05/2024", "28/05/2025"],
  ["SUBS001239", "eKYC Verification API", "QuickVerify Services", "Active", "27/05/2024", "27/05/2025"],
  ["SUBS001238", "PAN Verification API", "DataSecure India Ltd.", "Active", "27/05/2024", "27/05/2025"],
  ["SUBS001237", "Account Statement API", "FinTech Solutions Pvt. Ltd.", "Pending", "26/05/2024", "-"],
  ["SUBS001236", "Loan Document API", "Lendingkart Technologies", "Active", "26/05/2024", "26/05/2025"],
] as const;

const onboardingSummary = [
  { label: "Pending Approval", value: "6", icon: FileKey2, className: "bg-[#eff6ff] text-[#2563eb]" },
  { label: "Approved", value: "20", icon: CheckCircle2, className: "bg-[#ecfdf3] text-[#16a34a]" },
  { label: "Rejected", value: "2", icon: XCircle, className: "bg-[#fef2f2] text-[#dc2626]" },
  { label: "Total", value: "32", icon: Users, className: "bg-[#eff6ff] text-[#2563eb]" },
] as const;

const vendors = [
  ["FinTech Solutions Pvt. Ltd.", "Rohit Sharma", "rohit@fintech.com", "Approved", "28/05/2024"],
  ["QuickVerify Services", "Neha Verma", "neha@quickverify.com", "Pending", "28/05/2024"],
  ["DataSecure India Ltd.", "Amit Joshi", "amit@datasecure.com", "Approved", "27/05/2024"],
  ["VerifyMe Technologies", "Sneha Iyer", "sneha@verifyme.com", "Pending", "27/05/2024"],
  ["Secure Data Systems", "Vikram Patel", "vikram@secdata.com", "Rejected", "26/05/2024"],
] as const;

const topApis = [
  ["Document Retrieval API", "45,678"],
  ["eKYC Verification API", "32,456"],
  ["PAN Verification API", "18,765"],
  ["Account Statement API", "15,234"],
  ["Loan Document API", "10,345"],
] as const;

const statusClass = (status: string) => {
  if (status === "Approved" || status === "Active") {
    return "border-[#bbf7d0] bg-[#ecfdf3] text-[#16a34a]";
  }
  if (status === "Pending") {
    return "border-[#fed7aa] bg-[#fff7ed] text-[#ea580c]";
  }
  return "border-[#fecaca] bg-[#fff1f2] text-[#dc2626]";
};

export default function ApiManagementOverviewPage() {
  const [activeTab, setActiveTab] = useState<"subscriptions" | "top-apis">("subscriptions");

  return (
    <div className="mx-auto max-w-[1400px] space-y-2 p-2 animate-fade-in">
      
      {/* 1. Metrics Grid */}
      <section className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" aria-label="API overview metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isDown = metric.direction === "down";

          return (
            <article
              key={metric.label}
              className="flex items-center gap-3.5 rounded-[16px] border border-[#e3e4ee] bg-white p-4.5 shadow-[0_2px_12px_rgba(18,22,46,0.02)] hover:shadow-md transition-shadow"
            >
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-[12px] ${metric.iconClass}`}>
                <Icon size={20} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#5e6272] uppercase tracking-wide leading-none mb-1.5">{metric.label}</p>
                <p className="text-[22px] font-extrabold leading-none text-[#10142d]">{metric.value}</p>
                <p className={`mt-2 flex items-center gap-1 whitespace-nowrap text-[10px] font-bold ${isDown ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
                  {isDown ? <ArrowDown size={11} strokeWidth={3} /> : <ArrowUp size={11} strokeWidth={3} />}
                  <span>{metric.trend}</span>
                  <span className="text-[#9094a8] font-semibold">from last month</span>
                </p>
              </div>
            </article>
          );
        })}
      </section>

      {/* 2. Split Layout */}
      <div className="grid grid-cols-1 items-start gap-2 xl:grid-cols-[minmax(0,2.28fr)_minmax(320px,1fr)]">
        
        {/* Left Column */}
        <div className="space-y-2">
          
          {/* Recent API Subscriptions & Top Performing APIs */}
          <section className="overflow-hidden rounded-[16px] border border-[#e3e4ee] bg-white shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
            <div className="flex h-[44px] items-end gap-6 border-b border-[#e3e4ee] px-5 bg-white">
              <button
                onClick={() => setActiveTab("subscriptions")}
                className={`h-full border-b-2 text-[13px] font-extrabold transition-colors cursor-pointer ${
                  activeTab === "subscriptions"
                    ? "border-[#0089CF] text-[#0089CF]"
                    : "border-transparent text-[#5e6272] hover:text-[#10142d]"
                }`}
              >
                Recent API Subscriptions
              </button>
              <button
                onClick={() => setActiveTab("top-apis")}
                className={`h-full border-b-2 text-[13px] font-extrabold transition-colors cursor-pointer ${
                  activeTab === "top-apis"
                    ? "border-[#0089CF] text-[#0089CF]"
                    : "border-transparent text-[#5e6272] hover:text-[#10142d]"
                }`}
              >
                Top Performing APIs
              </button>
            </div>

            <div className="px-5 pt-2">
              {activeTab === "subscriptions" ? (
                <table className="w-full table-fixed border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="h-[38px] border-b border-[#e3e4ee] text-[11px] font-bold text-[#10142d] uppercase tracking-wide">
                      <th className="w-[16%] px-1">Subscription ID</th>
                      <th className="w-[24%] px-1">API Name</th>
                      <th className="w-[22%] px-1">Vendor/Client</th>
                      <th className="w-[12%] px-1">Status</th>
                      <th className="w-[13%] px-1">Subscribed On</th>
                      <th className="w-[13%] px-1">Expires On</th>
                      <th className="w-[8%] px-1 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub[0]} className="h-[40px] border-b border-[#e3e4ee] text-[#10142d] font-semibold last:border-b-0">
                        <td className="truncate px-1 text-[#0089CF] font-bold">{sub[0]}</td>
                        <td className="truncate px-1 font-bold">{sub[1]}</td>
                        <td className="truncate px-1 text-[#5e6272]">{sub[2]}</td>
                        <td className="px-1">
                          <span className={`inline-flex rounded-[4px] border px-2 py-0.5 text-[10px] font-bold ${statusClass(sub[3])}`}>
                            {sub[3]}
                          </span>
                        </td>
                        <td className="px-1 text-[#5e6272]">{sub[4]}</td>
                        <td className="px-1 text-[#5e6272]">{sub[5]}</td>
                        <td className="px-1">
                          <div className="flex items-center justify-center gap-2 text-[#0089CF]">
                            <button title="View Details" className="cursor-pointer p-1 hover:bg-slate-50 rounded">
                              <Eye size={14.5} />
                            </button>
                            <button title="More Actions" className="cursor-pointer p-1 hover:bg-slate-50 rounded">
                              <MoreVertical size={14.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full table-fixed border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="h-[38px] border-b border-[#e3e4ee] text-[11px] font-bold text-[#10142d] uppercase tracking-wide">
                      <th className="w-[50%] px-1">API Name</th>
                      <th className="w-[25%] px-1">Calls (This Month)</th>
                      <th className="w-[25%] px-1 text-right">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topApis.map((api) => (
                      <tr key={api[0]} className="h-[40px] border-b border-[#e3e4ee] text-[#10142d] font-semibold last:border-b-0">
                        <td className="truncate px-1 font-bold">{api[0]}</td>
                        <td className="px-1 text-[#5e6272]">{api[1]}</td>
                        <td className="px-1 text-right text-[#16a34a] font-bold">99.8%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="px-5 py-3">
              <Link href="/dashboard/api-management/subscriptions" className="inline-flex items-center gap-1 text-[11.5px] font-extrabold text-[#0089CF] hover:underline">
                <span>View all subscriptions</span>
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </section>

          {/* Vendor/Client Onboarding */}
          <section className="overflow-hidden rounded-[16px] border border-[#e3e4ee] bg-white shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
            <div className="px-5 pt-3.5 pb-2">
              <h2 className="text-[14px] font-extrabold text-[#10142d]">Vendor/Client Onboarding</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-2 px-5 py-2 sm:grid-cols-4">
              {onboardingSummary.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.label} className="flex h-[74px] items-center gap-3 rounded-[12px] border border-[#e3e4ee] px-3.5 bg-white">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ${item.className}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#5e6272] uppercase tracking-wide leading-none mb-1">{item.label}</p>
                      <p className="text-[18px] font-extrabold leading-none text-[#10142d]">{item.value}</p>
                      <p className="mt-1 text-[9.5px] font-bold text-[#9094a8]">Vendors</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="px-5 pt-1">
              <table className="w-full table-fixed border-collapse text-left text-[13px]">
                <thead>
                  <tr className="h-[38px] border-b border-[#e3e4ee] text-[11px] font-bold text-[#10142d] uppercase tracking-wide">
                    <th className="w-[28%] px-1">Vendor/Client Name</th>
                    <th className="w-[18%] px-1">Contact Person</th>
                    <th className="w-[22%] px-1">Email ID</th>
                    <th className="w-[12%] px-1">Status</th>
                    <th className="w-[12%] px-1">Onboarded On</th>
                    <th className="w-[8%] px-1 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor[0]} className="h-[40px] border-b border-[#e3e4ee] text-[#10142d] font-semibold last:border-b-0">
                      <td className="truncate px-1 font-bold">{vendor[0]}</td>
                      <td className="truncate px-1 text-[#5e6272]">{vendor[1]}</td>
                      <td className="truncate px-1 text-[#5e6272]">{vendor[2]}</td>
                      <td className="px-1">
                        <span className={`inline-flex rounded-[4px] border px-2 py-0.5 text-[10px] font-bold ${statusClass(vendor[3])}`}>
                          {vendor[3]}
                        </span>
                      </td>
                      <td className="px-1 text-[#5e6272]">{vendor[4]}</td>
                      <td className="px-1">
                        <div className="flex items-center justify-center gap-2 text-[#0089CF]">
                          <button title="View Details" className="cursor-pointer p-1 hover:bg-slate-50 rounded">
                            <Eye size={14.5} />
                          </button>
                          <button title="More Actions" className="cursor-pointer p-1 hover:bg-slate-50 rounded">
                            <MoreVertical size={14.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3">
              <Link href="/dashboard/api-management/vendor-onboarding" className="inline-flex items-center gap-1 text-[11.5px] font-extrabold text-[#0089CF] hover:underline">
                <span>View all vendors/clients</span>
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <aside className="space-y-2">
          
          {/* API Usage Summary */}
          <section className="rounded-[16px] border border-[#e3e4ee] bg-white shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
            <h2 className="border-b border-[#e3e4ee] px-5 py-3.5 text-[14px] font-extrabold text-[#10142d]">API Usage Summary (This Month)</h2>
            <div className="flex flex-col sm:flex-row items-center gap-5 px-5 py-4 bg-white">
              {/* Donut Chart */}
              <div className="relative h-[120px] w-[120px] shrink-0 rounded-full bg-[conic-gradient(#36b86f_0%_96.5%,#ef4444_96.5%_99.2%,#f59e0b_99.2%_100%)] p-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-[10px] font-extrabold text-[#9094a8] uppercase tracking-wider">Total Calls</p>
                    <p className="text-[16px] font-extrabold text-[#10142d] mt-0.5">1,27,000</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="min-w-0 flex-1 space-y-2.5 text-[12px] font-semibold">
                <div>
                  <p className="flex items-center gap-2 font-extrabold text-[#10142d]">
                    <span className="h-2 w-2 rounded-full bg-[#36b86f] shrink-0" />
                    Successful Calls
                  </p>
                  <p className="ml-4 mt-0.5 font-bold text-[#5e6272] text-[11.5px]">1,21,544 (96.5%)</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 font-extrabold text-[#10142d]">
                    <span className="h-2 w-2 rounded-full bg-[#ef4444] shrink-0" />
                    Failed Calls
                  </p>
                  <p className="ml-4 mt-0.5 font-bold text-[#5e6272] text-[11.5px]">3,456 (2.7%)</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 font-extrabold text-[#10142d]">
                    <span className="h-2 w-2 rounded-full bg-[#f59e0b] shrink-0" />
                    Partial Success
                  </p>
                  <p className="ml-4 mt-0.5 font-bold text-[#5e6272] text-[11.5px]">2,000 (1.6%)</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[12px]">
                  <span className="font-extrabold text-[#5e6272]">Total Calls</span>
                  <span className="font-extrabold text-[#10142d]">1,27,000</span>
                </div>
              </div>
            </div>
          </section>

          {/* Top API's by Usage */}
          <section className="overflow-hidden rounded-[16px] border border-[#e3e4ee] bg-white shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
            <h2 className="border-b border-[#e3e4ee] px-5 py-3.5 text-[14px] font-extrabold text-[#10142d]">Top API&apos;s by Usage</h2>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="h-[30px] bg-[#f8fafc] text-left text-[11px] font-bold text-[#10142d] uppercase tracking-wide">
                  <th className="px-5">API Name</th>
                  <th className="px-5 text-right">Total Calls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e4ee]">
                {topApis.map((api) => (
                  <tr key={api[0]} className="h-[36px] font-semibold text-[#10142d] hover:bg-slate-50 transition-colors">
                    <td className="px-5 font-bold">{api[0]}</td>
                    <td className="px-5 text-right text-[#5e6272]">{api[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3.5 border-t border-[#e3e4ee] bg-white">
              <Link href="/dashboard/api-management/api-catalog" className="inline-flex items-center gap-1 text-[11.5px] font-extrabold text-[#0089CF] hover:underline">
                <span>View all APIs</span>
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </section>

          {/* Quick Links */}
          <section className="overflow-hidden rounded-[16px] border border-[#e3e4ee] bg-white shadow-[0_2px_12px_rgba(18,22,46,0.02)]">
            <h2 className="border-b border-[#e3e4ee] px-5 py-3.5 text-[14px] font-extrabold text-[#10142d]">Quick Links</h2>
            <div className="divide-y divide-[#e3e4ee] px-5 bg-white">
              {[
                { label: "API Catalog", href: "/dashboard/api-management/api-catalog", icon: BookOpen },
                { label: "Create New API", href: "/dashboard/api-management/api-catalog", icon: PlusCircle },
                { label: "Generate API Key", href: "/dashboard/api-management/keys", icon: KeyRound },
                { label: "View API Documentation", href: "/dashboard/api-management/documentation", icon: FileText },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.label} href={link.href} className="flex h-[38px] items-center justify-between text-[13px] font-bold text-[#0089CF] hover:text-[#005f91] transition-colors">
                    <span className="flex items-center gap-3">
                      <Icon size={14.5} />
                      {link.label}
                    </span>
                    <ChevronRight size={13} className="text-[#9094a8]" />
                  </Link>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
