"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { MEMBER_SIDEBAR_NAV, ADMIN_SIDEBAR_NAV } from "@/config/nav.config";

/**
 * Rute di area Member/Admin sengaja masih datar (satu level di bawah
 * root — belum ada halaman detail dinamis seperti /admin/pengumuman/[id],
 * itu scope fitur bisnis). Jadi breadcrumb cukup 2 level: root area
 * ("Dashboard"/"Dashboard Admin") dan halaman aktif. Kalau nanti ada
 * rute bersarang, tinggal perluas logika pemetaan di bawah — tidak perlu
 * ubah komponen Breadcrumb primitive-nya.
 */
export function AutoBreadcrumb() {
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith("/admin");

  const items = isAdminArea ? ADMIN_SIDEBAR_NAV : MEMBER_SIDEBAR_NAV;
  const rootHref = isAdminArea ? "/admin/dashboard" : "/dashboard";
  const rootLabel = isAdminArea ? "Dashboard Admin" : "Dashboard";

  const isRoot = pathname === rootHref;
  const current = items.find((item) => item.href === pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {isRoot ? (
            <BreadcrumbPage>{rootLabel}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={rootHref}>{rootLabel}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {!isRoot ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{current?.label ?? "Halaman"}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
