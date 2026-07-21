import { Users, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { siteConfig } from "@/config/site.config";

export function TentangSection() {
  return (
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
  );
}
