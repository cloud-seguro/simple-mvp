// Standard service packages with uniform pricing
export const SERVICE_PACKAGES = {
  CONSULTATION: {
    id: "consultation",
    title: "Consulta de Ciberseguridad",
    description:
      "Evaluación inicial de tu infraestructura de seguridad y recomendaciones personalizadas",
    price: 150,
    duration: "1-2 horas",
    durationDays: 1,
    features: [
      "Análisis inicial de vulnerabilidades",
      "Recomendaciones de seguridad",
      "Plan de acción personalizado",
      "Sesión de Q&A",
    ],
  },
  SECURITY_AUDIT: {
    id: "security_audit",
    title: "Auditoría de Seguridad",
    description:
      "Evaluación completa de tu infraestructura de seguridad con reporte detallado",
    price: 500,
    duration: "3-5 días",
    durationDays: 5,
    features: [
      "Análisis completo de vulnerabilidades",
      "Revisión de configuraciones",
      "Reporte ejecutivo detallado",
      "Plan de remediación",
    ],
  },
  INCIDENT_RESPONSE: {
    id: "incident_response",
    title: "Respuesta a Incidentes",
    description:
      "Respuesta inmediata y gestión de incidentes de ciberseguridad",
    price: 300,
    duration: "24-48 horas",
    durationDays: 2,
    features: [
      "Respuesta inmediata 24/7",
      "Contención del incidente",
      "Análisis forense básico",
      "Reporte de incidente",
    ],
  },
  TRAINING: {
    id: "training",
    title: "Capacitación en Ciberseguridad",
    description:
      "Formación especializada para tu equipo en mejores prácticas de seguridad",
    price: 400,
    duration: "1-2 días",
    durationDays: 2,
    features: [
      "Capacitación personalizada",
      "Material de entrenamiento",
      "Ejercicios prácticos",
      "Certificado de participación",
    ],
  },
  COMPLIANCE_REVIEW: {
    id: "compliance_review",
    title: "Revisión de Cumplimiento",
    description:
      "Evaluación de cumplimiento normativo (ISO 27001, SOC 2, GDPR, etc.)",
    price: 600,
    duration: "5-7 días",
    durationDays: 7,
    features: [
      "Evaluación de cumplimiento",
      "Gap analysis detallado",
      "Roadmap de implementación",
      "Documentación de procesos",
    ],
  },
  PENETRATION_TEST: {
    id: "penetration_test",
    title: "Pruebas de Penetración",
    description:
      "Pruebas de penetración completas para identificar vulnerabilidades críticas",
    price: 800,
    duration: "7-10 días",
    durationDays: 10,
    features: [
      "Pruebas de penetración completas",
      "Análisis de vulnerabilidades",
      "Reporte ejecutivo y técnico",
      "Sesión de presentación de resultados",
    ],
  },
  CUSTOM: {
    id: "custom",
    title: "Servicio Personalizado",
    description: "Proyecto personalizado según tus necesidades específicas",
    price: 0,
    duration: "A definir",
    durationDays: 0,
    features: [
      "Solución a medida",
      "Alcance personalizado",
      "Precio según complejidad",
      "Cronograma flexible",
    ],
  },
} as const;

// Service package IDs for validation
export const SERVICE_PACKAGE_IDS = Object.values(SERVICE_PACKAGES).map(
  (pkg) => pkg.id
);

// Service package names for display
export const SERVICE_PACKAGE_NAMES: Record<string, string> = {
  consultation: "Consulta de Ciberseguridad",
  security_audit: "Auditoría de Seguridad",
  incident_response: "Respuesta a Incidentes",
  training: "Capacitación en Ciberseguridad",
  compliance_review: "Revisión de Cumplimiento",
  penetration_test: "Pruebas de Penetración",
  custom: "Servicio Personalizado",
};

// Urgency levels
export const URGENCY_LEVELS = {
  LOW: {
    id: "LOW",
    label: "Baja - Planificado",
    description: "1-2 semanas",
    color: "green",
  },
  MEDIUM: {
    id: "MEDIUM",
    label: "Media - Normal",
    description: "3-7 días",
    color: "yellow",
  },
  HIGH: {
    id: "HIGH",
    label: "Alta - Urgente",
    description: "24-48 horas",
    color: "red",
  },
} as const;

// Urgency level IDs for validation
export const URGENCY_LEVEL_IDS = Object.keys(URGENCY_LEVELS);

// Urgency level names for display
export const URGENCY_LEVEL_NAMES: Record<string, string> = {
  LOW: "Baja (1-2 semanas)",
  MEDIUM: "Media (3-7 días)",
  HIGH: "Alta (24-48 horas)",
};

// Standard pricing overview for display
export const STANDARD_PRICING = {
  CONSULTATION: {
    price: 150,
    duration: "1-2 horas",
    description: "Consulta inicial y evaluación",
  },
  SECURITY_AUDIT: {
    price: 500,
    duration: "3-5 días",
    description: "Auditoría completa de seguridad",
  },
  INCIDENT_RESPONSE: {
    price: 300,
    duration: "24-48 horas",
    description: "Respuesta inmediata a incidentes",
  },
  TRAINING: {
    price: 400,
    duration: "1-2 días",
    description: "Capacitación en ciberseguridad",
  },
  COMPLIANCE_REVIEW: {
    price: 600,
    duration: "5-7 días",
    description: "Revisión de cumplimiento normativo",
  },
  PENETRATION_TEST: {
    price: 800,
    duration: "7-10 días",
    description: "Pruebas de penetración completas",
  },
} as const;
