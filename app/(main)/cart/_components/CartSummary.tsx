"use client";

interface CartSummaryProps {
    totalPrice: number;
}

export default function CartSummary({ totalPrice }: CartSummaryProps) {
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
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

                <button className="w-full bg-[#0a192f] hover:bg-[#002174] text-white rounded-xl py-4 font-semibold transition flex items-center justify-center gap-2">
                    Pesan Sekarang
                </button>
            </div>
        </div>
    );
}