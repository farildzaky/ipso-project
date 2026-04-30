import { Search, RefreshCcw, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TransaksiPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);

  const transactions = await prisma.transaction.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true, 
        }
      }
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb & Title */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Home / <span className="text-green-800 font-semibold">Transaction</span>
        </p>
        <h1 className="text-3xl font-bold text-green-900">Transaction</h1>
      </div>

      {/* Action Bar (Refresh, Search, Filter) */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button className="w-12 h-12 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center bg-white shadow-sm flex-shrink-0">
          <RefreshCcw className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white shadow-sm"
            placeholder="Cari sesuatu disini ..."
          />
        </div>

        <button className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between min-w-[140px] bg-white shadow-sm">
          <span className="text-sm font-medium text-gray-700">Relevant</span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Transaction List Container */}
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Product Summary</h2>
        
        <div className="space-y-6">
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Belum ada riwayat transaksi. Yuk, belanja sekarang!
            </div>
          ) : (
            transactions.map((trx) => (
              <div key={trx.id} className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                
                {/* Header Card (Toko, Tanggal, Status) */}
                <div className="flex items-center gap-3 mb-4">
                  {/* Ambil nama tenant dari produk pertama di transaksi ini */}
                  <span className="font-bold text-sm text-gray-900">
                    {trx.items[0]?.product?.tenant || "EcoBite Store"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(trx.createdAt).toLocaleDateString('en-GB', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    trx.status === 'PENDING' ? 'text-yellow-700 bg-yellow-100' : 
                    trx.status === 'SELESAI' ? 'text-green-800 bg-green-100' : 
                    'text-gray-700 bg-gray-100'
                  }`}>
                    {trx.status === 'PENDING' ? 'Menunggu Pembayaran' : trx.status}
                  </span>
                </div>

                {/* Looping item di dalam satu transaksi */}
                <div className="space-y-4">
                  {trx.items.map((item, index) => (
                    <div key={item.id} className="flex gap-4 items-start justify-between">
                      
                      {/* KIRI: Gambar & Detail Produk */}
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-gray-200">
                          {/* Menampilkan Gambar Asli */}
                          {item.product?.gambarUrls?.[0] ? (
                            <img
                              src={item.product.gambarUrls[0]}
                              alt={item.product.namaProduct}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                          )}
                        </div>
                        
                        <div className="flex flex-col justify-center">
                          <span className="text-xs text-gray-500 mb-1">
                            {/* @ts-ignore - Berjaga-jaga jika ada field kategori */}
                            {item.product?.kategori || "Vegetables"} 
                          </span>
                          
                          {/* Menggunakan namaProduct */}
                          <h3 className="font-bold text-gray-900 text-base mb-1">
                            {item.product?.namaProduct} 
                          </h3>
                          
                          <p className="text-sm text-gray-900 font-semibold">
                            {item.qty} items x Rp {Number(item.hargaSnapshot).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      {/* KANAN: Kolom Total Harga */}
                      <div className="text-right flex flex-col justify-between items-end h-20">
                        <div>
                          <span className="text-xs text-gray-500 mb-1 block">Total :</span>
                          <span className="font-bold text-gray-900 text-base">
                            Rp {(item.qty * Number(item.hargaSnapshot)).toLocaleString('id-ID')}
                          </span>
                        </div>
                        
                        {/* Menampilkan link "Detail Transaction" hanya di item paling bawah */}
                        {index === trx.items.length - 1 && (
                          trx.status !== 'SELESAI' ? (
                            <Link 
                              href={`/transaksi/${trx.id}`} 
                              className="text-xs text-gray-400 hover:text-green-700 font-medium transition-colors"
                            >
                              Detail Transaction
                            </Link>
                          ) : (
                            <span className="text-xs text-gray-300 font-medium cursor-not-allowed">
                              Detail Transaction
                            </span>
                          )
                        )}
                      </div>

                    </div>
                  ))}
                </div>
                
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}