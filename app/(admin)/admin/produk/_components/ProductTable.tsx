"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchIcon from "@/assets/admin/admin_search.svg";
import Image from "next/image";

type Product = {
  id: number;
  namaProduct: string;
  harga: string;
  stok: number;
  kategori: string;
  tenant: string;
  gambarUrl: string | null;
};

export default function ProductTable({ produk }: { produk: Product[] }) {
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();

  const filtered = produk.filter((p) =>
    p.namaProduct.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete(id: number) {
    if (!confirm("Yakin mau hapus produk ini?")) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  function formatHarga(harga: string) {
    return "Rp " + Number(harga).toLocaleString("id-ID");
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400">
              Menu / <span className="text-gray-600">Product</span>
            </p>
            <h1 className="text-2xl font-bold text-gray-800">Product Page</h1>
          </div>
          <Link
            href="/admin/produk/tambah"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Tambah Produk
          </Link>
        </div>
        <div className="relative">
            <Image src={SearchIcon} alt="Search" width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
         
          <input
            type="text"
            placeholder="Cari sesuatu ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
            <th className="px-6 py-3 font-medium">Nama Produk ↕</th>
            <th className="px-6 py-3 font-medium">Harga ↕</th>
            <th className="px-6 py-3 font-medium">Stok Sisa ↕</th>
            <th className="px-6 py-3 font-medium">Status ↕</th>
            <th className="px-6 py-3 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center text-gray-400 text-sm"
              >
                Tidak ada produk ditemukan
              </td>
            </tr>
          ) : (
            filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-800">
                  {p.namaProduct}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                  {formatHarga(p.harga)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {p.stok} pcs
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.stok > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {p.stok > 0 ? "Tersedia" : "Habis"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/produk/${p.id}/edit`}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors text-sm"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors text-sm disabled:opacity-40"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
