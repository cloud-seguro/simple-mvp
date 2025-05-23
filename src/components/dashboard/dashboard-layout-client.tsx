"use client";

import { cn } from "@/lib/utils";
import { SearchProvider } from "@/context/search-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import SkipToMain from "@/components/skip-to-main";
import { Header } from "@/components/sidebar/header";
import { Search } from "@/components/sidebar/search";
import { useEffect, useState } from "react";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { generateClientFingerprint } from "@/lib/utils/session-utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMediaQuery } from "@/hooks/use-media-query";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const router = useRouter();
  console.error("Dashboard error caught:", error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="bg-background p-8 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Algo salió mal</h2>
        <p className="text-muted-foreground mb-6">
          Hubo un error al cargar esta página
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Ir al Dashboard
          </button>
          <button
            onClick={resetErrorBoundary}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardLayoutClient({ children }: DashboardLayoutProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { profile, isLoading } = useCurrentUser();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Handle initial loading with timeout
  useEffect(() => {
    // Set up a timeout to handle cases where loading might get stuck
    const timeoutId = setTimeout(() => {
      if (isInitialLoading) {
        // If still loading after timeout, force refresh
        router.refresh();
      }
    }, 5000); // 5 seconds timeout

    // Simulate component mounting completion
    setIsInitialLoading(false);

    return () => clearTimeout(timeoutId);
  }, [router, isInitialLoading]);

  // Update fingerprint on dashboard load to prevent session-hijacking false positives
  useEffect(() => {
    const updateUserFingerprint = async () => {
      try {
        // Get current session
        const { data } = await supabase.auth.getSession();

        if (data?.session && profile) {
          // Check if user has premium access before updating fingerprint
          // Now using the profile data from useCurrentUser hook
          if (profile.role !== "PREMIUM" && profile.role !== "SUPERADMIN") {
            console.log(
              "Non-premium user detected, redirecting to upgrade page"
            );
            // Don't update fingerprint, let the server handle redirect
            return;
          }

          // Generate current client fingerprint
          const fingerprint = generateClientFingerprint(navigator.userAgent);

          // Update user metadata with the current fingerprint
          await supabase.auth.updateUser({
            data: {
              fingerprint,
              fingerprintMismatchCount: 0, // Reset counter
              last_update: new Date().toISOString(),
            },
          });

          console.log(
            "User fingerprint updated successfully on dashboard load"
          );
        }
      } catch (error) {
        console.error("Error updating fingerprint on dashboard load:", error);
        setHasError(true);
      }
    };

    // Only run fingerprint update when we have both a profile and we're not loading
    if (profile && !isLoading) {
      updateUserFingerprint();
    }
  }, [supabase, profile, isLoading]);

  // If the component is still in initial loading state or we're waiting for user data, show a loading screen
  if (isInitialLoading || isLoading) {
    return <SecurityLoadingScreen message="Cargando dashboard..." />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state when the error boundary is reset
        router.refresh();
      }}
    >
      <SearchProvider>
        <SidebarProvider defaultOpen={!isMobile}>
          <NavigationProgress />
          <SkipToMain />
          <AppSidebar className="fixed inset-y-0 left-0 z-20" />
          <div
            id="main-content"
            className={cn(
              "ml-auto w-full max-w-full",
              "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
              "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
              "transition-all duration-200 ease-linear",
              "flex min-h-screen flex-col",
              "group-data-[scroll-locked=1]/body:h-full",
              "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:min-h-screen",
              // Better mobile handling
              "sm:peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
              "sm:peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
              isMobile && "w-full"
            )}
          >
            <Header>
              <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
                <Search />
              </div>
            </Header>
            <main className="px-2 sm:px-4 py-4 h-[calc(100vh-4rem)] overflow-y-auto">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </SearchProvider>
    </ErrorBoundary>
  );
}
