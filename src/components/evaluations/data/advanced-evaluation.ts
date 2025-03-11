import type { QuizData } from "../types"

export const evaluacionAvanzada: QuizData = {
  id: "evaluacion-avanzada",
  title: "Evaluación Avanzada",
  description: "Evaluación de madurez avanzada en ciberseguridad",
  instructions:
    "Responda a las siguientes preguntas para evaluar el nivel de madurez avanzada en ciberseguridad de su organización. Seleccione la opción que mejor describa su situación actual.",
  questions: [
    {
      id: "politicas-1",
      text: "¿La organización tiene políticas de seguridad de la información formalmente establecidas, comunicadas y alineadas con estándares como ISO 27001 o NIST?",
      category: "Políticas, Normativas y Gobernanza",
      options: [
        { label: "No", value: 0 },
        { label: "En proceso", value: 1 },
        { label: "Sí, pero no actualizadas", value: 2 },
        { label: "Sí, actualizadas y alineadas", value: 3 },
      ],
    },
    {
      id: "politicas-2",
      text: "¿Se cuenta con políticas específicas de uso de dispositivos personales (BYOD) y seguridad en dispositivos móviles?",
      category: "Políticas, Normativas y Gobernanza",
      options: [
        { label: "No", value: 0 },
        { label: "En proceso", value: 1 },
        { label: "Sí, pero no aplicadas", value: 2 },
        { label: "Sí, aplicadas y revisadas regularmente", value: 3 },
      ],
    },
    {
      id: "politicas-3",
      text: "¿Existe un comité de seguridad de la información que supervise estrategias de ciberseguridad y realice revisiones periódicas?",
      category: "Políticas, Normativas y Gobernanza",
      options: [
        { label: "No", value: 0 },
        { label: "En formación", value: 1 },
        { label: "Activo pero sin reuniones periódicas", value: 2 },
        { label: "Activo con revisiones periódicas y reportes", value: 3 },
      ],
    },
    {
      id: "activos-1",
      text: "¿La organización tiene identificados y clasificados sus activos de información y sistemas críticos?",
      category: "Identificación de Activos y Gestión de Riesgos",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Mayoritariamente", value: 2 },
        { label: "Completamente", value: 3 },
      ],
    },
    {
      id: "activos-2",
      text: "¿Existe un proceso de evaluación y gestión de riesgos de ciberseguridad dentro de la empresa?",
      category: "Identificación de Activos y Gestión de Riesgos",
      options: [
        { label: "No", value: 0 },
        { label: "En proceso", value: 1 },
        { label: "Sí, pero no actualizado", value: 2 },
        { label: "Sí y actualizado regularmente", value: 3 },
      ],
    },
    {
      id: "activos-3",
      text: "¿Se han definido procedimientos de eliminación segura de datos y dispositivos conforme a NIST 800-88?",
      category: "Identificación de Activos y Gestión de Riesgos",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Sí, pero no revisado regularmente", value: 2 },
        { label: "Sí, con auditorías y procesos documentados", value: 3 },
      ],
    },
    {
      id: "controles-1",
      text: "¿Se implementan soluciones avanzadas de autenticación, como MFA y Zero Trust?",
      category: "Controles Técnicos y Protección de Infraestructura",
      options: [
        { label: "No", value: 0 },
        { label: "En algunos sistemas", value: 1 },
        { label: "En la mayoría de sistemas", value: 2 },
        { label: "En todos los sistemas críticos", value: 3 },
      ],
    },
    {
      id: "controles-2",
      text: "¿La empresa sigue frameworks de seguridad en la nube como AWS Well-Architected, Google Cloud Security y Azure Security Center?",
      category: "Controles Técnicos y Protección de Infraestructura",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Implementados sin revisión", value: 2 },
        { label: "Implementados y revisados regularmente", value: 3 },
      ],
    },
    {
      id: "controles-3",
      text: "¿Se gestionan parches y vulnerabilidades en todos los sistemas de acuerdo con CIS Controls y NIST 800-53?",
      category: "Controles Técnicos y Protección de Infraestructura",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Sí, pero no en todos los sistemas", value: 2 },
        {
          label: "Sí, con monitoreo automatizado y revisiones periódicas",
          value: 3,
        },
      ],
    },
    {
      id: "monitoreo-1",
      text: "¿Se utilizan herramientas de monitoreo de amenazas (SIEM, EDR, SOC) con detección en tiempo real?",
      category: "Monitoreo, Auditoría y Respuesta a Incidentes",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Sí, pero sin monitoreo continuo", value: 2 },
        { label: "Sí, con SOC y análisis proactivo", value: 3 },
      ],
    },
    {
      id: "monitoreo-2",
      text: "¿Existen métricas e indicadores de gestión para evaluar la efectividad de los controles de ciberseguridad?",
      category: "Monitoreo, Auditoría y Respuesta a Incidentes",
      options: [
        { label: "No", value: 0 },
        { label: "En proceso", value: 1 },
        { label: "Sí, pero sin seguimiento formal", value: 2 },
        { label: "Sí, con revisión periódica y reportes ejecutivos", value: 3 },
      ],
    },
    {
      id: "monitoreo-3",
      text: "¿Se realizan auditorías internas y externas de seguridad de la información?",
      category: "Monitoreo, Auditoría y Respuesta a Incidentes",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Sí, pero sin planes de mejora", value: 2 },
        {
          label: "Sí, con auditorías certificadas y remediación de hallazgos",
          value: 3,
        },
      ],
    },
    {
      id: "desarrollo-1",
      text: "¿Se implementan principios de desarrollo seguro (DevSecOps, revisión de código, SAST/DAST)?",
      category: "Seguridad en Desarrollo y Aplicaciones",
      options: [
        { label: "No", value: 0 },
        { label: "Solo en algunos proyectos", value: 1 },
        { label: "Sí, pero sin herramientas avanzadas", value: 2 },
        {
          label: "Sí, con pruebas de seguridad integradas en el SDLC",
          value: 3,
        },
      ],
    },
    {
      id: "redes-1",
      text: "¿Se han realizado pruebas de penetración (Pentesting) en aplicaciones críticas y redes?",
      category: "Seguridad en Redes y Defensa Activa",
      options: [
        { label: "No", value: 0 },
        { label: "Raramente", value: 1 },
        { label: "Anualmente", value: 2 },
        { label: "Trimestralmente o más frecuente", value: 3 },
      ],
    },
    {
      id: "redes-2",
      text: "¿Se implementa segmentación de red y control de acceso basado en Zero Trust?",
      category: "Seguridad en Redes y Defensa Activa",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Sí, pero sin monitoreo continuo", value: 2 },
        {
          label: "Sí, con segmentación avanzada, monitoreo y auditoría",
          value: 3,
        },
      ],
    },
    {
      id: "redes-3",
      text: "¿La empresa cuenta con ejercicios de Red Team y Blue Team para evaluar y fortalecer la seguridad?",
      category: "Seguridad en Redes y Defensa Activa",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Sí, pero sin reportes estructurados", value: 2 },
        {
          label: "Sí, con evaluaciones recurrentes y acciones de mejora",
          value: 3,
        },
      ],
    },
    {
      id: "ingenieria-1",
      text: "¿Se realizan pruebas de ingeniería social para evaluar la conciencia en ciberseguridad?",
      category: "Ingeniería Social y Resiliencia",
      options: [
        { label: "No", value: 0 },
        { label: "Raramente", value: 1 },
        { label: "Anualmente", value: 2 },
        { label: "Trimestralmente o más frecuente", value: 3 },
      ],
    },
    {
      id: "ingenieria-2",
      text: "¿Se capacita regularmente a los empleados en ciberseguridad y concienciación sobre amenazas?",
      category: "Ingeniería Social y Resiliencia",
      options: [
        { label: "Nunca", value: 0 },
        { label: "Solo al ingresar", value: 1 },
        { label: "Anualmente", value: 2 },
        { label: "Semestralmente o más frecuente", value: 3 },
      ],
    },
    {
      id: "ingenieria-3",
      text: "¿Existe un plan de continuidad del negocio que contemple ciberseguridad?",
      category: "Ingeniería Social y Resiliencia",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente desarrollado", value: 1 },
        { label: "Sí, pero no probado", value: 2 },
        { label: "Sí, probado y actualizado regularmente", value: 3 },
      ],
    },
    {
      id: "incidentes-1",
      text: "¿Existe un plan de respuesta a incidentes formalizado, probado y documentado?",
      category: "Gestión de Incidentes y Resiliencia",
      options: [
        { label: "No", value: 0 },
        { label: "En proceso de desarrollo", value: 1 },
        { label: "Sí, pero no probado regularmente", value: 2 },
        { label: "Sí, probado y actualizado periódicamente", value: 3 },
      ],
    },
    {
      id: "incidentes-2",
      text: "¿Se han realizado simulaciones de respuesta a incidentes cibernéticos (Tabletop Exercises o Cyber Drills)?",
      category: "Gestión de Incidentes y Resiliencia",
      options: [
        { label: "No", value: 0 },
        { label: "Raramente", value: 1 },
        { label: "Anualmente", value: 2 },
        { label: "Trimestralmente o más frecuente", value: 3 },
      ],
    },
    {
      id: "incidentes-3",
      text: "¿Se cuenta con una política de prueba digital y gestión de evidencias en caso de incidentes de seguridad?",
      category: "Gestión de Incidentes y Resiliencia",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Sí, pero no revisada regularmente", value: 2 },
        { label: "Sí, con auditorías y revisiones periódicas", value: 3 },
      ],
    },
    {
      id: "continuidad-1",
      text: "¿Se cuenta con un plan de recuperación ante desastres (DRP) y pruebas periódicas de restauración de datos?",
      category: "Continuidad del Negocio y Protección de la Información",
      options: [
        { label: "No", value: 0 },
        { label: "En desarrollo", value: 1 },
        { label: "Implementado pero no probado regularmente", value: 2 },
        { label: "Implementado y probado con éxito periódicamente", value: 3 },
      ],
    },
    {
      id: "continuidad-2",
      text: "¿Existen procedimientos para la eliminación segura de información confidencial y dispositivos, alineados con NIST 800-88 e ISO 27001:2022?",
      category: "Continuidad del Negocio y Protección de la Información",
      options: [
        { label: "No", value: 0 },
        { label: "En proceso", value: 1 },
        { label: "Sí, pero no aplicado sistemáticamente", value: 2 },
        { label: "Sí, con auditorías y monitoreo periódico", value: 3 },
      ],
    },
    {
      id: "continuidad-3",
      text: "¿La empresa ha implementado controles de seguridad en su infraestructura en la nube (AWS, Google Cloud, Azure) para garantizar la protección de los datos y su disponibilidad?",
      category: "Continuidad del Negocio y Protección de la Información",
      options: [
        { label: "No", value: 0 },
        { label: "En algunos servicios", value: 1 },
        { label: "Sí, pero sin monitoreo continuo", value: 2 },
        {
          label:
            "Sí, con auditorías y controles avanzados en múltiples entornos",
          value: 3,
        },
      ],
    },
  ],
}; 