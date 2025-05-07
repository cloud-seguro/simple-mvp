"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BlogPostEditorLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/blog">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-5 w-96 bg-gray-200 animate-pulse rounded mt-1"></div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          {/* Title input */}
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Slug field */}
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Excerpt field */}
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-24 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Status select */}
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Tags field */}
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Featured image */}
          <div className="space-y-2">
            <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-40 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Editor tabs */}
          <Tabs defaultValue="rich-editor">
            <TabsList className="mb-2">
              <TabsTrigger value="rich-editor" disabled>
                Editor Enriquecido
              </TabsTrigger>
              <TabsTrigger value="markdown" disabled>
                Markdown
              </TabsTrigger>
              <TabsTrigger value="preview" disabled>
                Vista previa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rich-editor">
              {/* Editor toolbar */}
              <div className="border rounded-t p-2">
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 bg-gray-200 animate-pulse rounded"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Editor content */}
              <div className="h-96 w-full border rounded-b bg-gray-50 flex items-center justify-center">
                <div className="w-3/4 space-y-4">
                  <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-6 border-t">
          <Button variant="outline" disabled>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          </Button>
          <Button disabled className="gap-2">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
