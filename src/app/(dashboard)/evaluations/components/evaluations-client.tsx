"use client";

import { useState } from "react";
import type { Evaluation } from "@prisma/client";
import { EvaluationsList } from "./evaluations-list";
import { CompareEvaluationsButton } from "./compare-evaluations-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowUpDown } from "lucide-react";

interface EvaluationsClientProps {
  evaluations: Evaluation[];
}

export function EvaluationsClient({ evaluations }: EvaluationsClientProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Sort evaluations based on the selected sort order
  const sortedEvaluations = [...evaluations].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Split evaluations by type
  const initialEvaluations = sortedEvaluations.filter(
    (e) => e.type === "INITIAL"
  );
  const advancedEvaluations = sortedEvaluations.filter(
    (e) => e.type === "ADVANCED"
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-order" className="text-sm font-medium">
              Ordenar por:
            </Label>
            <Select
              value={sortOrder}
              onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
            >
              <SelectTrigger id="sort-order" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Más reciente primero
                  </div>
                </SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Más antigua primero
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CompareEvaluationsButton evaluations={sortedEvaluations} />
      </div>

      <Tabs defaultValue="initial" className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-6">
          <TabsTrigger value="initial">Evaluaciones Iniciales</TabsTrigger>
          <TabsTrigger value="advanced">Evaluaciones Avanzadas</TabsTrigger>
        </TabsList>

        <TabsContent value="initial">
          <EvaluationsList evaluations={initialEvaluations} />
        </TabsContent>

        <TabsContent value="advanced">
          <EvaluationsList evaluations={advancedEvaluations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
