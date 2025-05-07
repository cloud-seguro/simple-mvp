"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="h-full w-full flex-1 animate-pulse">
      {/* Sidebar skeleton (won't be seen since the layout preserves the sidebar) */}
      <div className="hidden md:flex fixed inset-y-0 z-50 h-full w-64 flex-col">
        <div className="flex flex-col gap-2 overflow-hidden py-8 px-4">
          <Skeleton className="h-10 w-36 mx-auto" />
          <div className="mt-8 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="md:pl-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur h-16 flex items-center border-b px-4">
          <div className="flex-1 flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </header>

        {/* Main content wrapper */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>

          {/* Card skeleton */}
          <div className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>

          {/* Table skeleton */}
          <div className="border rounded-lg p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
