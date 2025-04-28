import { Metadata } from "next";
import { BlogManagement } from "@/components/dashboard/blog/blog-management";

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

      <BlogManagement />
    </div>
  );
}
