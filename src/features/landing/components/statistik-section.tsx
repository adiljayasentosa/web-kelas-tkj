import { Users, Megaphone, FileText, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { siteConfig } from "@/config/site.config";

export function StatistikSection() {
  return (
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
  );
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
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
