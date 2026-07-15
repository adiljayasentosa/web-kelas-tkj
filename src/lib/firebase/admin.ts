/**
 * Inisialisasi Firebase Admin SDK — HANYA untuk kode sisi server
 * (Server Action / Route Handler), misalnya membuat akun anggota baru.
 *
 * `import "server-only"` di baris pertama akan membuat build GAGAL kalau
 * file ini sampai ter-import dari komponen client — pagar keamanan di
 * level build, bukan cuma konvensi penamaan. Lihat kritik di
 * docs/struktur-proyek-website-kelas-v1.0.md §5 poin 5.
 *
 * Belum ada logika fitur di sini — hanya konfigurasi project.
 */
import "server-only";
import { cert, getApps, initializeApp, getApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getAdminApp(): App {
  if (getApps().length) return getApp();

  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountRaw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY belum di-set. Cek file .env.local (lihat .env.example)."
    );
  }

  const serviceAccount = JSON.parse(serviceAccountRaw);

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminApp = getAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
