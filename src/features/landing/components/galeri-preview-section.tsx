import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

const GALERI_PLACEHOLDER = Array.from({ length: 6 }, (_, i) => ({ id: i + 1 }));

export function GaleriPreviewSection() {
  return (
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
  );
}
