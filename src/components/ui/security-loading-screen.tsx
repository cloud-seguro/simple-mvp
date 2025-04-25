"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedSecuritySVG } from "@/components/ui/animated-security-svg";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SecurityLoadingScreenProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  variant?: "default" | "overlay" | "fullscreen";
  timeout?: number;
}

export function SecurityLoadingScreen({
  message = "Cargando...",
  variant = "default",
  timeout = 10000, // 10 second default timeout
  className,
  ...props
}: SecurityLoadingScreenProps) {
  const [showRetryButton, setShowRetryButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRetryButton(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-8",
        variant === "overlay" && "fixed inset-0 z-50 bg-black/50",
        variant === "fullscreen" && "fixed inset-0 z-50 bg-background",
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

        {showRetryButton && variant !== "fullscreen" && (
          <Button variant="outline" onClick={handleRetry} className="mt-4">
            Reintentar
          </Button>
        )}
      </div>
    </div>
  );
}
