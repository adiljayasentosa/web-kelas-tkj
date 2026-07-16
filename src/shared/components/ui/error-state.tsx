import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * role="alert" supaya screen reader langsung mengumumkan kegagalan saat
 * komponen ini muncul, tanpa user harus mencari-cari sendiri.
 */
export function ErrorState({
  title = "Gagal memuat data",
  description = "Terjadi kesalahan. Coba lagi beberapa saat lagi.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center",
        className
      )}
    >
      <div className="bg-danger/10 flex size-12 items-center justify-center rounded-full">
        <AlertTriangle className="text-danger size-5" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Coba Lagi
        </Button>
      ) : null}
    </div>
  );
}
