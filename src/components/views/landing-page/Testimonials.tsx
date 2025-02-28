"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/magicui/text-animate";

const testimonials = [
  {
    quote:
      "Lo que buscábamos era un enfoque de ciberseguridad que fuera efectivo y simple de implementar. SIMPLE fue la solución perfecta para nosotros. Se alineó perfectamente con nuestros valores fundamentales.",
    name: "María Rodríguez",
    title: "CTO, Empresa Innovadora",
    rating: 5,
    company: "Empresa Innovadora S.L.",
    industry: "Tecnología",
  },
  {
    quote:
      "La evaluación de SIMPLE nos ayudó a identificar vulnerabilidades que no sabíamos que teníamos. El proceso fue sencillo y las recomendaciones fueron claras y accionables.",
    name: "Carlos Méndez",
    title: "Director de IT, Grupo Empresarial",
    rating: 5,
    company: "Grupo Empresarial XYZ",
    industry: "Finanzas",
  },
  {
    quote:
      "Gracias a la evaluación avanzada, pudimos implementar medidas de seguridad que nos ayudaron a cumplir con la normativa ISO 27001. El equipo de SIMPLE fue fundamental en este proceso.",
    name: "Laura Sánchez",
    title: "CISO, Multinacional",
    rating: 5,
    company: "Global Solutions Corp",
    industry: "Consultoría",
  },
];

export default function Testimonial() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 bg-white" id="testimonios">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Lo que dicen nuestros clientes
        </motion.h2>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black hover:bg-black/90 transition-colors rounded-full p-3 md:p-6"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </Button>

          <div className="relative overflow-hidden px-12 md:px-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <Quote className="h-12 w-12 md:h-16 md:w-16 mb-6 text-yellow-500" />

                <TextAnimate
                  className="text-xl md:text-2xl mb-8 text-gray-700 max-w-3xl mx-auto"
                  animation="fadeIn"
                  by="word"
                >
                  {testimonials[currentTestimonial].quote}
                </TextAnimate>

                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={`${testimonials[currentTestimonial].name}-star-${i}`}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    )
                  )}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-xl font-semibold">
                    {testimonials[currentTestimonial].name}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {testimonials[currentTestimonial].title}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {testimonials[currentTestimonial].company} •{" "}
                    {testimonials[currentTestimonial].industry}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black hover:bg-black/90 transition-colors rounded-full p-3 md:p-6"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </Button>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <Button
                key={`dot-${index}-${currentTestimonial}`}
                variant="ghost"
                size="icon"
                className={`h-3 w-3 rounded-full p-0 transition-colors ${
                  currentTestimonial === index
                    ? "bg-yellow-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
