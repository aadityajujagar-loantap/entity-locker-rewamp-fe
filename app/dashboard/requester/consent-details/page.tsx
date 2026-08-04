"use client";

import React, { Suspense } from "react";
import ConsentDetails from "@/app/portal/ConsentDetails";
import { RefreshCw } from "lucide-react";

export default function DashboardConsentDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw size={36} className="text-[#0089CF] animate-spin" />
          <p className="text-[13px] font-bold text-[#5e6272]">Loading consent details page...</p>
        </div>
      }
    >
      <ConsentDetails />
    </Suspense>
  );
}
