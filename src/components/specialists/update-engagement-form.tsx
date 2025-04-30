"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { EngagementStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

export function UpdateEngagementForm({
  engagementId,
  currentStatus,
}: {
  engagementId: string;
  currentStatus: EngagementStatus;
}) {
  const [status, setStatus] = useState<EngagementStatus>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const needsReason = (statusValue: EngagementStatus) => {
    return statusValue === "REJECTED" || statusValue === "CANCELLED";
  };

  // Check if current status cannot go back to PENDING
  const cannotReturnToPending =
    currentStatus === "ACCEPTED" ||
    currentStatus === "IN_PROGRESS" ||
    currentStatus === "COMPLETED" ||
    currentStatus === "REJECTED" ||
    currentStatus === "CANCELLED";

  const handleStatusChange = async () => {
    if (status === currentStatus) return;

    // If status is REJECTED or CANCELLED, we need a reason
    if (needsReason(status) && !showDialog) {
      setShowDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/specialists/engagements/${engagementId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            reason: needsReason(status) ? reason : undefined,
            previousStatus: currentStatus,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar estado");
      }

      toast({
        title: "Estado actualizado",
        description: "El estado de la solicitud ha sido actualizado.",
      });

      // Close dialog if open
      setShowDialog(false);
      setReason("");

      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error("Error updating engagement status:", error);
      toast({
        title: "Error",
        description:
          "No se pudo actualizar el estado. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReasonSubmit = () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una razón para este cambio de estado.",
        variant: "destructive",
      });
      return;
    }
    handleStatusChange();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as EngagementStatus)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            {/* Only show PENDING option if the current status allows it */}
            {!cannotReturnToPending && (
              <SelectItem value="PENDING">Pendiente</SelectItem>
            )}
            <SelectItem value="ACCEPTED">Aceptada</SelectItem>
            <SelectItem value="REJECTED">Rechazada</SelectItem>
            <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
            <SelectItem value="COMPLETED">Completada</SelectItem>
            <SelectItem value="CANCELLED">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleStatusChange}
          disabled={status === currentStatus || isLoading}
        >
          {isLoading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {status === "REJECTED"
                ? "Razón para rechazar"
                : "Razón para cancelar"}
            </DialogTitle>
            <DialogDescription>
              Por favor proporciona una razón para este cambio de estado. Este
              mensaje será visible para el cliente.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Escribe la razón aquí..."
            className="min-h-[100px]"
            required
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleReasonSubmit}
              disabled={isLoading || reason.trim() === ""}
            >
              {isLoading ? "Enviando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
