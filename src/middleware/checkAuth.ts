import { PROTECTED_ROUTES, type Role } from "@/config/roles.config";

const SESSION_COOKIE_NAME = "session";

/**
 * Membaca payload JWT tanpa verifikasi signature — CUKUP untuk keputusan UX
 * (redirect di proxy.ts), TIDAK dipakai sebagai batas keamanan sesungguhnya.
 *
 * Keamanan data yang sebenarnya ditegakkan oleh Firebase Security Rules
 * (lihat firestore.rules) dan verifikasi penuh via Admin SDK di Server
 * Action/Route Handler — konsisten dengan spesifikasi-teknis-website-kelas
 * -v1.0.md §6: "proteksi di Next.js middleware hanya lapisan kenyamanan
 * UX, bukan satu-satunya lapisan keamanan."
 */
function decodeSessionCookiePayload(
  cookieValue: string | undefined
): { role?: Role; exp?: number } | null {
  if (!cookieValue) return null;

  try {
    const [, payloadB64] = cookieValue.split(".");
    if (!payloadB64) return null;

    const normalized = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    const payload = JSON.parse(json);

    return { role: payload.role, exp: payload.exp };
  } catch {
    return null;
  }
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function checkAuth(cookieValue: string | undefined): {
  isAuthenticated: boolean;
  role?: Role;
} {
  const payload = decodeSessionCookiePayload(cookieValue);
  const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : true;

  if (!payload || isExpired) {
    return { isAuthenticated: false };
  }

  return { isAuthenticated: true, role: payload.role };
}

export function findRequiredRole(pathname: string) {
  return PROTECTED_ROUTES.find((route) => pathname.startsWith(route.prefix));
}
