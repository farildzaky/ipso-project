"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CartSummaryProps {
    totalPrice: number;
}

export default function CartSummary({ totalPrice }: CartSummaryProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Fungsi untuk menangani proses checkout
    const handleCheckout = async () => {
        if (totalPrice === 0) return; // Cegah checkout jika tidak ada item yang dicentang

        try {
            setIsLoading(true);
            
            // Memanggil API checkout yang mengubah Cart menjadi Transaksi
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gagal melakukan checkout");
            }

            // Jika sukses, arahkan ke halaman detail transaksi
            if (data.success && data.transactionId) {
                router.push(`/transaksi/${data.transactionId}`);
            }

        } catch (error) {
            console.error("Checkout Error:", error);
            alert(error instanceof Error ? error.message : "Terjadi kesalahan saat pesanan diproses.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full lg:w-[380px] shrink-0">
            <div className="border border-gray-300 rounded-2xl bg-white p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-[#1c3f28] mb-6 border-b border-gray-300 pb-4">Rincian Harga</h2>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Price Total</span>
                        <span className="font-bold text-gray-900">{formatRupiah(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Delivery</span>
                        <span className="font-bold text-gray-900">Rp 0</span>
                    </div>

                    <div className="pt-4 border-t border-gray-300 flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Total</span>
                        <span className="font-bold text-2xl text-[#1c3f28]">{formatRupiah(totalPrice)}</span>
                    </div>
                </div>

                <button 
                    onClick={handleCheckout}
                    disabled={totalPrice === 0 || isLoading}
                    className={`w-full rounded-xl py-4 font-semibold transition flex items-center justify-center gap-2 ${
                        totalPrice === 0 || isLoading 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-[#0a192f] hover:bg-[#002174] text-white"
                    }`}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memproses...
                        </span>
                    ) : (
                        "Pesan Sekarang"
                    )}
                </button>
            </div>
        </div>
    );
}