import { requireRole } from "@/features/auth/services/requireRole";
import { ROLES } from "@/config/roles.config";
import { MemberShell } from "@/shared/components/layout/member-shell";

/**
 * Role Guard sesungguhnya terjadi di sini (server), BUKAN di proxy.ts.
 * requireRole() memverifikasi penuh lewat Admin SDK dan redirect kalau
 * tidak berhak — anggota yang tidak login tidak akan sampai merender
 * MemberShell sama sekali, apalagi children-nya.
 */
export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(ROLES.ANGGOTA);

  return (
    <MemberShell user={{ name: session.name, photoURL: session.photoURL }}>
      {children}
    </MemberShell>
  );
}
