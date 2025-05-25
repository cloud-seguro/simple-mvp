import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { EngagementForm } from "@/components/contrata/engagement-form";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Mail, Star, CheckCircle, Shield, Users } from "lucide-react";

export const metadata = {
  title: "Contrata Especialista | CONTRATA | SIMPLE",
  description:
    "Contrata un especialista en ciberseguridad para tus necesidades de seguridad",
};

// Add dynamic export to handle the cookies usage
export const dynamic = "force-dynamic";

export default async function HireSpecialistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const specialistId = (await params).id;

  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // Get the user's profile to check their role
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, role: true },
  });

  // If not a PREMIUM or SUPERADMIN user, redirect to dashboard
  if (
    !profile ||
    (profile.role !== UserRole.PREMIUM && profile.role !== UserRole.SUPERADMIN)
  ) {
    redirect("/dashboard");
  }

  // Fetch specialist details with engagement count
  const specialist = await prisma.specialist.findUnique({
    where: {
      id: specialistId,
      active: true,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      bio: true,
      expertiseAreas: true,
      location: true,
      contactEmail: true,
      skills: true,
      linkedinProfileUrl: true,
      _count: {
        select: {
          engagements: {
            where: {
              status: "COMPLETED",
            },
          },
        },
      },
    },
  });

  if (!specialist) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Contratar Especialista</h1>
        <p className="text-muted-foreground">
          Conecta con un experto en ciberseguridad para proteger tu negocio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Specialist Profile Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {specialist.imageUrl ? (
                  <Image
                    src={specialist.imageUrl}
                    alt={specialist.name}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full object-cover border-4 border-primary/10"
                  />
                ) : (
                  <div className="w-30 h-30 rounded-full bg-muted flex items-center justify-center border-4 border-primary/10">
                    <Shield className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardTitle className="text-xl">{specialist.name}</CardTitle>
              <CardDescription className="flex items-center justify-center space-x-4 mt-2">
                {specialist.location && (
                  <span className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {specialist.location}
                  </span>
                )}
                <span className="flex items-center text-sm">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  {specialist._count.engagements} proyectos completados
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Bio */}
              <div>
                <h4 className="font-medium mb-2">Acerca del Especialista</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {specialist.bio}
                </p>
              </div>

              {/* Expertise Areas */}
              <div>
                <h4 className="font-medium mb-3">Áreas de Especialización</h4>
                <div className="flex flex-wrap gap-2">
                  {specialist.expertiseAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="text-xs">
                      {translateExpertiseArea(area)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Skills */}
              {specialist.skills && specialist.skills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Habilidades Técnicas</h4>
                  <div className="flex flex-wrap gap-2">
                    {specialist.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="pt-4 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{specialist.contactEmail}</span>
                </div>
                {specialist.linkedinProfileUrl && (
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Users className="h-4 w-4 mr-2" />
                    <a
                      href={specialist.linkedinProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 truncate"
                    >
                      Perfil de LinkedIn
                    </a>
                  </div>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1 text-green-500" />
                    <span>Verificado</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>Certificado</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Form */}
        <div className="lg:col-span-2">
          <EngagementForm specialist={specialist} profileId={profile.id} />
        </div>
      </div>
    </div>
  );
}

// Helper function to translate expertise areas to Spanish
function translateExpertiseArea(area: string): string {
  const translations: Record<string, string> = {
    NETWORK_SECURITY: "Seguridad de Redes",
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

  return translations[area] || area.replace(/_/g, " ");
}
