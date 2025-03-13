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

  // Check if the compare query parameter is present
  useEffect(() => {
    const shouldOpenCompare = searchParams.get("compare") === "true";
    if (shouldOpenCompare && evaluations.length >= 2) {
      setOpen(true);
    }
  }, [searchParams, evaluations.length]);

  // Filter out evaluations already selected
  const availableFirstEvaluations = evaluations;
  const availableSecondEvaluations = evaluations.filter(
    (evaluation) => evaluation.id !== firstEvaluationId
  );

  const handleCompare = () => {
    if (firstEvaluationId && secondEvaluationId) {
      router.push(
        `/evaluations/compare?first=${firstEvaluationId}&second=${secondEvaluationId}`
      );
      setOpen(false);
    }
  };

  // Format evaluation option label
  const formatEvaluationLabel = (evaluation: Evaluation) => {
    const type = evaluation.type === "INITIAL" ? "Inicial" : "Avanzada";
    const date = format(new Date(evaluation.createdAt), "d MMM yyyy", {
      locale: es,
    });
    return `${evaluation.title} (${type}) - ${date}`;
  };

  // Disable button if there are less than 2 evaluations
  const isDisabled = evaluations.length < 2;

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
            Selecciona dos evaluaciones para comparar sus resultados
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="first-evaluation" className="text-sm font-medium">
              Primera Evaluación
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
            <label htmlFor="second-evaluation" className="text-sm font-medium">
              Segunda Evaluación
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
