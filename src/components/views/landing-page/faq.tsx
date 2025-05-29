"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Expand, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question:
      "¿Qué es exactamente esta plataforma de capacitación en ciberseguridad?",
    answer:
      "Es una plataforma integral de aprendizaje que combina módulos teóricos interactivos, simulaciones prácticas y evaluaciones continuas para formar profesionales en ciberseguridad. Utilizamos metodologías modernas y escenarios reales para garantizar un aprendizaje efectivo.",
  },
  {
    question: "¿Necesito experiencia previa en ciberseguridad para comenzar?",
    answer:
      "No es necesario. Nuestros módulos están diseñados para adaptarse a diferentes niveles de conocimiento, desde principiantes hasta profesionales experimentados. El sistema se ajusta automáticamente a tu ritmo de aprendizaje.",
  },
  {
    question: "¿Cómo funcionan las evaluaciones y certificaciones?",
    answer:
      "Las evaluaciones son continuas e incluyen ejercicios prácticos, simulaciones de ataques reales y pruebas teóricas. Al completar exitosamente los módulos, recibes certificaciones reconocidas en la industria que validan tus competencias.",
  },
  {
    question: "¿Puedo acceder al contenido desde cualquier dispositivo?",
    answer:
      "Sí, la plataforma es completamente responsive y funciona en computadoras, tablets y dispositivos móviles. Tu progreso se sincroniza automáticamente entre todos tus dispositivos.",
  },
  {
    question: "¿Qué tipo de soporte técnico ofrecen?",
    answer:
      "Ofrecemos soporte técnico 24/7 a través de chat en vivo, email y videoconferencias. También tenemos una comunidad activa de usuarios y mentores expertos disponibles para resolver dudas específicas.",
  },
  {
    question: "¿Los contenidos se actualizan regularmente?",
    answer:
      "Absolutamente. El mundo de la ciberseguridad evoluciona constantemente, por lo que actualizamos nuestros contenidos mensualmente para incluir las últimas amenazas, técnicas de defensa y mejores prácticas de la industria.",
  },
  {
    question:
      "¿Puedo usar la plataforma para entrenar a mi equipo corporativo?",
    answer:
      "Sí, ofrecemos planes empresariales con dashboards administrativos, reportes de progreso, asignación de cursos personalizados y métricas detalladas de desempeño para equipos y organizaciones.",
  },
  {
    question: "¿Hay alguna garantía de satisfacción?",
    answer:
      "Ofrecemos una garantía de satisfacción de 30 días. Si no estás completamente satisfecho con la plataforma, te reembolsamos el 100% de tu inversión, sin preguntas.",
  },
];

const FAQItem = ({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) => {
  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

      <Button
        variant="ghost"
        className="w-full p-6 text-left justify-between hover:bg-gray-50/80 transition-all duration-300 rounded-xl"
        onClick={onToggle}
      >
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-colors duration-300">
              <HelpCircle className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <span className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200 leading-relaxed">
            {item.question}
          </span>
        </div>
        <div className="flex-shrink-0 ml-4">
          <div
            className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
          </div>
        </div>
      </Button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-0">
          <div className="ml-12 pl-4 border-l-2 border-gray-100">
            <p className="text-gray-600 leading-relaxed text-[15px] animate-in slide-in-from-top-2 duration-500">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const allOpen = openItems.length === faqData.length;

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (allOpen) {
      setOpenItems([]);
    } else {
      setOpenItems(faqData.map((_, index) => index));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
          <HelpCircle className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
          Preguntas Frecuentes
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Resolvemos las dudas más comunes sobre nuestra plataforma de
          capacitación en ciberseguridad
        </p>

        {/* Expand/Collapse All Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={toggleAll}
            className="inline-flex items-center gap-2 px-6 py-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            {allOpen ? (
              <>
                <Minimize2 className="h-4 w-4" />
                Cerrar Todas
              </>
            ) : (
              <>
                <Expand className="h-4 w-4" />
                Abrir Todas
              </>
            )}
          </Button>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-0">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            isOpen={openItems.includes(index)}
            onToggle={() => toggleItem(index)}
            index={index}
          />
        ))}
      </div>

      {/* Contact Section */}
      <div className="text-center mt-16 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            ¿Aún tienes dudas?
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Nuestro equipo de soporte está disponible 24/7 para ayudarte con
            cualquier consulta específica.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Contactar Soporte
          </Button>
        </div>
      </div>
    </div>
  );
}
