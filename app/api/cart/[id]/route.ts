import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { id } = await params;
    const cartItemId = parseInt(id);
    const body = await req.json();
    const { qty } = body;

    if (!qty || qty < 1) {
        return NextResponse.json(
            { error: "Invalid quantity" },
            { status: 400 }
        );
    }

    try {
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                cart: true,
                product: true,
            },
        });

        if (!cartItem) {
            return NextResponse.json(
                { error: "Cart item not found" },
                { status: 404 }
            );
        }

        if (cartItem.cart.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (cartItem.product.stok < qty) {
            return NextResponse.json(
                { error: "Insufficient stock" },
                { status: 400 }
            );
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { qty },
            include: {
                product: true,
            },
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error("Error updating cart item:", error);
        return NextResponse.json(
            { error: "Failed to update cart item" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { id } = await params;
    const cartItemId = parseInt(id);

    try {
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                cart: true,
            },
        });

        if (!cartItem) {
            return NextResponse.json(
                { error: "Cart item not found" },
                { status: 404 }
            );
        }

        if (cartItem.cart.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await prisma.cartItem.delete({
            where: { id: cartItemId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        return NextResponse.json(
            { error: "Failed to delete cart item" },
            { status: 500 }
        );
    }
}
