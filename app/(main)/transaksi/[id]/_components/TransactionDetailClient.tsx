"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { processPayment } from "../../actions"; // Import server action yang baru dibuat

export default function TransactionDetailClient({ transaksi }: { transaksi: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const totalItemsQty = transaksi.items.reduce((acc: number, item: any) => acc + item.qty, 0);
  const subtotal = transaksi.items.reduce((acc: number, item: any) => acc + (Number(item.hargaSnapshot) * item.qty), 0);
  const deliveryFee = 10000; 
  const grandTotal = subtotal + deliveryFee;

  const mainTitle = transaksi.items[0]?.product?.namaProduct || "Transaction Detail";

  // Fungsi untuk handle klik Proceed
  const handleProceed = async () => {
    setIsLoading(true);
    const result = await processPayment(transaksi.id);
    
    if (result.success) {
      // Jika berhasil, kembali ke halaman daftar transaksi
      router.push("/transaksi");
    } else {
      alert("Gagal memproses pembayaran. Coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb & Title */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2">
          Home / Catalog / Product Detail / <span className="text-green-800 font-semibold">Payment</span>
        </p>
        <h1 className="text-3xl font-bold text-green-900">{mainTitle}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI (Shipment & Product Summary) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Shipment Details</h2>
            <div className="flex items-center border-b border-gray-100 pb-4 mb-4">
              <span className="text-gray-400 text-sm font-medium w-28">Phone</span>
              <span className="flex-1 text-sm font-bold text-gray-900">+62 813 212 3121</span>
            </div>
            <div className="flex items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row md:items-center flex-1">
                <span className="text-gray-400 text-sm font-medium w-28 mb-1 md:mb-0">Address</span>
                <span className="flex-1 text-sm font-bold text-gray-900">
                  Jl. Pahlawan Trip, Kec. Bangun Siang, Malang, Jawa Timur
                </span>
              </div>
              <button className="text-green-800 font-bold text-sm hover:underline ml-4 transition-colors">
                Change
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Product Summary</h2>
            <div className="space-y-6">
              {transaksi.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center justify-between border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-200">
                      {item.product?.gambarUrl ? (
                        <img src={item.product.gambarUrl} alt={item.product.namaProduct} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">🍽️</div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 mb-1">
                        {item.product?.kategori || "Vegetables"}
                      </span>
                      <h3 className="font-bold text-gray-900 text-[15px]">
                        {item.product?.namaProduct}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block mb-1">
                      Total : <span className="font-bold text-gray-900">x{item.qty}</span>
                    </span>
                    <span className="font-bold text-gray-900 text-base">
                      Rp {(item.qty * Number(item.hargaSnapshot)).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (Price Detail) */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Price Detail</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  Item Quantity <span className="font-bold text-gray-900">({totalItemsQty}pcs)</span>
                </span>
                <span className="font-bold text-gray-900">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="font-bold text-gray-900">
                  Rp {deliveryFee.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-between items-center mb-6">
              <span className="text-gray-900 font-bold">Total</span>
              <div className="flex items-baseline gap-1">
                <span className="text-gray-400 font-semibold text-sm">Rp</span>
                <span className="font-bold text-2xl text-gray-900">
                  {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Promo Banner */}
            <div className="w-full h-24 rounded-xl bg-gradient-to-br from-[#2a3c5a] to-[#4a6583] mb-4 flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
               <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ffffff_10px,#ffffff_20px)]"></div>
               <h3 className="text-white font-bold text-center text-sm leading-snug relative z-10">
                 Enjoy Special Promo<br/>For New User!
               </h3>
            </div>

            {/* Tombol Proceed Diperbarui */}
            <button 
              onClick={handleProceed}
              disabled={isLoading || transaksi.status === 'SELESAI'}
              className="w-full bg-[#0a192f] hover:bg-[#002174] text-white rounded-xl py-4 font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                transaksi.status === 'SELESAI' ? 'Payment Completed' : 'Proceed'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}