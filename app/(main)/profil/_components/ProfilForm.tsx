// app/(main)/profil/_components/ProfileForm.tsx
"use client";

import { useState } from "react";

type UserData = {
  id: number;
  nama: string;
  email: string;
  noTelepon: string | null;
  alamat: string | null;
};

export default function ProfileForm({ user }: { user: UserData }) {
  const [form, setForm] = useState({
    nama: user.nama ?? "",
    noTelepon: user.noTelepon ?? "",
    alamat: user.alamat ?? "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setError("");
    setLoading(true);

    const res = await fetch("/api/profil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Gagal menyimpan.");
      return;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Avatar placeholder */}
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-[#c8d8e8] border-2 border-gray-200 flex items-center justify-center mb-3">
          <span className="text-[#1a3a5c] text-2xl font-semibold">
            {user.nama?.[0]?.toUpperCase()}
          </span>
        </div>
        <button
          type="button"
          className="bg-[#1a3a5c] hover:bg-[#0f2540] text-white text-sm font-medium px-5 py-2 rounded-lg transition"
        >
          Change Photo
        </button>
      </div>

      <hr className="border-gray-100 mb-6" />

      <div className="space-y-4">
        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition"
          />
        </div>

        {/* Email — read only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* No Telepon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+62 812 3456 7890"
            value={form.noTelepon}
            onChange={(e) => setForm({ ...form, noTelepon: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition"
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Primary Address
          </label>
          <input
            type="text"
            placeholder="Jl. Contoh No. 1, Kota, Provinsi"
            value={form.alamat}
            onChange={(e) => setForm({ ...form, alamat: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition"
          />
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
          Profil berhasil disimpan!
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 bg-[#1a3a5c] hover:bg-[#0f2540] text-white text-sm font-medium px-8 py-3 rounded-lg transition disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Save Changes"}
      </button>
    </form>
  );
}