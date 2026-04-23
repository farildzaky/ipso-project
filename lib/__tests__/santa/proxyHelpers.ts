export const PUBLIC_PATHS = ["/katalog", "/produk"];
export const AUTH_PAGES = ["/login", "/register"];

export type MockSession = {
  user: { role: string };
} | null;

export type RouteDecision =
  | "NEXT"
  | "REDIRECT_LOGIN"
  | "REDIRECT_KATALOG";

export function cekAksesRoute(
  session: MockSession,
  pathname: string
): RouteDecision {
  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const isPublic =
    PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    ) || isAuthPage;

  if (session && isAuthPage) return "REDIRECT_KATALOG";
  if (isAdminPage && session?.user?.role !== "admin") return "REDIRECT_LOGIN";
  if (!session && !isPublic) return "REDIRECT_LOGIN";
  return "NEXT";
}
