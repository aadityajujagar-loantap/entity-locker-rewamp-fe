"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import DashboardLayout from "@/app/dashboard/layout";
import { RefreshCw } from "lucide-react";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const session = getAuthSession();

        if (!session || !session.accessToken) {
            router.replace("/login");
            return;
        }

        const isAdmin = Boolean(
            session.roles?.some((role) => role.toLowerCase() === "admin")
        );

        if (!isAdmin) {
            // Non-admin attempted direct URL access: redirect to dashboard immediately
            router.replace("/dashboard");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    // While checking permissions or if unauthorized, do NOT render the form/page
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="flex items-center gap-2 text-[#0089CF] text-[13px] font-bold">
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Verifying access permissions...</span>
                </div>
            </div>
        );
    }

    // Admin user: render with sidebar & top navigation
    return <DashboardLayout>{children}</DashboardLayout>;
}