"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { Topbar } from "@/shared/components/layout/topbar";
import { MEMBER_SIDEBAR_NAV } from "@/config/nav.config";
import { useAuth } from "@/shared/hooks/useAuth";
import { signOut } from "@/features/auth/services/authService";

/**
 * Shell dashboard umum untuk area Member, sesuai wireframe
 * ui-ux-planning-website-kelas-v1.0.md §3 ("Dashboard — shell umum").
 * Proteksi akses sesungguhnya ada di proxy.ts + Security Rules;
 * pengecekan di sini hanya untuk menampilkan nama user yang benar.
 */
export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Memuat...
      </div>
    );
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar items={MEMBER_SIDEBAR_NAV} />
      <div className="flex flex-1 flex-col pb-14 md:pb-0">
        <Topbar
          userName={user?.displayName ?? "Anggota"}
          userPhotoURL={user?.photoURL}
          drawerItems={MEMBER_SIDEBAR_NAV}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
