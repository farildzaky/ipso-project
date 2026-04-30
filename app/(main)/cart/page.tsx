"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CartToolbar from "./_components/SearchBar";
import CartItemList, { CartItemType } from "./_components/CartList";
import CartSummary from "./_components/CartSummary";

type Cart = {
    id: number;
    userId: number;
    createdAt: string;
    items: (CartItemType & { id: number; cartId: number; productId: number })[];
};

export default function CartPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

    // 1. Tambahkan State untuk Search dan Sort
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Relevant");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated") {
            fetchCart();
        }
    }, [status, router]);

    const fetchCart = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);

            const response = await fetch("/api/cart");
            if (!response.ok) throw new Error("Failed to fetch cart");
            const data = await response.json();

            const transformedCart = {
                ...data,
                items: data.items.map((item: any) => ({
                    id: item.id,
                    name: item.product.namaProduct,
                    price: Number(item.product.harga),
                    stock: item.product.stok,
                    qty: item.qty,
                    image: item.product.gambarUrls?.[0] || "",
                    category: item.product.kategori || "Product",
                    cartId: item.cartId,
                    productId: item.productId,
                })),
            };

            setCart(transformedCart);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load cart");
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    const handleCartUpdate = () => {
        fetchCart(true);
    };

    const handleCheckedChange = (newChecked: Set<number>) => {
        setCheckedItems(newChecked);
    };

    const handleItemsChange = useCallback((updatedItems: CartItemType[]) => {
        setCart(prev => prev ? { ...prev, items: updatedItems as any } : null);
    }, []);

    // Fungsi reset untuk tombol Refresh di SearchBar
    const handleRefresh = () => {
        setSearchTerm("");
        setSortBy("Relevant");
        fetchCart(false);
    };

    if (status === "loading" || loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
                <div className="text-center py-12">
                    <p className="text-gray-500">Loading cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
                <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    const rawItems = cart?.items || [];
    const totalPrice = rawItems
        .filter(item => checkedItems.has(item.id))
        .reduce((acc, item) => acc + item.price * item.qty, 0);


    let processedItems = rawItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    processedItems = [...processedItems].sort((a, b) => {
        if (sortBy === "Lowest Price") {
            return a.price - b.price;
        } else if (sortBy === "Newest") {
            return b.id - a.id;
        }
        return 0;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
            <div className="text-sm mb-2">
                <span className="text-gray-400">Home / </span>
                <span className="text-gray-800 font-medium">Cart</span>
            </div>

            <h1 className="text-3xl font-semibold text-[#1c3f28] mb-6">Cart</h1>

            <CartToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedSort={sortBy}
                onSortChange={setSortBy}
                onRefresh={handleRefresh}
            />

            <div className="flex flex-col lg:flex-row gap-8">
                <CartItemList
                    items={processedItems}
                    onCartUpdate={handleCartUpdate}
                    checkedItems={checkedItems}
                    onCheckedChange={handleCheckedChange}
                    onItemsChange={handleItemsChange}
                />

                <CartSummary totalPrice={totalPrice} />
            </div>
        </div>
    );
}