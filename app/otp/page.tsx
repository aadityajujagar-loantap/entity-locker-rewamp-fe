"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const OTP_LENGTH = 6;
const INITIAL_SECONDS = 165; // 2:45

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function OtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [otpError, setOtpError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const expired = seconds <= 0;

  // Countdown
  useEffect(() => {
    if (seconds <= 0) {
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  // Auto-focus first box
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[lastFilled]?.focus();
  }, []);

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setSeconds(INITIAL_SECONDS);
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    const otpValue = otp.join("");
    if (otpValue.length < OTP_LENGTH) {
      return;
    }

    if (otpValue !== "123456") {
      setOtpError("Incorrect OTP code. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
      return;
    }

    router.push("/dashboard");
  };

  const allFilled = otp.join("").length === OTP_LENGTH;

  return (
    <AuthLayout>
      {/* ── OTP Card (Tailwind-Refactored, Compact) ── */}
      <div className="relative z-10 w-full max-w-[420px] p-6 border border-white/90 rounded-[18px] bg-card-bg shadow-[0_24px_70px_rgba(20,16,50,0.11)] backdrop-blur-[18px]">

        <h2 className="m-0 mb-1 text-text-primary text-[20px] font-extrabold text-center tracking-tight">
          Verify OTP
        </h2>
        <p className="m-0 mb-3 text-text-mid text-[13px] text-center font-medium leading-[1.5]">
          We have sent a 6-digit OTP to your registered mobile number
          <span className="font-extrabold text-text-primary block mt-0.5 text-center">+91 98******21</span>
        </p>
        <hr className="border-0 border-t border-border-col my-4 -mx-6" />

        <form onSubmit={handleVerify} noValidate>

          {/* OTP Boxes */}
          <div className="mb-[clamp(12px,1.8vh,18px)]" style={{ marginBottom: 6 }}>
            <label className="block mb-1.5 text-text-primary text-[clamp(11.5px,0.9vw,13px)] font-bold">
              Enter OTP
            </label>
            <div className="flex gap-[9px] mb-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`w-[clamp(46px,8vw,54px)] h-[clamp(52px,8vh,60px)] border-[1.5px] rounded-[10px] text-[22px] font-extrabold text-center outline-none font-manrope transition-all duration-150 caret-bom-blue focus:border-bom-blue focus:shadow-[0_0_0_3px_rgba(0,137,207,0.10)] ${
                    digit ? "border-bom-blue bg-[#eef2ff] text-bom-blue" : "border-border-col bg-white text-text-primary"
                  }`}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  autoComplete="one-time-code"
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <p className="text-center text-[13px] text-text-mid font-semibold mb-[14px]">
            {expired ? (
              <>
                OTP has <span className="font-extrabold text-red-600">expired</span>
              </>
            ) : (
              <>
                OTP will expire in <span className="font-extrabold text-[#e05c1a]">{formatTime(seconds)}</span>
              </>
            )}
          </p>

          {/* Info box */}
          <div className="flex items-start gap-2.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-[10px] p-[12px_16px] text-[13px] text-[#2563eb] mb-[16px] leading-[1.55] font-medium">
            <Info size={16} className="text-[#2563eb] shrink-0 mt-0.5" />
            <span>
              If you did not receive the OTP, please check your SMS or click on Resend OTP.
            </span>
          </div>

          {/* OTP Error display */}
          {otpError && (
            <p className="text-red-600 text-xs mb-3 font-bold text-center">{otpError}</p>
          )}

          {/* Verify button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full h-[38px] border-0 rounded-[10px] bg-bom-blue text-white text-[14px] font-extrabold shadow-[0_8px_24px_rgba(0,137,207,0.27)] transition-all duration-150 hover:bg-bom-blue-dark hover:shadow-[0_12px_32px_rgba(0,137,207,0.36)] active:scale-[0.985]"
            id="verify-btn"
            disabled={!allFilled || expired}
            style={{
              marginBottom: 10,
              opacity: !allFilled || expired ? 0.6 : 1,
              cursor: !allFilled || expired ? "not-allowed" : "pointer",
            }}
          >
            Verify &amp; Login
          </button>

          {/* Back to login */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full h-[38px] border-[1.5px] border-border-col rounded-[10px] bg-white/80 text-text-primary text-[14px] font-bold cursor-pointer transition-all duration-150 hover:border-bom-blue/40 hover:bg-bom-blue-bg hover:shadow-[0_4px_14px_rgba(0,137,207,0.1)]"
            id="back-login-btn"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </button>

        </form>
      </div>

      {/* Resend OTP */}
      <p className="text-center mt-[18px] text-[13px] text-text-mid font-medium z-10">
        Didn&apos;t receive OTP?{" "}
        <a
          href="#"
          className="text-bom-blue-mid font-extrabold no-underline transition-colors duration-150 hover:text-bom-blue-dark"
          onClick={(e) => {
            e.preventDefault();
            handleResend();
          }}
        >
          Resend OTP
        </a>
      </p>
    </AuthLayout>
  );
}
