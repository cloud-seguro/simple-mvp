import type { QuizData } from "@/components/evaluations/types";

export const advancedEvaluationData: QuizData = {
  id: "evaluacion-avanzada",
  title: "Evaluación Avanzada de Ciberseguridad",
  description:
    "Evaluación detallada del nivel de madurez en ciberseguridad para organizaciones con necesidades avanzadas.",
  questions: [
    {
      id: "adv_q1",
      text: "¿Su organización implementa un marco de gobernanza de ciberseguridad?",
      category: "Gobernanza y Liderazgo",
      options: [
        { text: "No existe un marco formal de gobernanza", value: 0 },
        {
          text: "Existe una estructura básica sin roles claramente definidos",
          value: 1,
        },
        {
          text: "Existe un marco con roles definidos y responsabilidades asignadas",
          value: 2,
        },
        {
          text: "Existe un marco completo alineado con estándares internacionales y con supervisión ejecutiva",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q2",
      text: "¿Cómo gestiona su organización los activos de información?",
      category: "Gestión de Activos",
      options: [
        { text: "No existe un inventario formal de activos", value: 0 },
        { text: "Existe un inventario básico pero incompleto", value: 1 },
        {
          text: "Existe un inventario completo con clasificación básica",
          value: 2,
        },
        {
          text: "Existe un sistema completo de gestión de activos con clasificación, valoración y ciclo de vida",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q3",
      text: "¿Su organización implementa controles de seguridad basados en el principio de mínimo privilegio?",
      category: "Control de Acceso",
      options: [
        { text: "No se aplica el principio de mínimo privilegio", value: 0 },
        {
          text: "Se aplica de forma inconsistente en algunos sistemas",
          value: 1,
        },
        {
          text: "Se aplica en la mayoría de los sistemas con revisiones ocasionales",
          value: 2,
        },
        {
          text: "Se implementa rigurosamente con revisiones periódicas y automatizadas",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q4",
      text: "¿Cómo gestiona su organización la seguridad en el desarrollo de software?",
      category: "Desarrollo Seguro",
      options: [
        {
          text: "No existen prácticas formales de desarrollo seguro",
          value: 0,
        },
        {
          text: "Se aplican algunas prácticas básicas de forma inconsistente",
          value: 1,
        },
        {
          text: "Existe un proceso definido con revisiones de seguridad",
          value: 2,
        },
        {
          text: "Se implementa un ciclo de vida de desarrollo seguro completo con pruebas automatizadas",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q5",
      text: "¿Su organización realiza pruebas de penetración o evaluaciones de vulnerabilidad?",
      category: "Gestión de Vulnerabilidades",
      options: [
        {
          text: "No se realizan pruebas de penetración o evaluaciones",
          value: 0,
        },
        {
          text: "Se realizan evaluaciones básicas de forma reactiva",
          value: 1,
        },
        {
          text: "Se realizan evaluaciones periódicas siguiendo un proceso",
          value: 2,
        },
        {
          text: "Existe un programa completo con pruebas continuas y gestión de vulnerabilidades",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q6",
      text: "¿Cómo gestiona su organización la seguridad de los proveedores y terceros?",
      category: "Gestión de Terceros",
      options: [
        { text: "No existen controles específicos para proveedores", value: 0 },
        {
          text: "Existen algunos requisitos básicos sin verificación",
          value: 1,
        },
        {
          text: "Existe un proceso formal con evaluaciones iniciales",
          value: 2,
        },
        {
          text: "Existe un programa completo con evaluaciones continuas y monitoreo",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q7",
      text: "¿Su organización implementa controles de seguridad en la nube?",
      category: "Seguridad en la Nube",
      options: [
        {
          text: "No existen controles específicos para entornos cloud",
          value: 0,
        },
        {
          text: "Se aplican controles básicos sin una estrategia definida",
          value: 1,
        },
        {
          text: "Existe una estrategia con controles específicos para cloud",
          value: 2,
        },
        {
          text: "Existe una arquitectura de seguridad cloud completa con controles automatizados",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q8",
      text: "¿Su organización implementa monitoreo de seguridad y detección de amenazas?",
      category: "Monitoreo y Detección",
      options: [
        { text: "No existe monitoreo formal de seguridad", value: 0 },
        {
          text: "Existe monitoreo básico sin correlación de eventos",
          value: 1,
        },
        {
          text: "Existe un SIEM o sistema similar con algunas reglas de detección",
          value: 2,
        },
        {
          text: "Existe un SOC con monitoreo 24/7 y capacidades avanzadas de detección",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q9",
      text: "¿Cómo gestiona su organización la protección de datos sensibles?",
      category: "Protección de Datos",
      options: [
        {
          text: "No existen controles específicos para datos sensibles",
          value: 0,
        },
        {
          text: "Existe clasificación básica sin controles técnicos consistentes",
          value: 1,
        },
        {
          text: "Existen controles técnicos para datos clasificados como sensibles",
          value: 2,
        },
        {
          text: "Existe un programa completo con cifrado, DLP y controles de acceso granulares",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q10",
      text: "¿Su organización tiene un programa de concienciación en ciberseguridad?",
      category: "Concienciación y Formación",
      options: [
        { text: "No existe un programa formal de concienciación", value: 0 },
        {
          text: "Existe formación básica sin medición de efectividad",
          value: 1,
        },
        {
          text: "Existe un programa regular con algunos ejercicios prácticos",
          value: 2,
        },
        {
          text: "Existe un programa completo con simulaciones, métricas y mejora continua",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q11",
      text: "¿Su organización implementa segmentación de red y microsegmentación?",
      category: "Seguridad de Red",
      options: [
        { text: "No existe segmentación de red", value: 0 },
        {
          text: "Existe segmentación básica sin controles granulares",
          value: 1,
        },
        {
          text: "Existe segmentación con algunas políticas basadas en roles",
          value: 2,
        },
        {
          text: "Existe microsegmentación avanzada con políticas basadas en Zero Trust",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q12",
      text: "¿Cómo gestiona su organización la respuesta a incidentes de ciberseguridad?",
      category: "Respuesta a Incidentes",
      options: [
        {
          text: "No existe un plan formal de respuesta a incidentes",
          value: 0,
        },
        {
          text: "Existe un plan básico sin ejercicios de simulación",
          value: 1,
        },
        {
          text: "Existe un plan documentado con roles definidos y algunas simulaciones",
          value: 2,
        },
        {
          text: "Existe un programa completo con equipo dedicado, simulaciones regulares y mejora continua",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q13",
      text: "¿Su organización implementa controles de seguridad física para proteger activos de información?",
      category: "Seguridad Física",
      options: [
        { text: "No existen controles formales de seguridad física", value: 0 },
        {
          text: "Existen controles básicos sin integración con seguridad lógica",
          value: 1,
        },
        {
          text: "Existen controles con algunas integraciones y monitoreo",
          value: 2,
        },
        {
          text: "Existe un programa completo con controles avanzados e integración total",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q14",
      text: "¿Su organización cumple con regulaciones y estándares de ciberseguridad?",
      category: "Cumplimiento Normativo",
      options: [
        { text: "No existe un programa formal de cumplimiento", value: 0 },
        {
          text: "Existe cumplimiento básico sin verificación independiente",
          value: 1,
        },
        {
          text: "Existe cumplimiento verificado para regulaciones principales",
          value: 2,
        },
        {
          text: "Existe un programa completo con certificaciones y auditorías regulares",
          value: 3,
        },
      ],
    },
    {
      id: "adv_q15",
      text: "¿Su organización tiene un plan de recuperación ante desastres para sistemas críticos?",
      category: "Continuidad de Negocio",
      options: [
        { text: "No existe un plan formal de recuperación", value: 0 },
        { text: "Existe un plan básico sin pruebas regulares", value: 1 },
        { text: "Existe un plan documentado con pruebas periódicas", value: 2 },
        {
          text: "Existe un plan completo con RTO/RPO definidos, pruebas regulares y mejora continua",
          value: 3,
        },
      ],
    },
  ],
};
