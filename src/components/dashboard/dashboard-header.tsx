"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GitCompareIcon, PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  hasMultipleEvaluations: boolean;
}

export function DashboardHeader({
  userName,
  hasMultipleEvaluations,
}: DashboardHeaderProps) {
  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Bienvenido, {userName}</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/evaluations/new">
            <Button className="w-full sm:w-auto gap-2">
              <PlusCircle className="h-4 w-4" />
              Nueva Evaluación
            </Button>
          </Link>
          {hasMultipleEvaluations && (
            <Link href="/evaluations">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <GitCompareIcon className="h-4 w-4" />
                Comparar Evaluaciones
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
