"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Evaluation } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GitCompareIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CompareEvaluationsButtonProps {
  evaluations: Evaluation[];
}

export function CompareEvaluationsButton({
  evaluations,
}: CompareEvaluationsButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [firstEvaluationId, setFirstEvaluationId] = useState<string>("");
  const [secondEvaluationId, setSecondEvaluationId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [evaluationType, setEvaluationType] = useState<"INITIAL" | "ADVANCED">(
    "INITIAL"
  );

  // Check if the compare query parameter is present
  useEffect(() => {
    const shouldOpenCompare = searchParams.get("compare") === "true";
    if (shouldOpenCompare && evaluations.length >= 2) {
      setOpen(true);
    }
  }, [searchParams, evaluations.length]);

  // Filter evaluations by type and selection
  const evaluationsByType = evaluations.filter(
    (evaluation) => evaluation.type === evaluationType
  );

  const availableFirstEvaluations = evaluationsByType;
  const availableSecondEvaluations = evaluationsByType.filter(
    (evaluation) => evaluation.id !== firstEvaluationId
  );

  const handleCompare = () => {
    if (firstEvaluationId && secondEvaluationId) {
      router.push(
        `/evaluations/compare?first=${firstEvaluationId}&second=${secondEvaluationId}&type=${evaluationType}`
      );
      setOpen(false);
    }
  };

  // Format evaluation option label
  const formatEvaluationLabel = (evaluation: Evaluation) => {
    const date = format(new Date(evaluation.createdAt), "d MMM yyyy", {
      locale: es,
    });
    return `${evaluation.title} - ${date}`;
  };

  // Check if there are at least 2 evaluations of a specific type
  const initialEvaluationsCount = evaluations.filter(
    (e) => e.type === "INITIAL"
  ).length;
  const advancedEvaluationsCount = evaluations.filter(
    (e) => e.type === "ADVANCED"
  ).length;
  const isDisabled =
    initialEvaluationsCount < 2 && advancedEvaluationsCount < 2;

  // Reset selection when changing evaluation type
  const handleTypeChange = (type: "INITIAL" | "ADVANCED") => {
    setEvaluationType(type);
    setFirstEvaluationId("");
    setSecondEvaluationId("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled} variant="outline" className="gap-2">
          <GitCompareIcon className="h-4 w-4" />
          Comparar Evaluaciones
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Comparar Evaluaciones</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de evaluación y dos evaluaciones para comparar
            sus resultados
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Tabs
            defaultValue="INITIAL"
            className="w-full"
            onValueChange={(value) =>
              handleTypeChange(value as "INITIAL" | "ADVANCED")
            }
          >
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger
                value="INITIAL"
                disabled={initialEvaluationsCount < 2}
              >
                Evaluaciones Iniciales{" "}
                {initialEvaluationsCount < 2 ? "(Insuficientes)" : ""}
              </TabsTrigger>
              <TabsTrigger
                value="ADVANCED"
                disabled={advancedEvaluationsCount < 2}
              >
                Evaluaciones Avanzadas{" "}
                {advancedEvaluationsCount < 2 ? "(Insuficientes)" : ""}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="INITIAL">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="first-evaluation"
                    className="text-sm font-medium"
                  >
                    Primera Evaluación Inicial
                  </label>
                  <Select
                    value={firstEvaluationId}
                    onValueChange={(value) => {
                      setFirstEvaluationId(value);
                      // Reset second evaluation if it's the same as the first
                      if (value === secondEvaluationId) {
                        setSecondEvaluationId("");
                      }
                    }}
                  >
                    <SelectTrigger id="first-evaluation">
                      <SelectValue placeholder="Selecciona una evaluación" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFirstEvaluations.map((evaluation) => (
                        <SelectItem key={evaluation.id} value={evaluation.id}>
                          {formatEvaluationLabel(evaluation)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="second-evaluation"
                    className="text-sm font-medium"
                  >
                    Segunda Evaluación Inicial
                  </label>
                  <Select
                    value={secondEvaluationId}
                    onValueChange={setSecondEvaluationId}
                    disabled={!firstEvaluationId}
                  >
                    <SelectTrigger id="second-evaluation">
                      <SelectValue placeholder="Selecciona una evaluación" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSecondEvaluations.map((evaluation) => (
                        <SelectItem key={evaluation.id} value={evaluation.id}>
                          {formatEvaluationLabel(evaluation)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ADVANCED">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="first-evaluation-advanced"
                    className="text-sm font-medium"
                  >
                    Primera Evaluación Avanzada
                  </label>
                  <Select
                    value={firstEvaluationId}
                    onValueChange={(value) => {
                      setFirstEvaluationId(value);
                      if (value === secondEvaluationId) {
                        setSecondEvaluationId("");
                      }
                    }}
                  >
                    <SelectTrigger id="first-evaluation-advanced">
                      <SelectValue placeholder="Selecciona una evaluación" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFirstEvaluations.map((evaluation) => (
                        <SelectItem key={evaluation.id} value={evaluation.id}>
                          {formatEvaluationLabel(evaluation)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="second-evaluation-advanced"
                    className="text-sm font-medium"
                  >
                    Segunda Evaluación Avanzada
                  </label>
                  <Select
                    value={secondEvaluationId}
                    onValueChange={setSecondEvaluationId}
                    disabled={!firstEvaluationId}
                  >
                    <SelectTrigger id="second-evaluation-advanced">
                      <SelectValue placeholder="Selecciona una evaluación" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSecondEvaluations.map((evaluation) => (
                        <SelectItem key={evaluation.id} value={evaluation.id}>
                          {formatEvaluationLabel(evaluation)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleCompare}
            disabled={!firstEvaluationId || !secondEvaluationId}
          >
            Comparar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
