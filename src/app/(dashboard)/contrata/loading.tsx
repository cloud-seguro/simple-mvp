"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContrataLoading() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-5 w-full max-w-2xl bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Service Card Skeletons */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden border-2">
            <CardHeader className="space-y-2 p-6">
              <div className="h-10 w-10 bg-gray-200 animate-pulse rounded"></div>
              <CardTitle>
                <div className="h-6 w-36 bg-gray-200 animate-pulse rounded"></div>
              </CardTitle>
              <div className="h-24 w-full bg-gray-200 animate-pulse rounded"></div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
              <div className="pt-4 space-y-4">
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-4 w-full max-w-3xl bg-gray-200 animate-pulse rounded"></div>
          <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    </div>
  );
}
