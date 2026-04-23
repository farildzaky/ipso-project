import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    try {
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Create cart if not exists
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }

        return NextResponse.json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json(
            { error: "Failed to fetch cart" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await req.json();
    const { productId, qty } = body;

    if (!productId || !qty || qty < 1) {
        return NextResponse.json(
            { error: "Invalid product ID or quantity" },
            { status: 400 }
        );
    }

    try {
        let cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            });
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        if (product.stok < qty) {
            return NextResponse.json(
                { error: "Insufficient stock" },
                { status: 400 }
            );
        }

        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
            },
        });

        let cartItem;
        if (existingItem) {
            const newQty = existingItem.qty + qty;
            if (newQty > product.stok) {
                return NextResponse.json(
                    { error: "Insufficient stock" },
                    { status: 400 }
                );
            }

            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { qty: newQty },
                include: {
                    product: true,
                },
            });
        } else {
            cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    qty,
                },
                include: {
                    product: true,
                },
            });
        }

        return NextResponse.json(cartItem, { status: 201 });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return NextResponse.json(
            { error: "Failed to add to cart" },
            { status: 500 }
        );
    }
}
