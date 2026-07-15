# Spesifikasi Teknis — Website Kelas v1.0

> Dokumen ini menjabarkan spesifikasi teknis untuk pengembangan Website Kelas v1.0, berdasarkan roadmap yang telah disepakati. Prinsip yang dipegang: **Clean Architecture, Mobile First, Responsive, Maintainable, Modular, Secure, Fast**, dengan teknologi yang gratis, stabil, dan mudah dipelajari.

---

## 1. Functional Requirements (Kebutuhan Fungsional)

### 1.1 Aktor / Role Pengguna

| Role | Deskripsi |
|---|---|
| **Guest (Pengunjung)** | Belum login. Bisa melihat Landing Page, Profil Kelas, Pengumuman publik, Galeri publik. |
| **Anggota (Member)** | Siswa yang sudah login. Bisa melihat semua data kelas, jadwal, kas, dokumentasi. |
| **Admin (Pengurus Kelas)** | Ketua/Sekretaris/Bendahara kelas. Bisa mengelola (CRUD) seluruh data. |
| **Super Admin (Wali Kelas/Guru)** *(opsional v1.0, wajib mulai v1.1)* | Kontrol penuh, termasuk kelola akun Admin. |

### 1.2 Kebutuhan Fungsional per Modul

| Modul | Fungsi Utama | Diakses Oleh |
|---|---|---|
| **Landing Page** | Menampilkan hero section, ringkasan info kelas, akses cepat ke pengumuman terbaru | Semua |
| **Profil Kelas** | Menampilkan visi/misi, wali kelas, struktur organisasi kelas | Semua |
| **Data Anggota** | CRUD data siswa (nama, NIS, jabatan, kontak, foto) | Admin (CRUD), Anggota (lihat) |
| **Jadwal Pelajaran** | CRUD & tampilkan jadwal per hari/jam | Admin (CRUD), Semua (lihat) |
| **Jadwal Piket** | CRUD & tampilkan jadwal piket per kelompok/hari | Admin (CRUD), Semua (lihat) |
| **Pengumuman** | CRUD pengumuman dengan kategori & tanggal | Admin (CRUD), Semua (lihat) |
| **Galeri** | Upload & tampilkan foto kegiatan | Admin (upload), Semua (lihat) |
| **Dokumentasi** | Upload & kelola dokumen (materi, surat, dsb) | Admin (CRUD), Anggota (lihat/unduh) |
| **Login & Authentication** | Registrasi (oleh admin), login, reset password | Semua (login), Admin (kelola akun) |
| **Dashboard Admin** | Ringkasan aktivitas kelas, akses cepat ke semua modul CRUD | Admin |
| **Manajemen Kas Kelas** | Catat pemasukan/pengeluaran, lihat saldo & riwayat transaksi | Admin (CRUD), Anggota (lihat saldo & riwayat) |
| **Responsive Design** | Tampilan optimal di mobile, tablet, desktop | Semua |
| **Dark Mode** | Toggle tema terang/gelap, tersimpan sesuai preferensi user | Semua |

---

## 2. Non-Functional Requirements (Kebutuhan Non-Fungsional)

| Kategori | Kebutuhan | Target/Pendekatan |
|---|---|---|
| **Performance** | Waktu muat halaman cepat | Target First Contentful Paint < 2 detik; gunakan SSG/ISR untuk halaman statis, lazy-load gambar |
| **Security** | Data anggota & kas terlindungi | Password ditangani Firebase Authentication, **Firebase Security Rules** di Firestore & Storage sebagai lapisan proteksi utama, validasi input di client & server, HTTPS wajib |
| **Scalability** | Mudah menambah fitur di v1.1/v1.2 tanpa refactor besar | Struktur modular per fitur (feature-based folder) |
| **Usability** | Mudah dipakai anggota kelas yang awam teknologi | UI sederhana, navigasi jelas, mobile-first |
| **Maintainability** | Kode mudah dipahami & dilanjutkan orang lain | TypeScript, penamaan konsisten, dokumentasi kode |
| **Availability** | Website bisa diakses kapan saja | Hosting dengan uptime tinggi (Vercel), monitoring dasar |
| **Portability** | Berjalan baik di berbagai browser modern | Uji di Chrome, Firefox, Safari, Edge |
| **Reliability (Data Kas)** | Data transaksi kas tidak boleh korup/hilang | Transaksi kas bersifat **append-only** (tidak bisa diubah/dihapus lewat Security Rules) + Firestore Transaction saat penulisan, karena Firestore (NoSQL) tidak punya constraint relasional bawaan seperti database SQL |

---

## 3. Tech Stack & Alasan Pemilihan

| Layer | Teknologi | Alasan |
|---|---|---|
| **Frontend Framework** | **Next.js (App Router) + TypeScript** | Gratis, komunitas besar, dokumentasi lengkap, mendukung SSR/SSG (bagus untuk Landing Page & SEO), file-based routing yang mudah dipelajari, satu framework untuk frontend & API layer |
| **Styling** | **Tailwind CSS** | Utility-first sehingga cepat membangun UI responsive, mendukung dark mode secara native, ukuran akhir kecil (bagus untuk performance) |
| **Backend / API** | **Next.js Server Actions/API Routes** (untuk operasi privileged) + akses langsung **Firebase Client SDK** dari frontend untuk operasi CRUD biasa | Sebagian besar baca/tulis data tidak perlu lewat API custom — cukup Client SDK + Security Rules. Server Actions tetap dipakai untuk operasi sensitif (mis. membuat akun anggota baru) via **Firebase Admin SDK**, dijalankan di server Next.js (bukan Cloud Functions), sehingga tidak butuh paket berbayar Firebase |
| **Database** | **Cloud Firestore** | NoSQL document-based bawaan Firebase, real-time by default, terintegrasi penuh dengan Firebase Auth & Security Rules |
| **Autentikasi** | **Firebase Authentication** | Gratis hingga 50.000 pengguna aktif bulanan, terintegrasi native dengan Firestore Security Rules & Custom Claims untuk role |
| **File Storage** | **Firebase Storage (Cloud Storage for Firebase)** | Satu ekosistem dengan Auth & Firestore, dilindungi Security Rules yang sama, cukup untuk kebutuhan galeri & dokumentasi skala kelas |
| **Hosting Frontend** | **Vercel (Hobby/Free Plan)** — tetap dipisah dari Firebase | Next.js tetap di-hosting di Vercel, bukan Firebase App Hosting, karena App Hosting untuk Next.js saat ini mewajibkan project berada di paket **Blaze (pay-as-you-go)**. Dengan hosting di Vercel, project bisa tetap 100% gratis (Spark plan) selama Firebase hanya dipakai untuk Auth/Firestore/Storage lewat Client SDK |

---

## 4. Arsitektur Proyek

Pendekatan **Clean Architecture** diadaptasi secara ringan (tidak berlebihan untuk skala proyek ini) dengan pemisahan tanggung jawab per lapisan:

**a. Presentation Layer (Frontend)**
- Halaman (pages/routes) dan komponen UI (Next.js + Tailwind)
- Hanya bertugas menampilkan data & menangkap interaksi pengguna, tidak berisi logika bisnis langsung

**b. Application Layer (Logic/Use Case)**
- Berisi fungsi-fungsi "use case" per fitur, misalnya "tambahTransaksiKas", "ajukanAnggotaBaru"
- Menjembatani Presentation Layer dengan Data Layer

**c. Domain Layer**
- Definisi tipe data & aturan bisnis inti (misal: aturan saldo kas tidak boleh negatif)
- Tidak bergantung pada framework atau database tertentu

**d. Infrastructure Layer (Data Access)**
- Koneksi ke Firebase: Firestore (query/mutasi), Firebase Storage (upload/unduh file), Firebase Auth (sesi login)
- Untuk operasi biasa: Client SDK dipanggil langsung dari layer ini, diproteksi Security Rules di sisi Firebase
- Untuk operasi privileged (mis. buat akun anggota baru): Firebase Admin SDK dipanggil dari Server Action, bukan dari client
- Satu-satunya lapisan yang "tahu" tentang detail teknis Firebase

**Organisasi folder** akan disusun **feature-based** (per modul: `auth`, `anggota`, `jadwal`, `piket`, `pengumuman`, `galeri`, `dokumentasi`, `kas`), bukan per tipe file — setiap modul membawa komponen, logic, dan tipe datanya sendiri. Ini menjaga proyek tetap modular saat fitur bertambah di v1.1/v1.2.

---

## 5. Library / Framework Pendukung

| Kebutuhan | Library | Alasan |
|---|---|---|
| Validasi form | **Zod** + **React Hook Form** | Validasi skema yang type-safe, form performant, kombinasi ini jadi standar de-facto di ekosistem Next.js |
| Data fetching & caching | **TanStack Query (React Query)** | Menghindari refetch berlebihan, mengelola loading/error state secara konsisten |
| Ikon | **lucide-react** | Ringan, konsisten, mudah dipakai bersama Tailwind |
| Komponen UI dasar | **shadcn/ui** | Komponen accessible siap pakai (dialog, table, dropdown) yang tetap bisa dikustom penuh via Tailwind |
| State ringan (opsional) | **Zustand** | Untuk state UI kecil (misal: status sidebar/dark mode) tanpa boilerplate Redux |

---

## 6. Struktur Autentikasi & Role Permission

**Alur autentikasi:**
1. Akun anggota **dibuat oleh Admin** (bukan self-registration bebas) — dieksekusi lewat Server Action yang memanggil **Firebase Admin SDK** (`createUser`), bukan lewat Client SDK, supaya sesi Admin yang sedang login tidak ikut tergantikan.
2. Login menggunakan email & password melalui **Firebase Authentication** (Client SDK).
3. Saat akun dibuat, Admin sekaligus menetapkan **Custom Claim** `role` (`anggota` / `admin` / `superadmin`) pada akun tersebut lewat Admin SDK.
4. Setelah login, ID Token dari Firebase Auth otomatis membawa Custom Claim `role` ini — dipakai baik di frontend (menentukan tampilan UI) maupun di Security Rules (menentukan hak akses data).
5. Dokumen profil tambahan (nama, NIS, jabatan, foto) tetap disimpan terpisah di koleksi `users` di Firestore, karena Custom Claims hanya cocok untuk data kecil seperti role, bukan seluruh profil.

**Role & hak akses:**

| Role | Hak Akses |
|---|---|
| Anggota | Read-only ke sebagian besar modul; hanya bisa melihat data, tidak bisa mengubah |
| Admin | Full CRUD ke semua modul kecuali kelola akun Admin lain |
| Super Admin | Full CRUD + kelola akun Admin |

**Penerapan teknis:**
- **Firebase Security Rules** di Firestore & Storage — proteksi data dilakukan di level Firebase, bukan cuma di frontend, dengan mengecek `request.auth.token.role` pada setiap request baca/tulis. Ini tetap aman meski ada yang mencoba akses langsung ke Firestore/Storage tanpa lewat aplikasi.
- **Middleware** di Next.js memverifikasi ID Token & membaca Custom Claim `role` sebelum mengizinkan akses ke halaman `/admin/*`.
- Halaman yang butuh proteksi selalu divalidasi ulang lewat Security Rules di sisi Firebase — proteksi di Next.js middleware hanya lapisan kenyamanan UX, **bukan** satu-satunya lapisan keamanan.

---

## 7. Standar Coding

- **TypeScript strict mode** — meminimalkan bug terkait tipe data sejak awal.
- **ESLint + Prettier** dengan konfigurasi seragam — menjaga gaya penulisan kode konsisten antar kontributor.
- **Penamaan:**
  - `PascalCase` untuk komponen React
  - `camelCase` untuk fungsi/variabel
  - `kebab-case` untuk nama file & folder
- **Satu komponen per file**, dikelompokkan per fitur (feature-based), bukan per tipe file.
- **Conventional Commits** untuk pesan commit (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`) — memudahkan tracking histori perubahan.
- **Environment variables** untuk semua kredensial (Firebase config, service account key untuk Admin SDK), tidak pernah disimpan langsung di kode maupun ter-commit ke repository. Service account key **khusus** hanya boleh diakses dari kode sisi server, tidak pernah dari bundle yang dikirim ke browser.
- Setiap fungsi/aturan bisnis yang tidak trivial diberi komentar singkat menjelaskan **mengapa**, bukan sekadar apa yang dilakukan kode tersebut.

---

## 8. Kritik & Catatan Trade-off Teknologi

Beberapa hal yang perlu dipertimbangkan secara sadar sebelum mulai membangun:

1. **Firestore adalah NoSQL — trade-off nyata untuk modul Kas Kelas.** Tidak seperti database relasional, Firestore tidak punya *constraint* atau transaksi lintas-tabel bawaan. Untuk data kas yang butuh akurasi tinggi, ini diakali dengan pola **ledger append-only**: setiap transaksi hanya bisa dibuat, tidak bisa diubah/dihapus lewat Security Rules — kalau ada kesalahan input, dibuat transaksi koreksi baru, bukan mengedit yang lama. Ini menjaga jejak audit tetap utuh meski tanpa constraint database. Detail pola ini dijabarkan di dokumen desain database.
2. **Firebase App Hosting untuk Next.js mewajibkan paket Blaze (pay-as-you-go).** Supaya prinsip "gratis" tetap terjaga, keputusan arsitektur di sini adalah: **hosting frontend tetap di Vercel**, Firebase hanya dipakai sebagai backend service (Auth, Firestore, Storage) lewat Client SDK — bukan lewat Firebase App Hosting/Cloud Functions. Ini membuat seluruh stack bisa berjalan di paket **Spark (gratis)** tanpa perlu kartu kredit.
3. **Membuat akun anggota baru butuh Firebase Admin SDK, bukan Cloud Functions.** Berita baiknya, Admin SDK tidak harus berjalan di Cloud Functions — ia bisa berjalan di Server Action Next.js yang di-hosting di Vercel. Ini penting dicatat supaya tim tidak salah asumsi bahwa "pakai Firebase = wajib pakai Cloud Functions".
4. **Tidak ada backup otomatis di paket Spark.** Sama seperti pertimbangan sebelumnya terhadap Supabase, data di Firestore — khususnya koleksi kas dan anggota — sebaiknya di-*export* manual secara berkala (Firebase punya fitur *export* ke Cloud Storage), alih-alih mengandalkan platform sepenuhnya.
5. **Kuota harian Firestore di paket Spark** (50.000 baca, 20.000 tulis per hari) sangat cukup untuk skala satu kelas, tapi query yang tidak efisien (misalnya mengambil seluruh koleksi tanpa `limit`) bisa memboroskan kuota lebih cepat dari perkiraan — pagination dan query spesifik perlu jadi kebiasaan sejak awal, bukan optimasi belakangan.
6. **Perubahan kebijakan Cloud Storage untuk proyek baru** perlu dicek saat setup: proyek Firebase yang baru dibuat sudah otomatis memakai jenis bucket yang tetap gratis di paket Spark, berbeda dari proyek lama yang memakai bucket default `appspot.com` — ini bukan masalah untuk proyek baru, tapi baik untuk dikonfirmasi saat pertama kali membuat project.
7. **Dashboard Admin & Manajemen Kas sebaiknya diuji ekstra ketat** sebelum rilis v1.0, karena keduanya menyentuh hak akses dan uang — dua area paling sensitif terhadap bug, dan di Firestore keduanya sangat bergantung pada Security Rules yang ditulis benar (bukan sekadar validasi di frontend).

---

## Tabel Ringkasan Teknologi

| Kategori | Teknologi | Alasan Penggunaan |
|---|---|---|
| Frontend Framework | Next.js (App Router) + TypeScript | SSR/SSG, type-safe, komunitas besar, mudah dipelajari |
| Styling | Tailwind CSS | Cepat, responsive by default, dark mode native |
| Komponen UI | shadcn/ui | Komponen accessible & mudah dikustom |
| Ikon | lucide-react | Ringan & konsisten |
| Backend/API | Next.js Server Actions (Firebase Admin SDK untuk operasi privileged) | Operasi privileged tetap di server tanpa perlu Cloud Functions |
| BaaS | Firebase | Auth + Firestore + Storage dalam satu platform, gratis (Spark) hingga 50rb pengguna aktif |
| Database | Cloud Firestore | NoSQL document-based, real-time, terintegrasi native dengan Auth & Security Rules |
| Autentikasi | Firebase Authentication + Custom Claims + Security Rules | Keamanan di level Firebase, bukan hanya UI |
| Validasi Form | Zod + React Hook Form | Validasi type-safe, form performant |
| Data Fetching | TanStack Query | Caching & state loading/error yang konsisten |
| State Ringan | Zustand | Simpel, tanpa boilerplate |
| Hosting Frontend | Vercel (Hobby) | Gratis untuk non-komersial, deploy otomatis dari Git |
| Linting/Format | ESLint + Prettier | Konsistensi gaya kode antar kontributor |
