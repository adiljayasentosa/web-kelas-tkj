import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import type { Role } from "@/config/roles.config";

export interface SessionUser {
  uid: string;
  email: string | undefined;
  name: string | undefined;
  photoURL: string | undefined;
  role: Role | undefined;
}

const SESSION_COOKIE_NAME = "session";

/**
 * Verifikasi PENUH (signature + revocation check) session cookie di server.
 * Ini beda dengan decode ringan di src/middleware/checkAuth.ts — decode
 * ringan itu hanya untuk keputusan UX redirect di proxy.ts. Fungsi INI
 * yang jadi lapisan keamanan sesungguhnya untuk Server Component/Layout,
 * sesuai prinsip di spesifikasi-teknis-website-kelas-v1.0.md §6:
 * "proteksi di Next.js middleware hanya lapisan kenyamanan UX".
 */
export async function getCurrentSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  try {
    // checkRevoked = true: menolak cookie yang sesi-nya sudah di-revoke
    // manual (mis. admin menonaktifkan akun), bukan cuma cek kedaluwarsa.
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    return {
      uid: decoded.uid,
      email: decoded.email,
      name: (decoded.name as string | undefined) ?? decoded.email,
      photoURL: decoded.picture as string | undefined,
      role: decoded.role as Role | undefined,
    };
  } catch {
    // Cookie kedaluwarsa, di-revoke, atau tidak valid — anggap saja belum login.
    return null;
  }
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}
