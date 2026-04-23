// app/(main)/profil/_components/ProfileForm.tsx
"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";

type UserData = {
  id: number;
  nama: string;
  email: string;
  noTelepon: string | null;
  alamat: string | null;
  image?: string | null;
};

export default function ProfileForm({ user }: { user: UserData }) {
  const { update } = useSession();
  const [form, setForm] = useState({
    nama: user.nama ?? "",
    noTelepon: user.noTelepon ?? "",
    alamat: user.alamat ?? "",
  });
  const [preview, setPreview] = useState<string | null>(user.image ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setError("");
    setLoading(true);

    try {
      let imageUrl = user.image ?? null;

      // Upload foto dulu kalau ada
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      // Update profil
      const res = await fetch("/api/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan.");
        setLoading(false);
        return;
      }

      // Update session supaya nama di navbar ikut berubah
      await update({
        name: form.nama,
        image: imageUrl,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Terjadi kesalahan.");
    }

    setLoading(false);
  }

  const initials = form.nama
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <form onSubmit={handleSubmit}>
      {/* Avatar */}
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-[#c8d8e8] border-2 border-gray-200 flex items-center justify-center mb-3 overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt={form.nama}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[#1a3a5c] text-2xl font-semibold">
              {initials}
            </span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="bg-[#1a3a5c] hover:bg-[#0f2540] text-white text-sm font-medium px-5 py-2 rounded-lg transition"
        >
          Change Photo
        </button>
        {imageFile && (
          <p className="text-xs text-gray-400 mt-1">{imageFile.name}</p>
        )}
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