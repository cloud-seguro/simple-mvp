"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Dashboard Header Loading Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled variant="outline" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          </Button>
        </div>
      </div>

      {/* Dashboard Tabs Loading Skeleton */}
      <Tabs defaultValue="loading" className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-6">
          <TabsTrigger value="loading1" disabled>
            Evaluación Inicial
          </TabsTrigger>
          <TabsTrigger value="loading2" disabled>
            Evaluación Avanzada
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loading" className="space-y-6">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{ minHeight: "400px" }}
          >
            {/* Chart Card Skeleton 1 */}
            <Card className="col-span-1 h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                </CardTitle>
                <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="aspect-square w-full max-w-md mx-auto flex items-center justify-center">
                  <div className="h-[300px] w-[300px] bg-gray-200 animate-pulse rounded-full flex items-center justify-center">
                    <div className="h-[150px] w-[150px] bg-white rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart Card Skeleton 2 */}
            <Card className="col-span-1 h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                </CardTitle>
                <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="h-[300px] flex items-end justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-full w-full flex flex-col items-center justify-end"
                    >
                      <div
                        style={{ height: `${20 + Math.random() * 60}%` }}
                        className="w-full bg-gray-200 animate-pulse rounded-t"
                      ></div>
                      <div className="h-4 w-12 mt-2 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Evaluations Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
              </CardTitle>
              <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
