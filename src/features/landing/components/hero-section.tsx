import Link from "next/link";
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { siteConfig } from "@/config/site.config";

/**
 * Hero Section Landing Page.
 *
 * Layout: grid 2 kolom di md ke atas (teks kiri, ilustrasi kanan).
 * Di mobile, grid otomatis jadi 1 kolom — karena ilustrasi ditulis
 * SETELAH teks di JSX, urutan tumpuknya otomatis benar (teks dulu,
 * ilustrasi di bawahnya) tanpa perlu utility "order-*" tambahan.
 *
 * Animasi pakai utility `animate-in`/`fade-in`/`slide-in-from-bottom-4`
 * dari tw-animate-css (CSS murni, tanpa library animasi/JS tambahan)
 * — sengaja dijaga ringan & singkat (duration-700) sesuai instruksi
 * "secukupnya, tanpa berlebihan". Ilustrasi diberi `delay-150` supaya
 * muncul sedikit menyusul teks, bukan bersamaan persis.
 *
 * Light/Dark mode: seluruh warna pakai token semantik
 * (bg-secondary, text-primary, text-muted-foreground, dst.) dari
 * globals.css, jadi otomatis menyesuaikan tanpa kelas khusus dark:.
 */
export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:py-24 md:grid-cols-2 md:items-center md:gap-12 md:px-8">
      {/* Kolom teks */}
      <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-6 text-center duration-700 md:items-start md:text-left">
        <span className="bg-secondary text-secondary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Selamat datang
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          {siteConfig.className}
        </h1>

        <p className="text-muted-foreground max-w-md text-base text-balance sm:text-lg">
          {siteConfig.tagline}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" size="lg">
            <Link href="/profil">Lihat Profil Kelas</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/login">
              Masuk ke Akun
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Kolom ilustrasi — kanan di desktop, bawah teks di mobile.
          Belum ada foto kelas asli, jadi dibuat dari token warna Design
          System (gradient + ikon), bukan gambar placeholder dari luar
          (menghindari 404 aset yang belum ada). */}
      <div
        aria-hidden="true"
        className="animate-in fade-in slide-in-from-bottom-4 from-primary/15 via-primary/5 flex h-56 items-center justify-center rounded-xl bg-gradient-to-br to-transparent delay-150 duration-700 sm:h-72 md:h-80"
      >
        <GraduationCap className="text-primary/40 size-20 sm:size-28" />
      </div>
    </section>
  );
}
