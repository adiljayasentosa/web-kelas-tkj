import { NextResponse, type NextRequest } from "next/server";
import { checkAuth, findRequiredRole, getSessionCookieName } from "@/middleware/checkAuth";
import { hasMinimumRole } from "@/config/roles.config";

/**
 * Entry point tunggal Next.js (proxy.ts — nama baru untuk `middleware.ts`
 * sejak Next.js 16, lihat docs/struktur-proyek-website-kelas-v1.0.md §1.1).
 *
 * Tugasnya HANYA mengarahkan (redirect) lebih awal berdasarkan status
 * login & role, supaya user tidak sempat melihat layout ter-render dulu
 * baru di-redirect (kenyamanan UX). Ini BUKAN lapisan keamanan utama —
 * lapisan sesungguhnya ada di dua tempat:
 *   1. requireRole() (src/features/auth/services/requireRole.ts) — verifikasi
 *      PENUH lewat Admin SDK di setiap Server Component layout.
 *   2. Firebase Security Rules (firestore.rules/storage.rules) — baris
 *      pertahanan terakhir di level database, berlaku bahkan kalau ada
 *      yang mencoba akses Firestore/Storage langsung tanpa lewat app ini.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiredRoute = findRequiredRole(pathname);
  if (!requiredRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(getSessionCookieName())?.value;
  const { isAuthenticated, role } = checkAuth(sessionCookie);

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!hasMinimumRole(role, requiredRoute.minimumRole)) {
    // Login tapi role tidak cukup (mis. anggota mencoba buka /admin).
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/jadwal/:path*",
    "/piket/:path*",
    "/kas/:path*",
    "/galeri/:path*",
    "/dokumentasi/:path*",
    "/akun/:path*",
  ],
};
