"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="h-8 w-36 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="h-5 w-64 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <Tabs defaultValue="loading" className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="loading" disabled>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          </TabsTrigger>
          <TabsTrigger value="loading2" disabled>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          </TabsTrigger>
          <TabsTrigger value="loading3" disabled>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
              </CardTitle>
              <CardDescription>
                <div className="h-4 w-72 bg-gray-200 animate-pulse rounded"></div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
              <div className="pt-4">
                <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
              </CardTitle>
              <CardDescription>
                <div className="h-4 w-72 bg-gray-200 animate-pulse rounded"></div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
