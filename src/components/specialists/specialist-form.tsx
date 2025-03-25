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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type SpecialistFormProps = {
  specialist: Specialist | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

const expertiseAreaOptions = Object.values(ExpertiseArea).map((area) => ({
  id: area,
  label: area.replace(/_/g, " "),
}));

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    expertiseAreas: z
      .array(z.nativeEnum(ExpertiseArea))
      .min(1, "Select at least one expertise area"),
    contactEmail: z.string().email("Invalid email address"),
    contactPhone: z.string().optional(),
    website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    imageUrl: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    minMaturityLevel: z.coerce.number().int().min(1).max(5),
    maxMaturityLevel: z.coerce.number().int().min(1).max(5),
    location: z.string().optional(),
    active: z.boolean().default(true),
  })
  .refine((data) => data.minMaturityLevel <= data.maxMaturityLevel, {
    message: "Minimum maturity level cannot be greater than maximum",
    path: ["minMaturityLevel"],
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
          ...specialist,
        }
      : {
          name: "",
          bio: "",
          expertiseAreas: [],
          contactEmail: "",
          contactPhone: "",
          website: "",
          imageUrl: "",
          minMaturityLevel: 1,
          maxMaturityLevel: 5,
          location: "",
          active: true,
        },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
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
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 123 456 7890" {...field} />
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Mexico City, Mexico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minMaturityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Maturity Level (1-5) *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select minimum level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        Level {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Minimum security maturity level for recommendation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxMaturityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Maturity Level (1-5) *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select maximum level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        Level {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Maximum security maturity level for recommendation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio/Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Professional description and qualifications..."
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
                <FormLabel>Areas of Expertise *</FormLabel>
                <FormDescription>
                  Select all relevant areas of expertise
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
                <FormLabel>Active</FormLabel>
                <FormDescription>
                  When active, this specialist will be recommended to users
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
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : specialist
                ? "Update Specialist"
                : "Add Specialist"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
