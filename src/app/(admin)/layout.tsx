import { requireRole } from "@/features/auth/services/requireRole";
import { ROLES } from "@/config/roles.config";
import { AdminShell } from "@/shared/components/layout/admin-shell";

/** Role Guard sesungguhnya — minimal role "admin", diverifikasi penuh di server. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(ROLES.ADMIN);

  return (
    <AdminShell user={{ name: session.name, photoURL: session.photoURL }}>
      {children}
    </AdminShell>
  );
}
