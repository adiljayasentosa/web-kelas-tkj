"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/nav.config";

interface SidebarProps {
  items: NavItem[];
  className?: string;
}

/**
 * Sidebar persisten untuk desktop/tablet, sesuai
 * ui-ux-planning-website-kelas-v1.0.md §2 (Sidebar dipakai saat menu > 5 item).
 * Di bawah breakpoint `md`, komponen ini disembunyikan — navigasi mobile
 * memakai BottomNav + Drawer (lihat bottom-nav.tsx).
 */
export function Sidebar({ items, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground hidden w-56 shrink-0 flex-col border-r md:flex",
        className
      )}
    >
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
