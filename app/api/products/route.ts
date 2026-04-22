import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  namaProduct: z.string().min(1),
  harga: z.number().positive(),
  stok: z.number().min(0),
  deskripsi: z.string().min(1),
  kategori: z.string().min(1),
  tenant: z.string().min(1),
  gambarUrls: z.array(z.string()).min(1, "Minimal 1 foto produk"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(product, { status: 201 });
}
