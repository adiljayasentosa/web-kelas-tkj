"use client";

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onIdTokenChanged,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await credential.user.getIdToken();

  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("Gagal membuat sesi. Coba login ulang.");
  }

  return credential.user;
}

export async function signOut(): Promise<void> {
  await fetch("/api/auth/session", { method: "DELETE" });
  await firebaseSignOut(auth);
}

/**
 * Dipanggil sekali di provider root — menjaga session cookie tetap sinkron
 * kalau Firebase merefresh ID token di background (default tiap ~1 jam).
 */
export function subscribeToIdTokenChanges(callback: (user: User | null) => void) {
  return onIdTokenChanged(auth, async (user) => {
    if (user) {
      const idToken = await user.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }).catch(() => {
        // Gagal refresh sesi di background tidak perlu mengganggu UX —
        // proxy.ts akan redirect ke /login saat cookie benar-benar kedaluwarsa.
      });
    }
    callback(user);
  });
}
