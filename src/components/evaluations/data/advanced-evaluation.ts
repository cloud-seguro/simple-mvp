import type { QuizData } from "../types"

export const evaluacionAvanzada: QuizData = {
  id: "evaluacion-avanzada",
  title: "Evaluación Avanzada",
  description: "Evaluación de madurez avanzada en ciberseguridad",
  instructions: "Responda a las siguientes preguntas para evaluar el nivel de madurez avanzada en ciberseguridad de su organización. Seleccione la opción que mejor describa su situación actual.",
  questions: [
    {
      id: "controles-1",
      text: "¿La empresa tiene un programa formal de gestión de vulnerabilidades y parches?",
      category: "Controles Avanzados y Monitoreo",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente implementado", value: 1 },
        { label: "Regularmente aplicado", value: 2 },
        { label: "Automatizado y gestionado continuamente", value: 3 },
      ],
    },
    {
      id: "controles-2",
      text: "¿Se han implementado estrategias de Zero Trust para gestionar accesos dentro de la organización?",
      category: "Controles Avanzados y Monitoreo",
      options: [
        { label: "No", value: 0 },
        { label: "En evaluación", value: 1 },
        { label: "Implementado parcialmente", value: 2 },
        { label: "Completamente implementado con monitoreo continuo", value: 3 },
      ],
    },
    {
      id: "controles-3",
      text: "¿Cuenta la empresa con un SOC interno o servicio de monitoreo 24/7 para detectar amenazas?",
      category: "Controles Avanzados y Monitoreo",
      options: [
        { label: "No", value: 0 },
        { label: "SOC tercerizado básico", value: 1 },
        { label: "SOC interno con monitoreo parcial", value: 2 },
        { label: "SOC interno avanzado con respuesta activa", value: 3 },
      ],
    },
    {
      id: "redteam-1",
      text: "¿Se realizan ejercicios de Red Team (simulación de ataques) y Blue Team (respuesta defensiva)?",
      category: "Red Team y Blue Team",
      options: [
        { label: "No", value: 0 },
        { label: "Solo Blue Team", value: 1 },
        { label: "Solo Red Team", value: 2 },
        { label: "Ambos con integración y pruebas periódicas", value: 3 },
      ],
    },
    {
      id: "redteam-2",
      text: "¿Cuenta con un sistema de monitoreo de logs de seguridad para detectar amenazas en tiempo real?",
      category: "Red Team y Blue Team",
      options: [
        { label: "No", value: 0 },
        { label: "Implementado pero sin revisión periódica", value: 1 },
        { label: "Implementado con alertas básicas", value: 2 },
        { label: "Implementado con correlación de eventos y automatización", value: 3 },
      ],
    },
    {
      id: "redteam-3",
      text: "¿La empresa aplica segmentación de red y microsegmentación para minimizar riesgos?",
      category: "Red Team y Blue Team",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Aplicada en entornos críticos", value: 2 },
        { label: "Implementada en toda la infraestructura", value: 3 },
      ],
    },
    {
      id: "intel-1",
      text: "¿Se realiza inteligencia de amenazas mediante OSINT, monitoreo de la Dark Web o servicios de Threat Intelligence?",
      category: "Ciberinteligencia y Análisis de Amenazas",
      options: [
        { label: "No", value: 0 },
        { label: "En evaluación", value: 1 },
        { label: "Implementado parcialmente", value: 2 },
        { label: "Implementado con herramientas avanzadas", value: 3 },
      ],
    },
    {
      id: "intel-2",
      text: "¿Utiliza modelos de detección de fraudes o ataques con análisis de datos avanzados?",
      category: "Ciberinteligencia y Análisis de Amenazas",
      options: [
        { label: "No", value: 0 },
        { label: "En pruebas", value: 1 },
        { label: "Implementado parcialmente", value: 2 },
        { label: "Implementado con IA y análisis predictivo", value: 3 },
      ],
    },
    {
      id: "ia-1",
      text: "¿Está integrada la Inteligencia Artificial en los procesos de ciberseguridad de la empresa?",
      category: "IA y Automatización de Ciberseguridad",
      options: [
        { label: "No", value: 0 },
        { label: "En evaluación", value: 1 },
        { label: "Implementado parcialmente", value: 2 },
        { label: "Completamente operativo", value: 3 },
      ],
    },
    {
      id: "ia-2",
      text: "¿Se utilizan herramientas de automatización como SOAR, UEBA o XDR para respuesta a incidentes?",
      category: "IA y Automatización de Ciberseguridad",
      options: [
        { label: "No", value: 0 },
        { label: "En pruebas", value: 1 },
        { label: "Implementado parcialmente", value: 2 },
        { label: "Implementado con integración y monitoreo continuo", value: 3 },
      ],
    },
    {
      id: "resiliencia-1",
      text: "¿La empresa cuenta con planes de resiliencia cibernética y simulaciones de crisis?",
      category: "Planes de Resiliencia y Simulación de Crisis",
      options: [
        { label: "No", value: 0 },
        { label: "En evaluación", value: 1 },
        { label: "Implementado parcialmente", value: 2 },
        { label: "Implementado y probado regularmente", value: 3 },
      ],
    },
    {
      id: "resiliencia-2",
      text: "¿Cuenta con un plan de tratamiento de riesgos cibernéticos para proveedores y terceros?",
      category: "Planes de Resiliencia y Simulación de Crisis",
      options: [
        { label: "No", value: 0 },
        { label: "En evaluación", value: 1 },
        { label: "Aplicado parcialmente", value: 2 },
        { label: "Aplicado con controles y monitoreo continuo", value: 3 },
      ],
    },
  ],
} 