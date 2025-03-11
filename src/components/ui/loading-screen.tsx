"use client";

import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

interface LoadingScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function LoadingScreen({
  message = "Cargando...",
  className,
  ...props
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background",
        className
      )}
      {...props}
    >
      <Loader size="lg" variant="primary" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
