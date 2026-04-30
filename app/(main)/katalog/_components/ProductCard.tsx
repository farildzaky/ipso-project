"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: number;
  namaProduct: string;
  harga: string;
  tenant: string;
  gambarUrls: string[];
};

export default function ProductCard({
  id,
  namaProduct,
  harga,
  tenant,
  gambarUrls,
}: Props) {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-[20px] p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
      onClick={() => router.push(`/produk/${id}`)}
    >
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden  bg-gray-100 shrink-0">
        {gambarUrls.length > 0 ? (
          <img
            src={gambarUrls[0]}
            alt={namaProduct}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-5xl">
            🍽️
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col flex-grow">
        <h3 className="font-bold text-[22px] text-black leading-tight line-clamp-1">
          {namaProduct}
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
          <span className="text-[15px] font-medium text-gray-500 line-clamp-1">
            {tenant}
          </span>
        </div>

        <div className="mt-auto">
          <p className="flex items-baseline gap-1.5 mb-5">
            <span className="font-bold text-gray-400 text-lg">Rp</span>
            <span className="font-bold text-[#142910] text-[28px]">
              {Number(harga).toLocaleString("id-ID")}
            </span>
          </p>

          <button
            onClick={() => router.push(`/produk/${id}`)}
            className="w-full cursor-pointer bg-[#041c68] text-white text-[15px] py-3.5 rounded-xl hover:bg-[#041c68]/90 transition-colors font-medium"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}
