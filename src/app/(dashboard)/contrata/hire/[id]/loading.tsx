"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HireDetailLoading() {
  return (
    <div className="w-full py-8 space-y-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/contrata/specialists">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Specialist Preview */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 w-36 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-5 w-5 bg-gray-200 animate-pulse rounded-full"
                ></div>
              ))}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Skills */}
            <div>
              <div className="h-5 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Selection */}
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-32 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
