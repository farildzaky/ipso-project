import { cekAksesRoute, MockSession } from "./proxyHelpers";

describe("WB-01 s/d WB-04 | proxy.ts — Proteksi Route", () => {
  test("WB-01: Akses /katalog tanpa sesi → diizinkan (NEXT)", () => {
    const result = cekAksesRoute(null, "/katalog");
    expect(result).toBe("NEXT");
  });

  test("WB-02: Akses /cart tanpa sesi → redirect ke login", () => {
    const result = cekAksesRoute(null, "/cart");
    expect(result).toBe("REDIRECT_LOGIN");
  });

  test("WB-03: Customer akses /admin → redirect ke login", () => {
    const session: MockSession = { user: { role: "customer" } };
    const result = cekAksesRoute(session, "/admin");
    expect(result).toBe("REDIRECT_LOGIN");
  });

  test("WB-04: Admin akses /admin → diizinkan (NEXT)", () => {
    const session: MockSession = { user: { role: "admin" } };
    const result = cekAksesRoute(session, "/admin");
    expect(result).toBe("NEXT");
  });

  test("WB-04b: User login buka /login → redirect ke katalog", () => {
    const session: MockSession = { user: { role: "customer" } };
    const result = cekAksesRoute(session, "/login");
    expect(result).toBe("REDIRECT_KATALOG");
  });
});
