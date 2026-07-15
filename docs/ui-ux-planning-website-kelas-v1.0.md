# UI/UX Planning — Website Kelas v1.0

> Dokumen ini merancang pengalaman pengguna (UX) dan struktur antarmuka (UI) Website Kelas v1.0, mengacu pada spesifikasi teknis, struktur proyek, dan desain database Firestore yang sudah disepakati. Tidak ada kode maupun implementasi di dokumen ini — murni perencanaan desain.

---

## 1. Information Architecture

### 1.1 Peta Halaman per Kelompok

**Public** (tanpa login):
- `/` — Landing Page
- `/profil` — Profil Kelas
- `/pengumuman` — Daftar pengumuman (baca saja, versi publik)
- `/login` — Login

**Member** (login, role `anggota` ke atas):
- `/dashboard` — Dashboard Member
- `/jadwal` — Jadwal Pelajaran
- `/piket` — Jadwal Piket
- `/kas` — Kas Kelas (lihat saldo & riwayat)
- `/galeri` — Galeri
- `/dokumentasi` — Dokumentasi
- `/akun` — Pengaturan akun pribadi (ganti password)

**Admin** (role `admin`/`superadmin`):
- `/admin/dashboard` — Dashboard Admin/Wali Kelas
- `/admin/anggota` — Kelola Data Anggota
- `/admin/jadwal` — Kelola Jadwal Pelajaran
- `/admin/piket` — Kelola Jadwal Piket
- `/admin/pengumuman` — Kelola Pengumuman
- `/admin/galeri` — Kelola Galeri
- `/admin/dokumentasi` — Kelola Dokumentasi
- `/admin/kas` — Kelola Transaksi Kas
- `/admin/akun-pengurus` — Kelola akun Admin lain *(khusus `superadmin`)*
- `/system` — Dashboard System Administrator *(lihat catatan di §1.3)*

### 1.2 Hubungan Antar Halaman

```
                        ┌───────────────┐
                        │  Landing (/)  │
                        └───────┬───────┘
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        /profil            /pengumuman          /login
      (Profil Kelas)      (versi publik)           │
                                                     ▼
                                        ┌─────────────────────┐
                                        │  Cek role (Custom    │
                                        │  Claim di ID Token)  │
                                        └──────────┬───────────┘
                        ┌────────────────┬─────────┴─────────┐
                        ▼                ▼                   ▼
                 role: anggota    role: admin/superadmin   (invalid → balik ke /login)
                        │                │
                        ▼                ▼
              /dashboard (Member)   /admin/dashboard
                        │                │
          ┌─────┬───────┼───────┬────┐   ├── /admin/anggota
          ▼     ▼       ▼       ▼    ▼   ├── /admin/jadwal, /admin/piket
        jadwal piket   kas   galeri dok. ├── /admin/pengumuman
                                          ├── /admin/galeri, /admin/dokumentasi
                                          ├── /admin/kas
                                          └── /admin/akun-pengurus (superadmin saja)
```

### 1.3 Catatan: "System Administrator"

Peran ini **belum ada** di tabel role pada spesifikasi teknis sebelumnya (yang hanya punya Anggota/Admin/Super Admin). Sebelum dianggap final, ini perlu diperjelas dulu — lihat pembahasan di §8 Kritik poin 1. Untuk sementara, `/system` dirancang sebagai halaman terpisah yang **hanya bisa diakses lewat akun tertentu**, bukan sebagai role baru yang formal di Custom Claims.

---

## 2. Navigation

### 2.1 Ringkasan per Breakpoint

| Breakpoint | Area Public | Area Member/Admin |
|---|---|---|
| **Desktop** (≥1024px) | Navbar horizontal atas | Sidebar kiri persisten (dengan label teks) |
| **Tablet** (768–1023px) | Navbar horizontal atas | Sidebar collapsed (ikon saja), bisa di-expand |
| **Mobile** (<768px) | Navbar minimal + Drawer | Bottom Navigation (4 item utama) + Drawer (menu lengkap) |

### 2.2 Kapan Memakai Apa

| Komponen | Dipakai Kapan | Alasan |
|---|---|---|
| **Navbar** (horizontal atas) | Halaman Public, di semua breakpoint | Jumlah menu sedikit (≤4: Beranda, Profil, Pengumuman, Login) — navbar horizontal cukup dan familiar untuk pengunjung baru |
| **Sidebar** (vertikal kiri, persisten) | Area Member/Admin, desktop & tablet | Jumlah menu banyak (7-9 item), sidebar lebih scalable dibanding navbar horizontal yang akan penuh |
| **Bottom Navigation** | Area Member/Admin, mobile saja | Area ibu jari paling gampang dijangkau di layar kecil; dibatasi 4 item **paling sering diakses** (lihat kritik §8.2) |
| **Drawer** (slide-out, full menu) | Mobile (dipicu tombol hamburger), untuk item di luar 4 item Bottom Nav | Menyimpan menu sekunder tanpa memenuhi layar; juga dipakai sebagai sidebar mode-tersembunyi di tablet sempit |

---

## 3. Wireframe (ASCII)

> Wireframe berikut memakai layout generik: pada mobile, sidebar hilang dan konten menjadi satu kolom penuh; struktur di bawah menggambarkan versi desktop sebagai acuan utama.

### Landing Page
```
┌──────────────────────────────────────────────┐
│ [Logo Kelas]   Beranda  Profil  Pengumuman    │
│                                       [Login] │
├──────────────────────────────────────────────┤
│              HERO: Nama Kelas                 │
│              Tagline singkat                  │
│           [Ilustrasi/Foto Kelas]              │
├──────────────────────────────────────────────┤
│  Pengumuman Terbaru                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Card 1  │  │ Card 2  │  │ Card 3  │        │
│  └─────────┘  └─────────┘  └─────────┘        │
├──────────────────────────────────────────────┤
│  Sekilas Kelas (jumlah anggota, wali kelas)   │
├──────────────────────────────────────────────┤
│  Footer                                       │
└──────────────────────────────────────────────┘
```

### Login
```
┌────────────────────────────┐
│         [Logo Kelas]        │
│                              │
│  Email                       │
│  ┌──────────────────────┐   │
│  └──────────────────────┘   │
│  Password                [👁]│
│  ┌──────────────────────┐   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │        Masuk          │   │
│  └──────────────────────┘   │
│         Lupa password?       │
└────────────────────────────┘
```

### Dashboard (shell umum — isi widget beda per role, lihat §4)
```
┌────────┬──────────────────────────────────────┐
│        │  Halo, {Nama}          🔔  [Avatar]  │
│ Sidebar├──────────────────────────────────────┤
│        │  ┌────────┐ ┌────────┐ ┌────────┐    │
│ Dashbrd│  │ Widget │ │ Widget │ │ Widget │    │
│ Jadwal │  └────────┘ └────────┘ └────────┘    │
│ Piket  │                                       │
│ Kas    │  Aktivitas / Info Terbaru             │
│ Galeri │  • item                               │
│ Dok.   │  • item                               │
└────────┴──────────────────────────────────────┘
```

### Pengumuman
```
┌────────┬──────────────────────────────────────┐
│ Sidebar│  Pengumuman             [+ Tambah]*  │
│        ├──────────────────────────────────────┤
│        │ [Kategori ▾]   [Cari...........]     │
│        │ ┌──────────────────────────────────┐ │
│        │ │ 📌 Judul Pengumuman               │ │
│        │ │    Kategori · 12 Jul 2026         │ │
│        │ │    Cuplikan isi...                │ │
│        │ └──────────────────────────────────┘ │
│        │ ┌──────────────────────────────────┐ │
│        │ │ 📌 Judul Pengumuman lain          │ │
│        │ └──────────────────────────────────┘ │
└────────┴──────────────────────────────────────┘
* tombol hanya tampil untuk Admin
```

### Jadwal Pelajaran
```
┌────────┬──────────────────────────────────────┐
│ Sidebar│  Jadwal Pelajaran         [Edit]*    │
│        ├──────────────────────────────────────┤
│        │ [Senin][Selasa][Rabu][Kamis][Jumat]  │
│        │ ┌──────────────────────────────────┐ │
│        │ │ 07.00–08.30  Matematika   Bu Ani │ │
│        │ │ 08.30–10.00  B. Indonesia Pak Budi│ │
│        │ │ 10.00–10.15  Istirahat            │ │
│        │ │ ...                                │ │
│        │ └──────────────────────────────────┘ │
└────────┴──────────────────────────────────────┘
```

### Jadwal Piket
```
┌────────┬──────────────────────────────────────┐
│ Sidebar│  Jadwal Piket             [Edit]*    │
│        ├──────────────────────────────────────┤
│        │ [Senin][Selasa][Rabu][Kamis][Jumat]  │
│        │                                       │
│        │  Kelompok Piket — Senin               │
│        │  • Nama Anggota 1                     │
│        │  • Nama Anggota 2                     │
│        │  • Nama Anggota 3                     │
└────────┴──────────────────────────────────────┘
```

### Kas
```
┌────────┬──────────────────────────────────────┐
│ Sidebar│  Kas Kelas                           │
│        ├──────────────────────────────────────┤
│        │ ┌──────────────────────────────────┐ │
│        │ │   Saldo Saat Ini: Rp 1.250.000   │ │
│        │ └──────────────────────────────────┘ │
│        │                       [+ Transaksi]* │
│        │  Riwayat Transaksi                   │
│        │ ┌──────────────────────────────────┐ │
│        │ │ + Rp50.000  Iuran mingguan  12/07│ │
│        │ │ − Rp30.000  Beli print     10/07 │ │
│        │ └──────────────────────────────────┘ │
└────────┴──────────────────────────────────────┘
```

### Galeri
```
┌────────┬──────────────────────────────────────┐
│ Sidebar│  Galeri                  [+ Upload]* │
│        ├──────────────────────────────────────┤
│        │ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│        │ │foto│ │foto│ │foto│ │foto│          │
│        │ └────┘ └────┘ └────┘ └────┘          │
│        │ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│        │ │foto│ │foto│ │foto│ │foto│          │
│        │ └────┘ └────┘ └────┘ └────┘          │
└────────┴──────────────────────────────────────┘
```

### Dokumentasi
```
┌────────┬──────────────────────────────────────┐
│ Sidebar│  Dokumentasi             [+ Upload]* │
│        ├──────────────────────────────────────┤
│        │ [Kategori ▾]                         │
│        │ ┌──────────────────────────────────┐ │
│        │ │ 📄 Materi Matematika Bab 3        │ │
│        │ │    Materi · [Unduh]               │ │
│        │ └──────────────────────────────────┘ │
│        │ ┌──────────────────────────────────┐ │
│        │ │ 📄 Surat Edaran Sekolah           │ │
│        │ └──────────────────────────────────┘ │
└────────┴──────────────────────────────────────┘
```

### Profil Kelas
```
┌──────────────────────────────────────────────┐
│  Navbar (public)                              │
├──────────────────────────────────────────────┤
│  [Foto Kelas]                                 │
│  Nama Kelas — Tahun Ajaran                    │
│  Wali Kelas: ...                              │
├──────────────────────────────────────────────┤
│  Visi & Misi Kelas                            │
├──────────────────────────────────────────────┤
│  Struktur Organisasi                          │
│  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │ Ketua  │  │Sekretar│  │Bendaha-│           │
│  │        │  │is      │  │ra      │           │
│  └────────┘  └────────┘  └────────┘           │
└──────────────────────────────────────────────┘
```

---

## 4. Dashboard Design

| Dashboard | Widget Utama | Catatan |
|---|---|---|
| **Member** | (1) Pengumuman terbaru (3), (2) Jadwal hari ini, (3) Status piket hari ini (disorot kalau user sendiri sedang piket), (4) Saldo kas (read-only) | Fokus: informasi harian yang relevan untuk siswa |
| **Admin** (Pengurus Kelas) | (1) Saldo kas + tombol tambah transaksi, (2) Pengumuman terbaru + tombol tambah, (3) Jumlah anggota, (4) Aksi cepat (tambah pengumuman/upload galeri/upload dokumentasi) | Fokus: aksi cepat ke tugas rutin pengurus |
| **Wali Kelas** (Super Admin) | Semua widget Admin **+** (5) Daftar akun Admin & aksi kelola/nonaktifkan akun | Analitik kas mendetail (grafik) sengaja **tidak** dimasukkan ke v1.0 — itu scope v1.2 (Dashboard Analytics, Statistik Kas) |
| **System Administrator** | (1) Status ketersediaan sistem (tautan ke Firebase Console), (2) Tautan ke Vercel Dashboard (status deploy terakhir), (3) Daftar akun & role (audit sederhana) | Lihat catatan penting di §8 Kritik poin 1 — dashboard ini sebaiknya **hanya berisi tautan keluar**, bukan mencoba membangun monitoring custom di dalam aplikasi |

---

## 5. Design System

| Elemen | Keputusan | Alasan |
|---|---|---|
| **Color Palette** | Primary: Emerald green (nuansa hijau segar, konsisten dengan tema 🌱 di roadmap); Neutral: skala Zinc (default shadcn/ui); Semantic: Success = hijau, Warning = amber, Danger = merah (dipakai juga untuk "keluar" di kas & tombol hapus), Info = biru | Hijau memberi kesan segar/edukatif, dan skema token (bukan warna hardcode) memudahkan dark mode |
| **Typography** | Font: **Inter** (via `next/font`), skala mengikuti default Tailwind (`text-sm` s.d. `text-3xl`); heading `font-semibold`/`font-bold`, body `font-normal` | Inter gratis, sangat legible di ukuran kecil (penting untuk mobile-first), terintegrasi mudah dengan Next.js |
| **Border Radius** | Basis `rounded-lg` (default shadcn/ui, ~0.5rem) untuk card/button/input; `rounded-full` untuk avatar & badge | Konsisten dengan default shadcn/ui, terasa modern tanpa terlalu tajam atau terlalu bulat |
| **Spacing** | Skala spacing default Tailwind (basis 4px); padding card: `p-4` di mobile, `p-6` di desktop; `gap-4` antar elemen grid | Konsisten & mudah dihafal tim, tidak perlu custom scale |
| **Icon Style** | **lucide-react**, gaya outline, stroke width 2, ukuran 16-20px inline, 20-24px di navigasi | Sudah dipilih di tech stack, ringan dan konsisten |
| **Button Variant** | `primary` (solid), `secondary`, `outline`, `ghost`, `destructive` (aksi hapus/koreksi), `link`; ukuran `sm`/`default`/`lg`/`icon` | Set variant standar shadcn/ui, cukup untuk semua kebutuhan tanpa custom berlebihan |
| **Card** | shadcn/ui `Card`, border tipis + `shadow-sm`, dipakai untuk widget dashboard, item pengumuman, item dokumentasi | Konsisten di semua modul |
| **Modal** | shadcn/ui `Dialog` di **desktop**, `Sheet` (slide dari bawah) di **mobile** untuk form & konfirmasi | Dialog di tengah layar kecil terasa sempit di mobile — Sheet lebih nyaman disentuh dengan ibu jari |
| **Table** | shadcn/ui `Table` di desktop/tablet; berubah jadi **daftar Card bertumpuk** di mobile (bukan scroll horizontal) | Tabel literal sangat tidak nyaman di layar kecil — lihat kritik §8.3 |
| **Badge** | shadcn/ui `Badge`, dipakai untuk kategori pengumuman/dokumentasi dan status role | Penanda visual ringan tanpa makan tempat |
| **Alert** | shadcn/ui `Alert`, dipakai untuk pesan inline (empty state, permission denied, peringatan form) | Kontekstual, muncul di dalam alur halaman |
| **Toast** | shadcn/ui `Toast`/`Sonner`, dipakai untuk feedback transien (berhasil disimpan, gagal upload) | Tidak mengganggu alur seperti alert permanen |
| **Form** | React Hook Form + Zod (sudah dipilih), pola label-di-atas-input, pesan error di bawah field | Konsisten, jelas dibaca terutama di mobile satu kolom |

---

## 6. Responsive Strategy

| Breakpoint | Layout | Navigasi | Tabel | Form/Modal |
|---|---|---|---|---|
| **Mobile** (<768px) | Satu kolom penuh, widget dashboard ditumpuk vertikal | Bottom Navigation (4 item) + Drawer | Berubah jadi daftar Card | Sheet (slide dari bawah), satu kolom |
| **Tablet** (768–1023px) | Grid 2 kolom untuk card/widget | Sidebar collapsed (ikon saja), bisa expand | Tabel penuh, scroll horizontal kalau perlu | Dialog tengah, form bisa 2 kolom untuk field pendek |
| **Desktop** (≥1024px) | Grid 3–4 kolom untuk widget dashboard | Sidebar penuh dengan label | Tabel penuh tanpa scroll | Dialog tengah |

---

## 7. Accessibility

- **HTML semantik** — memakai elemen `nav`, `main`, `header`, `footer`, `button` yang sesuai, bukan `div` untuk semuanya; didukung otomatis karena shadcn/ui dibangun di atas Radix UI yang sudah menangani ARIA & peran elemen.
- **Kontras warna** minimal **WCAG AA** (4.5:1 untuk teks biasa, 3:1 untuk teks besar) — perlu dicek ulang saat implementasi, terutama warna primary di dark mode (lihat kritik §8.6).
- **Navigasi keyboard** — semua elemen interaktif bisa dijangkau lewat Tab, dengan focus ring yang terlihat jelas (default shadcn/ui). Dialog/Sheet menahan fokus di dalamnya selama terbuka dan mengembalikan fokus saat ditutup (ditangani Radix).
- **Alt text wajib** untuk semua gambar yang diunggah (galeri, foto profil anggota) — jadi field wajib di form upload, bukan opsional.
- **`aria-label` untuk tombol ikon-saja** (mis. tombol hapus/edit yang hanya berupa ikon di tabel admin) — ditetapkan sebagai aturan sejak tahap desain supaya tidak terlewat saat implementasi cepat.
- **Dark mode** tetap diuji kontrasnya secara terpisah dari light mode — warna yang lolos AA di light mode belum tentu lolos di dark mode.
- **Reduced motion** — animasi/transisi menghormati preferensi `prefers-reduced-motion` pengguna.

---

## 8. Kritik & Alternatif yang Lebih Sederhana

1. **4 tingkat dashboard (Member/Admin/Wali Kelas/System Administrator) melebihi tabel role yang sudah disepakati** di spesifikasi teknis (yang hanya punya Anggota/Admin/Super Admin). "System Administrator" berpotensi jadi role ke-4 yang menambah kompleksitas Custom Claims & Security Rules tanpa kebutuhan fungsional yang jelas di roadmap v1.0. **Alternatif lebih sederhana:** jangan jadikan role formal dulu — cukup lindungi `/system` dengan pengecekan UID tertentu (hardcoded di server), atau gabungkan isinya sebagai satu tab tambahan di Dashboard Wali Kelas bernama "Pengaturan Sistem". Jadikan role terpisah baru kalau nanti benar-benar ada orang lain (bukan wali kelas) yang perlu akses rutin ke sana.

2. **Bottom Navigation berisiko kepenuhan** kalau semua modul (Jadwal, Piket, Kas, Galeri, Dokumentasi) dipaksa masuk. **Alternatif:** batasi tegas ke 4 item paling sering dipakai (usulan: Dashboard, Jadwal, Kas, Menu) — sisanya taruh di Drawer. Ini juga konsisten dengan tujuan "sederhana, mudah dipahami" di brief.

3. **Tabel HTML literal di mobile untuk halaman admin** (Data Anggota, Riwayat Kas) akan sangat tidak nyaman disentuh & dibaca di layar kecil kalau dibiarkan implisit. **Sudah diputuskan** di §5 & §6: berubah jadi daftar Card bertumpuk di bawah breakpoint tablet — poin ini ditegaskan lagi supaya tidak terlewat saat masuk tahap coding, karena shadcn/ui `Table` **tidak otomatis** melakukan ini.

4. **Dashboard Admin/Wali Kelas berisiko widget overload** kalau semua informasi (kas, pengumuman, anggota, aktivitas pengurus, dsb.) ditampilkan sekaligus tanpa prioritas — bertentangan dengan tujuan "sederhana". **Alternatif:** batasi 3–4 widget utama yang selalu terlihat, sisanya (misalnya daftar aktivitas detail) taruh di balik tab/link terpisah, bukan selalu tampil di layar pertama.

5. **Keputusan Dialog vs Sheet perlu eksplisit dari awal**, bukan menyusul saat coding. **Sudah ditetapkan** di §5: mobile → Sheet, desktop/tablet → Dialog. Aturan ini sebaiknya didokumentasikan di `docs/` supaya konsisten dipakai semua kontributor, bukan diputuskan ulang tiap kali ada form baru.

6. **Palet warna Emerald green belum diverifikasi kontrasnya secara teknis** — dokumen ini menetapkan arah warna, tapi rasio kontras pastinya (terutama versi dark mode) perlu dicek dengan tool contrast checker saat token warna benar-benar dituliskan di tahap coding. Jangan anggap ini sudah "pasti lolos AA" hanya karena tercantum di sini.

7. **Tombol ikon-saja untuk aksi hapus/edit** adalah titik rawan aksesibilitas yang sering terlewat kalau tidak ditegaskan dari tahap desain — aturan `aria-label` wajib di §7 perlu benar-benar dijadikan checklist saat review komponen, bukan sekadar catatan di dokumen.
