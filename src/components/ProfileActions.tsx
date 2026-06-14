"use client";

import { LogOut, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfileActions({ role }: { role: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/"; // Force full reload to clear all states
  };

  return (
    <div className="flex gap-4 mb-8">
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>

      {role === "ADMIN" && (
        <Link 
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 bg-[#0B3B60] text-white font-bold rounded-lg hover:bg-[#07243c] transition-colors"
        >
          <Shield className="h-4 w-4" />
          Admin Dashboard
        </Link>
      )}
    </div>
  );
}
