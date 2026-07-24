"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound, LockKeyhole, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import {
  AuthApiError,
  getAuthSession,
  getPortalApiBaseUrl,
  loginToPortal,
  saveAuthSession,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getAuthSession()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setLoginError("Enter username and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const loginData = await loginToPortal({
        login: trimmedUsername,
        password,
      });

      saveAuthSession(loginData);
      router.replace("/dashboard");
    } catch (error) {
      const message = error instanceof AuthApiError
        ? error.message
        : `Unable to reach the login service at ${getPortalApiBaseUrl()}.`;

      setLoginError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {/* ── Card (Tailwind-Refactored, Compact) ── */}
      <div className="relative z-10 w-full max-w-[420px] p-6 border border-white/90 rounded-[18px] bg-card-bg shadow-[0_24px_70px_rgba(20,16,50,0.11)] backdrop-blur-[18px]">

        <h2 className="m-0 mb-1 text-text-primary text-[20px] font-extrabold text-center tracking-tight">
          Login to Your Account
        </h2>
        <p className="m-0 mb-3 text-text-mid text-[13px] text-center font-medium leading-[1.5]">
          Access your Mahabank Digital Document Portal
        </p>
        <hr className="border-0 border-t border-border-col my-4 -mx-6" />

        <form onSubmit={handleLogin} noValidate>

          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="block mb-1 text-text-primary text-[12px] font-bold">
              Username
            </label>
            <div className="relative flex items-center h-[38px] border-[1.5px] border-border-col rounded-[10px] bg-white/98 shadow-[0_2px_8px_rgba(18,22,46,0.05)] transition-all duration-150 focus-within:border-bom-blue/50 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(0,137,207,0.09),0_4px_14px_rgba(18,22,46,0.07)]">
              <span className="grid place-items-center flex-[0_0_32px] w-8 h-8 ml-1 rounded-[7px] bg-[#eef2ff] text-bom-blue-mid shrink-0">
                <UserRound size={15} strokeWidth={2.2} />
              </span>
              <input
                id="username"
                type="text"
                className="flex-1 h-full border-0 bg-transparent shadow-none text-text-primary text-[13px] font-semibold px-3 pl-2.5 outline-none focus:outline-none focus:ring-0"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="block mb-1 text-text-primary text-[12px] font-bold">
              Password
            </label>
            <div className="relative flex items-center h-[38px] border-[1.5px] border-border-col rounded-[10px] bg-white/98 shadow-[0_2px_8px_rgba(18,22,46,0.05)] transition-all duration-150 focus-within:border-bom-blue/50 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(0,137,207,0.09),0_4px_14px_rgba(18,22,46,0.07)]">
              <span className="grid place-items-center flex-[0_0_32px] w-8 h-8 ml-1 rounded-[7px] bg-[#eef2ff] text-bom-blue-mid shrink-0">
                <LockKeyhole size={15} strokeWidth={2.2} />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="flex-1 h-full border-0 bg-transparent shadow-none text-text-primary text-[13px] font-semibold px-3 pl-2.5 pr-11 outline-none focus:outline-none focus:ring-0"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 grid place-items-center w-[30px] h-[30px] border-0 bg-transparent text-[#9094a8] cursor-pointer transition-colors duration-150 hover:text-bom-blue p-0"
                onClick={() => setShowPassword((v) => !v)}
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login error display */}
          {loginError && (
            <p className="text-red-600 text-xs mb-3.5 font-bold text-center">{loginError}</p>
          )}

          {/* Login button */}
          <button
            type="submit"
            className={`flex items-center justify-center gap-2 w-full h-[38px] border-0 rounded-[10px] bg-bom-blue text-white text-[14px] font-extrabold shadow-[0_8px_24px_rgba(0,137,207,0.27)] transition-all duration-150 hover:bg-bom-blue-dark hover:shadow-[0_12px_32px_rgba(0,137,207,0.36)] active:scale-[0.985] ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
            id="login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

        </form>
      </div>
    </AuthLayout>
  );
}
