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
import { GitCompareIcon, ArrowUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Check if the compare query parameter is present
  useEffect(() => {
    const shouldOpenCompare = searchParams.get("compare") === "true";
    if (shouldOpenCompare && evaluations.length >= 2) {
      setOpen(true);
    }
  }, [searchParams, evaluations.length]);

  // Filter and sort evaluations by type and selected sort order
  const evaluationsByType = evaluations
    .filter((evaluation) => evaluation.type === evaluationType)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const availableFirstEvaluations = evaluationsByType;
  const availableSecondEvaluations = evaluationsByType.filter(
    (evaluation) => evaluation.id !== firstEvaluationId
  );

  const handleCompare = () => {
    if (firstEvaluationId && secondEvaluationId) {
      router.push(
        `/evaluations/compare?first=${firstEvaluationId}&second=${secondEvaluationId}&type=${evaluationType}&sortOrder=${sortOrder}`
      );
      setOpen(false);
    }
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

  // Reset selection when changing evaluation type or sort order
  const handleTypeChange = (type: "INITIAL" | "ADVANCED") => {
    setEvaluationType(type);
    setFirstEvaluationId("");
    setSecondEvaluationId("");
  };

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comparar Evaluaciones</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de evaluación, el orden y dos evaluaciones para
            comparar sus resultados
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Sort Order Selection */}
          <div className="grid gap-2">
            <Label htmlFor="sort-order" className="text-sm font-medium">
              Orden de evaluaciones
            </Label>
            <Select value={sortOrder} onValueChange={handleSortOrderChange}>
              <SelectTrigger id="sort-order">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Más reciente a más antigua
                  </div>
                </SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Más antigua a más reciente
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              </TabsTrigger>
              <TabsTrigger
                value="ADVANCED"
                disabled={advancedEvaluationsCount < 2}
              >
                Evaluaciones Avanzadas{" "}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="INITIAL">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="first-evaluation"
                    className="text-sm font-medium"
                  >
                    {sortOrder === "asc" ? "Primera" : "Primera"} Evaluación
                    Inicial
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
                    <SelectTrigger
                      id="first-evaluation"
                      className="h-auto py-2"
                    >
                      {firstEvaluationId ? (
                        <div className="flex flex-col items-start text-left">
                          <span className="font-medium">
                            {
                              availableFirstEvaluations.find(
                                (e) => e.id === firstEvaluationId
                              )?.title
                            }
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>
                              {format(
                                new Date(
                                  availableFirstEvaluations.find(
                                    (e) => e.id === firstEvaluationId
                                  )?.createdAt || new Date()
                                ),
                                "d MMM yyyy",
                                { locale: es }
                              )}
                            </span>
                            <span className="font-semibold">
                              {format(
                                new Date(
                                  availableFirstEvaluations.find(
                                    (e) => e.id === firstEvaluationId
                                  )?.createdAt || new Date()
                                ),
                                "HH:mm",
                                { locale: es }
                              )}
                            </span>
                            <span
                              className={`ml-2 px-1.5 py-0.5 rounded ${(() => {
                                const score = availableFirstEvaluations.find(
                                  (e) => e.id === firstEvaluationId
                                )?.score;
                                return score !== null && score !== undefined
                                  ? score >= 70
                                    ? "bg-green-100 text-green-800"
                                    : score >= 50
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800";
                              })()}`}
                            >
                              {(() => {
                                const score = availableFirstEvaluations.find(
                                  (e) => e.id === firstEvaluationId
                                )?.score;
                                return score !== null && score !== undefined
                                  ? `${Math.round(score)}%`
                                  : "N/A";
                              })()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <SelectValue placeholder="Selecciona una evaluación" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {availableFirstEvaluations.map((evaluation) => (
                        <SelectItem key={evaluation.id} value={evaluation.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {evaluation.title}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {format(
                                  new Date(evaluation.createdAt),
                                  "d MMM yyyy",
                                  { locale: es }
                                )}
                              </span>
                              <span className="font-semibold">
                                {format(
                                  new Date(evaluation.createdAt),
                                  "HH:mm",
                                  { locale: es }
                                )}
                              </span>
                              <span
                                className={`ml-2 px-1.5 py-0.5 rounded ${
                                  evaluation.score !== null
                                    ? evaluation.score >= 70
                                      ? "bg-green-100 text-green-800"
                                      : evaluation.score >= 50
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {evaluation.score !== null
                                  ? `${Math.round(evaluation.score)}%`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
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
                    {sortOrder === "asc" ? "Segunda" : "Segunda"} Evaluación
                    Inicial
                  </label>
                  <Select
                    value={secondEvaluationId}
                    onValueChange={setSecondEvaluationId}
                    disabled={!firstEvaluationId}
                  >
                    <SelectTrigger
                      id="second-evaluation"
                      className="h-auto py-2"
                    >
                      {secondEvaluationId ? (
                        <div className="flex flex-col items-start text-left">
                          <span className="font-medium">
                            {
                              availableSecondEvaluations.find(
                                (e) => e.id === secondEvaluationId
                              )?.title
                            }
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>
                              {format(
                                new Date(
                                  availableSecondEvaluations.find(
                                    (e) => e.id === secondEvaluationId
                                  )?.createdAt || new Date()
                                ),
                                "d MMM yyyy",
                                { locale: es }
                              )}
                            </span>
                            <span className="font-semibold">
                              {format(
                                new Date(
                                  availableSecondEvaluations.find(
                                    (e) => e.id === secondEvaluationId
                                  )?.createdAt || new Date()
                                ),
                                "HH:mm",
                                { locale: es }
                              )}
                            </span>
                            <span
                              className={`ml-2 px-1.5 py-0.5 rounded ${(() => {
                                const score = availableSecondEvaluations.find(
                                  (e) => e.id === secondEvaluationId
                                )?.score;
                                return score !== null && score !== undefined
                                  ? score >= 70
                                    ? "bg-green-100 text-green-800"
                                    : score >= 50
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800";
                              })()}`}
                            >
                              {(() => {
                                const score = availableSecondEvaluations.find(
                                  (e) => e.id === secondEvaluationId
                                )?.score;
                                return score !== null && score !== undefined
                                  ? `${Math.round(score)}%`
                                  : "N/A";
                              })()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <SelectValue placeholder="Selecciona una evaluación" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {availableSecondEvaluations.map((evaluation) => (
                        <SelectItem key={evaluation.id} value={evaluation.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {evaluation.title}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {format(
                                  new Date(evaluation.createdAt),
                                  "d MMM yyyy",
                                  { locale: es }
                                )}
                              </span>
                              <span className="font-semibold">
                                {format(
                                  new Date(evaluation.createdAt),
                                  "HH:mm",
                                  { locale: es }
                                )}
                              </span>
                              <span
                                className={`ml-2 px-1.5 py-0.5 rounded ${
                                  evaluation.score !== null
                                    ? evaluation.score >= 70
                                      ? "bg-green-100 text-green-800"
                                      : evaluation.score >= 50
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {evaluation.score !== null
                                  ? `${Math.round(evaluation.score)}%`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
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
                    {sortOrder === "asc" ? "Primera" : "Primera"} Evaluación
                    Avanzada
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
                    <SelectTrigger
                      id="first-evaluation-advanced"
                      className="h-auto py-2"
                    >
                      {firstEvaluationId ? (
                        <div className="flex flex-col items-start text-left">
                          <span className="font-medium">
                            {
                              availableFirstEvaluations.find(
                                (e) => e.id === firstEvaluationId
                              )?.title
                            }
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>
                              {format(
                                new Date(
                                  availableFirstEvaluations.find(
                                    (e) => e.id === firstEvaluationId
                                  )?.createdAt || new Date()
                                ),
                                "d MMM yyyy",
                                { locale: es }
                              )}
                            </span>
                            <span className="font-semibold">
                              {format(
                                new Date(
                                  availableFirstEvaluations.find(
                                    (e) => e.id === firstEvaluationId
                                  )?.createdAt || new Date()
                                ),
                                "HH:mm",
                                { locale: es }
                              )}
                            </span>
                            <span
                              className={`ml-2 px-1.5 py-0.5 rounded ${(() => {
                                const score = availableFirstEvaluations.find(
                                  (e) => e.id === firstEvaluationId
                                )?.score;
                                return score !== null && score !== undefined
                                  ? score >= 70
                                    ? "bg-green-100 text-green-800"
                                    : score >= 50
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800";
                              })()}`}
                            >
                              {(() => {
                                const score = availableFirstEvaluations.find(
                                  (e) => e.id === firstEvaluationId
                                )?.score;
                                return score !== null && score !== undefined
                                  ? `${Math.round(score)}%`
                                  : "N/A";
                              })()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <SelectValue placeholder="Selecciona una evaluación" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {availableFirstEvaluations.map((evaluation) => (
                        <SelectItem key={evaluation.id} value={evaluation.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {evaluation.title}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {format(
                                  new Date(evaluation.createdAt),
                                  "d MMM yyyy",
                                  { locale: es }
                                )}
                              </span>
                              <span className="font-semibold">
                                {format(
                                  new Date(evaluation.createdAt),
                                  "HH:mm",
                                  { locale: es }
                                )}
                              </span>
                              <span
                                className={`ml-2 px-1.5 py-0.5 rounded ${
                                  evaluation.score !== null
                                    ? evaluation.score >= 70
                                      ? "bg-green-100 text-green-800"
                                      : evaluation.score >= 50
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {evaluation.score !== null
                                  ? `${Math.round(evaluation.score)}%`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
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
                    {sortOrder === "asc" ? "Segunda" : "Segunda"} Evaluación
                    Avanzada
                  </label>
                  <Select
                    value={secondEvaluationId}
                    onValueChange={setSecondEvaluationId}
                    disabled={!firstEvaluationId}
                  >
                    <SelectTrigger
                      id="second-evaluation-advanced"
                      className="h-auto py-2"
                    >
                      {secondEvaluationId ? (
                        <div className="flex flex-col items-start text-left">
                          <span className="font-medium">
                            {
                              availableSecondEvaluations.find(
                                (e) => e.id === secondEvaluationId
                              )?.title
                            }
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>
                              {format(
                                new Date(
                                  availableSecondEvaluations.find(
                                    (e) => e.id === secondEvaluationId
                                  )?.createdAt || new Date()
                                ),
                                "d MMM yyyy",
                                { locale: es }
                              )}
                            </span>
                            <span className="font-semibold">
                              {format(
                                new Date(
                                  availableSecondEvaluations.find(
                                    (e) => e.id === secondEvaluationId
                                  )?.createdAt || new Date()
                                ),
                                "HH:mm",
                                { locale: es }
                              )}
                            </span>
                            <span
                              className={`ml-2 px-1.5 py-0.5 rounded ${(() => {
                                const score = availableSecondEvaluations.find(
                                  (e) => e.id === secondEvaluationId
                                )?.score;
                                return score !== null && score !== undefined
                                  ? score >= 70
                                    ? "bg-green-100 text-green-800"
                                    : score >= 50
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800";
                              })()}`}
                            >
                              {(() => {
                                const score = availableSecondEvaluations.find(
                                  (e) => e.id === secondEvaluationId
                                )?.score;
                                return score !== null && score !== undefined
                                  ? `${Math.round(score)}%`
                                  : "N/A";
                              })()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <SelectValue placeholder="Selecciona una evaluación" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {availableSecondEvaluations.map((evaluation) => (
                        <SelectItem key={evaluation.id} value={evaluation.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {evaluation.title}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {format(
                                  new Date(evaluation.createdAt),
                                  "d MMM yyyy",
                                  { locale: es }
                                )}
                              </span>
                              <span className="font-semibold">
                                {format(
                                  new Date(evaluation.createdAt),
                                  "HH:mm",
                                  { locale: es }
                                )}
                              </span>
                              <span
                                className={`ml-2 px-1.5 py-0.5 rounded ${
                                  evaluation.score !== null
                                    ? evaluation.score >= 70
                                      ? "bg-green-100 text-green-800"
                                      : evaluation.score >= 50
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {evaluation.score !== null
                                  ? `${Math.round(evaluation.score)}%`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
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
