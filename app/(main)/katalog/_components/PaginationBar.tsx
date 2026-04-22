"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = { currentPage: number; totalPages: number };

export default function PaginationBar({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/katalog?${params.toString()}`);
  }

  const pages: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const btnBase =
    "w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors";

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className={`${btnBase} text-gray-400`}>
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            className={`${btnBase} ${p === currentPage ? "bg-[#001038] text-white" : "hover:bg-gray-100 text-gray-600"}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`${btnBase} hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ›
      </button>
    </div>
  );
}
