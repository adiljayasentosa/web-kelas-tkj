/**
 * Definisi role sesuai spesifikasi-teknis-website-kelas-v1.0.md §6.
 * Role disimpan sebagai Custom Claim di Firebase Auth (bukan di Firestore),
 * supaya bisa dibaca langsung dari ID token / session cookie.
 */
export const ROLES = {
  ANGGOTA: "anggota",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Urutan level akses, dipakai untuk pengecekan "minimal role X". */
const ROLE_LEVEL: Record<Role, number> = {
  [ROLES.ANGGOTA]: 1,
  [ROLES.ADMIN]: 2,
  [ROLES.SUPERADMIN]: 3,
};

export function hasMinimumRole(role: Role | undefined, minimum: Role): boolean {
  if (!role) return false;
  return ROLE_LEVEL[role] >= ROLE_LEVEL[minimum];
}

/** Prefix path yang membutuhkan role tertentu — dipakai di proxy.ts. */
export const PROTECTED_ROUTES: Array<{ prefix: string; minimumRole: Role }> = [
  { prefix: "/admin", minimumRole: ROLES.ADMIN },
  { prefix: "/dashboard", minimumRole: ROLES.ANGGOTA },
  { prefix: "/jadwal", minimumRole: ROLES.ANGGOTA },
  { prefix: "/piket", minimumRole: ROLES.ANGGOTA },
  { prefix: "/kas", minimumRole: ROLES.ANGGOTA },
  { prefix: "/galeri", minimumRole: ROLES.ANGGOTA },
  { prefix: "/dokumentasi", minimumRole: ROLES.ANGGOTA },
  { prefix: "/akun", minimumRole: ROLES.ANGGOTA },
];
