"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-6 w-48" />
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          <Skeleton className="h-10 w-full" />

          <div className="flex items-center justify-center space-x-2">
            <Skeleton className="h-px w-full flex-grow" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-px w-full flex-grow" />
          </div>

          <div className="flex flex-col space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="text-center">
            <Skeleton className="mx-auto h-5 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
