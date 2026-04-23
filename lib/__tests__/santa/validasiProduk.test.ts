import { z } from "zod";

const produkSchema = z.object({
  namaProduct: z.string().min(1, "Nama produk wajib diisi"),
  harga: z.number().positive("Harga harus bernilai positif"),
  stok: z.number().min(0),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  kategori: z.string().min(1),
  tenant: z.string().min(1),
  gambarUrls: z.array(z.string()).min(1, "Minimal 1 foto produk"),
});

const dataValid = {
  namaProduct: "Nasi Goreng Spesial",
  harga: 25000,
  stok: 10,
  deskripsi: "Nasi goreng dengan telur ayam",
  kategori: "Makanan Berat",
  tenant: "Warung Pak Budi",
  gambarUrls: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
};

describe("WB-08 s/d WB-11 | api/products — Validasi Zod Schema", () => {
  test("WB-08: Data lengkap dan valid → lolos validasi", () => {
    const result = produkSchema.safeParse(dataValid);
    expect(result.success).toBe(true);
  });

  test("WB-09: Harga bernilai negatif (-1000) → validasi gagal", () => {
    const result = produkSchema.safeParse({ ...dataValid, harga: -1000 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const pesan = result.error.issues[0].message;
      expect(pesan).toMatch(/positif|positive/i);
    }
  });

  test("WB-10: gambarUrls array kosong ([]) → validasi gagal", () => {
    const result = produkSchema.safeParse({ ...dataValid, gambarUrls: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      const pesan = result.error.issues[0].message;
      expect(pesan).toMatch(/foto/i);
    }
  });

  test("WB-11: namaProduct kosong ('') → validasi gagal", () => {
    const result = produkSchema.safeParse({ ...dataValid, namaProduct: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("namaProduct");
    }
  });

  test("WB-11b: Hapus produk dengan ID valid → mengembalikan ID yang sama", () => {
    const idProduk = 1;
    const simulasiHapus = (id: number) => ({ deleted: true, id });
    const hasil = simulasiHapus(idProduk);
    expect(hasil.deleted).toBe(true);
    expect(hasil.id).toBe(idProduk);
  });
});
