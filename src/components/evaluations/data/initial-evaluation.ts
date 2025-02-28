import type { QuizData } from "../types"

export const evaluacionInicial: QuizData = {
  id: "evaluacion-inicial",
  title: "Evaluación Inicial",
  description: "Evaluación de ciberseguridad para su organización",
  instructions:
    "Responda a las siguientes preguntas para evaluar el nivel de ciberseguridad en su organización. Seleccione la opción que mejor describa su situación actual.",
  questions: [
    {
      id: "politicas-1",
      text: "¿La organización tiene políticas de seguridad de la información formalmente establecidas y comunicadas?",
      category: "Políticas de Seguridad",
      options: [
        { label: "No", value: 0 },
        { label: "En proceso", value: 1 },
        { label: "Sí, pero no actualizadas", value: 2 },
        { label: "Sí y actualizadas regularmente", value: 3 },
      ],
    },
    {
      id: "politicas-2",
      text: "¿La empresa cuenta con un comité de seguridad de la información responsable de la gobernanza de ciberseguridad?",
      category: "Políticas de Seguridad",
      options: [
        { label: "No", value: 0 },
        { label: "En formación", value: 1 },
        { label: "Activo pero sin reuniones periódicas", value: 2 },
        { label: "Activo con revisiones periódicas", value: 3 },
      ],
    },
    {
      id: "activos-1",
      text: "¿La organización tiene identificados y clasificados sus activos de información?",
      category: "Identificación de Activos y Procesos",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Mayoritariamente", value: 2 },
        { label: "Completamente", value: 3 },
      ],
    },
    {
      id: "activos-2",
      text: "¿Existe un proceso formal para la evaluación de riesgos de ciberseguridad dentro de la empresa?",
      category: "Identificación de Activos y Procesos",
      options: [
        { label: "No", value: 0 },
        { label: "En proceso", value: 1 },
        { label: "Sí, pero no actualizado", value: 2 },
        { label: "Sí y actualizado regularmente", value: 3 },
      ],
    },
    {
      id: "activos-3",
      text: "¿La empresa tiene documentado un plan de tratamiento de riesgos de ciberseguridad?",
      category: "Identificación de Activos y Procesos",
      options: [
        { label: "No", value: 0 },
        { label: "En proceso", value: 1 },
        { label: "Sí, pero no implementado", value: 2 },
        { label: "Sí y con monitoreo continuo", value: 3 },
      ],
    },
    {
      id: "sgsi-1",
      text: "¿La empresa ha adoptado algún estándar de seguridad como ISO 27001, NIST CSF o CIS Controls?",
      category: "SGSI y Controles Básicos",
      options: [
        { label: "No", value: 0 },
        { label: "En evaluación", value: 1 },
        { label: "Implementado parcialmente", value: 2 },
        { label: "Implementado y revisado regularmente", value: 3 },
      ],
    },
    {
      id: "sgsi-2",
      text: "¿Se utiliza autenticación multifactor (MFA) en sistemas críticos?",
      category: "SGSI y Controles Básicos",
      options: [
        { label: "No", value: 0 },
        { label: "En algunos sistemas", value: 1 },
        { label: "En la mayoría de sistemas", value: 2 },
        { label: "En todos los sistemas críticos", value: 3 },
      ],
    },
    {
      id: "sgsi-3",
      text: "¿Cuenta la empresa con controles básicos en la nube, como Firewalls, WAF y cifrado de datos?",
      category: "SGSI y Controles Básicos",
      options: [
        { label: "No", value: 0 },
        { label: "Parcialmente", value: 1 },
        { label: "Implementados sin revisión", value: 2 },
        { label: "Implementados y revisados regularmente", value: 3 },
      ],
    },
    {
      id: "formacion-1",
      text: "¿Se realizan capacitaciones periódicas en ciberseguridad para los empleados?",
      category: "Formación y Cultura de Seguridad",
      options: [
        { label: "Nunca", value: 0 },
        { label: "Cuando ingresan a la empresa", value: 1 },
        { label: "Anualmente", value: 2 },
        { label: "Semestralmente o más frecuente", value: 3 },
      ],
    },
    {
      id: "formacion-2",
      text: "¿Se han realizado pruebas de ingeniería social para evaluar la conciencia de seguridad de los empleados?",
      category: "Formación y Cultura de Seguridad",
      options: [
        { label: "Nunca", value: 0 },
        { label: "Raramente", value: 1 },
        { label: "Anualmente", value: 2 },
        { label: "Semestralmente o más frecuente", value: 3 },
      ],
    },
    {
      id: "formacion-3",
      text: "¿La ciberseguridad es vista como una responsabilidad de todos en la empresa, y no solo del área de TI?",
      category: "Formación y Cultura de Seguridad",
      options: [
        { label: "No", value: 0 },
        { label: "En teoría, pero no en práctica", value: 1 },
        { label: "Parcialmente integrada en la cultura", value: 2 },
        { label: "Totalmente integrada y promovida", value: 3 },
      ],
    },
    {
      id: "formacion-4",
      text: "¿La junta directiva está informada y ha recibido formación en ciberseguridad?",
      category: "Formación y Cultura de Seguridad",
      options: [
        { label: "No", value: 0 },
        { label: "Informada mínimamente", value: 1 },
        { label: "Informada y con alguna formación", value: 2 },
        { label: "Bien informada y formada regularmente", value: 3 },
      ],
    },
  ],
}

