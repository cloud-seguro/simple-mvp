import { PrismaClient, ExpertiseArea, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // First, we need to create a SUPERADMIN user profile to be the creator of specialists
  // Check if a superadmin already exists
  const existingSuperAdmin = await prisma.profile.findFirst({
    where: {
      role: UserRole.SUPERADMIN,
    },
  });

  // Create superadmin if it doesn't exist
  const superAdmin =
    existingSuperAdmin ||
    (await prisma.profile.create({
      data: {
        userId: "seed-superadmin",
        firstName: "Admin",
        lastName: "SIMPLE",
        email: "admin@simple-sec.com",
        role: UserRole.SUPERADMIN,
        active: true,
      },
    }));

  console.log(`SuperAdmin profile created or found with ID: ${superAdmin.id}`);

  // Define sample specialists with different expertise areas and maturity level ranges
  const specialists = [
    {
      name: "Carlos Martínez",
      bio: "Experto en seguridad de redes con más de 10 años de experiencia trabajando con empresas de todos los tamaños. Certificado en CISSP, CISA y CEH.",
      expertiseAreas: [
        ExpertiseArea.NETWORK_SECURITY,
        ExpertiseArea.SECURITY_ARCHITECTURE,
      ],
      contactEmail: "carlos@cybersecurity-specialists.com",
      contactPhone: "+34 600 123 456",
      website: "https://cybersecurity-specialists.com/carlos",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      minMaturityLevel: 1,
      maxMaturityLevel: 3,
      location: "Madrid, España",
    },
    {
      name: "Ana Rodríguez",
      bio: "Especialista en aplicaciones seguras y desarrollo seguro. Certificada en CSSLP y AWS Security. Experiencia en auditorías de seguridad y análisis de código.",
      expertiseAreas: [
        ExpertiseArea.APPLICATION_SECURITY,
        ExpertiseArea.CLOUD_SECURITY,
      ],
      contactEmail: "ana@securedev-consulting.com",
      contactPhone: "+34 600 789 012",
      website: "https://securedev-consulting.com",
      imageUrl: "https://randomuser.me/api/portraits/women/45.jpg",
      minMaturityLevel: 2,
      maxMaturityLevel: 4,
      location: "Barcelona, España",
    },
    {
      name: "Miguel López",
      bio: "Consultor senior especializado en respuesta a incidentes y forense digital. Certificado en GCFA, GREM y EnCE. Amplia experiencia en gestión de crisis de seguridad.",
      expertiseAreas: [
        ExpertiseArea.INCIDENT_RESPONSE,
        ExpertiseArea.SECURITY_ASSESSMENT,
      ],
      contactEmail: "miguel@incident-response.es",
      contactPhone: "+34 600 345 678",
      website: "https://incident-response.es",
      imageUrl: "https://randomuser.me/api/portraits/men/67.jpg",
      minMaturityLevel: 3,
      maxMaturityLevel: 5,
      location: "Valencia, España",
    },
    {
      name: "Laura Sánchez",
      bio: "Consultora de seguridad especializada en cumplimiento normativo (GDPR, ISO 27001, PCI DSS). Amplia experiencia en auditorías e implementación de controles.",
      expertiseAreas: [ExpertiseArea.COMPLIANCE, ExpertiseArea.DATA_PROTECTION],
      contactEmail: "laura@compliance-security.com",
      contactPhone: "+34 600 901 234",
      website: "https://compliance-security.com",
      imageUrl: "https://randomuser.me/api/portraits/women/22.jpg",
      minMaturityLevel: 1,
      maxMaturityLevel: 5,
      location: "Sevilla, España",
    },
    {
      name: "Javier Gómez",
      bio: "Especialista en formación de seguridad y concienciación. Experiencia en implementación de programas de seguridad integrales para empresas de todos los sectores.",
      expertiseAreas: [ExpertiseArea.SECURITY_TRAINING, ExpertiseArea.GENERAL],
      contactEmail: "javier@security-awareness.es",
      contactPhone: "+34 600 567 890",
      website: "https://security-awareness.es",
      imageUrl: "https://randomuser.me/api/portraits/men/54.jpg",
      minMaturityLevel: 1,
      maxMaturityLevel: 2,
      location: "Málaga, España",
    },
    {
      name: "Elena Díaz",
      bio: "Arquitecta de seguridad con experiencia en diseño de infraestructuras seguras y Zero Trust. Certificada en SABSA y TOGAF. Experiencia en sectores críticos y financieros.",
      expertiseAreas: [
        ExpertiseArea.SECURITY_ARCHITECTURE,
        ExpertiseArea.CLOUD_SECURITY,
      ],
      contactEmail: "elena@security-architect.es",
      contactPhone: "+34 600 234 567",
      website: "https://security-architect.es",
      imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      minMaturityLevel: 3,
      maxMaturityLevel: 5,
      location: "Bilbao, España",
    },
    {
      name: "David Fernández",
      bio: "Consultor de ciberseguridad especializado en protección de datos y seguridad en la nube. Amplia experiencia en análisis de riesgos y planificación estratégica.",
      expertiseAreas: [ExpertiseArea.DATA_PROTECTION, ExpertiseArea.COMPLIANCE],
      contactEmail: "david@data-protect.es",
      contactPhone: "+34 600 678 901",
      website: "https://data-protect.es",
      imageUrl: "https://randomuser.me/api/portraits/men/41.jpg",
      minMaturityLevel: 2,
      maxMaturityLevel: 4,
      location: "Zaragoza, España",
    },
  ];

  // Create specialists and track their creation in database
  console.log("Creating specialists...");

  for (const specialistData of specialists) {
    // Check if the specialist already exists (by name and email to avoid duplicates)
    const existingSpecialist = await prisma.specialist.findFirst({
      where: {
        AND: [
          { name: specialistData.name },
          { contactEmail: specialistData.contactEmail },
        ],
      },
    });

    if (!existingSpecialist) {
      const specialist = await prisma.specialist.create({
        data: {
          ...specialistData,
          createdById: superAdmin.id,
          active: true,
        },
      });
      console.log(
        `Created specialist ${specialist.name} with ID: ${specialist.id}`
      );
    } else {
      console.log(
        `Specialist ${specialistData.name} already exists, skipping...`
      );
    }
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed operation:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
