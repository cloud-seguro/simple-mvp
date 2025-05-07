"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EvaluationsCompareLoading() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Evaluation Selection */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[180px]" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-36 w-full rounded-md" />
                <Skeleton className="h-36 w-full rounded-md" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Comparison Preview */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-[120px]" />
                  <Skeleton className="h-6 w-[80px]" />
                </div>
                <div className="mt-4 space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-6 w-[70px]" />
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-[120px]" />
                  <Skeleton className="h-6 w-[80px]" />
                </div>
                <div className="mt-4 space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-6 w-[70px]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Skeleton className="h-10 w-[180px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
