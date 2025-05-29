"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Categorized FAQ items for cybersecurity platform
const faqCategories = [
  {
    category: "General",
    items: [
      {
        id: "general-1",
        question:
          "¿Qué es exactamente esta plataforma de capacitación en ciberseguridad?",
        answer:
          "Es una plataforma integral de aprendizaje que combina módulos teóricos interactivos, simulaciones prácticas y evaluaciones continuas para formar profesionales en ciberseguridad. Utilizamos metodologías modernas y escenarios reales para garantizar un aprendizaje efectivo.",
      },
      {
        id: "general-2",
        question:
          "¿Necesito experiencia previa en ciberseguridad para comenzar?",
        answer:
          "No es necesario. Nuestros módulos están diseñados para adaptarse a diferentes niveles de conocimiento, desde principiantes hasta profesionales experimentados. El sistema se ajusta automáticamente a tu ritmo de aprendizaje.",
      },
      {
        id: "general-3",
        question: "¿Puedo acceder al contenido desde cualquier dispositivo?",
        answer:
          "Sí, la plataforma es completamente responsive y funciona en computadoras, tablets y dispositivos móviles. Tu progreso se sincroniza automáticamente entre todos tus dispositivos.",
      },
      {
        id: "general-4",
        question: "¿Los contenidos se actualizan regularmente?",
        answer:
          "Absolutamente. El mundo de la ciberseguridad evoluciona constantemente, por lo que actualizamos nuestros contenidos mensualmente para incluir las últimas amenazas, técnicas de defensa y mejores prácticas de la industria.",
      },
    ],
  },
  {
    category: "Evaluaciones y Certificaciones",
    items: [
      {
        id: "eval-1",
        question: "¿Cómo funcionan las evaluaciones y certificaciones?",
        answer:
          "Las evaluaciones son continuas e incluyen ejercicios prácticos, simulaciones de ataques reales y pruebas teóricas. Al completar exitosamente los módulos, recibes certificaciones reconocidas en la industria que validan tus competencias.",
      },
      {
        id: "eval-2",
        question: "¿Qué tipos de evaluaciones ofrecen?",
        answer:
          "Ofrecemos evaluaciones de vulnerabilidades, auditorías de seguridad, análisis de riesgos y simulaciones de incidentes. Cada evaluación incluye un reporte detallado con recomendaciones específicas para tu organización.",
      },
      {
        id: "eval-3",
        question: "¿Cuánto tiempo toma completar una evaluación?",
        answer:
          "El tiempo varía según el tipo de evaluación. Las evaluaciones básicas toman 2-4 horas, mientras que las evaluaciones completas pueden requerir 1-2 semanas dependiendo del alcance y complejidad de tu infraestructura.",
      },
      {
        id: "eval-4",
        question: "¿Las certificaciones son reconocidas internacionalmente?",
        answer:
          "Sí, nuestras certificaciones están alineadas con estándares internacionales como ISO 27001, NIST, y frameworks reconocidos por la industria. Son válidas para procesos de compliance y auditorías.",
      },
    ],
  },
  {
    category: "Plataforma y Funcionalidades",
    items: [
      {
        id: "platform-1",
        question: "¿Cómo accedo a la plataforma?",
        answer:
          "Puedes acceder registrándote con tu email. Una vez verificada tu cuenta, tendrás acceso inmediato a los módulos básicos y podrás suscribirte a planes avanzados según tus necesidades.",
      },
      {
        id: "platform-2",
        question:
          "¿Puedo usar la plataforma para entrenar a mi equipo corporativo?",
        answer:
          "Sí, ofrecemos planes empresariales con dashboards administrativos, reportes de progreso, asignación de cursos personalizados y métricas detalladas de desempeño para equipos y organizaciones.",
      },
      {
        id: "platform-3",
        question: "¿Qué incluye el dashboard administrativo?",
        answer:
          "El dashboard incluye seguimiento de progreso individual y grupal, asignación de módulos específicos, generación de reportes, métricas de completitud, y herramientas para evaluar el nivel de conocimiento de tu equipo.",
      },
      {
        id: "platform-4",
        question: "¿Hay simulaciones prácticas disponibles?",
        answer:
          "Sí, incluimos laboratorios virtuales, simulaciones de ataques, ejercicios de respuesta a incidentes y escenarios reales para practicar técnicas de defensa en un entorno controlado y seguro.",
      },
    ],
  },
  {
    category: "Soporte y Precios",
    items: [
      {
        id: "support-1",
        question: "¿Qué tipo de soporte técnico ofrecen?",
        answer:
          "Ofrecemos soporte técnico 24/7 a través de chat en vivo, email y videoconferencias. También tenemos una comunidad activa de usuarios y mentores expertos disponibles para resolver dudas específicas.",
      },
      {
        id: "support-2",
        question: "¿Cuáles son los planes de precios disponibles?",
        answer:
          "Tenemos planes individuales desde $29/mes, planes profesionales desde $99/mes, y planes empresariales personalizados. Todos incluyen acceso completo a contenidos, evaluaciones y soporte técnico.",
      },
      {
        id: "support-3",
        question: "¿Hay alguna garantía de satisfacción?",
        answer:
          "Ofrecemos una garantía de satisfacción de 30 días. Si no estás completamente satisfecho con la plataforma, te reembolsamos el 100% de tu inversión, sin preguntas.",
      },
      {
        id: "support-4",
        question:
          "¿Ofrecen descuentos para estudiantes o instituciones educativas?",
        answer:
          "Sí, ofrecemos descuentos del 50% para estudiantes con identificación válida y precios especiales para universidades e instituciones educativas. Contacta a nuestro equipo para más detalles.",
      },
    ],
  },
];

interface HelpAccordionProps {
  searchTerm?: string;
}

// Function to normalize text by removing accents for comparison
function normalizeText(text: string): string {
  return text
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .toLowerCase(); // Convert to lowercase
}

export function HelpAccordion({ searchTerm = "" }: HelpAccordionProps) {
  const [filteredCategories, setFilteredCategories] = useState(faqCategories);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filter faqCategories based on searchTerm
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(faqCategories);
      setExpandedItems([]);
      return;
    }

    const normalizedSearch = normalizeText(searchTerm.trim());

    // Filter categories and their items
    const filtered = faqCategories
      .map((category) => {
        // Filter items that match the search term
        const matchedItems = category.items.filter((item) => {
          const normalizedQuestion = normalizeText(item.question);
          const normalizedAnswer = normalizeText(item.answer);

          return (
            normalizedQuestion.includes(normalizedSearch) ||
            normalizedAnswer.includes(normalizedSearch)
          );
        });

        // If there are matching items, include this category with only the matching items
        return matchedItems.length > 0
          ? { ...category, items: matchedItems }
          : null;
      })
      .filter(Boolean) as typeof faqCategories;

    setFilteredCategories(filtered);

    // Auto-expand items that match the search
    const newExpandedItems = filtered.flatMap((category) =>
      category.items.map((item) => item.id)
    );
    setExpandedItems(newExpandedItems);
  }, [searchTerm]);

  // No results message
  if (searchTerm && filteredCategories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">
          No se encontraron resultados para "{searchTerm}"
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Intenta con otra búsqueda o revisa todas nuestras preguntas frecuentes
        </p>
      </div>
    );
  }

  return (
    <div className="mb-16 space-y-10">
      {filteredCategories.map((category) => (
        <div key={category.category}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {category.category}
          </h2>
          <Accordion
            type="multiple"
            value={expandedItems}
            onValueChange={setExpandedItems}
            className="mb-8"
          >
            {category.items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="text-xl font-medium text-gray-900 hover:text-gray-700 py-6">
                  <div className="text-left">
                    {highlightMatch(item.question, searchTerm)}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-lg text-gray-600 py-4">
                  <div className="whitespace-normal">
                    {highlightMatch(item.answer, searchTerm)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}

// Function to highlight the matching text
function highlightMatch(text: string, searchTerm: string) {
  if (!searchTerm.trim()) return text;

  try {
    const normalizedSearchTerm = normalizeText(searchTerm.trim());

    // If search term is empty after normalization, return original text
    if (!normalizedSearchTerm) return text;

    // Create a mapping between original text positions and normalized text positions
    const mapping: { original: number; normalized: number }[] = [];
    const normalizedChars: string[] = [];

    // Build the mapping and normalized characters array
    for (let i = 0; i < text.length; i++) {
      const normalizedChar = normalizeText(text[i]);
      mapping.push({ original: i, normalized: normalizedChars.length });
      normalizedChars.push(normalizedChar);
    }

    // Add an extra entry to mark the end of the text
    mapping.push({ original: text.length, normalized: normalizedChars.length });

    const normalizedText = normalizedChars.join("");
    const matches: { start: number; end: number }[] = [];

    // Find all matches in the normalized text
    let startPos = 0;
    while (startPos < normalizedText.length) {
      const matchPos = normalizedText.indexOf(normalizedSearchTerm, startPos);
      if (matchPos === -1) break;

      // Find the original text positions for this match
      const originalStart =
        mapping.find((m) => m.normalized === matchPos)?.original || 0;
      const originalEnd =
        mapping.find(
          (m) => m.normalized === matchPos + normalizedSearchTerm.length
        )?.original || text.length;

      matches.push({ start: originalStart, end: originalEnd });
      startPos = matchPos + 1; // Move past current match
    }

    // If no matches, return the original text
    if (matches.length === 0) return text;

    // Build the highlighted result
    const result: React.ReactNode[] = [];
    let lastEnd = 0;

    matches.forEach((match, index) => {
      // Text before the match
      if (match.start > lastEnd) {
        result.push(
          <span key={`text-${index}-before`}>
            {text.substring(lastEnd, match.start)}
          </span>
        );
      }

      // The highlighted match
      result.push(
        <span
          key={`highlight-${index}`}
          className="bg-yellow-200 font-medium inline"
        >
          {text.substring(match.start, match.end)}
        </span>
      );

      lastEnd = match.end;
    });

    // Text after the last match
    if (lastEnd < text.length) {
      result.push(<span key="text-after">{text.substring(lastEnd)}</span>);
    }

    return <>{result}</>;
  } catch (error) {
    console.error("Error highlighting text:", error);
    return text;
  }
}
