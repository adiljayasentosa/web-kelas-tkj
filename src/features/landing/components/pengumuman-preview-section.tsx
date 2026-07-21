import Link from "next/link";
import { Megaphone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";

/**
 * Data dummy — modul Pengumuman (baca dari Firestore lewat
 * features/pengumuman/services) belum diimplementasikan. Bentuk data
 * di bawah sudah mengikuti field di desain-database-website-kelas-v1.0.md.
 */
const PENGUMUMAN_PLACEHOLDER = [
  { id: "1", judul: "Pengumuman akan tampil di sini", kategori: "Umum", tanggal: "—" },
  { id: "2", judul: "Modul Pengumuman menyusul setelah Landing Page", kategori: "Umum", tanggal: "—" },
  { id: "3", judul: "Admin bisa menambah pengumuman lewat Dashboard", kategori: "Umum", tanggal: "—" },
];

export function PengumumanPreviewSection() {
  return (
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
  );
}
