"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import Navbar from "@/components/views/landing-page/navbar";
import Footer from "@/components/views/landing-page/Footer";
import { useRouter, usePathname } from "next/navigation";

// Lazy load heavy components
const Pricing = lazy(() => import("@/components/views/landing-page/pricing"));
const HourlyRates = lazy(
  () => import("@/components/views/pricing/hourly-rates")
);

// Simple loading components
const LoadingSection = () => (
  <div className="w-full py-20 flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Simplified FAQ component without animations
const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-lg font-medium mb-2">{question}</h3>
    <p className="text-gray-600">{answer}</p>
  </div>
);

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("subscription");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    // Set active tab based on hash - simplified approach
    const hash = window.location.hash;
    if (hash === "#hourly") {
      setActiveTab("hourly");
    } else if (hash === "#faq" && document.getElementById("faq")) {
      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    }

    // Simplified hash change handler
    const handleHashChange = () => {
      const newHash = window.location.hash;
      if (newHash === "#hourly") {
        setActiveTab("hourly");
      } else if (newHash === "#faq" && document.getElementById("faq")) {
        document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
      } else if (newHash === "") {
        setActiveTab("subscription");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`${pathname}${tab === "hourly" ? "#hourly" : ""}`);
  };

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      {/* Header - simplified without animations */}
      <div className="pt-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center mb-12">
          <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium mb-4">
            Soluciones a medida
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Planes y tarifas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Selecciona el plan que mejor se adapte a tus necesidades o contrata
            especialistas por hora para una solución personalizada
          </p>

          {/* Tab Navigation - simplified */}
          <div className="flex justify-center mt-10 border-b border-gray-200">
            <button
              onClick={() => handleTabChange("subscription")}
              className={`px-6 py-3 text-lg font-medium transition-colors ${
                activeTab === "subscription"
                  ? "text-black border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-yellow-500"
              }`}
            >
              Suscripción mensual
            </button>
            <button
              onClick={() => handleTabChange("hourly")}
              className={`px-6 py-3 text-lg font-medium transition-colors ${
                activeTab === "hourly"
                  ? "text-black border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-yellow-500"
              }`}
            >
              Especialistas por hora
            </button>
          </div>
        </div>
      </div>

      {/* Content sections with Suspense for lazy loading */}
      <section
        id="subscription"
        className={activeTab === "subscription" ? "block" : "hidden"}
      >
        <Suspense fallback={<LoadingSection />}>
          <Pricing />
        </Suspense>
      </section>

      <section
        id="hourly"
        className={`py-20 bg-white ${activeTab === "hourly" ? "block" : "hidden"}`}
      >
        <Suspense fallback={<LoadingSection />}>
          <HourlyRates />
        </Suspense>
      </section>

      {/* Simplified FAQ Section without animations */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium mb-3">
              Respuestas a tus dudas
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              Resolvemos las dudas más comunes sobre nuestros servicios
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question:
                    "¿Puedo cancelar mi suscripción en cualquier momento?",
                  answer:
                    "Sí, puedes cancelar tu suscripción en cualquier momento sin ningún compromiso ni penalización.",
                },
                {
                  question: "¿Qué métodos de pago aceptan?",
                  answer:
                    "Aceptamos todas las tarjetas de crédito y débito principales, así como pagos a través de PayPal.",
                },
                {
                  question:
                    "¿Las evaluaciones de seguridad son compatibles con todas las empresas?",
                  answer:
                    "Sí, nuestras evaluaciones se adaptan a empresas de cualquier tamaño y sector, desde pequeñas startups hasta grandes corporaciones.",
                },
                {
                  question:
                    "¿Cómo funciona la contratación de especialistas por hora?",
                  answer:
                    "Al elegir un plan de horas, se te asignará un coordinador de seguridad que gestionará el equipo de especialistas según tus necesidades específicas.",
                },
                {
                  question: "¿Puedo cambiar entre planes o servicios?",
                  answer:
                    "Sí, puedes ajustar o cambiar tu plan en cualquier momento según evolucionen las necesidades de ciberseguridad de tu empresa.",
                },
                {
                  question: "¿Ofrecen soporte técnico con todos los planes?",
                  answer:
                    "Todos nuestros planes incluyen soporte técnico, aunque el nivel de prioridad y los tiempos de respuesta varían según el plan elegido.",
                },
              ].map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
