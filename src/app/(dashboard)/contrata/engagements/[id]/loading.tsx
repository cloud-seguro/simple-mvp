"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EngagementDetailLoading() {
  return (
    <div className="w-full py-8 space-y-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/contrata/engagements">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-5 w-12 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="h-2 w-full bg-gray-200 animate-pulse rounded-full">
                  <div
                    className="h-2 bg-gray-300 rounded-full"
                    style={{ width: `${20 + Math.random() * 60}%` }}
                  ></div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <div className="h-5 w-28 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 w-28 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <div className="h-9 w-full bg-gray-200 animate-pulse rounded"></div>
            </CardFooter>
          </Card>

          {/* Specialist Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-5 w-36 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-5 w-5 bg-gray-200 animate-pulse rounded-full"
                  ></div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <div className="h-9 w-full bg-gray-200 animate-pulse rounded"></div>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="messages">Mensajes</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>

                  {/* Service Details */}
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-1">
                          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-4">
                        <div className="mt-1 h-6 w-6 bg-gray-200 animate-pulse rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-5 w-36 bg-gray-200 animate-pulse rounded"></div>
                          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
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
