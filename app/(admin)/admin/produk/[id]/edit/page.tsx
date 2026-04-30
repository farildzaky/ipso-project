import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProdukForm from "./_components/EditProdukForm";

export default async function EditProdukPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produk = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!produk) notFound();

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-400">
          Menu / <span className="text-gray-600">Edit</span>
        </p>
        <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1>
      </div>
      <EditProdukForm
        produk={{
          id: produk.id,
          namaProduct: produk.namaProduct,
          harga: produk.harga.toString(),
          stok: produk.stok,
          deskripsi: produk.deskripsi ?? "",
          kategori: produk.kategori,
          tenant: produk.tenant,
          gambarUrls: produk.gambarUrls,
        }}
      />
    </div>
  );
}
