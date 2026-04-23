import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TransactionDetailClient from "./_components/TransactionDetailClient";

export default async function TransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const transactionId = parseInt(resolvedParams.id);

  if (isNaN(transactionId)) {
    notFound();
  }

  // Ambil data transaksi dari database
  const transaksi = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      items: { 
        include: {
          product: true,
        },
      },
    },
  });

  if (!transaksi) {
    notFound();
  }

  // Trick untuk mengatasi error "Decimal objects are not supported"
  // Ini akan mengubah objek Decimal Prisma menjadi string/number biasa
  const serializedTransaksi = JSON.parse(JSON.stringify(transaksi));

  return <TransactionDetailClient transaksi={serializedTransaksi} />;
}