"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";

interface RedirectToUpgradeProps {
  path: string;
}

export function RedirectToUpgrade({ path }: RedirectToUpgradeProps) {
  const router = useRouter();

  useEffect(() => {
    // Perform client-side navigation
    router.replace(path);
  }, [router, path]);

  // Show loading screen while redirecting
  return (
    <SecurityLoadingScreen message="Redireccionando..." variant="fullscreen" />
  );
}
