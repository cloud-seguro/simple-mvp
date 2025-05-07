"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SpecialistDetailLoading() {
  return (
    <div className="container py-8 space-y-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/contrata/specialists">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Specialist Profile Column */}
        <div className="md:col-span-4 space-y-6">
          {/* Profile Card */}
          <Card>
            <div className="h-64 w-full bg-gray-200 animate-pulse"></div>
            <CardHeader className="text-center">
              <CardTitle>
                <div className="h-7 w-48 mx-auto bg-gray-200 animate-pulse rounded"></div>
              </CardTitle>
              <CardDescription>
                <div className="h-5 w-36 mx-auto bg-gray-200 animate-pulse rounded"></div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ratings */}
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-5 w-5 bg-gray-200 animate-pulse rounded-full"
                  ></div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-6 w-12 mx-auto bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-20 mx-auto bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>

              {/* Contact Button */}
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </CardContent>
          </Card>

          {/* Skills & Expertise */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Column */}
        <div className="md:col-span-8 space-y-6">
          <Tabs defaultValue="info">
            <TabsList className="mb-6">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="projects">Proyectos</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>

            {/* Bio Tab */}
            <TabsContent value="info" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-12 w-12 bg-gray-200 animate-pulse rounded"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
                          <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
