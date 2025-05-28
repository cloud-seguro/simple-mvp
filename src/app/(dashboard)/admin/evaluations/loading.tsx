"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingTable } from "@/components/table/loading-table";

export default function AdminEvaluationsLoading() {
  return (
    <div className="w-full py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-5 w-[350px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-10 rounded" />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-fit mb-6">
          <TabsTrigger value="all" disabled>
            Todas
          </TabsTrigger>
          <TabsTrigger value="pending" disabled>
            Pendientes
          </TabsTrigger>
          <TabsTrigger value="completed" disabled>
            Completadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Skeleton className="h-6 w-[150px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-[120px]" />
                  <Skeleton className="h-9 w-[100px]" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingTable columnCount={5} rowCount={5} showToolbar={false} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
