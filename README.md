# Website Kelas

Website resmi kelas — profil kelas, jadwal, piket, pengumuman, galeri, dokumentasi, dan kas kelas.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/) — Authentication, Cloud Firestore, Storage
- Deploy: [Vercel](https://vercel.com/)

## Menjalankan Proyek Secara Lokal

1. Clone repository ini, lalu install dependency:
   ```
   npm install
   ```
2. Salin `.env.example` menjadi `.env.local`, lalu isi dengan kredensial Firebase project kamu sendiri (lihat komentar di dalam file untuk tahu dari mana mengambil tiap nilai).
3. Jalankan development server:
   ```
   npm run dev
   ```
4. Buka [http://localhost:3000](http://localhost:3000).

## Struktur Proyek

Lihat penjelasan lengkap di [`docs/struktur-proyek-website-kelas-v1.0.md`](./docs/struktur-proyek-website-kelas-v1.0.md).

Ringkas:
- `src/app/` — routing (Next.js App Router)
- `src/features/` — modul per domain (anggota, jadwal, piket, pengumuman, galeri, dokumentasi, kas, auth)
- `src/shared/` — komponen, hook, service, tipe yang dipakai lintas-fitur
- `src/lib/firebase/` — inisialisasi Firebase Client SDK & Admin SDK
- `docs/` — seluruh dokumen perencanaan proyek (spesifikasi teknis, arsitektur, database, UI/UX)

## Dokumentasi Proyek

Seluruh keputusan desain & arsitektur proyek ini didokumentasikan di folder [`docs/`](./docs):

- `spesifikasi-teknis-website-kelas-v1.0.md`
- `struktur-proyek-website-kelas-v1.0.md`
- `desain-database-website-kelas-v1.0.md`
- `ui-ux-planning-website-kelas-v1.0.md`
- `project-setup-website-kelas-v1.0.md`

## Script yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server (Turbopack) |
| `npm run build` | Build production |
| `npm run start` | Menjalankan hasil build production |
| `npm run lint` | Menjalankan ESLint |
| `npm run format` | Merapikan format kode dengan Prettier |
| `npm run format:check` | Mengecek format kode tanpa mengubah file |

## Lisensi

MIT — lihat [LICENSE](./LICENSE).
