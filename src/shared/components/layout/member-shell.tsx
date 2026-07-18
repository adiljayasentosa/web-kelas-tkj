"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { Topbar } from "@/shared/components/layout/topbar";
import { AutoBreadcrumb } from "@/shared/components/layout/auto-breadcrumb";
import { MEMBER_SIDEBAR_NAV } from "@/config/nav.config";
import { signOut } from "@/features/auth/services/authService";
import type { SessionUser } from "@/features/auth/services/session";

interface MemberShellProps {
  user: Pick<SessionUser, "name" | "photoURL">;
  children: React.ReactNode;
}

/**
 * Bagian interaktif (client) dari area Member. Verifikasi siapa yang
 * boleh sampai ke sini sudah selesai di (member)/layout.tsx (Server
 * Component, lewat requireRole()) — komponen ini murni tampilan.
 */
export function MemberShell({ user, children }: MemberShellProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar items={MEMBER_SIDEBAR_NAV} />
      <div className="flex flex-1 flex-col pb-14 md:pb-0">
        <Topbar
          userName={user.name ?? "Anggota"}
          userPhotoURL={user.photoURL}
          drawerItems={MEMBER_SIDEBAR_NAV}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-4">
            <AutoBreadcrumb />
          </div>
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
