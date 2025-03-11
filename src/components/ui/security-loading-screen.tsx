"use client";

import { cn } from "@/lib/utils";
import { AnimatedSecuritySVG } from "@/components/ui/animated-security-svg";

interface SecurityLoadingScreenProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  variant?: "default" | "overlay";
}

export function SecurityLoadingScreen({
  message = "Cargando...",
  variant = "default",
  className,
  ...props
}: SecurityLoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-8",
        variant === "overlay" && "fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-8",
          variant === "overlay" && "bg-background p-8 rounded-lg shadow-lg"
        )}
      >
        <div className="w-32">
          <AnimatedSecuritySVG />
        </div>
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
