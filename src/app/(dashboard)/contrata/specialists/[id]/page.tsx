import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Star,
  CheckCircle,
  Shield,
  Users,
  Clock,
  DollarSign,
} from "lucide-react";
import { SERVICE_PACKAGES } from "@/lib/constants/service-packages";

export const metadata = {
  title: "Detalles del Especialista | CONTRATA | SIMPLE",
  description:
    "Ver detalles sobre un especialista en ciberseguridad y sus servicios",
};

// Add dynamic export to handle the cookies usage
export const dynamic = "force-dynamic";

export default async function SpecialistDetailPage({
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

  // Convert SERVICE_PACKAGES to array for easier mapping
  const servicePackagesArray = Object.values(SERVICE_PACKAGES).filter(
    (pkg) => pkg.id !== "custom"
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Navigation */}
      <Link
        href="/contrata"
        className="inline-flex items-center text-primary hover:text-primary/80"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Volver a todos los especialistas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Specialist Profile */}
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
              <CardDescription className="space-y-2">
                {specialist.location && (
                  <div className="flex items-center justify-center text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {specialist.location}
                  </div>
                )}
                <div className="flex items-center justify-center text-sm">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  {specialist._count.engagements} proyectos completados
                </div>
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
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{specialist.contactEmail}</span>
                </div>
                {specialist.linkedinProfileUrl && (
                  <div className="flex items-center text-sm text-muted-foreground">
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

              {/* CTA Button */}
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link href={`/contrata/hire/${specialist.id}`}>
                    Contratar Especialista
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services and Pricing */}
        <div className="lg:col-span-2 space-y-8">
          {/* Services Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Servicios y Precios</span>
              </CardTitle>
              <CardDescription>
                Todos nuestros especialistas ofrecen los mismos servicios con
                precios estándar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicePackagesArray.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">
                          {service.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {service.description}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <Badge variant="secondary" className="mb-1">
                          ${service.price}
                        </Badge>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.duration}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center text-xs text-muted-foreground"
                        >
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Why Choose This Specialist */}
          <Card>
            <CardHeader>
              <CardTitle>¿Por qué elegir a {specialist.name}?</CardTitle>
              <CardDescription>
                Ventajas de trabajar con este especialista certificado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Especialista Verificado
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Perfil verificado y certificaciones validadas por
                        nuestro equipo
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Experiencia Comprobada
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {specialist._count.engagements} proyectos completados
                        exitosamente
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Calidad Garantizada
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Servicios respaldados por nuestra garantía de
                        satisfacción
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Soporte Continuo</h4>
                      <p className="text-xs text-muted-foreground">
                        Comunicación directa y soporte durante todo el proyecto
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process */}
          <Card>
            <CardHeader>
              <CardTitle>Proceso de Contratación</CardTitle>
              <CardDescription>
                Cómo funciona el proceso desde la solicitud hasta la entrega
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Solicitud</h4>
                    <p className="text-xs text-muted-foreground">
                      Envía tu solicitud con los detalles del proyecto
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Evaluación</h4>
                    <p className="text-xs text-muted-foreground">
                      El especialista revisa tu solicitud y confirma
                      disponibilidad
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Ejecución</h4>
                    <p className="text-xs text-muted-foreground">
                      Trabajo colaborativo con comunicación constante
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Entrega</h4>
                    <p className="text-xs text-muted-foreground">
                      Entrega de resultados y documentación completa
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
