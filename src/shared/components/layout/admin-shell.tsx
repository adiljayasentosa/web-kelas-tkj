"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { Topbar } from "@/shared/components/layout/topbar";
import { AutoBreadcrumb } from "@/shared/components/layout/auto-breadcrumb";
import { ADMIN_SIDEBAR_NAV } from "@/config/nav.config";
import { signOut } from "@/features/auth/services/authService";
import type { SessionUser } from "@/features/auth/services/session";

interface AdminShellProps {
  user: Pick<SessionUser, "name" | "photoURL">;
  children: React.ReactNode;
}

/** Verifikasi akses sudah selesai di admin/layout.tsx lewat requireRole(). */
export function AdminShell({ user, children }: AdminShellProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar items={ADMIN_SIDEBAR_NAV} />
      <div className="flex flex-1 flex-col">
        <Topbar
          userName={user.name ?? "Admin"}
          userPhotoURL={user.photoURL}
          drawerItems={ADMIN_SIDEBAR_NAV}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-4">
            <AutoBreadcrumb />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
