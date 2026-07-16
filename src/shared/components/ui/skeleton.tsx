import { cn } from "@/lib/utils";

/**
 * Placeholder animasi saat data async (query React Query) masih loading.
 * Pakai lewat komposisi — atur ukuran/bentuk lewat className di tiap
 * pemanggilan, mis. <Skeleton className="h-4 w-32" /> untuk baris teks,
 * <Skeleton className="size-9 rounded-full" /> untuk avatar.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="status"
      aria-label="Memuat"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
