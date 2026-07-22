import "server-only";
import { redirect } from "next/navigation";
import { getCurrentSession, type SessionUser } from "@/features/auth/services/session";
import { hasMinimumRole, type Role } from "@/config/roles.config";

/**
 * Role Guard — dipanggil di baris pertama Server Component layout
 * (mis. (member)/layout.tsx, admin/layout.tsx). Berbeda dari proxy.ts
 * (yang cuma decode ringan untuk UX), ini melakukan verifikasi PENUH
 * lewat Admin SDK sebelum halaman dirender sama sekali — request yang
 * tidak berhak tidak pernah sampai mengirim HTML/data ke client.
 */
export async function requireRole(minimumRole: Role): Promise<SessionUser> {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (!hasMinimumRole(session!.role, minimumRole)) {
    // Login tapi role tidak cukup (mis. anggota mencoba buka area admin).
    redirect("/dashboard");
  }

  return session!;
}
