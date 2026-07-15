import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Mengizinkan next/image memuat foto dari Firebase Storage
    // (galeri, foto profil anggota, dokumentasi bergambar).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
