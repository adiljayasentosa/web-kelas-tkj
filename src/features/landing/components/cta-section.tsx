import Link from "next/link";
import { LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function CtaSection() {
  return (
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
  );
}
