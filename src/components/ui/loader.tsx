"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
  variant?: "default" | "primary";
}

export function Loader({
  size = "default",
  variant = "default",
  className,
  ...props
}: LoaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        {
          "h-4 w-4": size === "sm",
          "h-8 w-8": size === "default",
          "h-12 w-12": size === "lg",
        },
        className
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "h-full w-full rounded-full border-2 border-t-transparent",
          {
            "border-muted": variant === "default",
            "border-primary": variant === "primary",
          }
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
