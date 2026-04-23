import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // PERBAIKAN: Kita cari Cart milik User ini, bukan mencari User-nya langsung
    const cart = await prisma.cart.findFirst({
      where: { userId: userId },
      include: {
        items: { // Mengambil isi dari keranjang
          include: { product: true } // Mengambil detail produk dari tiap isi
        }
      }
    });

    // Cek apakah keranjang ada dan tidak kosong
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Hitung total harga dari item di dalam cart
    const totalHarga = cart.items.reduce(
      (total, item) => total + (Number(item.product.harga) * item.qty), 
      0
    );

    // Buat Transaksi dan hapus item dari cart menggunakan Prisma Transaction
    const transaksi = await prisma.$transaction(async (tx) => {
      // 1. Buat record transaksi
      const newTx = await tx.transaction.create({
        data: {
          userId: userId,
          totalHarga: totalHarga.toString(),
          status: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              qty: item.qty,
              hargaSnapshot: item.product.harga.toString(), 
            }))
          }
        }
      });

      // 2. Hapus isi keranjang berdasarkan cartId (bukan userId) karena sudah di-checkout
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newTx;
    });

    return NextResponse.json({ success: true, transactionId: transaksi.id });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}