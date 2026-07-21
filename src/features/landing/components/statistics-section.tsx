import { Users, UserCog, UserRound, CalendarRange, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { siteConfig } from "@/config/site.config";

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

/**
 * Data dummy, diambil dari config/site.config.ts (bukan hardcode di sini)
 * supaya tetap satu sumber kebenaran dengan AboutSection — mis. Tahun
 * Ajaran di sini otomatis selalu sama dengan yang tampil di AboutSection.
 */
const STATISTIK: StatItem[] = [
  { icon: Users, value: String(siteConfig.jumlahAnggota), label: "Anggota Kelas" },
  { icon: UserCog, value: String(siteConfig.jumlahPengurus), label: "Pengurus Kelas" },
  { icon: UserRound, value: String(siteConfig.jumlahWaliKelas), label: "Wali Kelas" },
  { icon: CalendarRange, value: siteConfig.tahunAjaran, label: "Tahun Ajaran" },
];

/**
 * Section "Statistik Kelas" — reusable, diletakkan setelah AboutSection
 * di Landing Page. Beda gaya dari AboutSection secara sengaja: di sini
 * ANGKA jadi fokus utama (besar, tebal), bukan daftar label:value —
 * karena isinya statistik, bukan fakta deskriptif.
 *
 * Grid responsif: 1 kolom (mobile) → 2 kolom (tablet, `sm:`) → 4 kolom
 * (desktop, `lg:`), sesuai breakpoint yang sama dipakai section lain.
 *
 * Hover effect sengaja minim (shadow + border saja, tanpa transform/
 * translate) supaya tetap "sedikit" sesuai instruksi, bukan animasi
 * yang mencolok.
 */
export function StatisticsSection() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
        <h2 className="mb-6 text-xl font-semibold sm:text-2xl">Statistik Kelas</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATISTIK.map(({ icon: Icon, value, label }) => (
            <Card
              key={label}
              className="hover:border-primary/40 transition-all duration-200 hover:shadow-md"
            >
              <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
                <div className="bg-secondary flex size-11 items-center justify-center rounded-full">
                  <Icon className="text-secondary-foreground size-5" aria-hidden="true" />
                </div>
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">{value}</p>
                <p className="text-muted-foreground text-sm">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
