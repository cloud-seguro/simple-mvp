"use client";

import { useState } from "react";
import { Specialist, ExpertiseArea } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

type SpecialistFormProps = {
  specialist: Specialist | null;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
};

const expertiseAreaOptions = Object.values(ExpertiseArea).map((area) => {
  const areaMap: Record<string, string> = {
    NETWORK_SECURITY: "Seguridad de Red",
    APPLICATION_SECURITY: "Seguridad de Aplicaciones",
    CLOUD_SECURITY: "Seguridad en la Nube",
    INCIDENT_RESPONSE: "Respuesta a Incidentes",
    SECURITY_ASSESSMENT: "Evaluación de Seguridad",
    COMPLIANCE: "Cumplimiento Normativo",
    SECURITY_TRAINING: "Formación en Seguridad",
    SECURITY_ARCHITECTURE: "Arquitectura de Seguridad",
    DATA_PROTECTION: "Protección de Datos",
    GENERAL: "General",
  };

  return {
    id: area,
    label: areaMap[area] || area.replace(/_/g, " "),
  };
});

export const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  bio: z.string().min(10, "La biografía debe tener al menos 10 caracteres"),
  expertiseAreas: z
    .array(z.nativeEnum(ExpertiseArea))
    .min(1, "Selecciona al menos un área de especialización"),
  skills: z.array(z.string()).default([]),
  contactEmail: z.string().email("Dirección de correo electrónico inválida"),
  imageUrl: z.string().url("Debe ser una URL válida").nullable().optional(),
  linkedinProfileUrl: z
    .string()
    .url("Debe ser una URL válida")
    .nullable()
    .optional(),
  location: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export function SpecialistForm({
  specialist,
  onSubmit,
  onCancel,
}: SpecialistFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: specialist
      ? {
          name: specialist.name,
          bio: specialist.bio,
          expertiseAreas: specialist.expertiseAreas,
          skills: specialist.skills || [],
          contactEmail: specialist.contactEmail,
          imageUrl: specialist.imageUrl,
          linkedinProfileUrl: specialist.linkedinProfileUrl,
          location: specialist.location,
          active: specialist.active,
        }
      : {
          name: "",
          bio: "",
          expertiseAreas: [],
          skills: [],
          contactEmail: "",
          imageUrl: null,
          linkedinProfileUrl: null,
          location: null,
          active: true,
        },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (
      skillInput.trim() &&
      !form.getValues().skills.includes(skillInput.trim())
    ) {
      const currentSkills = form.getValues().skills || [];
      form.setValue("skills", [...currentSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    const currentSkills = form.getValues().skills || [];
    form.setValue(
      "skills",
      currentSkills.filter((s) => s !== skill)
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 py-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input placeholder="juan@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="linkedinProfileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Perfil de LinkedIn</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://linkedin.com/in/usuario"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ciudad de México, México"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Habilidades</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Añadir una habilidad"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button type="button" onClick={addSkill} variant="outline">
              Añadir
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {form.getValues().skills?.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <XIcon
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeSkill(skill)}
                />
              </Badge>
            ))}
          </div>
          <FormMessage />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Imagen de Perfil</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://ejemplo.com/imagen.jpg"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografía/Descripción *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción profesional y cualificaciones..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertiseAreas"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Áreas de Especialización *</FormLabel>
                <FormDescription>
                  Selecciona todas las áreas de especialización relevantes
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                {expertiseAreaOptions.map((area) => (
                  <FormField
                    key={area.id}
                    control={form.control}
                    name="expertiseAreas"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={area.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                area.id as ExpertiseArea
                              )}
                              onCheckedChange={(checked) => {
                                const updatedAreas = checked
                                  ? [...field.value, area.id]
                                  : field.value?.filter(
                                      (value) => value !== area.id
                                    );
                                field.onChange(updatedAreas);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {area.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Activo</FormLabel>
                <FormDescription>
                  Cuando está activo, este especialista será recomendado a los
                  usuarios
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : specialist
                ? "Actualizar Especialista"
                : "Añadir Especialista"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
