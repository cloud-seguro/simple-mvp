"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingTable } from "@/components/table/loading-table";

export default function ContrataSpecialistsLoading() {
  return (
    <div className="w-full py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active" disabled>
            Activos
          </TabsTrigger>
          <TabsTrigger value="pending" disabled>
            Pendientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Skeleton className="h-6 w-[200px]" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-[150px]" />
                  <Skeleton className="h-10 w-10 rounded" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingTable columnCount={5} rowCount={5} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-40 relative">
              <Skeleton className="absolute inset-0" />
            </div>
            <CardHeader className="pt-4">
              <div className="absolute -top-8 left-4">
                <Skeleton className="h-16 w-16 rounded-full border-4 border-background" />
              </div>
              <CardTitle className="mt-6">
                <Skeleton className="h-6 w-36" />
              </CardTitle>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-[80px]" />
                <Skeleton className="h-9 w-[80px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
