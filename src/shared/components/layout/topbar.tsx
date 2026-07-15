"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { DrawerNav } from "@/shared/components/layout/drawer-nav";
import type { NavItem } from "@/config/nav.config";

interface TopbarProps {
  userName: string;
  userPhotoURL?: string | null;
  drawerItems: NavItem[];
  onSignOut: () => void;
}

export function Topbar({ userName, userPhotoURL, drawerItems, onSignOut }: TopbarProps) {
  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2 md:hidden">
        <DrawerNav items={drawerItems} onSignOut={onSignOut} />
      </div>

      <p className="text-sm font-medium">Halo, {userName}</p>

      <Avatar>
        {userPhotoURL ? <AvatarImage src={userPhotoURL} alt={userName} /> : null}
        <AvatarFallback>{initials || "?"}</AvatarFallback>
      </Avatar>
    </header>
  );
}
