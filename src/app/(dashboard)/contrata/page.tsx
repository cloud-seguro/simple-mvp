import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STANDARD_PRICING } from "@/lib/constants/service-packages";

// Add dynamic export to handle the cookies usage
export const dynamic = "force-dynamic";

export const metadata = {
  title: "CONTRATA - Contrata Especialistas | SIMPLE",
  description:
    "Encuentra y contrata especialistas en ciberseguridad para cubrir tus necesidades",
};

export default async function ContrataPage() {
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

  // Fetch all active specialists
  const specialists = await prisma.specialist.findMany({
    where: {
      active: true,
    },
    include: {
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
    orderBy: {
      name: "asc",
    },
  });

  // Fetch user's existing engagements
  const engagements = await prisma.engagement.findMany({
    where: {
      profileId: profile.id,
    },
    select: {
      id: true,
      title: true,
      status: true,
      budget: true,
      specialist: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5, // Only show recent engagements
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">CONTRATA</h1>
        </div>
        <h2 className="text-xl text-muted-foreground">
          Especialistas en Ciberseguridad Certificados
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Conecta con expertos en seguridad digital para proteger tu negocio.
          Precios transparentes y servicios estandarizados para todas tus
          necesidades de ciberseguridad.
        </p>
      </div>

      {/* Pricing Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Precios Estándar</span>
          </CardTitle>
          <CardDescription>
            Tarifas fijas y transparentes para todos nuestros especialistas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(STANDARD_PRICING).map(([key, service]) => (
              <div key={key} className="bg-white rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{service.description}</h4>
                  <Badge variant="secondary">${service.price}</Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {service.duration}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active engagements section */}
      {engagements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tus Contratos Activos</CardTitle>
            <CardDescription>
              Gestiona tus proyectos en curso con especialistas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagements.map((engagement) => (
                <Link
                  key={engagement.id}
                  href={`/contrata/engagements/${engagement.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      {engagement.specialist.imageUrl ? (
                        <Image
                          src={engagement.specialist.imageUrl}
                          alt={engagement.specialist.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{engagement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Con: {engagement.specialist.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusVariant(engagement.status)}>
                        {translateStatus(engagement.status)}
                      </Badge>
                      {engagement.budget && (
                        <p className="text-sm text-muted-foreground mt-1">
                          ${engagement.budget}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link
              href="/contrata/engagements"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Ver todos los contratos →
            </Link>
          </CardFooter>
        </Card>
      )}

      {/* Available specialists section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Especialistas Disponibles</h2>
          <Badge variant="outline" className="text-sm">
            {specialists.length} especialistas activos
          </Badge>
        </div>

        {specialists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map((specialist) => (
              <Card
                key={specialist.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    {specialist.imageUrl ? (
                      <Image
                        src={specialist.imageUrl}
                        alt={specialist.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {specialist.name}
                      </CardTitle>
                      {specialist.location && (
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {specialist.location}
                        </p>
                      )}
                      <div className="flex items-center mt-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-muted-foreground">
                          {specialist._count.engagements} proyectos completados
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground line-clamp-3">
                    {specialist.bio}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Especialidades
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {specialist.expertiseAreas.slice(0, 3).map((area) => (
                          <Badge
                            key={area}
                            variant="secondary"
                            className="text-xs"
                          >
                            {translateExpertiseArea(area)}
                          </Badge>
                        ))}
                        {specialist.expertiseAreas.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{specialist.expertiseAreas.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    {specialist.skills && specialist.skills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Habilidades
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {specialist.skills.slice(0, 4).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {specialist.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{specialist.skills.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between pt-4">
                  <Button variant="outline" asChild>
                    <Link href={`/contrata/specialists/${specialist.id}`}>
                      Ver Perfil
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/contrata/hire/${specialist.id}`}>
                      Contratar
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No hay especialistas disponibles
              </h3>
              <p className="text-muted-foreground mb-4">
                Actualmente no tenemos especialistas activos. Por favor,
                contacta con nosotros.
              </p>
              <Button variant="outline" asChild>
                <a href="mailto:contacto@ciberseguridadsimple.com">
                  Contactar Soporte
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Helper function to get badge variant based on status
function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "PENDING":
      return "outline";
    case "ACCEPTED":
      return "secondary";
    case "IN_PROGRESS":
      return "default";
    case "COMPLETED":
      return "secondary";
    case "REJECTED":
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}

// Helper functions to translate status and expertise areas to Spanish
function translateStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Pendiente",
    ACCEPTED: "Aceptado",
    REJECTED: "Rechazado",
    IN_PROGRESS: "En Progreso",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
  };

  return statusMap[status] || status;
}

function translateExpertiseArea(area: string): string {
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

  return areaMap[area] || area.replace(/_/g, " ");
}
