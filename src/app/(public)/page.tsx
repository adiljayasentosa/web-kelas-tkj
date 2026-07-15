/**
 * PLACEHOLDER — bukan implementasi Landing Page final.
 * Landing Page sesungguhnya (hero, pengumuman terbaru, dsb.) dibangun
 * di tahap Development fitur, mengikuti wireframe di
 * docs/ui-ux-planning-website-kelas-v1.0.md §3.
 *
 * Halaman ini hanya berfungsi memastikan `npm run dev` berjalan
 * setelah Project Setup selesai.
 */
export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-2xl font-semibold">Website Kelas</h1>
      <p className="text-muted-foreground text-sm">
        Project setup selesai. Halaman fitur menyusul di tahap Development.
      </p>
    </main>
  );
}
