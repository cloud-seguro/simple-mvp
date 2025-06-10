"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function BreachVerificationLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Shield className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-9 w-80" />
            <Skeleton className="h-6 w-96" />
          </div>
        </div>

        <div className="bg-muted/30 border-l-4 border-primary p-6 rounded-r-lg">
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <Card className="border-2 shadow-lg">
        <div className="p-8 space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-3">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>

          {/* Form Section */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>

          {/* Results Section Skeleton */}
          <div className="space-y-8">
            <Card className="border-2 bg-gradient-to-r from-background to-muted/20">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-72" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-96" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-4 gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>

      {/* Footer Skeleton */}
      <Card className="border-2 bg-muted/20">
        <div className="p-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-primary animate-pulse" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-3 w-96 mx-auto" />
          </div>
        </div>
      </Card>
    </div>
  );
}
