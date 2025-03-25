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
        title: "Success",
        description: "Specialist created successfully",
      });
    } catch (error) {
      console.error("Error creating specialist:", error);
      toast({
        title: "Error",
        description: "Failed to create specialist",
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
        title: "Success",
        description: "Specialist updated successfully",
      });
    } catch (error) {
      console.error("Error updating specialist:", error);
      toast({
        title: "Error",
        description: "Failed to update specialist",
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
        title: "Success",
        description: "Specialist deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting specialist:", error);
      toast({
        title: "Error",
        description: "Failed to delete specialist",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Specialists</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingSpecialist(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Specialist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingSpecialist ? "Edit Specialist" : "Add New Specialist"}
              </DialogTitle>
              <DialogDescription>
                {editingSpecialist
                  ? "Update specialist information"
                  : "Add a new cybersecurity specialist to recommend to users"}
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
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-medium text-gray-900">
            No specialists added yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Add specialists to recommend to users based on their evaluation
            results.
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" /> Add your first specialist
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialists.map((specialist) => (
            <Card key={specialist.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{specialist.name}</CardTitle>
                    <CardDescription>
                      Maturity Level: {specialist.minMaturityLevel}-
                      {specialist.maxMaturityLevel}
                    </CardDescription>
                  </div>
                  {specialist.imageUrl && (
                    <div className="w-12 h-12 rounded-full overflow-hidden">
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
                  <p className="text-sm text-gray-500 mb-1">Expertise:</p>
                  <div className="flex flex-wrap gap-2">
                    {specialist.expertiseAreas.map((area) => (
                      <Badge key={area} variant="secondary">
                        {area.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm mt-2 line-clamp-3">{specialist.bio}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingSpecialist(specialist);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSpecialist(specialist.id)}
                  disabled={isDeleting && deleteId === specialist.id}
                >
                  {isDeleting && deleteId === specialist.id ? (
                    "Deleting..."
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
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
