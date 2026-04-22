"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Product = {
  id: number;
  namaProduct: string;
  harga: string;
  stok: number;
  deskripsi: string;
  kategori: string;
  tenant: string;
  gambarUrls: string[];
};

type ImageEntry = { id: string; preview: string; url: string };

function removeAt<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}

export default function EditProdukForm({ produk }: { produk: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageEntry[]>(
    produk.gambarUrls.map((url) => ({ id: url, preview: url, url })),
  );
  const [error, setError] = useState<string | null>(null);

  async function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    const entries: ImageEntry[] = [];

    for (const file of files) {
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      entries.push({ id: data.url, preview, url: data.url });
    }

    setImages((prev) => [...prev, ...entries]);
    setUploading(false);
    e.target.value = "";
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (images.length === 0) {
      setError("Minimal 1 foto produk wajib diupload.");
      return;
    }
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    const res = await fetch(`/api/products/${produk.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        namaProduct: fd.get("namaProduct"),
        harga: Number(fd.get("harga")),
        stok: Number(fd.get("stok")),
        deskripsi: fd.get("deskripsi") || null,
        kategori: fd.get("kategori"),
        tenant: fd.get("tenant"),
        gambarUrls: images.map((img) => img.url),
      }),
    });

    if (res.ok) {
      router.push("/admin/produk");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Gagal menyimpan");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-7xl"
    >
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Foto */}
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">
          Foto Produk <span className="text-red-500">*</span>
          <span className="ml-1 text-gray-400 font-normal">(bisa lebih dari satu)</span>
        </p>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((img, i) => (
              <div key={img.id} className="relative">
                <img
                  src={img.preview}
                  alt={`foto ${i + 1}`}
                  className="w-28 h-28 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setImages((prev) => removeAt(prev, i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none shadow"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
          {uploading ? (
            <p className="text-sm text-gray-400">Mengupload...</p>
          ) : (
            <>
              <span className="text-2xl mb-1">☁️</span>
              <p className="text-sm text-gray-400">
                <span className="text-gray-600 font-medium">Click to upload</span>{" "}
                atau drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-0.5">jpg, jpeg, png – Maks 50MB</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImages}
            disabled={uploading}
          />
        </label>
      </div>

      <div>
        <label htmlFor="namaProduct" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <input
          id="namaProduct"
          name="namaProduct"
          type="text"
          defaultValue={produk.namaProduct}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      <div>
        <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-1">
          Harga Jual <span className="text-red-500">*</span>
        </label>
        <input
          id="harga"
          name="harga"
          type="number"
          defaultValue={produk.harga}
          required
          min={0}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      <div>
        <label htmlFor="stok" className="block text-sm font-medium text-gray-700 mb-1">
          Stok <span className="text-red-500">*</span>
        </label>
        <input
          id="stok"
          name="stok"
          type="number"
          defaultValue={produk.stok}
          required
          min={0}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      <div>
        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi Produk <span className="text-red-500">*</span>
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          defaultValue={produk.deskripsi}
          rows={3}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
        />
      </div>

      <div>
        <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">
          Kategori <span className="text-red-500">*</span>
        </label>
        <select
          id="kategori"
          name="kategori"
          defaultValue={produk.kategori}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">Pilih kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Snack">Snack</option>
          <option value="Dessert">Dessert</option>
        </select>
      </div>

      <div>
        <label htmlFor="tenant" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Tenant <span className="text-red-500">*</span>
        </label>
        <input
          id="tenant"
          name="tenant"
          type="text"
          defaultValue={produk.tenant}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Link
          href="/admin/produk"
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
