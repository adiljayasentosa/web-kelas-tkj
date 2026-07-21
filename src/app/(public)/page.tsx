import { HeroSection } from "@/features/landing/components/hero-section";
import { AboutSection } from "@/features/landing/components/about-section";
import { StatisticsSection } from "@/features/landing/components/statistics-section";

// Section lain SUDAH dibangun (lihat src/features/landing/components/)
// tapi sengaja belum dirender di sini — scope sprint berjalan baru
// sampai Statistik Kelas. Tinggal un-comment baris di bawah untuk
// mengaktifkan lagi satu per satu di sprint berikutnya:
//
// import { PengumumanPreviewSection } from "@/features/landing/components/pengumuman-preview-section";
// import { GaleriPreviewSection } from "@/features/landing/components/galeri-preview-section";
// import { CtaSection } from "@/features/landing/components/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <StatisticsSection />
      {/* <PengumumanPreviewSection /> */}
      {/* <GaleriPreviewSection /> */}
      {/* <CtaSection /> */}
    </>
  );
}
