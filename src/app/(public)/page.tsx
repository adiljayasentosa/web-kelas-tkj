import { HeroSection } from "@/features/landing/components/hero-section";

// Section lain SUDAH dibangun (lihat src/features/landing/components/)
// tapi sengaja belum dirender di sini — scope sprint ini hanya Hero
// Section. Tinggal un-comment 3 baris di bawah untuk mengaktifkan lagi:
//
// import { TentangSection } from "@/features/landing/components/tentang-section";
// import { StatistikSection } from "@/features/landing/components/statistik-section";
// import { PengumumanPreviewSection } from "@/features/landing/components/pengumuman-preview-section";
// import { GaleriPreviewSection } from "@/features/landing/components/galeri-preview-section";
// import { CtaSection } from "@/features/landing/components/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      {/* <TentangSection /> */}
      {/* <StatistikSection /> */}
      {/* <PengumumanPreviewSection /> */}
      {/* <GaleriPreviewSection /> */}
      {/* <CtaSection /> */}
    </>
  );
}
