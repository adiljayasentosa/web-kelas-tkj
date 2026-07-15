"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BOTTOM_NAV } from "@/config/nav.config";

/**
 * Bottom Navigation — HANYA tampil di mobile (<768px), disembunyikan di
 * tablet/desktop karena Sidebar sudah menangani navigasi di sana.
 * Lihat ui-ux-planning-website-kelas-v1.0.md §2 & §8.2.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="bg-background fixed inset-x-0 bottom-0 z-40 flex border-t md:hidden"
      aria-label="Navigasi utama"
    >
      {BOTTOM_NAV.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="size-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
