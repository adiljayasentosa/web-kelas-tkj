"use client";

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onIdTokenChanged,
  type User,
  type AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

/** Pesan error dipetakan ke Bahasa Indonesia — dipakai langsung di UI. */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Email atau password salah.",
  "auth/invalid-email": "Format email tidak valid.",
  "auth/user-disabled": "Akun ini dinonaktifkan. Hubungi pengurus kelas.",
  "auth/user-not-found": "Akun dengan email ini tidak ditemukan.",
  "auth/wrong-password": "Email atau password salah.",
  "auth/too-many-requests": "Terlalu banyak percobaan gagal. Coba lagi beberapa saat lagi.",
  "auth/network-request-failed": "Tidak ada koneksi internet. Cek jaringanmu dan coba lagi.",
};

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthServiceError";
  }
}

function toFriendlyMessage(error: unknown): string {
  const code = (error as AuthError)?.code;
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return "Gagal masuk. Coba lagi beberapa saat lagi.";
}

export async function signIn(email: string, password: string): Promise<User> {
  let user: User;

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    user = credential.user;
  } catch (error) {
    throw new AuthServiceError(toFriendlyMessage(error));
  }

  try {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error("session-request-failed");
    }
  } catch {
    // Login Firebase berhasil tapi gagal membuat session cookie server —
    // jangan biarkan user "setengah login". Sign out lagi supaya state
    // client & server konsisten, lalu laporkan sebagai gagal.
    await firebaseSignOut(auth).catch(() => {});
    throw new AuthServiceError(
      "Gagal menyiapkan sesi. Cek koneksi internetmu dan coba lagi."
    );
  }

  return user;
}

export async function signOut(): Promise<void> {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } finally {
    // Tetap sign-out dari Firebase Client SDK meski request hapus
    // cookie gagal (mis. offline) — client tidak boleh "terjebak login".
    await firebaseSignOut(auth);
  }
}

/**
 * Dipanggil sekali di provider root — menjaga session cookie tetap sinkron
 * kalau Firebase merefresh ID token di background (default tiap ~1 jam).
 */
export function subscribeToIdTokenChanges(callback: (user: User | null) => void) {
  return onIdTokenChanged(auth, async (user: User | null) => {
    if (user) {
      try {
        const idToken = await user.getIdToken();
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
      } catch {
        // Gagal refresh sesi di background tidak perlu mengganggu UX —
        // requireRole()/proxy.ts akan redirect ke /login saat cookie
        // benar-benar kedaluwarsa di request berikutnya.
      }
    }
    callback(user);
  });
}
