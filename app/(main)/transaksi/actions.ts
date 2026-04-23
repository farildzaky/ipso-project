// app/transaksi/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function processPayment(transactionId: number) {
  try {
    // Ubah status transaksi menjadi SELESAI
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: "SELESAI" },
    });
    
    // Refresh cache halaman transaksi agar data terbaru langsung muncul
    revalidatePath("/transaksi");
    
    return { success: true };
  } catch (error) {
    console.error("Gagal memproses pembayaran:", error);
    return { success: false };
  }
}