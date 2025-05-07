import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";

export default function EvaluationLoading() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link href="/evaluations">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="h-5 w-40 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12">
        <SecurityLoadingScreen message="Cargando resultados de la evaluación..." />
      </div>
    </div>
  );
}
