"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setStep("OTP");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      // Successfully logged in
      onClose();
      // Reset state
      setStep("PHONE");
      setPhone("");
      setOtp("");
      window.location.reload(); // Refresh to reflect auth state
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full p-1 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {step === "PHONE" ? "Sign In / Sign Up" : "Verify OTP"}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {step === "PHONE" 
                ? "Enter your phone number to proceed." 
                : `We've sent a 6-digit code to +91 ${phone}`}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-100">
              {error}
            </div>
          )}

          {step === "PHONE" ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter Mobile Number"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-12 pr-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all placeholder:font-normal"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Sending OTP..." : "Get OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-center text-2xl tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Verifying..." : "Verify & Proceed"}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setStep("PHONE"); setOtp(""); setError(""); }}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  Change Phone Number
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-xs text-center text-gray-400">
            By signing in, you agree to our <a href="#" className="underline hover:text-gray-600">Terms and Conditions</a> & <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
