import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetailClient from "./_components/ProductDetailClient";

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produk = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!produk) notFound();

  const similar = await prisma.product.findMany({
    where: { kategori: produk.kategori, id: { not: produk.id } },
    take: 8,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      namaProduct: true,
      harga: true,
      tenant: true,
      gambarUrls: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <p className="text-sm text-gray-400 mb-1">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/katalog" className="hover:underline">
          Catalog
        </Link>{" "}
        <span className="text-black">/ Product Detail</span>
      </p>
      <h1 className="text-2xl font-bold text-[#001038] mb-6">
        {produk.namaProduct}
      </h1>

      <ProductDetailClient
        produk={{
          id: produk.id,
          namaProduct: produk.namaProduct,
          harga: produk.harga.toString(),
          stok: produk.stok,
          deskripsi: produk.deskripsi ?? "",
          tenant: produk.tenant,
          gambarUrls: produk.gambarUrls,
        }}
        similar={similar.map((p) => ({
          id: p.id,
          namaProduct: p.namaProduct,
          harga: p.harga.toString(),
          tenant: p.tenant,
          gambarUrl: p.gambarUrls[0] ?? null,
        }))}
      />
    </div>
  );
}
