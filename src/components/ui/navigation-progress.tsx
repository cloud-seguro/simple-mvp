"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let resetTimeout: NodeJS.Timeout;

    const handleNavigationStart = () => {
      setIsNavigating(true);
      setProgress(0);

      // Clear any existing intervals
      if (progressInterval) clearInterval(progressInterval);
      if (resetTimeout) clearTimeout(resetTimeout);

      // Quickly advance to 20% to show immediate feedback
      setProgress(20);

      // Then simulate progress with slowing increments (never reaching 100%)
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            // Max out at 90% during loading
            clearInterval(progressInterval);
            return 90;
          }

          // Slow down as we get closer to 90%
          const increment = Math.max(1, 10 * (1 - prev / 100));
          return Math.min(90, prev + increment);
        });
      }, 200);
    };

    const handleNavigationEnd = () => {
      // Jump to 100% when navigation completes
      setProgress(100);

      // Keep progress bar visible briefly, then hide
      resetTimeout = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 200);

      if (progressInterval) clearInterval(progressInterval);
    };

    // Listen for our custom navigation events
    window.addEventListener("navigationStart", handleNavigationStart);
    window.addEventListener("navigationEnd", handleNavigationEnd);

    return () => {
      window.removeEventListener("navigationStart", handleNavigationStart);
      window.removeEventListener("navigationEnd", handleNavigationEnd);
      if (progressInterval) clearInterval(progressInterval);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, []);

  if (!isNavigating && progress === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 h-1.5 bg-transparent z-50 pointer-events-none transition-opacity duration-300",
        isNavigating ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)/0.8))",
          boxShadow: "0 0 8px hsl(var(--primary)/0.5)",
          transition: `width ${progress === 100 ? 200 : 400}ms ease-in-out`,
        }}
      />
    </div>
  );
}
