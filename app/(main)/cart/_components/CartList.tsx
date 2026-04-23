"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export type CartItemType = {
    id: number;
    category?: string;
    name: string;
    price: number;
    stock: number;
    qty: number;
    image: string;
    cartId?: number;
    productId?: number;
};

interface CartItemListProps {
    items: CartItemType[];
    onCartUpdate?: () => void;
    checkedItems?: Set<number>;
    onCheckedChange?: (itemIds: Set<number>) => void;
    onItemsChange?: (items: CartItemType[]) => void;
}

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

export default function CartItemList({
    items,
    onCartUpdate,
    checkedItems = new Set(),
    onCheckedChange,
    onItemsChange
}: CartItemListProps) {
    const [loadingItemId, setLoadingItemId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [optimisticItems, setOptimisticItems] = useState<CartItemType[]>(items);

    const isLocalChangeRef = useRef(false);
    const debounceRefs = useRef<{ [key: number]: NodeJS.Timeout }>({});

    useEffect(() => {
        if (!isLocalChangeRef.current) {
            setOptimisticItems(items);
        }
        isLocalChangeRef.current = false;
    }, [items]);

    useEffect(() => {
        if (isLocalChangeRef.current) {
            onItemsChange?.(optimisticItems);
        }
    }, [optimisticItems, onItemsChange]);

    const handleDeleteItem = async (itemId: number) => {
        setLoadingItemId(itemId);
        setError(null);

        const oldItems = optimisticItems;
        isLocalChangeRef.current = true;
        setOptimisticItems(optimisticItems.filter(item => item.id !== itemId));

        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to delete item");
            }
            onCartUpdate?.(); // Sync latar belakang
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to delete item";
            setError(errorMsg);
            setOptimisticItems(oldItems);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoadingItemId(null);
        }
    };

    const handleUpdateQuantity = (itemId: number, newQty: number) => {
        if (newQty < 1) return;

        const oldItems = optimisticItems;
        isLocalChangeRef.current = true;
        setOptimisticItems(
            optimisticItems.map(item =>
                item.id === itemId ? { ...item, qty: newQty } : item
            )
        );

        if (debounceRefs.current[itemId]) {
            clearTimeout(debounceRefs.current[itemId]);
        }

        debounceRefs.current[itemId] = setTimeout(async () => {
            try {
                const response = await fetch(`/api/cart/${itemId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ qty: newQty }),
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || "Failed to update quantity");
                }
                onCartUpdate?.();
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : "Failed to update quantity";
                setError(errorMsg);
                setOptimisticItems(oldItems);
                setTimeout(() => setError(null), 3000);
            }
        }, 500); 
    };

    const handleToggleCheckbox = (itemId: number) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(itemId)) {
            newChecked.delete(itemId);
        } else {
            newChecked.add(itemId);
        }
        onCheckedChange?.(newChecked);
    };

    const handleSelectAll = () => {
        if (checkedItems.size === optimisticItems.length) {
            onCheckedChange?.(new Set());
        } else {
            onCheckedChange?.(new Set(optimisticItems.map(item => item.id)));
        }
    };

    const handleDeleteAll = async () => {
        if (checkedItems.size === 0) return;
        setLoadingItemId(-1);
        setError(null);

        const oldItems = optimisticItems;
        const idsToDelete = Array.from(checkedItems);
        isLocalChangeRef.current = true;
        setOptimisticItems(optimisticItems.filter(item => !idsToDelete.includes(item.id)));

        try {
            for (const itemId of idsToDelete) {
                await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
            }
            onCheckedChange?.(new Set());
            onCartUpdate?.();
        } catch (err) {
            setError("Failed to delete items");
            setOptimisticItems(oldItems);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoadingItemId(null);
        }
    };

    return (
        <div className="flex-1 border border-gray-300 rounded-2xl bg-white overflow-hidden h-fit">
            {error && (
                <div className="bg-red-50 border-b border-red-200 p-4 text-red-800 text-sm">
                    {error}
                </div>
            )}

            <div className="flex items-center justify-between p-5 border-b border-gray-300">
                <h2 className="text-lg font-semibold text-gray-900">Product Summary</h2>
                <div className="flex items-center gap-6 text-sm">
                    <button onClick={handleDeleteAll} disabled={checkedItems.size === 0} className="flex items-center gap-2 text-gray-600 hover:text-red-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Delete All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer font-medium">
                        Choose All
                        <input type="checkbox" checked={checkedItems.size === optimisticItems.length && optimisticItems.length > 0} onChange={handleSelectAll} aria-label="Choose All" className="w-5 h-5 rounded border-gray-300 text-[#1a3a5c] focus:ring-[#1a3a5c] cursor-pointer" />
                    </label>
                </div>
            </div>

            <div className="flex flex-col divide-y divide-gray-200 px-5">
                {optimisticItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Cart is empty</div>
                ) : (
                    optimisticItems.map((item) => (
                        <div key={item.id} className="py-5 flex gap-5 transition-opacity" style={{ opacity: loadingItemId === item.id ? 0.6 : 1 }}>
                            <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden relative border border-gray-300 bg-gray-100">
                                {item.image ? (
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">🍽️</div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">{item.category || "Product"}</p>
                                    <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center border border-gray-300 rounded-lg w-fit h-9">
                                        <button aria-label="Kurangi kuantitas" className="w-9 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition" onClick={() => handleUpdateQuantity(item.id, item.qty - 1)}>-</button>
                                        <span className="w-10 text-center text-sm font-medium border-x border-gray-300 h-full flex items-center justify-center">{item.qty}</span>
                                        <button aria-label="Tambah kuantitas" className="w-9 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition" onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}>+</button>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">
                                        Stock Total: <span className="text-gray-800">{item.stock} pcs</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-between py-1">
                                <input type="checkbox" checked={checkedItems.has(item.id)} onChange={() => handleToggleCheckbox(item.id)} aria-label={`Select ${item.name}`} className="w-5 h-5 rounded border-gray-300 text-[#1a3a5c] focus:ring-[#1a3a5c] cursor-pointer" />
                                <div className="text-right mt-4 mb-2">
                                    <p className="text-xs text-gray-500 mb-1">Total: x{item.qty}</p>
                                    <p className="font-bold text-gray-900 text-lg">{formatRupiah(item.price * item.qty)}</p>
                                </div>
                                <button aria-label="Hapus dari keranjang" className="transition-colors text-gray-400 hover:text-red-500 disabled:opacity-50" onClick={() => handleDeleteItem(item.id)} disabled={loadingItemId === item.id}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}