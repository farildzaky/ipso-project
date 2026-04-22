"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue ?? "");

  function handleSearch(q: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    params.delete("page");
    router.push(`/katalog?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => {
          router.push("/katalog");
          setValue("");
        }}
        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
        title="Reset"
      >
        <svg
          width="16"
          height="16"
          className="text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      <div className="relative flex-1">
        <svg
          width="16"
          height="16"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Find something here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001038]/20 bg-white"
        />
      </div>

      <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-400 bg-white shrink-0">
        <span>⌘</span>
        <span className="font-medium">K</span>
      </div>
    </div>
  );
}
