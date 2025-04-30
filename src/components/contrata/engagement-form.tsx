"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ExpertiseArea } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { secureSupabaseClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { X, Upload, File, Paperclip } from "lucide-react";

// Types for the component props
type SpecialistInfo = {
  id: string;
  name: string;
  expertiseAreas: ExpertiseArea[];
  contactEmail: string;
  deals: {
    id: string;
    title: string;
    description: string;
    price: number;
    durationDays: number;
  }[];
};

type DealInfo = {
  id: string;
  title: string;
  description: string;
  price: number;
  durationDays: number;
} | null;

// Define the form schema
const engagementFormSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "El título debe tener al menos 5 caracteres.",
    })
    .max(100, {
      message: "El título no puede exceder los 100 caracteres.",
    }),
  description: z
    .string()
    .min(20, {
      message: "La descripción debe tener al menos 20 caracteres.",
    })
    .max(1000, {
      message: "La descripción no puede exceder los 1000 caracteres.",
    }),
  budget: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "El presupuesto debe ser un número válido.",
    })
    .refine((val) => Number(val) > 0, {
      message: "El presupuesto debe ser mayor que cero.",
    }),
  timeframe: z.string().min(1, {
    message: "Por favor selecciona un plazo.",
  }),
  dealId: z.string().optional(),
});

type EngagementFormValues = z.infer<typeof engagementFormSchema>;

// File upload related types
type FileUpload = {
  file: File;
  preview: string;
  uploading: boolean;
  error?: string;
};

export const EngagementForm = ({
  specialist,
  profileId,
  selectedDeal,
}: {
  specialist: SpecialistInfo;
  profileId: string;
  selectedDeal: DealInfo;
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [files, setFiles] = useState<FileUpload[]>([]);

  const form = useForm<EngagementFormValues>({
    resolver: zodResolver(engagementFormSchema),
    defaultValues: {
      title: selectedDeal ? `${selectedDeal.title} Service Request` : "",
      description: selectedDeal ? selectedDeal.description : "",
      budget: selectedDeal ? selectedDeal.price.toString() : "",
      timeframe: selectedDeal ? selectedDeal.durationDays.toString() : "",
      dealId: selectedDeal?.id,
    },
  });

  const { setValue, watch, handleSubmit } = form;

  // Watch for dealId changes to update form values
  const watchDealId = watch("dealId");

  useEffect(() => {
    if (watchDealId) {
      const deal = specialist.deals.find((d) => d.id === watchDealId);
      if (deal) {
        setValue("title", `${deal.title} Service Request`);
        setValue("description", deal.description);
        setValue("budget", deal.price.toString());
        setValue("timeframe", deal.durationDays.toString());
      }
    }
  }, [watchDealId, specialist.deals, setValue]);

  // Clean up file preview URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((fileUpload) => {
        if (fileUpload.preview) {
          URL.revokeObjectURL(fileUpload.preview);
        }
      });
    };
  }, [files]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
    }));

    setFiles([...files, ...newFiles]);
    e.target.value = "";
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    const newFiles = [...files];
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview);
    }
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // Upload files to Supabase storage
  const uploadFiles = async (): Promise<
    { fileName: string; fileUrl: string; fileType: string; fileSize: number }[]
  > => {
    if (files.length === 0) return [];

    const uploadPromises = files.map(async (fileUpload, index) => {
      try {
        const newFiles = [...files];
        newFiles[index].uploading = true;
        setFiles(newFiles);

        const file = fileUpload.file;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `engagements/${profileId}/${fileName}`;

        const { error } = await secureSupabaseClient.storage
          .from("attachments")
          .upload(filePath, file);

        if (error) throw error;

        const { data: urlData } = secureSupabaseClient.storage
          .from("attachments")
          .getPublicUrl(filePath);

        return {
          fileName: file.name,
          fileUrl: urlData.publicUrl,
          fileType: file.type,
          fileSize: file.size,
        };
      } catch (error) {
        console.error("Error uploading file:", error);
        const newFiles = [...files];
        newFiles[index].error = "Failed to upload";
        newFiles[index].uploading = false;
        setFiles(newFiles);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  const onSubmit = async (data: EngagementFormValues) => {
    setIsSubmitting(true);

    try {
      const {
        data: { session },
      } = await secureSupabaseClient.auth.getSession();

      if (!session) {
        router.push("/sign-in");
        return;
      }

      // Upload any attached files
      const attachments = await uploadFiles();

      // Format the data for submission
      const formattedData = {
        title: data.title,
        description: data.description,
        budget: data.budget ? parseFloat(data.budget) : null,
        timeframe: data.timeframe ? parseInt(data.timeframe) : null,
        specialistId: specialist.id,
        profileId: profileId,
        dealId: data.dealId || null,
        attachments: attachments,
      };

      // Submit the engagement request
      const response = await fetch("/api/contrata/engagements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Algo salió mal");
      }

      const result = await response.json();
      toast({
        title: "Éxito",
        description: "Solicitud enviada con éxito",
      });
      router.push(`/contrata/engagements/${result.id}`);
    } catch (error) {
      console.error("Error submitting engagement:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Contratar a {specialist.name}</h2>
        <p className="text-muted-foreground mt-1">
          Complete el formulario a continuación para enviar una solicitud de
          contratación.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Predefined Packages */}
          {specialist.deals.length > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">
                Choose a Predefined Package (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialist.deals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => {
                      setValue("dealId", deal.id);
                      setValue("timeframe", deal.durationDays.toString());
                    }}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      watchDealId === deal.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`deal-${deal.id}`}
                        value={deal.id}
                        checked={watchDealId === deal.id}
                        className="h-4 w-4 text-primary border-muted focus:ring-primary"
                      />
                      <label
                        htmlFor={`deal-${deal.id}`}
                        className="ml-2 block text-sm font-medium"
                      >
                        {deal.title}
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {deal.description}
                    </p>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">
                        ${deal.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {deal.durationDays} days
                      </span>
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => {
                    setValue("dealId", undefined);
                    setValue("title", "");
                    setValue("description", "");
                    setValue("budget", "");
                    setValue("timeframe", "");
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    !watchDealId
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="custom-service"
                      checked={!watchDealId}
                      onChange={() => {
                        setValue("dealId", undefined);
                        setValue("title", "");
                        setValue("description", "");
                        setValue("budget", "");
                        setValue("timeframe", "");
                      }}
                      className="h-4 w-4 text-primary border-muted focus:ring-primary"
                    />
                    <label
                      htmlFor="custom-service"
                      className="ml-2 block text-sm font-medium"
                    >
                      Custom Service Request
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create a custom request based on your specific needs
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Request Details */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título del Proyecto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Auditoría de Seguridad de la Red Corporativa"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Un título claro y conciso para tu proyecto.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción del Proyecto</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe los detalles de tu proyecto, objetivos, alcance, y cualquier otra información relevante..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Proporciona información detallada para que el especialista
                  pueda entender tus necesidades.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Attachments */}
          <div>
            <FormLabel>Archivos Adjuntos</FormLabel>
            <div className="mt-2 border-2 border-dashed rounded-md p-6">
              <div className="flex flex-col items-center justify-center">
                <Paperclip className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">
                  Arrastra o selecciona archivos
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Puedes subir hasta 5 archivos (máx. 10MB cada uno)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Seleccionar Archivos
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                  disabled={files.length >= 5}
                />
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Archivos seleccionados:</p>
                {files.map((fileUpload, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[200px]">
                        {fileUpload.file.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({Math.round(fileUpload.file.size / 1024)} KB)
                      </span>
                    </div>
                    <div className="flex items-center">
                      {fileUpload.uploading ? (
                        <div className="h-4 w-4 border-2 border-t-transparent border-primary animate-spin rounded-full mr-2"></div>
                      ) : fileUpload.error ? (
                        <span className="text-xs text-destructive mr-2">
                          {fileUpload.error}
                        </span>
                      ) : null}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Formatos permitidos: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, JPEG,
              ZIP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presupuesto (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 500" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tu presupuesto disponible para este proyecto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plazo de Tiempo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un plazo de tiempo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="7">1 semana</SelectItem>
                      <SelectItem value="14">2 semanas</SelectItem>
                      <SelectItem value="30">1 mes</SelectItem>
                      <SelectItem value="60">2 meses</SelectItem>
                      <SelectItem value="90">3 meses</SelectItem>
                      <SelectItem value="180">6 meses</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El tiempo que esperas que dure el proyecto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
