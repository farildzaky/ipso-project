import { hitungPaginasi, PER_PAGE } from "./katalogHelpers";

describe("WB-05 s/d WB-07 | katalog/page.tsx — Kalkulasi Pagination", () => {
  test("WB-05: Halaman 1, total 20 produk → from=1, to=18, totalPages=2", () => {
    const result = hitungPaginasi(1, 20);
    expect(result.skip).toBe(0);
    expect(result.from).toBe(1);
    expect(result.to).toBe(18);
    expect(result.totalPages).toBe(2);
    expect(result.currentPage).toBe(1);
  });

  test("WB-06: Halaman 2, total 20 produk → from=19, to=20", () => {
    const result = hitungPaginasi(2, 20);
    expect(result.skip).toBe(PER_PAGE);
    expect(result.from).toBe(19);
    expect(result.to).toBe(20);
  });

  test("WB-07: Total produk 0 → from=0, to=0, totalPages=0", () => {
    const result = hitungPaginasi(1, 0);
    expect(result.from).toBe(0);
    expect(result.to).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  test("WB-07b: Page tidak valid (NaN) → default ke halaman 1", () => {
    const result = hitungPaginasi(Number.NaN, 20);
    expect(result.currentPage).toBe(1);
    expect(result.from).toBe(1);
  });
});
