"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function EvaluationLoading() {
  return (
    <div className="container py-8 space-y-8">
      {/* Header with back button and title */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link href="/evaluations">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-5 w-40" />
        </div>
      </div>

      {/* Evaluation content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Score summary */}
              <div className="mb-8 p-6 border rounded-lg bg-gray-50">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="relative h-40 w-40 flex items-center justify-center">
                    <Skeleton className="h-40 w-40 rounded-full" />
                    <div className="absolute h-24 w-24 rounded-full bg-white flex items-center justify-center">
                      <Skeleton className="h-12 w-16" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="h-5 w-24 mx-auto" />
                        <Skeleton className="h-10 w-16 mx-auto mt-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="resumen">
                <TabsList className="mb-4">
                  <TabsTrigger value="resumen">Resumen</TabsTrigger>
                  <TabsTrigger value="detalle">Detalle</TabsTrigger>
                  <TabsTrigger value="graficos">Gráficos</TabsTrigger>
                </TabsList>

                <TabsContent value="resumen" className="space-y-6">
                  {/* Categories */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <div className="relative h-4 w-full rounded-full overflow-hidden">
                        <Skeleton className="absolute inset-0" />
                        <div
                          className="absolute h-4 bg-primary/30 rounded-full left-0 top-0 bottom-0"
                          style={{ width: `${20 + Math.random() * 60}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="detalle" className="space-y-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="graficos" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Skeleton className="h-48 w-48 rounded-full" />
                    </div>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Skeleton className="h-48 w-full" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-2 pb-4 border-b last:border-0 last:pb-0"
                >
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
