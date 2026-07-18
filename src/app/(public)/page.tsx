import Link from "next/link";
import {
  Megaphone,
  Users,
  GraduationCap,
  ArrowRight,
  Sparkles,
  FileText,
  Image as ImageIcon,
  LogIn,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { siteConfig } from "@/config/site.config";

/**
 * SELURUH data di bawah ini dummy/statis — modul Pengumuman & Galeri
 * (baca dari Firestore lewat services di folder features masing-masing) belum diimplementasikan,
 * sengaja di luar scope Sprint 5 (Landing Page). Bentuk data pengumuman
 * sudah mengikuti field di desain-database-website-kelas-v1.0.md, supaya
 * gampang diganti ke data asli nanti tanpa mengubah struktur JSX di bawah.
 */
const PENGUMUMAN_PLACEHOLDER = [
  {
    id: "1",
    judul: "Pengumuman akan tampil di sini",
    kategori: "Umum",
    tanggal: "—",
  },
  {
    id: "2",
    judul: "Modul Pengumuman menyusul setelah Landing Page",
    kategori: "Umum",
    tanggal: "—",
  },
  {
    id: "3",
    judul: "Admin bisa menambah pengumuman lewat Dashboard",
    kategori: "Umum",
    tanggal: "—",
  },
];

/** 6 slot galeri dummy — belum ada foto asli, jadi memakai tile warna + ikon. */
const GALERI_PLACEHOLDER = Array.from({ length: 6 }, (_, i) => ({ id: i + 1 }));

export default function LandingPage() {
  return (
    <>
      {/* --- Hero --- */}
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-24 md:px-8">
        <span className="bg-secondary text-secondary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Selamat datang
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          {siteConfig.className}
        </h1>

        <p className="text-muted-foreground max-w-xl text-base text-balance sm:text-lg">
          {siteConfig.tagline}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/login">
              Masuk ke Akun
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/profil">Lihat Profil Kelas</Link>
          </Button>
        </div>

        {/* Visual dekoratif — belum ada foto kelas asli, jadi dibuat dari
            token warna Design System, bukan gambar placeholder dari luar. */}
        <div
          aria-hidden="true"
          className="from-primary/15 via-primary/5 mt-8 flex h-40 w-full max-w-2xl items-center justify-center rounded-xl bg-gradient-to-br to-transparent sm:h-56"
        >
          <GraduationCap className="text-primary/40 size-16 sm:size-24" />
        </div>
      </section>

      {/* --- Tentang Kelas --- */}
      <section className="border-t">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:px-8 md:py-16">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold sm:text-2xl">Tentang Kelas</h2>
            <p className="text-muted-foreground text-balance">{siteConfig.tentang}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
                <Users className="text-primary size-6" aria-hidden="true" />
                <p className="text-2xl font-bold">{siteConfig.jumlahAnggota}</p>
                <p className="text-muted-foreground text-xs">Anggota</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
                <GraduationCap className="text-primary size-6" aria-hidden="true" />
                <p className="text-sm font-semibold text-balance">{siteConfig.waliKelas}</p>
                <p className="text-muted-foreground text-xs">Wali Kelas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- Statistik Kelas --- */}
      <section className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
          <h2 className="mb-6 text-xl font-semibold">Statistik Kelas</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={Users} label="Anggota" value={`${siteConfig.jumlahAnggota} siswa`} />
            <StatCard
              icon={Megaphone}
              label="Pengumuman"
              value={`${siteConfig.jumlahPengumuman} pengumuman`}
            />
            <StatCard
              icon={FileText}
              label="Dokumentasi"
              value={`${siteConfig.jumlahDokumentasi} berkas`}
            />
          </div>
        </div>
      </section>

      {/* --- Preview Pengumuman --- */}
      <section className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Megaphone className="text-primary size-5" aria-hidden="true" />
              Pengumuman Terbaru
            </h2>
            <Link href="/pengumuman" className="text-primary text-sm font-medium hover:underline">
              Lihat semua
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PENGUMUMAN_PLACEHOLDER.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{item.judul}</CardTitle>
                  <CardDescription>
                    {item.kategori} · {item.tanggal}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- Preview Galeri --- */}
      <section className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <ImageIcon className="text-primary size-5" aria-hidden="true" />
              Galeri Kegiatan
            </h2>
            <Link href="/login" className="text-primary text-sm font-medium hover:underline">
              Masuk untuk lihat semua
            </Link>
          </div>

          {/* Belum ada foto asli — tile warna + ikon sebagai placeholder,
              bukan gambar dari luar (menghindari 404 aset yang belum ada). */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {GALERI_PLACEHOLDER.map((item) => (
              <div
                key={item.id}
                aria-hidden="true"
                className="bg-secondary flex aspect-square items-center justify-center rounded-lg"
              >
                <ImageIcon className="text-secondary-foreground/40 size-6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Call-to-Action --- */}
      <section className="border-t">
        <div className="bg-primary text-primary-foreground mx-4 my-12 flex flex-col items-center gap-4 rounded-xl px-4 py-12 text-center sm:mx-8 md:my-16">
          <LogIn className="size-8" aria-hidden="true" />
          <h2 className="text-xl font-semibold sm:text-2xl">Sudah jadi bagian dari kelas ini?</h2>
          <p className="max-w-md text-balance opacity-90">
            Masuk untuk mengakses jadwal, piket, kas kelas, galeri lengkap, dan dokumentasi.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/login">
              Masuk Sekarang
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="bg-secondary flex size-12 shrink-0 items-center justify-center rounded-full">
          <Icon className="text-secondary-foreground size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
