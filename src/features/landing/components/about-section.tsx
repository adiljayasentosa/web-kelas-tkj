import Link from "next/link";
import { GraduationCap, BookOpen, CalendarRange, UserRound } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { siteConfig } from "@/config/site.config";

/**
 * Data info kelas ditampilkan sebagai daftar label:value dalam satu Card
 * (bukan 4 Card terpisah) — sengaja dibedakan gaya dari Statistik Kelas
 * (StatistikSection) yang menampilkan angka. Di sini isinya fakta
 * deskriptif, jadi format daftar lebih pas daripada kartu angka.
 */
const INFO_KELAS = [
  { icon: GraduationCap, label: "Nama Kelas", value: siteConfig.className },
  { icon: BookOpen, label: "Jurusan", value: siteConfig.jurusan },
  { icon: CalendarRange, label: "Tahun Ajaran", value: siteConfig.tahunAjaran },
  { icon: UserRound, label: "Wali Kelas", value: siteConfig.waliKelas },
];

/**
 * Section "Tentang Kelas" — reusable, dipakai di Landing Page.
 * Layout: grid 2 kolom di md ke atas (deskripsi+CTA kiri, info kelas
 * kanan dalam Card); satu kolom tumpuk di mobile.
 * Warna sepenuhnya token semantik (text-muted-foreground, bg-secondary,
 * dst.) sehingga otomatis konsisten di light & dark mode.
 */
export function AboutSection() {
  return (
    <section className="border-t">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:px-8 md:py-16">
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <h2 className="text-xl font-semibold sm:text-2xl">Tentang Kelas</h2>
          <p className="text-muted-foreground text-balance">{siteConfig.tentang}</p>
          <Button asChild variant="outline">
            <Link href="/profil">Lihat Profil Kelas</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="divide-border divide-y">
            {INFO_KELAS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="bg-secondary flex size-9 shrink-0 items-center justify-center rounded-full">
                  <Icon className="text-secondary-foreground size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs">{label}</p>
                  <p className="truncate text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
