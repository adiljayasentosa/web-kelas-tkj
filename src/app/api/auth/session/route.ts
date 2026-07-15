import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRES_IN_MS = 60 * 60 * 24 * 5 * 1000; // 5 hari

/**
 * Dipanggil dari client SETELAH signInWithEmailAndPassword() berhasil
 * (lihat features/auth/services/authService.ts). Menukar ID token jadi
 * session cookie httpOnly, supaya bisa dibaca proxy.ts & Server
 * Component tanpa mengekspos token ke JavaScript client.
 */
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken wajib diisi" }, { status: 400 });
    }

    // Verifikasi penuh (signature + expiry) di sini — beda dengan decode
    // ringan di proxy.ts. Ini bagian yang benar-benar jadi lapisan keamanan.
    await adminAuth.verifyIdToken(idToken);

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN_MS,
    });

    const response = NextResponse.json({ status: "ok" });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_EXPIRES_IN_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/session] Gagal membuat session:", error);
    return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
  }
}

/** Dipanggil saat logout untuk menghapus session cookie. */
export async function DELETE() {
  const response = NextResponse.json({ status: "ok" });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
