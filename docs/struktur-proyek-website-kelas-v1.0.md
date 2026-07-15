# Struktur Proyek — Website Kelas v1.0

> Dokumen ini merancang struktur folder & arsitektur proyek sebelum implementasi dimulai, mengacu pada spesifikasi teknis v1.0 (Next.js App Router + TypeScript, Tailwind CSS, **Firebase** — Authentication, Cloud Firestore, Storage, Security Rules —, Clean Architecture ringan, Feature-Based).

---

## 1. Folder Structure

### 1.1 Catatan Penyesuaian dari Usulan Awal

Sebelum masuk ke tree, ada 3 penyesuaian dari daftar folder yang diusulkan, supaya strukturnya tidak ambigu:

| Usulan Awal | Penyesuaian | Alasan |
|---|---|---|
| `components` dan `shared` sebagai dua folder terpisah | Digabung: `components`, `hooks`, `services`, `utils`, `types` lintas-fitur ditaruh **di dalam** `shared/` | Kalau dua-duanya jadi folder root sejajar, akan ambigu — komponen reusable ditaruh di `components/` atau `shared/`? Menyatukan jadi satu payung `shared/` menghindari kebingungan "ini reusable, taruh di mana" di kemudian hari |
| `layouts` sebagai folder root terpisah | Layout UI (Sidebar, Header, DashboardShell) ditaruh di `shared/components/layout/`, sedangkan `app/**/layout.tsx` tetap jadi mekanisme routing-layout bawaan Next.js | Next.js App Router sudah punya konsep `layout.tsx` sendiri untuk routing. Kalau ada folder `layouts/` terpisah juga, dua konsep dengan nama mirip ini gampang membingungkan tim yang baru bergabung |
| `middleware` sebagai folder | Tetap ada satu file entry point **tunggal** di root — bernama **`proxy.ts`** (bukan `middleware.ts` lagi, lihat catatan update di bawah), folder `middleware/` hanya berisi fungsi-fungsi kecil (`checkAuth`, `checkRole`) yang **dipanggil** dari file itu | Next.js hanya membaca satu file entry point di root project untuk mekanisme ini — tidak bisa diganti jadi banyak file otomatis. Folder `middleware/` di sini berfungsi sebagai tempat "potongan logika", bukan pengganti mekanismenya |

> **Update (Project Setup, Juli 2026):** Next.js 16 mengganti nama konvensi file ini dari `middleware.ts` menjadi **`proxy.ts`**, untuk memperjelas bahwa file ini menjaga batas jaringan (network boundary), bukan sekadar "middleware" generik. Fungsinya sama persis — satu file di root yang dijalankan sebelum request diproses. Seluruh referensi `middleware.ts` di dokumen ini disesuaikan menjadi `proxy.ts`.

### 1.2 Struktur Folder yang Disarankan

```
website-kelas/
├── app/                        # Routing Next.js (App Router)
│   ├── (public)/                # Route group: halaman publik
│   │   ├── page.tsx              # Landing Page
│   │   ├── profil/
│   │   └── pengumuman/
│   ├── (member)/                # Route group: butuh login
│   │   ├── layout.tsx             # Layout khusus area member
│   │   ├── jadwal/
│   │   ├── piket/
│   │   ├── galeri/
│   │   ├── dokumentasi/
│   │   └── kas/
│   ├── (admin)/                  # Route group: khusus admin
│   │   ├── layout.tsx
│   │   └── dashboard/
│   ├── api/                      # Route handlers (API layer)
│   └── layout.tsx                # Root layout
│
├── features/                   # Modul per domain (feature-based)
│   ├── anggota/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── jadwal/
│   ├── piket/
│   ├── pengumuman/
│   ├── galeri/
│   ├── dokumentasi/
│   ├── kas/
│   └── auth/
│
├── shared/                     # Semua yang lintas-fitur
│   ├── components/
│   │   ├── ui/                    # Button, Input, Modal, Card, dst.
│   │   └── layout/                 # Sidebar, Header, Footer, DashboardShell
│   ├── hooks/                     # useDebounce, useMediaQuery, dst.
│   ├── services/                  # authService, storageService (dipakai >1 fitur)
│   └── types/                     # Role, ApiResponse<T>, dst.
│
├── middleware/                  # Potongan logika middleware
│   ├── checkAuth.ts
│   └── checkRole.ts
├── proxy.ts                     # Entry point tunggal (wajib di root, konvensi Next.js 16)
│
├── config/                     # Konfigurasi aplikasi
│   ├── site.config.ts             # Nama situs, deskripsi, dsb.
│   ├── nav.config.ts              # Daftar menu navigasi
│   └── roles.config.ts            # Definisi role & permission
│
├── lib/                         # Wrapper/inisialisasi library eksternal
│   └── firebase/
│       ├── client.ts               # Firebase Client SDK init (browser)
│       └── admin.ts                 # Firebase Admin SDK init (server-only, pegang service account)
│
├── types/                       # Tipe global murni (bukan milik satu fitur/lib tertentu)
│   └── firestore.ts                # Tipe dokumen tiap koleksi Firestore (ditulis manual, tidak ada generator schema seperti di SQL)
│
├── utils/                       # Pure helper function, tanpa dependency eksternal
│   ├── formatDate.ts
│   ├── formatCurrency.ts
│   └── validators.ts
│
├── assets/                      # Aset yang di-import ke kode (diproses build tool)
│   ├── icons/
│   └── illustrations/
│
├── public/                      # Aset statis, diakses langsung via URL
│   ├── favicon.ico
│   └── images/
│
├── docs/                        # Dokumentasi proyek
│   ├── spesifikasi-teknis.md
│   ├── struktur-proyek.md
│   └── database-schema.md
│
├── next.config.ts
├── postcss.config.mjs           # Konfigurasi Tailwind v4
├── tsconfig.json
└── .env.local
```

> **Update (Project Setup, Juli 2026):** Tailwind CSS v4 (versi yang kini jadi default di `create-next-app`) tidak lagi memakai `tailwind.config.ts` — konfigurasi tema (warna, radius, dsb.) ditulis langsung di `src/app/globals.css` lewat directive `@theme`. File `postcss.config.mjs` hanya mendaftarkan plugin `@tailwindcss/postcss`. Ini murni penyesuaian versi tooling, bukan perubahan keputusan desain — token warna & radius yang sudah ditetapkan di dokumen UI/UX Planning tetap sama, hanya beda tempat penulisannya.

### 1.3 Penjelasan per Folder

| Folder | Fungsi | Isi | Alasan Dibuat |
|---|---|---|---|
| **app/** | Routing & entry point halaman | `page.tsx`, `layout.tsx`, route groups, API route handlers | Wajib ada di Next.js App Router; jadi satu-satunya tempat yang menentukan URL |
| **features/** | Modul bisnis per domain | Komponen, hook, service, tipe **khusus** satu fitur (mis. `kas/`) | Supaya setiap fitur "membawa dirinya sendiri" — kalau v1.1 menambah fitur baru, cukup tambah satu folder tanpa menyentuh fitur lain |
| **shared/** | Semua yang dipakai **lintas fitur** | `components/ui`, `components/layout`, `hooks`, `services`, `types` bersama | Menghindari duplikasi kode antar fitur; jadi tempat tunggal untuk "hal generik" |
| **middleware/** | Potongan logika pengecekan sebelum request diproses | Fungsi kecil seperti `checkAuth.ts`, `checkRole.ts` | Memisahkan logika dari file `proxy.ts` yang idealnya tetap tipis/ringkas |
| **config/** | Konfigurasi tingkat aplikasi | Nama situs, daftar menu, mapping role→permission | Supaya perubahan non-teknis (misal ganti nama menu) tidak perlu menyentuh logika |
| **lib/** | Inisialisasi/wrapper SDK pihak ketiga | Firebase Client SDK (`client.ts`) & Firebase Admin SDK (`admin.ts`) | Memisahkan "cara bicara dengan Firebase" dari logika bisnis; `admin.ts` juga jadi satu-satunya tempat yang boleh memegang service account key |
| **types/** | Tipe data global | Tipe dokumen tiap koleksi Firestore, tipe `ApiResponse` | Dipakai di banyak tempat lintas fitur maupun lintas layer. Karena Firestore tidak punya schema bawaan seperti SQL, tipe ini **ditulis & dijaga manual** |
| **utils/** | Fungsi murni tanpa efek samping | Format tanggal, format rupiah, validator sederhana | Dipisah dari `lib/` karena tidak bergantung pada library eksternal apa pun — murni logika JavaScript/TypeScript |
| **assets/** | Aset yang diproses build tool | Ikon custom, ilustrasi yang di-`import` di komponen | Berbeda dari `public/`: dioptimasi oleh bundler saat build |
| **public/** | Aset statis apa adanya | Favicon, gambar yang direferensikan lewat URL langsung | Next.js mengekspos folder ini apa adanya tanpa proses build |
| **docs/** | Dokumentasi proyek | Spesifikasi teknis, struktur proyek, desain database Firestore | Supaya knowledge proyek tidak hanya ada di kepala satu orang |

---

## 2. Project Architecture

Alur data mengikuti Clean Architecture ringan yang sudah disepakati di spesifikasi teknis, dipetakan ke folder di atas:

```
[ USER ]
   │  interaksi (klik, isi form, buka halaman)
   ▼
[ UI LAYER ]                         → app/**/page.tsx, features/*/components, shared/components
   │  memanggil hook / event handler
   ▼
[ APPLICATION LAYER (Business Logic) ] → features/*/hooks, shared/hooks
   │  memanggil fungsi service
   ▼
[ INFRASTRUCTURE LAYER (Data Access) ]  → features/*/services, shared/services, lib/firebase
   │  query / mutation via Client SDK (atau Admin SDK untuk operasi privileged)
   ▼
[ DATABASE ]                          → Cloud Firestore (+ Firebase Storage, dijaga Security Rules)
   │  hasil query
   ▼
(naik kembali ke Application Layer → UI Layer → ditampilkan ke User)
```

**Aturan arah ketergantungan (dependency rule):**
- UI Layer **boleh** memanggil Application Layer, tapi **tidak boleh** langsung memanggil Infrastructure Layer (langsung `import` Firebase client di komponen).
- Application Layer **tidak boleh** tahu detail UI (tidak mengandung JSX).
- Infrastructure Layer **tidak boleh** mengandung aturan bisnis (misal: "saldo tidak boleh negatif" bukan tempatnya di sini, itu tugas Application/Domain).
- Database sebagai lapisan terluar tetap dijaga dengan Firebase Security Rules, jadi keamanan tidak 100% bergantung pada disiplin lapisan di atasnya.

---

## 3. Naming Convention

| Elemen | Standar | Contoh |
|---|---|---|
| Folder | `kebab-case` | `data-anggota/`, `jadwal-piket/` |
| File komponen | `PascalCase.tsx` | `AnggotaCard.tsx`, `KasSummaryTable.tsx` |
| File non-komponen (hook, util, service) | `camelCase.ts` | `useAuth.ts`, `formatCurrency.ts`, `anggotaService.ts` |
| Nama komponen | `PascalCase`, sama dengan nama file | `export function AnggotaCard()` |
| Nama fungsi | `camelCase`, diawali kata kerja | `getAnggotaById`, `calculateSaldoKas` |
| Nama variabel | `camelCase`, deskriptif; boolean diawali `is/has/should` | `isLoading`, `hasPermission`, `totalSaldo` |
| Konstanta tetap | `UPPER_SNAKE_CASE` | `MAX_UPLOAD_SIZE`, `DEFAULT_PAGE_SIZE` |
| API Route | `kebab-case`, kata benda jamak (REST-style) | `/api/anggota`, `/api/kas/transaksi` |
| Koleksi Firestore | `camelCase`, kata benda jamak | `anggota`, `jadwalPelajaran`, `pengumuman`, `users` |
| Environment variable | `UPPER_SNAKE_CASE`, prefix jelas | `NEXT_PUBLIC_FIREBASE_API_KEY` (boleh diakses browser), `FIREBASE_SERVICE_ACCOUNT_KEY` (hanya server) |

Catatan khusus: prefix `NEXT_PUBLIC_` **wajib** dipakai Next.js untuk env variable apa pun yang perlu diakses dari sisi browser — tanpa prefix ini, variabel tidak akan ter-bundle ke client dan akan bernilai `undefined` di frontend.

---

## 4. Best Practice

| Situasi | Aturan |
|---|---|
| **Kapan membuat folder fitur baru** | Ketika ada entitas/domain bisnis baru dengan data model sendiri (misalnya nanti ada fitur "Ujian" atau "Absensi") — bukan untuk variasi kecil dari fitur yang sudah ada |
| **Kapan membuat reusable component** | Ketika pola UI yang sama dipakai di ≥2 tempat, atau sejak awal sudah jelas akan dipakai ulang (tombol, modal, form field, card) → taruh di `shared/components` |
| **Kapan memakai helper/utils** | Untuk fungsi murni: input → output, tanpa efek samping, tanpa panggilan ke API/database (format tanggal, format rupiah, validasi regex) |
| **Kapan memakai service** | Setiap kali kode perlu "bicara" ke Firestore/Firebase Storage atau API eksternal — tidak boleh langsung dipanggil dari komponen UI |
| **Kapan memakai custom hook** | Ketika logika state/efek React dipakai ulang di ≥2 komponen, atau ketika logika kompleks perlu dipisah dari JSX supaya komponen tetap mudah dibaca (misalnya `useKasSummary`, `useRolePermission`) |
| **Kapan sesuatu naik dari `features/*` ke `shared/`** | Begitu ada logika/komponen yang sama dibutuhkan oleh 2 fitur atau lebih — jangan duplikasi, pindahkan ke `shared/` |
| **Kapan menambah koleksi baru vs field baru** | Koleksi baru untuk entitas baru; field baru kalau memang atribut dari entitas yang sudah ada — hindari "koleksi serba guna" yang menyimpan banyak jenis dokumen berbeda dalam satu koleksi (lihat dokumen desain database untuk detail struktur tiap koleksi) |

---

## 5. Kritik & Alternatif yang Lebih Profesional

1. **Pemisahan `components` vs `shared` di usulan awal berpotensi ambigu.** Sudah diselesaikan di atas dengan menyatukan keduanya — tapi ini layak ditegaskan lagi: aturan mainnya, kalau ragu taruh di fitur dulu (`features/*/components`), baru "naikkan" ke `shared/components` begitu benar-benar dipakai fitur lain. Jangan taruh di `shared/` sejak awal hanya karena "mungkin nanti dipakai lagi" — itu premature abstraction.

2. **Folder `middleware/` sebagai folder murni kurang cocok dengan cara kerja Next.js.** Sudah disesuaikan: satu file `proxy.ts` (dulu bernama `middleware.ts`, berganti nama di Next.js 16) tetap jadi satu-satunya entry point di root (ini keharusan teknis, bukan pilihan gaya), folder `middleware/` hanya menyimpan fungsi pendukungnya. Tim perlu tahu ini agar tidak salah ekspektasi seolah-olah bisa ada banyak file terpisah yang otomatis terbaca Next.js.

3. **`layouts/` sebagai folder terpisah berisiko tumpang tindih konsep dengan `layout.tsx` bawaan App Router.** Solusinya: komponen visual layout (Sidebar, Header, Footer, DashboardShell) tinggal di `shared/components/layout/`, sedangkan file `layout.tsx` di dalam `app/` hanya "merangkai" komponen-komponen itu sesuai route group. Ini menghindari dua hal bernama mirip yang sebenarnya beda level abstraksi.

4. **Granularitas modul `features/` perlu dijaga agar tidak terlalu besar.** Modul `kas/` misalnya berpotensi membengkak (transaksi, laporan, kategori pengeluaran) — begitu satu folder fitur mulai punya banyak sub-konsep yang masing-masing punya data model sendiri, itu sinyal untuk dipecah lagi secara internal (misal `kas/transaksi/`, `kas/laporan/`), bukan langsung jadi fitur root baru.

5. **Perlu aturan eksplisit soal "server-only" vs "client-safe" code**, khususnya karena `lib/firebase/admin.ts` memegang **service account key** yang sangat sensitif — kalau bocor, siapa pun bisa memanggil Admin SDK dan melewati Security Rules sepenuhnya (Admin SDK secara desain memang bisa bypass Security Rules). Sebaiknya ditegaskan sejak struktur awal: file di `lib/firebase/admin.ts` **tidak boleh** di-`import` dari komponen yang berjalan di browser — ini bukan sekadar konvensi penamaan, tapi aturan keamanan yang harus dijaga ketat sejak hari pertama.

6. **`docs/` sebaiknya juga menyimpan Architecture Decision Record (ADR) sederhana** — catatan singkat kenapa suatu keputusan teknis diambil (misalnya kenapa akhirnya pindah dari Supabase ke Firebase, dan kenapa hosting tetap di Vercel bukan Firebase App Hosting). Ini akan sangat membantu kalau di v1.1/v2.0 ada kontributor baru yang bertanya "kenapa dulu dipilih begini".

7. **Karena Firestore tidak punya schema bawaan**, disiplin menjaga `types/firestore.ts` tetap sinkron dengan struktur dokumen yang sebenarnya jadi jauh lebih penting dibanding saat memakai database SQL — tidak ada mekanisme otomatis yang akan menegur kalau field di kode dan di Firestore mulai berbeda. Detail struktur tiap koleksi ada di dokumen desain database.
