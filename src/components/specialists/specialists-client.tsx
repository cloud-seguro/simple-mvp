"use client";

import { useState } from "react";
import { Specialist } from "@prisma/client";
import { SpecialistForm, formSchema } from "./specialist-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, User } from "lucide-react";
import Image from "next/image";
import { z } from "zod";

type SpecialistsClientProps = {
  initialSpecialists: Specialist[];
  profileId: string;
};

export function SpecialistsClient({
  initialSpecialists,
  profileId,
}: SpecialistsClientProps) {
  const [specialists, setSpecialists] =
    useState<Specialist[]>(initialSpecialists);
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreateSpecialist = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/specialists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          createdById: profileId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create specialist");
      }

      const newSpecialist = await response.json();
      setSpecialists((prev) => [newSpecialist, ...prev]);
      setIsDialogOpen(false);
      toast({
        title: "Éxito",
        description: "Especialista creado correctamente",
      });
    } catch (error) {
      console.error("Error creating specialist:", error);
      toast({
        title: "Error",
        description: "Error al crear el especialista",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSpecialist = async (data: Partial<Specialist>) => {
    if (!editingSpecialist) return;

    try {
      const response = await fetch(`/api/specialists/${editingSpecialist.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update specialist");
      }

      const updatedSpecialist = await response.json();
      setSpecialists((prev) =>
        prev.map((spec) =>
          spec.id === updatedSpecialist.id ? updatedSpecialist : spec
        )
      );
      setEditingSpecialist(null);
      setIsDialogOpen(false);
      toast({
        title: "Éxito",
        description: "Especialista actualizado correctamente",
      });
    } catch (error) {
      console.error("Error updating specialist:", error);
      toast({
        title: "Error",
        description: "Error al actualizar el especialista",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSpecialist = async (id: string) => {
    setIsDeleting(true);
    setDeleteId(id);

    try {
      const response = await fetch(`/api/specialists/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete specialist");
      }

      setSpecialists((prev) => prev.filter((spec) => spec.id !== id));
      toast({
        title: "Éxito",
        description: "Especialista eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting specialist:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el especialista",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <h2 className="text-xl font-semibold">Tus Especialistas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingSpecialist(null);
              }}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Añadir Especialista
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] w-[95vw] max-w-[95vw] sm:w-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSpecialist
                  ? "Editar Especialista"
                  : "Añadir Nuevo Especialista"}
              </DialogTitle>
              <DialogDescription>
                {editingSpecialist
                  ? "Actualizar información del especialista"
                  : "Añade un nuevo especialista en ciberseguridad para recomendar a los usuarios"}
              </DialogDescription>
            </DialogHeader>
            <SpecialistForm
              specialist={editingSpecialist}
              onSubmit={
                editingSpecialist
                  ? handleUpdateSpecialist
                  : handleCreateSpecialist
              }
              onCancel={() => {
                setEditingSpecialist(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {specialists.length === 0 ? (
        <div className="text-center py-8 sm:py-12 border rounded-lg bg-gray-50">
          <User className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400" />
          <h3 className="mt-4 font-medium text-gray-900">
            No hay especialistas añadidos aún
          </h3>
          <p className="mt-2 text-sm text-gray-500 px-4">
            Añade especialistas para recomendar a los usuarios en base a sus
            resultados de evaluación.
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" /> Añade tu primer especialista
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialists.map((specialist) => (
            <Card key={specialist.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="break-words">
                      {specialist.name}
                    </CardTitle>
                    <CardDescription>
                      {specialist.location && (
                        <span className="inline-block">
                          {specialist.location}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {specialist.imageUrl && (
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={specialist.imageUrl}
                        alt={specialist.name}
                        className="object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <p className="text-sm text-gray-500 mb-1">Especialidad:</p>
                  <div className="flex flex-wrap gap-2">
                    {specialist.expertiseAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                {specialist.skills && specialist.skills.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 mb-1">Habilidades:</p>
                    <div className="flex flex-wrap gap-2">
                      {specialist.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm mt-2 line-clamp-3">{specialist.bio}</p>

                {specialist.linkedinProfileUrl && (
                  <a
                    href={specialist.linkedinProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 flex items-center"
                  >
                    <span className="mr-1">Perfil de LinkedIn</span>
                  </a>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingSpecialist(specialist);
                    setIsDialogOpen(true);
                  }}
                  className="w-full sm:w-auto"
                >
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSpecialist(specialist.id)}
                  disabled={isDeleting && deleteId === specialist.id}
                  className="w-full sm:w-auto"
                >
                  {isDeleting && deleteId === specialist.id ? (
                    "Eliminando..."
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
