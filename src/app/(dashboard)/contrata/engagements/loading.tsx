"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function EngagementsLoading() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-5 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <Button disabled variant="default" size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
          <TabsTrigger value="archived">Archivados</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Engagement Cards */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center">
                  <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                </CardTitle>
                <CardDescription>
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 animate-pulse rounded-full">
                      <div
                        className="h-2 bg-gray-300 rounded-full"
                        style={{ width: `${20 + Math.random() * 60}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="space-y-1">
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-2">
                    <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
