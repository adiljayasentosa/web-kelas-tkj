import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { PUBLIC_NAV } from "@/config/nav.config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start sm:justify-between md:px-8">
        <div className="space-y-1">
          <p className="font-semibold">{siteConfig.name}</p>
          <p className="text-muted-foreground max-w-xs text-sm">{siteConfig.description}</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm sm:items-end">
          {PUBLIC_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="text-muted-foreground border-t px-4 py-4 text-center text-xs md:px-8">
        © {year} {siteConfig.name}. Dibuat untuk {siteConfig.className}.
      </div>
    </footer>
  );
}
