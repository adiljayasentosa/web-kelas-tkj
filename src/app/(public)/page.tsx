import Link from "next/link";
import { Megaphone, Users, GraduationCap, ArrowRight, Sparkles } from "lucide-react";
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
 * Pengumuman di sini masih data statis — modul Pengumuman (baca dari
 * Firestore lewat features/pengumuman/services) belum diimplementasikan,
 * sengaja di luar scope tahap Landing Page ini. Struktur & bentuk data
 * di bawah SUDAH mengikuti field pengumuman di desain-database-website
 * -kelas-v1.0.md, supaya gampang diganti ke data asli nanti.
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

      {/* --- Pengumuman Terbaru --- */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Megaphone className="text-primary size-5" aria-hidden="true" />
            Pengumuman Terbaru
          </h2>
          <Link
            href="/pengumuman"
            className="text-primary text-sm font-medium hover:underline"
          >
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
      </section>

      {/* --- Sekilas Kelas --- */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        <h2 className="mb-6 text-xl font-semibold">Sekilas Kelas</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="bg-secondary flex size-12 shrink-0 items-center justify-center rounded-full">
                <Users className="text-secondary-foreground size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Jumlah Anggota</p>
                <p className="text-lg font-semibold">{siteConfig.jumlahAnggota} siswa</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="bg-secondary flex size-12 shrink-0 items-center justify-center rounded-full">
                <GraduationCap className="text-secondary-foreground size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Wali Kelas</p>
                <p className="text-lg font-semibold">{siteConfig.waliKelas}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
