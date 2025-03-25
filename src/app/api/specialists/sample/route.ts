import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ExpertiseArea, UserRole } from "@prisma/client";

// GET - Creates a sample specialist for testing
// WARNING: Only for development use
export async function GET(req: NextRequest) {
  // Authentication check
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find a SUPERADMIN profile to assign as creator
    const adminProfile = await prisma.profile.findFirst({
      where: { role: UserRole.SUPERADMIN },
    });

    // If no SUPERADMIN exists, make the current user a SUPERADMIN
    let creatorId: string;
    if (!adminProfile) {
      // Find or create profile for current user
      const currentUserProfile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
      });

      if (currentUserProfile) {
        // Update existing profile to SUPERADMIN
        await prisma.profile.update({
          where: { id: currentUserProfile.id },
          data: { role: UserRole.SUPERADMIN },
        });
        creatorId = currentUserProfile.id;
      } else {
        return NextResponse.json(
          { error: "No profile found and couldn't create one" },
          { status: 400 }
        );
      }
    } else {
      creatorId = adminProfile.id;
    }

    // Create a sample specialist
    const specialist = await prisma.specialist.create({
      data: {
        name: "Ana Rodríguez",
        bio: "Especialista en seguridad con más de 10 años de experiencia en protección de infraestructuras críticas y consultoría para empresas medianas y grandes.",
        expertiseAreas: [
          ExpertiseArea.NETWORK_SECURITY,
          ExpertiseArea.INCIDENT_RESPONSE,
          ExpertiseArea.SECURITY_ASSESSMENT,
        ],
        contactEmail: "ana.rodriguez@example.com",
        contactPhone: "+1 234 567 8901",
        website: "https://example.com/anarod",
        minMaturityLevel: 1,
        maxMaturityLevel: 3,
        location: "Madrid, España",
        active: true,
        createdById: creatorId,
      },
    });

    // Create another sample specialist
    const specialist2 = await prisma.specialist.create({
      data: {
        name: "Carlos Méndez",
        bio: "Experto en seguridad en la nube y cumplimiento normativo. Certificado en AWS, Azure y GCP con enfoque en arquitecturas seguras y gestión de identidades.",
        expertiseAreas: [
          ExpertiseArea.CLOUD_SECURITY,
          ExpertiseArea.COMPLIANCE,
          ExpertiseArea.SECURITY_ARCHITECTURE,
        ],
        contactEmail: "carlos.mendez@example.com",
        contactPhone: "+1 987 654 3210",
        website: "https://example.com/carlosmendez",
        minMaturityLevel: 2,
        maxMaturityLevel: 5,
        location: "Barcelona, España",
        active: true,
        createdById: creatorId,
      },
    });

    // Create a third specialist for higher maturity levels
    const specialist3 = await prisma.specialist.create({
      data: {
        name: "Elena Gómez",
        bio: "Especialista en seguridad avanzada y respuesta a incidentes. Experiencia en SOC, CERT y análisis forense digital para empresas del sector financiero.",
        expertiseAreas: [
          ExpertiseArea.INCIDENT_RESPONSE,
          ExpertiseArea.SECURITY_TRAINING,
          ExpertiseArea.DATA_PROTECTION,
        ],
        contactEmail: "elena.gomez@example.com",
        contactPhone: "+1 555 123 4567",
        website: "https://example.com/elenagomez",
        minMaturityLevel: 3,
        maxMaturityLevel: 5,
        location: "Valencia, España",
        active: true,
        createdById: creatorId,
      },
    });

    return NextResponse.json({
      message: "Sample specialists created",
      specialists: [specialist, specialist2, specialist3],
    });
  } catch (error) {
    console.error("Error creating sample specialists:", error);
    return NextResponse.json(
      { error: "Failed to create sample specialists" },
      { status: 500 }
    );
  }
}
