# EcoBite — Food E-Commerce

Proyek tugas kuliah **Implementasi dan Pengujian Sistem Informasi**.

EcoBite adalah platform jual beli makanan berbasis web yang dibangun menggunakan **Next.js full stack**. Pengguna bisa browse produk, tambah ke keranjang, bayar, dan lihat riwayat transaksi. Admin bisa kelola produk.

---

## Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| Next.js 16 + React 19 | Framework utama (frontend + backend sekaligus) |
| TypeScript | Supaya kode lebih aman dari typo |
| Tailwind CSS v4 | Styling |
| Prisma 7 | ORM — buat query database tanpa nulis SQL mentah |
| PostgreSQL (Neon) | Database cloud gratis |
| NextAuth v5 | Login / session management |
| bcryptjs | Hash password sebelum disimpan ke DB |
| Zod | Validasi input form / API |

---

## Persiapan Awal (Wajib dilakukan sekali)

### 1. Clone repo dan install dependencies

```bash
git clone <url-repo>
cd ipso-project
npm install
```

### 2. Buat file `.env`

Duplikat file `.env.example` jadi `.env`:

```bash
cp .env.example .env
```

Isi nilainya:

```bash
DATABASE_URL="postgresql://..."   # yang dari santa
AUTH_SECRET="..."                  # generate sendiri pakai perintah di bawah
AUTH_URL="http://localhost:3000"
```

Untuk generate `AUTH_SECRET`, jalankan di terminal:

```bash
openssl rand -base64 32
```

Copy hasilnya ke `.env`.

### 3. Generate Prisma Client

Setiap kali schema database berubah, atau pertama kali setup, jalankan:

```bash
npx prisma generate
```

### 4. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Struktur Folder

```
ipso-project/
├── app/
│   ├── (auth)/              ← halaman login & register (layout sendiri)
│   │   ├── login/
│   │   └── register/
│   ├── (main)/              ← halaman utama untuk customer
│   │   ├── katalog/
│   │   ├── produk/[id]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── transaksi/
│   │   └── profil/
│   ├── (admin)/             ← halaman admin (akses terbatas)
│   │   └── admin/
│   ├── api/
│   │   └── auth/[...nextauth]/   ← jangan diubah, ini handler NextAuth
│   └── generated/           ← auto-generated Prisma, jangan diubah manual
├── lib/
│   ├── auth.ts              ← konfigurasi NextAuth (login logic)
│   └── prisma.ts            ← koneksi database
├── prisma/
│   └── schema.prisma        ← definisi tabel database
├── types/
│   └── next-auth.d.ts       ← TypeScript type untuk session
├── proxy.ts                 ← proteksi route (pengganti middleware di Next.js 16)
├── prisma.config.ts         ← konfigurasi Prisma (jangan diubah)
└── .env                     ← variabel environment (JANGAN di-commit ke git)
```

---

## Pembagian Branch

Setiap fitur dikerjakan di branch sendiri biar tidak tabrakan:

| Branch | Fitur yang dikerjakan |
|--------|-----------------------|
| `feat/auth` | Halaman Login & Register |
| `feat/katalog` | Halaman Katalog produk |
| `feat/cart` | Halaman Cart / Keranjang |
| `feat/checkout` | Halaman Checkout & Payment |
| `feat/profile` | Halaman Profil & Riwayat Transaksi |
| `feat/admin-product` | Halaman Admin — kelola produk |

Cara buat branch baru:

```bash
git checkout -b feat/nama-fitur
```

Kalau mau update dari branch `main`:

```bash
git pull origin main
```

---

## Cara Buat Halaman Baru

Contoh buat halaman `/katalog`:

1. Buat folder `app/(main)/katalog/`
2. Buat file `page.tsx` di dalamnya:

```tsx
export default function KatalogPage() {
  return (
    <div>
      <h1>Katalog Produk</h1>
    </div>
  )
}
```

Halaman otomatis bisa diakses di `http://localhost:3000/katalog`.

---

## Cara Ambil Data dari Database

Pakai `prisma` dari `lib/prisma.ts`. Contoh ambil semua produk:

```tsx
import { prisma } from '@/lib/prisma'

export default async function KatalogPage() {
  const produk = await prisma.product.findMany()

  return (
    <div>
      {produk.map((p) => (
        <div key={p.id}>{p.namaProduct}</div>
      ))}
    </div>
  )
}
```

---

## Cara Ambil Session (Data User yang Login)

```tsx
import { auth } from '@/lib/auth'

export default async function ProfilePage() {
  const session = await auth()

  return <div>Halo, {session?.user?.name}</div>
}
```

---

## Hal Penting yang WAJIB Diketahui

> Next.js versi ini (16) ada beberapa perubahan besar dari versi sebelumnya.

### `proxy.ts` bukan `middleware.ts`

Di Next.js 16, file middleware namanya diganti jadi `proxy.ts`. Kalau kamu pernah belajar Next.js sebelumnya dan kenal `middleware.ts`, di sini **tidak ada** — fungsinya digantikan `proxy.ts` di root project.

### `params` dan `cookies` harus `await`

Di Next.js 16, `params` dan `cookies()` sekarang **async**. Harus selalu di-await:

```tsx
// BENAR
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}

// SALAH (akan error)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params  // error!
}
```

### Jangan edit folder `app/generated/`

Folder itu auto-generated oleh Prisma. Kalau kamu edit manual, nanti hilang ketika `npx prisma generate` dijalankan lagi.

### File `.env` jangan di-commit

File `.env` sudah ada di `.gitignore`. Jangan pernah push file ini ke GitHub karena berisi credential database.

---

## Perintah yang Sering Dipakai

```bash
npm run dev          # jalankan development server
npx prisma generate  # generate ulang Prisma client (jalankan kalau schema berubah)
npx prisma studio    # buka UI untuk lihat/edit isi database
npx prisma db push   # push schema ke database (hati-hati, konfirmasi ke ketua dulu)
```

---

## Kalau Ada Error

1. **`Cannot find module '@/app/generated/prisma/client'`** — jalankan `npx prisma generate`
2. **`DATABASE_URL is not defined`** — cek file `.env` sudah ada dan sudah diisi
3. **`AUTH_SECRET is not defined`** — tambahkan `AUTH_SECRET` ke file `.env`
4. **Port 3000 sudah dipakai** — matikan proses lain atau jalankan `npm run dev -- -p 3001`
