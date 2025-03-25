"use client";

import { useState, useEffect } from "react";
import { Specialist } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Globe, MapPin } from "lucide-react";
import Image from "next/image";

interface SpecialistsRecommendationsProps {
  maturityLevel: number;
  categories?: string[];
}

export function SpecialistsRecommendations({
  maturityLevel,
  categories = [],
}: SpecialistsRecommendationsProps) {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialists = async () => {
      setIsLoading(true);
      setError(null);

      console.log(
        `Component: Fetching specialists for maturity level ${maturityLevel}`
      );
      console.log(`Component: Categories: ${categories.join(", ")}`);

      try {
        const categoriesParam =
          categories.length > 0 ? `&categories=${categories.join(",")}` : "";

        const url = `/api/specialists/recommended?level=${maturityLevel}${categoriesParam}`;
        console.log(`Component: Fetching from URL: ${url}`);

        const response = await fetch(url);
        console.log(`Component: Response status: ${response.status}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed fetch response: ${response.status}`, errorText);
          throw new Error(
            `Failed to fetch specialists: ${response.status} ${errorText}`
          );
        }

        const data = await response.json();
        console.log(`Component: Received ${data.length} specialists`);
        setSpecialists(data);
      } catch (err) {
        console.error("Error fetching recommended specialists:", err);
        // Show user-friendly error message but keep technical details in console
        setError(
          "Unable to load specialist recommendations. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Don't fetch if maturity level is invalid
    if (maturityLevel >= 1 && maturityLevel <= 5) {
      fetchSpecialists();
    } else {
      console.error(`Invalid maturity level: ${maturityLevel}`);
      setError("Invalid maturity level specified");
      setIsLoading(false);
    }
  }, [maturityLevel, categories]);

  if (isLoading) {
    return (
      <div className="py-4">
        <h3 className="text-lg font-semibold mb-2">
          Especialistas Recomendados
        </h3>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-100 p-4 rounded-lg">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-12 bg-gray-300 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <h3 className="text-lg font-semibold mb-2">
          Especialistas Recomendados
        </h3>
        <div className="bg-red-50 p-4 rounded-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (specialists.length === 0) {
    return (
      <div className="py-4">
        <h3 className="text-lg font-semibold mb-2">
          Especialistas Recomendados
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
          No hay especialistas disponibles para este nivel de madurez.
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h3 className="text-lg font-semibold mb-2">Especialistas Recomendados</h3>
      <p className="text-gray-600 mb-4">
        Basado en tu nivel de madurez, te recomendamos los siguientes
        especialistas para ayudarte a mejorar tu seguridad:
      </p>
      <div className="space-y-4">
        {specialists.map((specialist) => (
          <div
            key={specialist.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex items-start p-4">
              <div className="flex-grow">
                <h4 className="font-semibold text-lg">{specialist.name}</h4>
                {specialist.location && (
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {specialist.location}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                  {specialist.expertiseAreas &&
                  Array.isArray(specialist.expertiseAreas) ? (
                    specialist.expertiseAreas.map((area) => (
                      <Badge key={area} variant="outline" className="text-xs">
                        {typeof area === "string"
                          ? area.replace(/_/g, " ")
                          : area}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      General
                    </Badge>
                  )}
                </div>
              </div>
              {specialist.imageUrl ? (
                <div className="w-16 h-16 rounded-full overflow-hidden ml-4">
                  <Image
                    src={specialist.imageUrl}
                    alt={specialist.name}
                    className="object-cover"
                    width={64}
                    height={64}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ml-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="px-4 pb-2">
              <p className="text-gray-700 text-sm mb-3">{specialist.bio}</p>
            </div>
            <div className="bg-gray-50 p-4 border-t">
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center"
                  asChild
                >
                  <a href={`mailto:${specialist.contactEmail}`}>
                    <Mail className="h-4 w-4 mr-2" /> Email
                  </a>
                </Button>
                {specialist.contactPhone && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center"
                    asChild
                  >
                    <a href={`tel:${specialist.contactPhone}`}>
                      <Phone className="h-4 w-4 mr-2" /> Llamar
                    </a>
                  </Button>
                )}
                {specialist.website && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center"
                    asChild
                  >
                    <a
                      href={specialist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" /> Sitio Web
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
