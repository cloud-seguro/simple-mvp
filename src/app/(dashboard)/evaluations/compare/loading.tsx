"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CompareEvaluationsLoading() {
  return (
    <div className="container py-8 space-y-8">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/evaluations">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-5 w-96 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </CardContent>
      </Card>

      {/* Score Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-12 w-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="h-5 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-12 w-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          </div>

          {/* Category Comparisons */}
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Questions Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 pb-6 border-b last:border-0">
                <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 w-full bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-16 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 w-full bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-16 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
