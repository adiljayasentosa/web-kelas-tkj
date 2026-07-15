/**
 * Inisialisasi Firebase Client SDK — dipakai di komponen browser.
 * Kredensial di sini AMAN diekspos ke publik (bukan rahasia),
 * karena akses data sesungguhnya tetap dijaga oleh Firebase Security Rules.
 *
 * Belum ada logika fitur di sini — hanya konfigurasi project sesuai
 * tahap Project Setup (lihat docs/desain-database-website-kelas-v1.0.md
 * untuk struktur koleksi yang akan dipakai nanti).
 */
import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Mencegah re-inisialisasi saat Next.js melakukan hot reload di development.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
