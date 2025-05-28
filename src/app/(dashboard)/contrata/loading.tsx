"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ContrataLoading() {
  return (
    <div className="w-full py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Service Card Skeletons */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden border-2">
            <CardHeader className="space-y-2 p-6">
              <Skeleton className="h-10 w-10 rounded" />
              <CardTitle>
                <Skeleton className="h-6 w-36" />
              </CardTitle>
              <Skeleton className="h-24 w-full" />
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
              <div className="pt-4 space-y-4">
                <Badge variant="outline" className="px-4 py-1 border-none">
                  <Skeleton className="h-5 w-24" />
                </Badge>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-64" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-4 w-full max-w-3xl" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
