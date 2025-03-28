"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/views/landing-page/navbar";
import Footer from "@/components/views/landing-page/Footer";
import Pricing from "@/components/views/landing-page/pricing";
import HourlyRates from "@/components/views/pricing/hourly-rates";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("subscription");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    // Set active tab based on hash
    if (window.location.hash === "#hourly") {
      setActiveTab("hourly");
    } else {
      setActiveTab("subscription");
    }

    // Handle scroll to FAQ if hash is #faq
    if (window.location.hash === "#faq") {
      setTimeout(() => {
        const faqSection = document.getElementById("faq");
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 500); // Slight delay to ensure the page is loaded
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === "#hourly") {
        setActiveTab("hourly");
      } else if (window.location.hash === "#faq") {
        setTimeout(() => {
          const faqSection = document.getElementById("faq");
          if (faqSection) {
            faqSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
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

      {/* Header */}
      <div className="pt-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center mb-12">
          <motion.span
            className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Soluciones a medida
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Planes y tarifas
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Selecciona el plan que mejor se adapte a tus necesidades o contrata
            especialistas por hora para una solución personalizada
          </motion.p>

          {/* Tab Navigation */}
          <motion.div
            className="flex justify-center mt-10 border-b border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href={pathname}
              onClick={(e) => {
                e.preventDefault();
                handleTabChange("subscription");
              }}
              className={`px-6 py-3 text-lg font-medium transition-colors ${
                activeTab === "subscription"
                  ? "text-black border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-yellow-500"
              }`}
            >
              <motion.span whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                Suscripción mensual
              </motion.span>
            </Link>
            <Link
              href={`${pathname}#hourly`}
              onClick={(e) => {
                e.preventDefault();
                handleTabChange("hourly");
              }}
              className={`px-6 py-3 text-lg font-medium transition-colors ${
                activeTab === "hourly"
                  ? "text-black border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-yellow-500"
              }`}
            >
              <motion.span whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                Especialistas por hora
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Subscription pricing */}
      <motion.section
        id="subscription"
        className={activeTab === "subscription" ? "block" : "hidden"}
        initial={{ opacity: 0 }}
        animate={{ opacity: activeTab === "subscription" ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Pricing />
      </motion.section>

      {/* Hourly Rates */}
      <motion.section
        id="hourly"
        className={`py-20 bg-white ${activeTab === "hourly" ? "block" : "hidden"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: activeTab === "hourly" ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <HourlyRates />
      </motion.section>

      {/* Unified FAQ Section */}
      <motion.section
        id="faq"
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.span
              className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium mb-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Respuestas a tus dudas
            </motion.span>
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Preguntas frecuentes
            </motion.h2>
            <motion.p
              className="text-lg max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Resolvemos las dudas más comunes sobre nuestros servicios
            </motion.p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                staggerChildren: 0.1,
              }}
            >
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
                  question: "¿Ofrecen soporte técnico?",
                  answer:
                    "Ofrecemos soporte técnico para todos nuestros clientes. Los usuarios premium y con planes de horas disfrutan de soporte prioritario.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="flex items-start">
                    <motion.div
                      className="bg-yellow-400 p-2 rounded-full mr-3 mt-1 flex-shrink-0"
                      whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 },
                      }}
                    >
                      <HelpCircle className="h-5 w-5 text-black" />
                    </motion.div>
                    <div>
                      <h4 className="font-bold mb-2">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              ¿Necesitas una solución personalizada?
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Contáctanos para discutir tus necesidades específicas de
              ciberseguridad y encontrar la mejor solución para tu empresa
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button className="px-8 py-6 bg-black text-white hover:bg-gray-800">
                Contactar a un especialista
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
