import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { PUBLIC_NAV } from "@/config/nav.config";

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-8">
      <Link href="/" className="font-semibold">
        Website Kelas
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        {PUBLIC_NAV.map((item) => (
          <Link key={item.href} href={item.href} className="text-sm font-medium hover:underline">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button asChild size="sm">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </header>
  );
}
