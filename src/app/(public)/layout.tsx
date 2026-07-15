import { Navbar } from "@/shared/components/layout/navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
