"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function SpecialistsLoading() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="h-5 w-64 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <Button disabled variant="default" size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Specialist Card Skeletons */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-40 w-full bg-gray-200 animate-pulse"></div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">
                <div className="h-6 w-36 bg-gray-200 animate-pulse rounded"></div>
              </CardTitle>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="h-16 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-1 pt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"
          ></div>
        ))}
      </div>
    </div>
  );
}
