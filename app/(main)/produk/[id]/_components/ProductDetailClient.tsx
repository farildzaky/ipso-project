"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Produk = {
  id: number;
  namaProduct: string;
  harga: string;
  stok: number;
  deskripsi: string;
  tenant: string;
  gambarUrls: string[];
};

type SimilarItem = {
  id: number;
  namaProduct: string;
  harga: string;
  tenant: string;
  gambarUrl: string | null;
};

const DELIVERY = 10_000;
const VISIBLE = 4;

function formatRp(n: number) {
  return n.toLocaleString("id-ID");
}

export default function ProductDetailClient({
  produk,
  similar,
}: {
  produk: Produk;
  similar: SimilarItem[]; 
}) {
  const router = useRouter();
  const [mainImage, setMainImage] = useState(produk.gambarUrls[0] ?? null);
  const [qty, setQty] = useState(2); 
  const [offset, setOffset] = useState(0);

  const hargaNum = Number(produk.harga);
  const sideImages = produk.gambarUrls.slice(1, 3);

  return (
    <div className="pb-20">
      {/* ── SECTION 1: GALLERY (Terkunci Rapat dengan Absolute Inset) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        {/* Gambar Besar Kiri (Tinggi di-set langsung di sini) */}
        <div className="col-span-2 relative w-full h-[320px] lg:h-[420px] rounded-[16px] overflow-hidden bg-gray-100">
          {mainImage ? (
            <img
              src={mainImage}
              alt={produk.namaProduct}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-200 text-6xl">
              🍽️
            </div>
          )}
        </div>

        {/* Gambar Kecil Kanan (Menggunakan Grid Rows 2, bukan Flex) */}
        <div className="col-span-1 grid grid-rows-2 gap-5 w-full h-[320px] lg:h-[420px]">
          {sideImages.map((url, i) => {
            const isLast = i === 1;
            return (
              <div
                key={url}
                className="relative w-full h-full rounded-[16px] overflow-hidden bg-gray-100 cursor-pointer group"
                onClick={() => setMainImage(url)}
              >
                <img
                  src={url}
                  alt={`foto ${i + 2}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Tombol See All */}
                {isLast && produk.gambarUrls.length > 3 && (
                  <div className="absolute inset-0 flex items-end justify-end p-4 bg-gradient-to-t from-black/30 to-transparent">
                    <span className="bg-white text-[#1a202c] px-4 py-1.5 rounded-lg text-sm font-semibold shadow-md">
                      See All ({produk.gambarUrls.length})
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Placeholder jika gambar < 3 */}
          {Array.from({ length: Math.max(0, 2 - sideImages.length) }).map(
            (_, i) => (
              <div
                key={`ph-${i}`}
                className="relative w-full h-full rounded-[16px] bg-gray-100"
              />
            ),
          )}
        </div>
      </div>

      {/* ── SECTION 2: DETAILS & PRICE CARD ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Konten Kiri (Tenant, Harga, About) */}
        <div className="col-span-2 pr-0 lg:pr-4">
          <div className="flex items-center justify-between py-2 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-[52px] h-[52px] rounded-full overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${produk.tenant}&background=random`}
                  alt="tenant"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-[2px] border-white rounded-full"></div>
              </div>
              <span className="font-bold text-[#1a202c] text-[22px]">
                {produk.tenant}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-gray-400 text-xl">Rp</span>
              <span className="font-bold text-[#1a202c] text-[34px] tracking-tight">
                {formatRp(hargaNum)}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#1a202c] text-[18px] mb-3">
              About this food
            </h3>
            <p className="text-[15px] text-gray-500 leading-[1.8] text-justify">
              {produk.deskripsi ||
                "Immerse yourself in the vibrant medley of flavors and textures with our exquisite Vegetable Salad. Crafted with an assortment of crisp, farm-fresh vegetables, each ingredient is hand-selected to ensure optimal taste and nutritional value. From crunchy cucumbers to juicy tomatoes and vibrant bell peppers, every bite is a symphony of freshness."}
            </p>
          </div>
        </div>

        {/* Konten Kanan (Price Detail Card) */}
        <div className="col-span-1">
          <div className="border border-gray-200 rounded-[16px] p-6 bg-white shadow-sm sticky top-8">
            <h3 className="font-bold text-[#1a202c] text-[17px] mb-4">
              Price Detail
            </h3>
            <div className="w-full h-[1px] bg-gray-100 mb-6" />

            {/* Quantity Controls */}
            <div className="mb-6">
              <p className="text-[13px] font-bold text-[#1a202c] mb-3">
                Quantity
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-[42px]">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 text-lg transition-colors"
                  >
                    −
                  </button>
                  <div className="w-10 h-full flex items-center justify-center text-[15px] font-bold text-[#1a202c]">
                    {qty}
                  </div>
                  <button
                    onClick={() => setQty((q) => Math.min(produk.stok, q + 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-[13px] text-gray-500">
                  Stock Total:{" "}
                  <span className="font-bold text-[#1a202c]">
                    {produk.stok} pcs
                  </span>
                </span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-100 my-6" />

            {/* Total Breakdown */}
            <div>
              <p className="text-[13px] font-bold text-[#1a202c] mb-4">
                Total Detail
              </p>
              <div className="space-y-3.5 text-[14px]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">
                    Item Quantity{" "}
                    <span className="font-bold text-[#1a202c]">({qty}pcs)</span>
                  </span>
                  <span className="font-bold text-[#1a202c]">
                    Rp {formatRp(hargaNum * qty)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Delivery (Estimation)</span>
                  <span className="font-bold text-[#1a202c]">
                    Rp {formatRp(DELIVERY)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-6 pt-5 flex justify-between items-end">
                <span className="font-bold text-[#1a202c] text-[17px]">
                  Total
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-gray-400 text-sm">Rp</span>
                  <span className="font-bold text-[#1a202c] text-[26px] leading-none tracking-tight">
                    {formatRp(hargaNum * qty + DELIVERY)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3">
              <button className="flex-1 bg-[#0a1c4a] text-white text-[14px] py-3.5 rounded-lg hover:bg-[#0a1c4a]/90 transition-colors font-medium">
                Buy Now
              </button>
              <button className="flex-1 border border-[#c1e1c1] text-gray-800 bg-white text-[14px] py-3.5 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: SIMILAR SELECTION ───────────────────────────── */}
      {similar && similar.length > 0 && (
        <div className="mt-20 border-t border-gray-100 pt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[22px] font-bold text-[#1a202c]">
              Similar Selection
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setOffset((o) => Math.max(0, o - VISIBLE))}
                disabled={offset === 0}
                className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#1a202c] transition-colors disabled:opacity-30"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => setOffset((o) => o + VISIBLE)}
                disabled={offset + VISIBLE >= similar.length}
                className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#1a202c] transition-colors disabled:opacity-30"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.slice(offset, offset + VISIBLE).map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-[20px] p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                onClick={() => router.push(`/produk/${p.id}`)}
              >
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {p.gambarUrl ? (
                    <img
                      src={p.gambarUrl}
                      alt={p.namaProduct}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-200 text-5xl">
                      🍽️
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-[20px] text-[#1a202c] leading-tight line-clamp-1">
                    {p.namaProduct}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 mb-6">
                    <svg
                      width="18"
                      height="18"
                      className="text-gray-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="text-[14px] font-medium text-gray-500 line-clamp-1">
                      {p.tenant}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <p className="flex items-baseline gap-1.5 mb-5">
                      <span className="font-bold text-gray-400 text-lg">
                        Rp
                      </span>
                      <span className="font-bold text-[#1a202c] text-[26px]">
                        {formatRp(Number(p.harga))}
                      </span>
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="w-full bg-[#0a1c4a] text-white text-[14px] py-3.5 rounded-lg hover:bg-[#0a1c4a]/90 transition-colors font-medium"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}