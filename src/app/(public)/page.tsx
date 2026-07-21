import { HeroSection } from "@/features/landing/components/hero-section";
import { AboutSection } from "@/features/landing/components/about-section";

// Section lain SUDAH dibangun (lihat src/features/landing/components/)
// tapi sengaja belum dirender di sini — scope sprint berjalan baru
// sampai Tentang Kelas. Tinggal un-comment baris di bawah untuk
// mengaktifkan lagi satu per satu di sprint berikutnya:
//
// import { StatistikSection } from "@/features/landing/components/statistik-section";
// import { PengumumanPreviewSection } from "@/features/landing/components/pengumuman-preview-section";
// import { GaleriPreviewSection } from "@/features/landing/components/galeri-preview-section";
// import { CtaSection } from "@/features/landing/components/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      {/* <StatistikSection /> */}
      {/* <PengumumanPreviewSection /> */}
      {/* <GaleriPreviewSection /> */}
      {/* <CtaSection /> */}
    </>
  );
}
