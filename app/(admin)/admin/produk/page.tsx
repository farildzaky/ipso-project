import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductTable from "./_components/ProductTable";

export default async function AdminProdukPage() {
  const rawProduk = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const produk = rawProduk.map((p) => ({
    ...p,
    harga: p.harga.toString(),
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div>
      <ProductTable produk={produk} />
    </div>
  );
}
