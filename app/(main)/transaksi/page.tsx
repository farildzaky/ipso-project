import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function TransaksiPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = Number(session.user.id);

  // Tarik data Transaksi, Detail Item, dan Pembayaran
  const transactions = await prisma.transaction.findMany({
    where: { userId: userId },
    include: {
      TransactionItem: { 
        include: { Product: true } 
      },
      Payment: true 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Riwayat Transaksi</h1>

      {transactions.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center">
          <p className="text-gray-500">Kamu belum memiliki riwayat transaksi.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {transactions.map((trx) => (
            <div key={trx.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              
              {/* Header Card Transaksi */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tanggal Pesanan</p>
                  <p className="text-sm font-medium text-gray-800">
                    {trx.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    trx.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' : 
                    trx.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {trx.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">ID Transaksi</p>
                  <p className="text-sm font-mono text-gray-600">#{trx.id}</p>
                </div>
              </div>

              {/* Body: Daftar Produk */}
              <div className="p-6">
                <div className="space-y-4">
                  {trx.TransactionItem.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-dashed pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.Product.namaProduct}</p>
                        <p className="text-gray-500">{item.qty} x Rp {Number(item.hargaSnapshot).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="font-semibold text-gray-800">
                        Rp {(Number(item.hargaSnapshot) * item.qty).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer: Detail Pembayaran */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-wrap justify-between items-end gap-4">
                <div className="text-sm">
                  <p className="text-gray-500 mb-1"><span className="font-medium">Metode:</span> {trx.Payment[0]?.metodeBayar || '-'}</p>
                  <p className="text-gray-500"><span className="font-medium">Kirim ke:</span> {trx.Payment[0]?.alamatKirim || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Belanja</p>
                  <p className="text-xl font-bold text-blue-600">
                    Rp {Number(trx.totalHarga).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}