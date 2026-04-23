// app/api/profil/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    select: {
      id: true,
      nama: true,
      email: true,
      noTelepon: true,
      alamat: true,
      image: true,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await auth();

  console.log("SESSION ID:", session?.user?.id);
  console.log("SESSION USER:", session?.user);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nama, noTelepon, alamat, image } = body;

    if (!nama || nama.length < 2) {
      return NextResponse.json(
        { error: "Nama minimal 2 karakter" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: {
        nama,
        noTelepon: noTelepon || null,
        alamat: alamat || null,
        ...(image !== undefined && { image }),
      },
      select: {
        id: true,
        nama: true,
        email: true,
        noTelepon: true,
        alamat: true,
        image: true,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Profil update error:", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}