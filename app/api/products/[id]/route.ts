import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  namaProduct: z.string().min(1),
  harga: z.number().positive(),
  stok: z.number().min(0),
  deskripsi: z.string().min(1),
  kategori: z.string().min(1),
  tenant: z.string().min(1),
  gambarUrls: z.array(z.string()).min(1, "Minimal 1 foto produk"),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: parsed.data,
  });
  return NextResponse.json(product);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
