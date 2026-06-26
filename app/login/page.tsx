"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound, LockKeyhole, Eye, EyeOff, ShieldAlert, RotateCw } from "lucide-react";
import AuthLayout, { SupportLink } from "@/components/AuthLayout";

const INITIAL_CAPTCHA_CODE = "PF8K3M";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // CAPTCHA State
  const [captchaCode, setCaptchaCode] = useState(INITIAL_CAPTCHA_CODE);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [loginError, setLoginError] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude I, O, 0, 1 for clarity
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!username || !password) {
      return;
    }

    if (captchaInput !== captchaCode) {
      setCaptchaError("Incorrect CAPTCHA. Please try again.");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    if (username !== "PF12345" || password !== "12345678") {
      setLoginError("Invalid username or password.");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    router.push("/otp");
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
                required
              />
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 grid place-items-center w-[30px] h-[30px] border-0 bg-transparent text-[#9094a8] cursor-pointer transition-colors duration-150 hover:text-bom-blue p-0"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CAPTCHA Generation */}
          <div className="mb-3">
            <label className="block mb-1 text-text-primary text-[12px] font-bold">
              CAPTCHA Code
            </label>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex-1 select-none font-mono text-lg font-extrabold tracking-[0.25em] text-center bg-gradient-to-r from-zinc-200 via-zinc-50 to-zinc-200 border border-zinc-300 rounded-[10px] py-1.5 line-through decoration-zinc-500/40 select-none pointer-events-none italic text-zinc-700 shadow-inner">
                {captchaCode}
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                className="flex items-center justify-center w-[38px] h-[38px] border-[1.5px] border-border-col rounded-[10px] bg-white text-[#5e6272] hover:text-bom-blue hover:border-bom-blue/50 transition-colors duration-150 shrink-0 cursor-pointer"
                aria-label="Refresh CAPTCHA"
              >
                <RotateCw size={18} />
              </button>
            </div>
          </div>

          {/* CAPTCHA Input */}
          <div className="mb-3">
            <label htmlFor="captchaInput" className="block mb-1 text-text-primary text-[12px] font-bold">
              Verify CAPTCHA
            </label>
            <div className="relative flex items-center h-[38px] border-[1.5px] border-border-col rounded-[10px] bg-white/98 shadow-[0_2px_8px_rgba(18,22,46,0.05)] transition-all duration-150 focus-within:border-bom-blue/50 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(0,137,207,0.09),0_4px_14px_rgba(18,22,46,0.07)]">
              <span className="grid place-items-center flex-[0_0_32px] w-8 h-8 ml-1 rounded-[7px] bg-[#eef2ff] text-bom-blue-mid shrink-0">
                <ShieldAlert size={15} strokeWidth={2.2} />
              </span>
              <input
                id="captchaInput"
                type="text"
                className="flex-1 h-full border-0 bg-transparent shadow-none text-text-primary text-[13px] font-semibold px-3 pl-2.5 outline-none focus:outline-none focus:ring-0 uppercase"
                placeholder="Enter CAPTCHA code"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                required
              />
            </div>
            {captchaError && (
              <p className="text-red-600 text-xs mt-1 font-bold">{captchaError}</p>
            )}
          </div>

          {/* Forgot Password */}
          <a
            href="#"
            className="block w-fit mt-[-2px] mr-0 mb-3.5 ml-auto border-0 bg-transparent text-bom-blue-mid text-[12px] font-bold cursor-pointer no-underline transition-colors duration-150 hover:text-bom-blue-dark"
            onClick={(e) => e.preventDefault()}
          >
            Forgot Password?
          </a>

          {/* Login error display */}
          {loginError && (
            <p className="text-red-600 text-xs mb-3.5 font-bold text-center">{loginError}</p>
          )}

          {/* Login button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full h-[38px] border-0 rounded-[10px] bg-bom-blue text-white text-[14px] font-extrabold cursor-pointer shadow-[0_8px_24px_rgba(0,137,207,0.27)] transition-all duration-150 hover:bg-bom-blue-dark hover:shadow-[0_12px_32px_rgba(0,137,207,0.36)] active:scale-[0.985]"
            id="login-btn"
          >
            Login
          </button>

        </form>
      </div>

      {/* Support */}
      <SupportLink />
    </AuthLayout>
  );
}
