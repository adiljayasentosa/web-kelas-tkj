"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { Topbar } from "@/shared/components/layout/topbar";
import { ADMIN_SIDEBAR_NAV } from "@/config/nav.config";
import { useAuth } from "@/shared/hooks/useAuth";
import { signOut } from "@/features/auth/services/authService";

/**
 * Shell untuk Dashboard Admin/Wali Kelas. Tidak memakai BottomNav —
 * pengurus kelas diasumsikan lebih sering mengelola dari layar lebih
 * besar, tapi Sidebar tetap collapse sesuai breakpoint di CSS-nya.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
      <Sidebar items={ADMIN_SIDEBAR_NAV} />
      <div className="flex flex-1 flex-col">
        <Topbar
          userName={user?.displayName ?? "Admin"}
          userPhotoURL={user?.photoURL}
          drawerItems={ADMIN_SIDEBAR_NAV}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
