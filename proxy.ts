import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/katalog", "/produk"];
const AUTH_PAGES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const isPublic =
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    isAuthPage;

  // Redirect logged-in users away from login/register
  if (session && isAuthPage) {
  if (session.user?.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.redirect(new URL("/katalog", request.url));
}

  // Admin-only pages
  if (isAdminPage && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protected pages (cart, transaksi, dll) — harus login
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/katalog/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/profil/:path*",
    "/transaksi/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};

