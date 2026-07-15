"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import type { NavItem } from "@/config/nav.config";

interface DrawerNavProps {
  items: NavItem[];
  onSignOut?: () => void;
}

/**
 * Drawer (slide-out) untuk mobile — menampung menu di luar 4 item utama
 * Bottom Nav (Piket, Galeri, Dokumentasi, dsb). Dipicu tombol hamburger.
 * Lihat ui-ux-planning-website-kelas-v1.0.md §2.
 */
export function DrawerNav({ items, onSignOut }: DrawerNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Buka menu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        {onSignOut ? (
          <div className="mt-auto p-4">
            <Button variant="outline" className="w-full" onClick={onSignOut}>
              Keluar
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
