import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CheckoutPage() {
  // 1. Ambil session user yang sedang login
  const session = await auth()
  if (!session?.user?.email) {
    redirect('/login') // Lempar ke halaman login kalau belum login
  }

  // 2. Cari data user di database berdasarkan email dari session
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) redirect('/login')

  // 3. Ambil data keranjang (Cart) milik user tersebut beserta produknya
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  // 4. Jika keranjang kosong, tampilkan pesan
  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center mt-10 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Keranjang Kosong</h1>
        <p className="text-gray-600 mb-6">Belum ada makanan yang mau di-checkout nih.</p>
        <Link href="/katalog" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Belanja Sekarang
        </Link>
      </div>
    )
  }

  // 5. Hitung Total Harga
  const totalHarga = cart.items.reduce((total, item) => {
    return total + (Number(item.product.harga) * item.qty)
  }, 0)

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout Pesanan</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <form className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Alamat Pengiriman</h2>
              <textarea
                name="alamat"
                rows={3}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-500"
                placeholder="Masukkan alamat lengkap pengiriman..."
                defaultValue={user.alamat || ''}
                required
              ></textarea>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Metode Pembayaran</h2>
              <select 
                name="metode" 
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-500"
              >
                <option value="transfer_bank">Transfer Bank</option>
                <option value="qris">QRIS</option>
                <option value="cod">Cash on Delivery (COD)</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Bayar Sekarang
            </button>
          </form>
        </div>

        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Ringkasan Pesanan</h2>
          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-gray-800">{item.product.namaProduct}</p>
                  <p className="text-sm text-gray-500">{item.qty} x Rp {Number(item.product.harga).toLocaleString('id-ID')}</p>
                </div>
                <p className="font-medium text-gray-800">
                  Rp {(Number(item.product.harga) * item.qty).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t-2">
            <p className="text-lg font-bold text-gray-800">Total Tagihan</p>
            <p className="text-lg font-bold text-blue-600">
              Rp {totalHarga.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}