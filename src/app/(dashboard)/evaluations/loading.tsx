"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LoadingTable } from "@/components/table/loading-table";

export default function EvaluationsLoading() {
  return (
    <div className="w-full py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <div className="space-y-6">
        <Tabs defaultValue="initial" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="initial">Evaluación Inicial</TabsTrigger>
            <TabsTrigger value="advanced" disabled>
              Evaluación Avanzada
            </TabsTrigger>
          </TabsList>

          <TabsContent value="initial" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <Skeleton className="h-4 w-16" />
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Skeleton className="h-4 w-16" />
                    </Button>
                  </div>
                </CardTitle>
                <Skeleton className="h-5 w-full max-w-lg" />
              </CardHeader>
              <CardContent>
                <LoadingTable columnCount={5} rowCount={4} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Just show the same skeleton for advanced tab */}
          <TabsContent value="advanced">
            {/* Same skeleton structure as above */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
