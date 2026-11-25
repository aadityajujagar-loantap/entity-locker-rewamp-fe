"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound, LockKeyhole, Eye, EyeOff, KeyRound, CheckCircle2, AlertCircle, X, ArrowLeft, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import {
  AuthApiError,
  getAuthSession,
  getPortalApiBaseUrl,
  loginToPortal,
  saveAuthSession,
  requestForgotPassword,
  resetUserPassword,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot & Reset Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1); // 1 = Request OTP, 2 = Reset Password
  const [forgotLogin, setForgotLogin] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

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

  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    const trimmedLogin = forgotLogin.trim();
    if (!trimmedLogin) {
      setForgotError("Please enter your Employee ID, PF Number, or Email.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await requestForgotPassword(trimmedLogin);
      setForgotSuccess(res.message);
      setForgotOtp(""); // OTP is sent only to email, never pre-filled or shown on UI
      setForgotStep(2);
    } catch (error) {
      const msg = error instanceof AuthApiError ? error.message : "Failed to generate password reset OTP.";
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!forgotOtp.trim()) {
      setForgotError("Please enter the verification OTP received on your email.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setForgotError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match. Please re-enter.");
      return;
    }

    setForgotLoading(true);
    try {
      const successMsg = await resetUserPassword({
        login: forgotLogin.trim(),
        otp: forgotOtp.trim(),
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setForgotSuccess(successMsg);
      // Pre-fill login username
      setUsername(forgotLogin.trim());
      setPassword("");

      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotError("");
        setForgotSuccess("");
      }, 2000);
    } catch (error) {
      const msg = error instanceof AuthApiError ? error.message : "Failed to reset password.";
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
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

        {/* Forgot Password link */}
        <div className="flex justify-end mb-3.5">
          <button
            type="button"
            onClick={() => {
              setShowForgotModal(true);
              setForgotStep(1);
              setForgotLogin(username.trim());
              setForgotError("");
              setForgotSuccess("");
            }}
            className="text-[12px] font-bold text-bom-blue hover:text-bom-blue-dark transition-colors cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login error display */}
        {loginError && (
          <p className="text-red-600 text-xs mb-3.5 font-bold text-center">{loginError}</p>
        )}

        {/* Login button */}
        <button
          type="submit"
          className={`flex items-center justify-center gap-2 w-full h-[38px] border-0 rounded-[10px] bg-bom-blue text-white text-[14px] font-extrabold shadow-[0_8px_24px_rgba(0,137,207,0.27)] transition-all duration-150 hover:bg-bom-blue-dark hover:shadow-[0_12px_32px_rgba(0,137,207,0.36)] active:scale-[0.985] ${isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          id="login-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>

      </form>
    </div>

    {/* ── Forgot Password & Reset Password Modal ── */}
    {showForgotModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
        <div className="relative w-full max-w-[440px] bg-white rounded-[18px] p-6 shadow-2xl border border-[#e3e4ee] space-y-4 font-manrope">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#e3e4ee]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[8px] bg-blue-50 text-bom-blue flex items-center justify-center">
                <KeyRound size={16} />
              </div>
              <div>
                <h3 className="text-[16px] font-extrabold text-[#10142d]">
                  {forgotStep === 1 ? "Forgot Password" : "Reset Password"}
                </h3>
                <p className="text-[11px] font-medium text-[#5e6272]">
                  {forgotStep === 1
                    ? "Enter your account identifier to receive an OTP on your email"
                    : "Enter OTP received on your email and set your new password"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setForgotError("");
                setForgotSuccess("");
              }}
              className="p-1 rounded-md text-[#9094a8] hover:text-[#10142d] hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Error / Success Alerts */}
          {forgotError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-red-700 text-[12px] font-semibold">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{forgotError}</span>
            </div>
          )}

          {forgotSuccess && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-start gap-2 text-green-800 text-[12px] font-semibold">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-600" />
              <span>{forgotSuccess}</span>
            </div>
          )}

          {/* Step 1: Request OTP Form */}
          {forgotStep === 1 && (
            <form onSubmit={handleSendResetOtp} className="space-y-3.5">
              <div>
                <label htmlFor="forgot-login" className="block mb-1 text-[#10142d] text-[12px] font-bold">
                  Employee ID / PF Number / Email
                </label>
                <div className="relative flex items-center h-[38px] border-[1.5px] border-[#e3e4ee] rounded-[10px] bg-white focus-within:border-bom-blue">
                  <span className="grid place-items-center w-8 h-8 ml-1 rounded-[7px] bg-[#eef2ff] text-bom-blue shrink-0">
                    <UserRound size={15} />
                  </span>
                  <input
                    id="forgot-login"
                    type="text"
                    className="flex-1 h-full border-0 bg-transparent text-[13px] font-semibold px-3 pl-2.5 outline-none text-[#10142d]"
                    placeholder="e.g. 10001 or pf12345"
                    value={forgotLogin}
                    onChange={(e) => setForgotLogin(e.target.value)}
                    disabled={forgotLoading}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 h-[36px] rounded-lg border border-[#e3e4ee] text-[12px] font-bold text-[#5e6272] hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex items-center justify-center gap-1.5 px-4 h-[36px] rounded-lg bg-bom-blue hover:bg-bom-blue-dark text-white text-[12.5px] font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {forgotLoading ? "Sending OTP..." : "Send Verification OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Reset Password Form */}
          {forgotStep === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[12px] font-semibold flex items-center gap-2">
                <Mail size={16} className="text-bom-blue shrink-0" />
                <span>The verification OTP has been sent to your registered email address.</span>
              </div>
              <div>
                <label htmlFor="forgot-otp" className="block mb-1 text-[#10142d] text-[12px] font-bold">
                  Verification OTP
                </label>
                <div className="relative flex items-center h-[38px] border-[1.5px] border-[#e3e4ee] rounded-[10px] bg-white focus-within:border-bom-blue">
                  <span className="grid place-items-center w-8 h-8 ml-1 rounded-[7px] bg-[#eef2ff] text-bom-blue shrink-0">
                    <KeyRound size={15} />
                  </span>
                  <input
                    id="forgot-otp"
                    type="text"
                    className="flex-1 h-full border-0 bg-transparent text-[13px] font-semibold px-3 pl-2.5 outline-none tracking-widest text-[#10142d]"
                    placeholder="Enter 6-digit OTP"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    disabled={forgotLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="new-password" className="block mb-1 text-[#10142d] text-[12px] font-bold">
                  New Password
                </label>
                <div className="relative flex items-center h-[38px] border-[1.5px] border-[#e3e4ee] rounded-[10px] bg-white focus-within:border-bom-blue">
                  <span className="grid place-items-center w-8 h-8 ml-1 rounded-[7px] bg-[#eef2ff] text-bom-blue shrink-0">
                    <LockKeyhole size={15} />
                  </span>
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    className="flex-1 h-full border-0 bg-transparent text-[13px] font-semibold px-3 pl-2.5 pr-10 outline-none text-[#10142d]"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={forgotLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-2 text-[#9094a8] hover:text-[#10142d]"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block mb-1 text-[#10142d] text-[12px] font-bold">
                  Confirm Password
                </label>
                <div className="relative flex items-center h-[38px] border-[1.5px] border-[#e3e4ee] rounded-[10px] bg-white focus-within:border-bom-blue">
                  <span className="grid place-items-center w-8 h-8 ml-1 rounded-[7px] bg-[#eef2ff] text-bom-blue shrink-0">
                    <LockKeyhole size={15} />
                  </span>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="flex-1 h-full border-0 bg-transparent text-[13px] font-semibold px-3 pl-2.5 pr-10 outline-none text-[#10142d]"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={forgotLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-2 text-[#9094a8] hover:text-[#10142d]"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setForgotStep(1);
                    setForgotError("");
                  }}
                  className="flex items-center gap-1 text-[12px] font-bold text-[#5e6272] hover:text-[#10142d] cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 h-[36px] rounded-lg border border-[#e3e4ee] text-[12px] font-bold text-[#5e6272] hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex items-center justify-center gap-1.5 px-4 h-[36px] rounded-lg bg-bom-blue hover:bg-bom-blue-dark text-white text-[12.5px] font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    )}
  </AuthLayout>
);
}
