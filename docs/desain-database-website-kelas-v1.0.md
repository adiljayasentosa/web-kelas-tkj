# Desain Database — Website Kelas v1.0 (Cloud Firestore)

> Dokumen ini merancang struktur data di **Cloud Firestore**, menggantikan rencana skema relasional PostgreSQL sebelumnya. Karena Firestore adalah database **NoSQL document-based**, pendekatan desainnya berbeda dari SQL: tidak ada `JOIN`, dan struktur koleksi mengikuti **pola akses data** (bagaimana data akan dibaca), bukan murni normalisasi.

---

## 1. Prinsip Desain

1. **Denormalisasi terkontrol.** Beberapa data (misalnya nama pembuat pengumuman) sengaja disalin ke dokumen lain, supaya frontend tidak perlu melakukan *lookup* tambahan (yang di Firestore berarti biaya baca tambahan). Trade-off-nya: kalau nama anggota berubah, salinan lama tidak otomatis ter-update — ini diterima karena nama jarang berubah.
2. **Top-level collection vs subcollection.** Data dipakai sebagai subcollection ketika jumlahnya bisa terus bertambah dan hanya relevan dalam konteks dokumen induknya (misalnya transaksi kas per periode). Data dijadikan top-level collection ketika sering di-query lintas konteks.
3. **Satu dokumen per "unit yang biasa dibaca bersamaan".** Misalnya jadwal pelajaran satu hari disimpan sebagai satu dokumen berisi array, bukan satu dokumen per jam pelajaran — supaya menampilkan jadwal satu hari cukup **1 kali baca**, bukan belasan.

---

## 2. Struktur Koleksi (Overview)

| Koleksi | Tipe | Ringkasan Isi |
|---|---|---|
| `users` | Top-level, docID = UID Firebase Auth | Profil anggota: nama, NIS, jabatan, kontak, foto (role disimpan di Custom Claim, **bukan** di sini) |
| `pengumuman` | Top-level | Satu dokumen per pengumuman |
| `jadwalPelajaran` | Top-level, docID tetap (`senin`...`sabtu`) | Satu dokumen per hari, isi array jam pelajaran |
| `jadwalPiket` | Top-level, docID tetap (`senin`...`sabtu`) | Satu dokumen per hari, isi array anggota piket |
| `galeri` | Top-level | Satu dokumen per foto/album |
| `dokumentasi` | Top-level | Satu dokumen per file dokumen |
| `kas/ringkasan` | Dokumen tunggal | Saldo kas saat ini (lihat §4) |
| `kas/transaksi/{id}` (subcollection dari `kas`) | Subcollection | Ledger transaksi, append-only |

---

## 3. Detail Struktur Dokumen per Koleksi

### `users/{uid}`
| Field | Tipe | Keterangan |
|---|---|---|
| `nama` | string | |
| `nis` | string | |
| `jabatan` | string | mis. "Ketua Kelas", "Anggota" |
| `kontak` | string | opsional |
| `fotoURL` | string | URL dari Firebase Storage |
| `createdAt` | timestamp | |

> Field `role` **tidak** disimpan di sini, melainkan sebagai Custom Claim pada token Firebase Auth (lihat spesifikasi teknis §6) — supaya bisa dibaca langsung oleh Security Rules tanpa perlu query tambahan ke Firestore.

### `pengumuman/{id}`
| Field | Tipe | Keterangan |
|---|---|---|
| `judul` | string | |
| `isi` | string | |
| `kategori` | string | untuk fitur filter di v1.1 |
| `tanggal` | timestamp | |
| `createdByUid` | string | referensi ke `users/{uid}` |
| `createdByNama` | string | **disalin (denormalisasi)** supaya tidak perlu lookup tiap tampilkan daftar pengumuman |

### `jadwalPelajaran/{hari}`
Contoh dokumen dengan `hari` = `senin`:
| Field | Tipe | Keterangan |
|---|---|---|
| `daftarJam` | array of object | tiap elemen: `{ jam: string, mataPelajaran: string, guru: string }` |
| `updatedAt` | timestamp | |

### `jadwalPiket/{hari}`
| Field | Tipe | Keterangan |
|---|---|---|
| `anggotaPiket` | array of object | tiap elemen: `{ uid: string, nama: string }` (nama disalin agar tidak perlu lookup) |
| `updatedAt` | timestamp | |

### `galeri/{id}`
| Field | Tipe | Keterangan |
|---|---|---|
| `judul` | string | |
| `fotoURL` | string | path ke Firebase Storage |
| `tanggal` | timestamp | |
| `uploadedByUid` | string | |

### `dokumentasi/{id}`
| Field | Tipe | Keterangan |
|---|---|---|
| `judul` | string | |
| `fileURL` | string | path ke Firebase Storage |
| `kategori` | string | mis. "Materi", "Surat" |
| `uploadedByUid` | string | |
| `tanggal` | timestamp | |

---

## 4. Desain Modul Kas Kelas (Bagian Paling Kritis)

Ini adalah bagian yang paling perlu perhatian ekstra, karena Firestore tidak punya *constraint* atau transaksi lintas-dokumen sekuat SQL. Pola yang disarankan:

### `kas/transaksi/{id}` — Ledger, bersifat **append-only**
| Field | Tipe | Keterangan |
|---|---|---|
| `jenis` | string | `"masuk"` atau `"keluar"` |
| `jumlah` | number | dalam Rupiah, selalu bernilai positif (arah ditentukan oleh `jenis`) |
| `keterangan` | string | |
| `tanggal` | timestamp | |
| `createdByUid` | string | |
| `createdByNama` | string | disalin |
| `createdAt` | timestamp | |

**Aturan penting:** dokumen di sini **tidak boleh di-update atau dihapus** setelah dibuat (ditegakkan lewat Security Rules, dijelaskan di §5). Kalau ada salah input, solusinya adalah membuat transaksi **koreksi** baru (misalnya transaksi "keluar" senilai kesalahan tadi, dengan keterangan yang jelas), bukan mengedit riwayat lama. Ini menjaga jejak audit kas tetap utuh — prinsip standar pembukuan, sekaligus menutupi ketiadaan *constraint* database di level Firestore.

### `kas/ringkasan` — Dokumen saldo saat ini
Dua opsi dipertimbangkan untuk v1.0:

| Opsi | Cara Kerja | Kelebihan | Kekurangan |
|---|---|---|---|
| **A — Hitung ulang saat dibaca (direkomendasikan untuk v1.0)** | Saldo dihitung dengan menjumlahkan seluruh dokumen di `kas/transaksi` setiap kali halaman kas dibuka | Tidak butuh Cloud Functions → tetap 100% gratis di paket Spark; tidak ada risiko saldo "nyasar" karena tidak ada state tersimpan yang bisa keliru | Sedikit lebih banyak baca data dibanding satu dokumen ringkasan — namun untuk skala satu kelas (transaksi per bulan biasanya puluhan, bukan ribuan), ini jauh di bawah kuota gratis harian |
| **B — Dokumen ringkasan yang di-update otomatis** | Cloud Function terpicu tiap ada transaksi baru, lalu memperbarui `kas/ringkasan` | Baca jadi sangat murah (1 dokumen saja) | Butuh Cloud Functions → mewajibkan paket **Blaze**, menambah kompleksitas untuk manfaat yang belum dibutuhkan di skala ini |

**Rekomendasi:** pakai **Opsi A** untuk v1.0, sejalan dengan prinsip "gratis, stabil, mudah dipelajari". Opsi B bisa dipertimbangkan lagi di v1.1+ kalau jumlah transaksi sudah jauh lebih besar dan efisiensi baca mulai terasa penting.

---

## 5. Desain Firebase Security Rules (Deskriptif)

> Ini menjelaskan **aturan akses**, bukan kode Security Rules-nya (implementasi menyusul di tahap coding).

| Koleksi | Baca | Tulis | Alasan |
|---|---|---|---|
| `users/{uid}` | Pemilik dokumen sendiri, atau siapa pun yang sudah login (untuk keperluan menampilkan daftar anggota) | Hanya `admin`/`superadmin` | Data anggota bersifat semi-publik di dalam kelas, tapi hanya admin yang boleh mengubah |
| `pengumuman` | Siapa pun yang sudah login | Hanya `admin`/`superadmin` | Konsisten dengan requirement fungsional |
| `jadwalPelajaran`, `jadwalPiket` | Siapa pun yang sudah login | Hanya `admin`/`superadmin` | idem |
| `galeri`, `dokumentasi` | Siapa pun yang sudah login | Hanya `admin`/`superadmin` | idem |
| `kas/ringkasan` | Siapa pun yang sudah login | **Tidak ada** (kalau pakai Opsi A) — nilai selalu dihitung di client, tidak pernah ditulis manual | Mencegah saldo dimanipulasi langsung |
| `kas/transaksi/{id}` | Siapa pun yang sudah login | **Create**: hanya `admin`/`superadmin`. **Update/Delete**: ditolak untuk semua role, tanpa kecuali | Menegakkan prinsip ledger append-only di §4 |

**Prinsip umum yang berlaku di semua Security Rules:**
- Semua pengecekan role memakai `request.auth.token.role` (Custom Claim), bukan query tambahan ke koleksi `users` — supaya evaluasi rules tetap cepat dan murah.
- Setiap `write` juga divalidasi tipe datanya (mis. `jumlah` di transaksi kas harus `number` dan `> 0`) langsung di Security Rules, sebagai lapisan pertahanan kedua selain validasi Zod di frontend.

---

## 6. Query Pattern & Indexing

| Kebutuhan Query | Index yang Diperlukan |
|---|---|
| Pengumuman terbaru, urut tanggal descending | Index bawaan (single-field), tidak perlu index komposit |
| Pengumuman difilter kategori + urut tanggal (v1.1) | **Composite index**: `kategori` (Ascending) + `tanggal` (Descending) |
| Riwayat transaksi kas, urut tanggal descending | Index bawaan |
| Riwayat transaksi kas difilter `jenis` + urut tanggal (v1.1, laporan) | **Composite index**: `jenis` (Ascending) + `tanggal` (Descending) |

Firestore akan memberi tahu lewat error log kalau ada query yang butuh composite index tapi belum dibuat — indeks tambahan ini **tidak perlu dibuat di muka** untuk semua kemungkinan, cukup dibuat saat query yang bersangkutan benar-benar diimplementasikan.

---

## 7. Kritik & Trade-off Desain Database

1. **Ketiadaan constraint bawaan adalah risiko nyata**, bukan hanya catatan formalitas. Di SQL, "jumlah transaksi harus > 0" bisa dipaksakan di level database. Di Firestore, ini **hanya** ditegakkan oleh Security Rules dan validasi aplikasi — kalau ada bug di salah satu lapisan itu, data yang tidak valid tetap bisa masuk. Mitigasi: validasi dobel (frontend + Security Rules), dan pola append-only supaya kesalahan tidak menghapus jejak.

2. **Denormalisasi (nama disalin ke banyak dokumen) butuh disiplin saat ada perubahan data.** Kalau suatu saat perlu mengganti nama anggota di sistem, salinan nama di dokumen `pengumuman`, `jadwalPiket`, transaksi kas lama, dsb. **tidak otomatis ikut berubah**. Untuk skala kelas ini diterima sebagai trade-off (nama jarang berubah), tapi perlu didokumentasikan supaya tidak jadi kebingungan di kemudian hari.

3. **Opsi A untuk saldo kas (hitung ulang tiap dibaca) punya batas skala.** Untuk satu kelas dengan transaksi puluhan per bulan, ini tidak masalah. Kalau nanti pola pemakaian berubah drastis (misalnya kas dipakai untuk banyak sub-kelompok dengan transaksi harian dalam jumlah besar), opsi ini perlu dievaluasi ulang ke Opsi B.

4. **Firestore tidak punya "foreign key".** Referensi seperti `createdByUid` di dokumen pengumuman tidak divalidasi otomatis oleh database — kalau UID yang direferensikan ternyata sudah dihapus, tidak ada error dari sisi database. Ini perlu ditangani di level aplikasi (misalnya larangan menghapus akun yang punya riwayat transaksi/pengumuman, dipindah ke status nonaktif alih-alih dihapus permanen).
