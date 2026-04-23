# Laporan SRS, Pengujian Blackbox, dan Whitebox
## Bagian: Modul Admin & Katalog Produk

---

## A. Software Requirements Specification (SRS)

### Modul Admin

**UR-01:** Admin dapat masuk ke dalam sistem menggunakan email dan password.

**SR-01:** Sistem menyediakan halaman login dengan field email dan password. Sistem memvalidasi kredensial terhadap data di database; jika berhasil sistem mengarahkan admin ke halaman dashboard, jika gagal sistem menampilkan pesan kesalahan.

---

**UR-02:** Admin dapat menambahkan produk baru ke dalam sistem.

**SR-02:** Sistem menyediakan form tambah produk dengan field nama produk, harga, stok, deskripsi, kategori, tenant, dan foto produk. Sistem memvalidasi bahwa minimal satu foto diunggah dan deskripsi tidak kosong. Foto diunggah ke Cloudinary dan seluruh data disimpan ke database, sistem mengembalikan HTTP 201 apabila berhasil.

---

**UR-03:** Admin dapat mengubah data produk yang sudah ada.

**SR-03:** Sistem menyediakan form edit yang menampilkan data produk yang sudah tersimpan. Admin dapat menambah atau menghapus foto dengan syarat minimal tetap ada satu foto. Setelah disimpan, sistem memperbarui data produk di database dan mengembalikan HTTP 200.

---

**UR-04:** Admin dapat menghapus produk dari sistem.

**SR-04:** Sistem menyediakan tombol hapus pada setiap produk di halaman daftar produk. Setelah perintah hapus diterima, sistem menghapus data produk dari database secara permanen dan mengembalikan HTTP 200.

---

**UR-05:** Admin dapat melihat seluruh daftar produk yang tersimpan di sistem.

**SR-05:** Sistem menampilkan daftar produk dalam bentuk tabel yang memuat informasi nama produk, harga, stok, kategori, dan tenant untuk setiap produk.

---

### Modul Katalog Produk

**UR-06:** Pengguna dapat melihat daftar produk tanpa perlu melakukan login terlebih dahulu.

**SR-06:** Sistem mengizinkan akses ke halaman katalog (`/katalog`) dan halaman detail produk (`/produk/[id]`) tanpa autentikasi. Produk ditampilkan dalam grid dengan setiap kartu memuat foto utama, nama produk, nama tenant, dan harga.

---

**UR-07:** Pengguna dapat mencari produk berdasarkan nama produk atau nama tenant.

**SR-07:** Sistem menyediakan kolom pencarian pada halaman katalog. Sistem memfilter produk berdasarkan nama produk atau nama tenant secara case-insensitive dan mereset halaman ke halaman pertama setiap kali pencarian baru dilakukan. Apabila tidak ada produk yang cocok, sistem menampilkan pesan "Produk tidak ditemukan".

---

**UR-08:** Pengguna dapat berpindah halaman pada halaman katalog.

**SR-08:** Sistem membatasi tampilan sebanyak 18 produk per halaman dan menyediakan komponen navigasi pagination. Sistem menampilkan informasi rentang produk yang sedang ditampilkan beserta total keseluruhan produk.

---

**UR-09:** Pengguna dapat melihat informasi lengkap suatu produk.

**SR-09:** Sistem menampilkan halaman detail produk ketika pengguna mengklik kartu produk. Halaman memuat galeri foto, nama produk, harga, stok, deskripsi, dan informasi tenant. Sistem menyediakan kontrol jumlah yang dibatasi antara 1 hingga stok tersedia, menampilkan ringkasan total harga beserta estimasi ongkir, serta menampilkan rekomendasi produk dari kategori yang sama. Apabila ID produk tidak ditemukan, sistem menampilkan halaman 404.

---

## B. Pengujian Blackbox

| No | Modul | Skenario Uji | Data Input | Output yang Diharapkan | Status |
|:---:|---|---|---|---|:---:|
| BB-01 | Login Admin | Login dengan kredensial valid | Email & password benar | Redirect ke `/admin` | ✓ |
| BB-02 | Login Admin | Login dengan password salah | Password tidak sesuai | Pesan error, tetap di halaman login | ✓ |
| BB-03 | Login Admin | Login dengan email tidak terdaftar | Email tidak ada di database | Pesan error, tetap di halaman login | ✓ |
| BB-04 | Tambah Produk | Submit dengan semua field valid dan 1 foto | Data lengkap + file gambar | Produk tersimpan, redirect ke daftar produk | ✓ |
| BB-05 | Tambah Produk | Submit tanpa foto | Semua field terisi, tanpa gambar | Pesan error "Minimal 1 foto produk" | ✓ |
| BB-06 | Tambah Produk | Submit tanpa deskripsi | Deskripsi dikosongkan | Validasi gagal, form tidak terkirim | ✓ |
| BB-07 | Tambah Produk | Harga diisi angka negatif | harga = -5000 | Validasi gagal, pesan error harga harus positif | ✓ |
| BB-08 | Edit Produk | Mengubah harga produk | Harga baru yang valid | Data produk diperbarui di database | ✓ |
| BB-09 | Hapus Produk | Menghapus produk yang ada | Klik tombol hapus | Produk terhapus dari daftar | ✓ |
| BB-10 | Katalog | Buka halaman katalog tanpa login | Akses `/katalog` secara langsung | Halaman katalog tampil dengan daftar produk | ✓ |
| BB-11 | Katalog | Pencarian dengan kata kunci yang ada | Keyword: nama produk atau tenant | Produk yang relevan tampil | ✓ |
| BB-12 | Katalog | Pencarian dengan kata kunci tidak ada | Keyword: "xyzxyz" | Pesan "Produk tidak ditemukan" tampil | ✓ |
| BB-13 | Katalog | Navigasi ke halaman berikutnya | Klik tombol halaman 2 | Produk halaman 2 ditampilkan | ✓ |
| BB-14 | Detail Produk | Membuka detail produk yang valid | Klik kartu produk | Halaman detail tampil lengkap | ✓ |
| BB-15 | Detail Produk | Akses ID produk yang tidak ada | `/produk/99999` | Halaman 404 ditampilkan | ✓ |
| BB-16 | Detail Produk | Input quantity melebihi stok | qty > stok produk | Tombol tambah ter-disable, qty tidak bertambah | ✓ |
| BB-17 | Proteksi Route | Akses `/admin` sebagai customer | Login dengan role customer lalu buka `/admin` | Redirect ke `/login` | ✓ |

---

## C. Pengujian Whitebox (Unit Testing dengan Jest)

Unit test diimplementasikan menggunakan framework **Jest** dengan **ts-jest** untuk mendukung TypeScript. Test berfokus pada pengujian logika internal tiga modul utama: proteksi route (`proxy.ts`), kalkulasi pagination (`katalog/page.tsx`), dan validasi schema produk (`api/products`).

### Struktur File Test

```
lib/
├── proxyHelpers.ts          ← logika route protection
├── katalogHelpers.ts        ← logika pagination
└── __tests__/
    ├── proxy.test.ts        ← WB-01 s/d WB-04
    ├── katalog.test.ts      ← WB-05 s/d WB-07
    └── validasiProduk.test.ts ← WB-08 s/d WB-11
```

### Hasil Eksekusi Test

```
npx jest
```

```
PASS  lib/__tests__/proxy.test.ts
PASS  lib/__tests__/katalog.test.ts
PASS  lib/__tests__/validasiProduk.test.ts

Test Suites: 3 passed, 3 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        0.446 s
```

---

### Tabel Hasil Pengujian Whitebox

| No | File Test | Nama Test | Kondisi yang Diuji | Output yang Diharapkan | Hasil |
|:---:|---|---|---|---|:---:|
| WB-01 | `proxy.test.ts` | Akses `/katalog` tanpa sesi | `session=null`, `isPublic=true` | `"NEXT"` — akses diizinkan | PASS ✓ |
| WB-02 | `proxy.test.ts` | Akses `/cart` tanpa sesi | `session=null`, `isPublic=false` | `"REDIRECT_LOGIN"` | PASS ✓ |
| WB-03 | `proxy.test.ts` | Customer akses `/admin` | `role="customer"`, `isAdminPage=true` | `"REDIRECT_LOGIN"` | PASS ✓ |
| WB-04 | `proxy.test.ts` | Admin akses `/admin` | `role="admin"`, `isAdminPage=true` | `"NEXT"` — akses diizinkan | PASS ✓ |
| WB-04b | `proxy.test.ts` | User login buka `/login` | `session` ada, `isAuthPage=true` | `"REDIRECT_KATALOG"` | PASS ✓ |
| WB-05 | `katalog.test.ts` | Pagination halaman pertama | `page=1`, `total=20`, `PER_PAGE=18` | `from=1`, `to=18`, `totalPages=2` | PASS ✓ |
| WB-06 | `katalog.test.ts` | Pagination halaman kedua | `page=2`, `total=20`, `skip=18` | `from=19`, `to=20` | PASS ✓ |
| WB-07 | `katalog.test.ts` | Produk kosong | `total=0` | `from=0`, `to=0`, `totalPages=0` | PASS ✓ |
| WB-07b | `katalog.test.ts` | Page tidak valid (NaN) | `page=NaN` | default `currentPage=1`, `from=1` | PASS ✓ |
| WB-08 | `validasiProduk.test.ts` | Data produk lengkap dan valid | Semua field valid | `success=true` | PASS ✓ |
| WB-09 | `validasiProduk.test.ts` | Harga negatif (-1000) | `z.number().positive()` gagal | `success=false`, pesan error harga | PASS ✓ |
| WB-10 | `validasiProduk.test.ts` | Array foto kosong ([]) | `z.array().min(1)` gagal | `success=false`, pesan "foto" | PASS ✓ |
| WB-11 | `validasiProduk.test.ts` | Nama produk kosong ('') | `z.string().min(1)` gagal | `success=false`, path `namaProduct` | PASS ✓ |
| WB-11b | `validasiProduk.test.ts` | Simulasi hapus produk ID valid | `id=1` dihapus | `{ deleted: true, id: 1 }` | PASS ✓ |
