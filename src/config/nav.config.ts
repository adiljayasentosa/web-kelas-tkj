import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Image as ImageIcon,
  FileText,
  Megaphone,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Menu lengkap sidebar area Member — urutan sesuai wireframe UI/UX Planning §3. */
export const MEMBER_SIDEBAR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jadwal Pelajaran", href: "/jadwal", icon: CalendarDays },
  { label: "Jadwal Piket", href: "/piket", icon: Users },
  { label: "Kas Kelas", href: "/kas", icon: Wallet },
  { label: "Galeri", href: "/galeri", icon: ImageIcon },
  { label: "Dokumentasi", href: "/dokumentasi", icon: FileText },
];

/** Menu tambahan khusus Admin/Wali Kelas. */
export const ADMIN_SIDEBAR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Data Anggota", href: "/admin/anggota", icon: Users },
  { label: "Pengumuman", href: "/admin/pengumuman", icon: Megaphone },
  { label: "Jadwal Pelajaran", href: "/admin/jadwal", icon: CalendarDays },
  { label: "Jadwal Piket", href: "/admin/piket", icon: Users },
  { label: "Kas Kelas", href: "/admin/kas", icon: Wallet },
  { label: "Galeri", href: "/admin/galeri", icon: ImageIcon },
  { label: "Dokumentasi", href: "/admin/dokumentasi", icon: FileText },
];

/**
 * Bottom Navigation mobile — SENGAJA dibatasi 4 item, sesuai kritik di
 * ui-ux-planning-website-kelas-v1.0.md §8.2 (menghindari bottom nav penuh).
 * Item lain diakses lewat Drawer.
 */
export const BOTTOM_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jadwal", href: "/jadwal", icon: CalendarDays },
  { label: "Kas", href: "/kas", icon: Wallet },
  { label: "Akun", href: "/akun", icon: Settings },
];

export const PUBLIC_NAV: NavItem[] = [
  { label: "Beranda", href: "/", icon: LayoutDashboard },
  { label: "Profil Kelas", href: "/profil", icon: Users },
  { label: "Pengumuman", href: "/pengumuman", icon: Megaphone },
];
