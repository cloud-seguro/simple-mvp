import type { QuizData } from "@/components/evaluations/types";

export const initialEvaluationData: QuizData = {
  id: "evaluacion-inicial",
  title: "Evaluación Inicial de Ciberseguridad",
  description:
    "Evalúe el nivel de madurez en ciberseguridad de su organización con esta evaluación inicial.",
  questions: [
    {
      id: "q1",
      text: "¿Su organización tiene una política de seguridad de la información documentada?",
      category: "Políticas y Procedimientos",
      options: [
        { text: "No existe una política formal", value: 0 },
        {
          text: "Existe una política básica pero no está actualizada",
          value: 1,
        },
        {
          text: "Existe una política documentada y se revisa ocasionalmente",
          value: 2,
        },
        {
          text: "Existe una política completa que se revisa y actualiza regularmente",
          value: 3,
        },
      ],
    },
    {
      id: "q2",
      text: "¿Cómo gestiona su organización las contraseñas de los sistemas?",
      category: "Control de Acceso",
      options: [
        {
          text: "No hay requisitos específicos para las contraseñas",
          value: 0,
        },
        {
          text: "Existen requisitos básicos pero no se aplican consistentemente",
          value: 1,
        },
        {
          text: "Se aplican requisitos de complejidad y cambio periódico",
          value: 2,
        },
        {
          text: "Se implementa autenticación de múltiples factores y gestión avanzada de contraseñas",
          value: 3,
        },
      ],
    },
    {
      id: "q3",
      text: "¿Cómo maneja su organización las actualizaciones de seguridad?",
      category: "Gestión de Vulnerabilidades",
      options: [
        {
          text: "Las actualizaciones se realizan de forma irregular o reactiva",
          value: 0,
        },
        {
          text: "Las actualizaciones críticas se aplican cuando es posible",
          value: 1,
        },
        {
          text: "Existe un proceso regular para aplicar actualizaciones",
          value: 2,
        },
        {
          text: "Existe un proceso automatizado y proactivo de gestión de parches",
          value: 3,
        },
      ],
    },
    {
      id: "q4",
      text: "¿Su organización realiza copias de seguridad de datos críticos?",
      category: "Protección de Datos",
      options: [
        { text: "No se realizan copias de seguridad regularmente", value: 0 },
        {
          text: "Se realizan copias de seguridad ocasionales sin un proceso formal",
          value: 1,
        },
        { text: "Existe un proceso regular de copias de seguridad", value: 2 },
        {
          text: "Existe un proceso completo con pruebas de restauración y almacenamiento externo",
          value: 3,
        },
      ],
    },
    {
      id: "q5",
      text: "¿Cómo gestiona su organización los incidentes de seguridad?",
      category: "Respuesta a Incidentes",
      options: [
        {
          text: "No existe un proceso formal para gestionar incidentes",
          value: 0,
        },
        { text: "Los incidentes se manejan de forma reactiva", value: 1 },
        {
          text: "Existe un proceso básico documentado para responder a incidentes",
          value: 2,
        },
        {
          text: "Existe un plan completo con roles definidos, simulacros y mejora continua",
          value: 3,
        },
      ],
    },
    {
      id: "q6",
      text: "¿Su organización proporciona formación en ciberseguridad a los empleados?",
      category: "Concienciación y Formación",
      options: [
        { text: "No se proporciona formación en ciberseguridad", value: 0 },
        {
          text: "Se proporciona formación básica durante la incorporación",
          value: 1,
        },
        {
          text: "Se proporciona formación periódica a todos los empleados",
          value: 2,
        },
        {
          text: "Existe un programa completo con formación específica por rol y simulacros",
          value: 3,
        },
      ],
    },
    {
      id: "q7",
      text: "¿Cómo protege su organización la red corporativa?",
      category: "Seguridad de Red",
      options: [
        { text: "Protección básica con firewall simple", value: 0 },
        {
          text: "Firewall configurado y algunas medidas de segmentación",
          value: 1,
        },
        {
          text: "Segmentación de red, monitoreo y controles de acceso",
          value: 2,
        },
        {
          text: "Arquitectura de defensa en profundidad con múltiples capas de protección",
          value: 3,
        },
      ],
    },
    {
      id: "q8",
      text: "¿Su organización evalúa regularmente sus riesgos de ciberseguridad?",
      category: "Gestión de Riesgos",
      options: [
        { text: "No se realizan evaluaciones de riesgos", value: 0 },
        { text: "Se realizan evaluaciones informales o reactivas", value: 1 },
        {
          text: "Se realizan evaluaciones periódicas siguiendo un proceso",
          value: 2,
        },
        {
          text: "Existe un programa formal de gestión de riesgos con evaluaciones continuas",
          value: 3,
        },
      ],
    },
    {
      id: "q9",
      text: "¿Cómo gestiona su organización los dispositivos móviles y el trabajo remoto?",
      category: "Movilidad y Trabajo Remoto",
      options: [
        {
          text: "No existen políticas específicas para dispositivos móviles o trabajo remoto",
          value: 0,
        },
        {
          text: "Existen algunas directrices básicas pero sin aplicación técnica",
          value: 1,
        },
        {
          text: "Existen políticas y algunas medidas técnicas implementadas",
          value: 2,
        },
        {
          text: "Existe una estrategia completa con controles técnicos y administrativos",
          value: 3,
        },
      ],
    },
    {
      id: "q10",
      text: "¿Su organización tiene un plan de continuidad de negocio?",
      category: "Continuidad de Negocio",
      options: [
        { text: "No existe un plan formal de continuidad", value: 0 },
        {
          text: "Existe un plan básico pero no se prueba regularmente",
          value: 1,
        },
        {
          text: "Existe un plan documentado que se revisa periódicamente",
          value: 2,
        },
        {
          text: "Existe un plan completo con pruebas regulares y mejora continua",
          value: 3,
        },
      ],
    },
  ],
};
