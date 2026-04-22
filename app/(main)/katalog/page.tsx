import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "./_components/ProductCard";
import SearchBar from "./_components/SearchBar";
import PaginationBar from "./_components/PaginationBar";

const PER_PAGE = 18;

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const skip = (currentPage - 1) * PER_PAGE;

  const where = q
    ? {
        OR: [
          { namaProduct: { contains: q, mode: "insensitive" as const } },
          { tenant: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [produk, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PER_PAGE,
      select: {
        id: true,
        namaProduct: true,
        harga: true,
        tenant: true,
        gambarUrls: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const from = total === 0 ? 0 : skip + 1;
  const to = Math.min(skip + PER_PAGE, total);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <p className="text-sm text-gray-500 mb-2 font-medium">
        <Link href="/" className="hover:text-gray-800">
          Home
        </Link>{" "}
        / <span className="text-gray-800">Catalog</span>
      </p>
      <h1 className="text-[28px] font-bold text-[#001038] mb-6">
        Catalog Page
      </h1>

      <Suspense>
        <SearchBar defaultValue={q} />
      </Suspense>

      {produk.length === 0 ? (
        <p className="text-center text-gray-400 py-20 text-sm">
          Produk tidak ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {produk.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              namaProduct={p.namaProduct}
              harga={p.harga.toString()}
              tenant={p.tenant}
              gambarUrl={p.gambarUrls[0] ?? null}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing{" "}
          <span className="font-bold text-gray-800">
            {from}-{to}
          </span>{" "}
          Products From <span className="font-bold text-gray-800">{total}</span>{" "}
          Results
        </p>
        <Suspense>
          <PaginationBar currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}
