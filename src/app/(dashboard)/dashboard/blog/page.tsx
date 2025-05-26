import { Metadata } from "next";
import { BlogManagement } from "@/components/dashboard/blog/blog-management";
import { CategoryManagement } from "@/components/dashboard/blog/category-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gestión de Blog | SIMPLE",
  description: "Administración y creación de artículos de blog",
};

export default async function BlogManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Blog</h1>
          <p className="text-muted-foreground">
            Administra y crea artículos para el blog de SIMPLE
          </p>
        </div>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Artículos
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categorías
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <BlogManagement />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
