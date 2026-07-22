# Project Setup — Website Kelas v1.0

> Dokumen ini menjelaskan fondasi proyek yang sudah disiapkan (lihat paket `website-kelas-project-setup.zip` yang menyertai dokumen ini). Tidak ada fitur, halaman, atau data yang dibuat — murni konfigurasi proyek.

---

## 0. Catatan Penting Sebelum Mulai

Sebelum menyusun setup ini, dilakukan pengecekan referensi terkini karena beberapa hal di ekosistem Next.js/Tailwind sudah berubah sejak dokumen sebelumnya ditulis. **Dua penyesuaian teknis** (bukan perubahan keputusan arsitektur) sudah diterapkan ke dokumen `struktur-proyek-website-kelas-v1.0.md`, dengan alasan yang jelas:

| Yang Berubah | Sebelumnya | Sekarang | Alasan |
|---|---|---|---|
| Entry point pengecekan request | `middleware.ts` | **`proxy.ts`** | Next.js 16 (rilis Oktober 2025, versi stabil per Juli 2026 adalah 16.2.x) mengganti nama konvensi ini secara resmi untuk memperjelas bahwa file ini menjaga batas jaringan. Fungsinya identik. |
| Konfigurasi Tailwind | `tailwind.config.ts` | **`@theme` di `globals.css`** + `postcss.config.mjs` | Tailwind CSS v4 (kini default di `create-next-app`) pindah ke konfigurasi berbasis CSS, tidak lagi memakai file config JavaScript/TypeScript. |

Tidak ada keputusan desain (warna, radius, dsb.) yang berubah — hanya **tempat penulisannya**.

---

## 1. Membuat Project Next.js

Perintah yang dipakai sebagai acuan (dijalankan di komputer kamu sendiri, karena butuh koneksi internet untuk mengunduh package):

```
npx create-next-app@latest website-kelas --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

| Flag | Alasan |
|---|---|
| `--typescript` | Sudah disepakati sejak spesifikasi teknis — type-safety mengurangi bug sejak development |
| `--tailwind` | Sesuai tech stack; otomatis memasang Tailwind v4 |
| `--eslint` | Linting bawaan Next.js, mendeteksi masalah umum React/Next.js sejak dini |
| `--app` | App Router — dibutuhkan untuk Server Components, Server Actions (dipakai memanggil Firebase Admin SDK), dan route groups `(public)`/`(member)` + folder biasa `admin` yang sudah dirancang (lihat catatan perbaikan di struktur-proyek-website-kelas-v1.0.md §1.2 — `admin` sengaja BUKAN route group, supaya URL berprefix `/admin/*`) |
| `--src-dir` | Memisahkan kode aplikasi (`src/`) dari file konfigurasi root — konsisten dengan struktur proyek yang sudah disepakati |
| `--import-alias "@/*"` | Alias pendek untuk import, mengarah ke `src/*` — dipakai konsisten di semua dokumen sebelumnya |

Karena sandbox ini tidak berjaringan, seluruh file yang biasanya dihasilkan perintah di atas **sudah dibuat manual** dengan isi yang sama seperti hasil `create-next-app` + penyesuaian proyek, dan disertakan di paket zip.

---

## 2. Install Dependency

Berikut daftar lengkap dependency yang sudah dituliskan di `package.json`, dikelompokkan sesuai permintaan:

| Kelompok | Package | Alasan |
|---|---|---|
| **Core** | `next`, `react`, `react-dom` | Fondasi framework, sudah diputuskan sejak spesifikasi teknis |
| **Firebase** | `firebase` | Client SDK — Auth, Firestore, Storage dari browser |
| | `firebase-admin` | Admin SDK — dipakai di Server Action untuk operasi privileged (mis. buat akun anggota) |
| **UI** | `lucide-react` | Ikon, sudah dipilih di Design System |
| | `class-variance-authority`, `clsx`, `tailwind-merge` | Dipakai shadcn/ui untuk mengelola variant komponen & penggabungan className |
| **Form** | `react-hook-form` | Form performant, sudah dipilih di spesifikasi teknis |
| | `@hookform/resolvers` | Menjembatani React Hook Form dengan skema validasi Zod |
| **Validation** | `zod` | Validasi skema type-safe |
| **State Management** | `zustand` | State ringan lintas komponen (mis. status sidebar/dark mode) |
| **Data Fetching** | `@tanstack/react-query` | Caching & state loading/error saat membaca data dari Firestore |
| **Utility** | *(sengaja tidak ada package tambahan)* | Format tanggal & rupiah cukup pakai `Intl.DateTimeFormat`/`Intl.NumberFormat` bawaan JavaScript — menghindari dependency ekstra untuk hal yang sebenarnya sudah tersedia native, sejalan dengan prinsip performa |
| **Development** | `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | Tipe & compiler TypeScript |
| | `eslint`, `eslint-config-next`, `@eslint/eslintrc` | Linting, memakai flat config (standar ESLint 9 di Next.js 16) |
| | `prettier`, `prettier-plugin-tailwindcss` | Format kode konsisten; plugin tambahan otomatis mengurutkan class Tailwind |
| | `tailwindcss`, `@tailwindcss/postcss` | Engine Tailwind v4 + plugin PostCSS-nya |
| **(tambahan, keamanan)** | `server-only` | Bukan dari daftar kelompok awal, tapi perlu ditambahkan: paket kecil ini membuat **build gagal** kalau `lib/firebase/admin.ts` sampai ter-import dari kode client — pagar keamanan di level build, bukan cuma konvensi penamaan seperti dibahas di kritik struktur proyek |

Install dengan:
```
npm install
```

---

## 3. Konfigurasi Firebase

Sesuai instruksi, **tidak ada data atau koleksi** yang dibuat — hanya struktur inisialisasi:

- **`src/lib/firebase/client.ts`** — inisialisasi Firebase Client SDK (Auth, Firestore, Storage) yang aman dipakai di browser. Konfigurasinya dibaca dari environment variable `NEXT_PUBLIC_*`.
- **`src/lib/firebase/admin.ts`** — inisialisasi Firebase Admin SDK, **hanya boleh dipakai di server**. Diberi `import "server-only"` di baris pertama sebagai pagar teknis.

Untuk benar-benar menyalakan ketiga layanan, langkah manual di **Firebase Console** (di luar kode) yang perlu dilakukan:
1. Buat project baru di [console.firebase.google.com](https://console.firebase.google.com).
2. Aktifkan **Authentication** → pilih provider **Email/Password**.
3. Aktifkan **Cloud Firestore** → pilih mode production (Security Rules diterapkan nanti di tahap berikutnya, bukan tahap ini).
4. Aktifkan **Storage**.
5. Buka **Project Settings > General**, salin config Web App ke `.env.local`.
6. Buka **Project Settings > Service Accounts**, generate private key baru untuk mengisi `FIREBASE_SERVICE_ACCOUNT_KEY`.

---

## 4. Konfigurasi Environment Variable

Seluruhnya sudah didaftarkan di `.env.example` (nilai kosong, tidak ada kredensial asli):

| Variabel | Kegunaan |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Kunci API Firebase Web App |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Domain untuk Firebase Authentication |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID project Firebase |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Nama bucket Firebase Storage |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ID pengirim (dipakai internal SDK Firebase) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ID unik Web App di Firebase |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | JSON service account untuk Admin SDK — **hanya server**, tanpa prefix `NEXT_PUBLIC_` supaya tidak ter-bundle ke browser |

Cara pakai: salin `.env.example` menjadi `.env.local` (file ini sudah masuk `.gitignore`, tidak akan ter-commit), lalu isi dengan nilai asli dari Firebase Console.

---

## 5. Konfigurasi shadcn/ui

`components.json` sudah disiapkan, disesuaikan dengan struktur folder `shared/` yang sudah disepakati (bukan default `components/` di root):

| Opsi | Nilai | Alasan |
|---|---|---|
| `style` | `new-york` | Style default terbaru shadcn/ui (style `default` sudah deprecated) |
| `baseColor` | `zinc` | Sesuai Design System — neutral palette |
| `cssVariables` | `true` | Token warna (termasuk primary emerald & semantic colors) didefinisikan sebagai CSS variable, mendukung dark mode |
| `aliases.components` | `@/shared/components` | Diarahkan ke `shared/`, bukan default `components/` di root — konsisten dengan struktur proyek |
| `aliases.ui` | `@/shared/components/ui` | idem |
| `aliases.hooks` | `@/shared/hooks` | idem |
| `iconLibrary` | `lucide` | Sudah dipilih sejak spesifikasi teknis |

Setelah `npm install`, komponen ditambahkan satu per satu sesuai kebutuhan lewat CLI, misalnya:
```
npx shadcn@latest add button card dialog sheet table badge alert sonner form input
```
Sengaja **tidak semua komponen dipasang sekaligus** di tahap ini — itu masih bagian dari "membuat fitur", di luar cakupan Project Setup.

---

## 6. Konfigurasi Project

| Aspek | Status | Catatan |
|---|---|---|
| **Path Alias** | ✅ `@/*` → `src/*` di `tsconfig.json` | |
| **Folder Structure** | ✅ Seluruh folder dari `struktur-proyek-website-kelas-v1.0.md` sudah dibuat (kosong, ber-`.gitkeep`) | |
| **ESLint** | ✅ `eslint.config.mjs`, flat config, extend `next/core-web-vitals` + `next/typescript` | |
| **Prettier** | ✅ `.prettierrc.json` + `prettier-plugin-tailwindcss` (otomatis mengurutkan class Tailwind) | |
| **TypeScript** | ✅ `strict: true` + `noUncheckedIndexedAccess: true` (lebih ketat dari default, mencegah bug akses index array/object yang tidak pasti ada) | |
| **Tailwind** | ✅ `postcss.config.mjs` + token desain di `globals.css` (`@theme`) | Lihat catatan versi v4 di §0 |
| **next.config.ts** | ✅ Konfigurasi `images.remotePatterns` untuk domain `firebasestorage.googleapis.com` | Wajib ada supaya `next/image` bisa memuat foto dari Firebase Storage nanti |

---

## 7. Git

| File | Isi Singkat |
|---|---|
| `.gitignore` | Standar Next.js (`node_modules`, `.next`, dsb.) + tambahan khusus Firebase (`.firebase/`, `firebase-debug.log`) dan Vercel (`.vercel`) |
| `README.md` | Ringkasan proyek, cara menjalankan lokal, struktur folder, daftar dokumen di `docs/`, daftar script |
| `LICENSE` | MIT |

`docs/` di dalam project juga sudah diisi salinan seluruh dokumen perencanaan (spesifikasi teknis, struktur proyek, desain database, UI/UX planning) supaya dokumentasi ikut ter-version-control bersama kode.

---

## 8. Vercel

Proyek ini **siap** di-deploy ke Vercel tanpa konfigurasi build tambahan, karena:
- Next.js terdeteksi otomatis oleh Vercel (tidak perlu `vercel.json`).
- Tidak memakai fitur yang butuh runtime khusus (semua kompatibel dengan Node.js runtime standar Vercel).

**Yang perlu dilakukan manual di dashboard Vercel** (bukan file konfigurasi):
1. Hubungkan repository Git ke project Vercel.
2. Salin seluruh variabel dari `.env.local` ke **Project Settings > Environment Variables** di Vercel — termasuk `FIREBASE_SERVICE_ACCOUNT_KEY` (Vercel mendukung env variable multi-baris untuk JSON service account).
3. Pastikan project Firebase berada di paket **Spark** (gratis) — tidak perlu Blaze, karena hosting tetap di Vercel, bukan Firebase App Hosting (sudah dibahas di kritik spesifikasi teknis).

Tidak ada konfigurasi tambahan lain yang diperlukan untuk v1.0.

---

## 9. Final Checklist — Project Setup

- [ ] `npm install` berjalan tanpa error
- [ ] `npm run dev` menampilkan halaman placeholder di `localhost:3000`
- [ ] `npm run lint` tidak menunjukkan error
- [ ] `npm run format:check` lolos (kode sudah sesuai format Prettier)
- [ ] Firebase project sudah dibuat, Authentication (Email/Password), Firestore, dan Storage sudah diaktifkan
- [ ] `.env.local` sudah diisi dari kredensial Firebase asli (dan **tidak** ter-commit ke Git — cek `git status`)
- [ ] `npx shadcn@latest init` dikonfirmasi memakai `components.json` yang sudah ada (bukan generate baru)
- [ ] Repository Git sudah diinisialisasi (`git init`, commit pertama)
- [ ] Project sudah terhubung ke Vercel, environment variable sudah disalin ke dashboard Vercel
- [ ] Deploy pertama ke Vercel berhasil menampilkan halaman placeholder yang sama seperti di lokal

Kalau semua poin di atas sudah tercentang, proyek **siap masuk ke tahap Development fitur pertama** (disarankan mulai dari modul `auth` — login & proteksi role — karena hampir semua fitur lain bergantung padanya).
