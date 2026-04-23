// app/(auth)/_components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthImage from "@/public/auth-farm.svg";
import EcoBite from "@/public/ecobite_logo.svg";
import Image from "next/image";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: "", email: "", password: "", noTelepon: "", alamat: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Kamu harus menyetujui Terms & Privacy.");
      return;
    }
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registrasi gagal.");
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Kiri */}
      <div className="hidden md:flex relative overflow-hidden bg-[#b8cce0] min-h-screen">
        <Image
          src={AuthImage}
          alt="EcoBite Farm"
          fill
          className="object-cover object-bottom-left"
        />
      </div>

      {/* Kanan */}
      <div className="flex flex-col items-center justify-center px-8 md:px-16 py-12 bg-white">
        <div className="flex items-center gap-2 mb-8">
          <Image
            src={EcoBite}
            alt="EcoBite"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
          <span className=" text-xl font-semibold text-gray-900">
            EcoBite
          </span>
        </div>

        <h1 className=" text-3xl font-semibold text-gray-900 mb-1">
          Get Started Now!
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Already have an account?{" "}
          <Link href="/login" className="text-[#1a3a5c] font-medium hover:underline">
            Sign In
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              required
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 pr-10 text-sm outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="noTelepon" className="block text-sm font-medium text-gray-700 mb-1.5">
              Nomor Telepon
            </label>
            <input
              id="noTelepon"
              type="tel"
              placeholder="Contoh: 08123456789"
              required
              value={form.noTelepon}
              onChange={(e) => setForm({ ...form, noTelepon: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition"
            />
          </div>

          <div>
            <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1.5">
              Alamat
            </label>
            <textarea
              id="alamat"
              placeholder="Masukkan alamat lengkap"
              required
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition resize-none"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-[#1a3a5c] focus:ring-[#1a3a5c]"
            />
            <span>
              I agree to{" "}
              <span className="text-[#1a3a5c] underline cursor-pointer">
                Terms &amp; Privacy
              </span>
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white rounded-lg py-3 text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? "Mendaftar..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}