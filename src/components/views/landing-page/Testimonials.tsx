"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Testimonial() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote:
        "Lo que buscábamos era un enfoque de ciberseguridad que fuera efectivo y simple de implementar. SIMPLESEC fue la solución perfecta para nosotros. Se alineó perfectamente con nuestros valores fundamentales.",
      name: "María Rodríguez",
      title: "CTO, Empresa Innovadora",
    },
    {
      quote:
        "La evaluación de SIMPLE nos ayudó a identificar vulnerabilidades que no sabíamos que teníamos. El proceso fue sencillo y las recomendaciones fueron claras y accionables.",
      name: "Carlos Méndez",
      title: "Director de IT, Grupo Empresarial",
    },
    {
      quote:
        "Gracias a la evaluación avanzada, pudimos implementar medidas de seguridad que nos ayudaron a cumplir con la normativa ISO 27001. El equipo de SIMPLESEC fue fundamental en este proceso.",
      name: "Laura Sánchez",
      title: "CISO, Multinacional",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 px-4 bg-white" id="testimonios">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Lo que dicen nuestros clientes
        </motion.h2>

        <div className="relative">
          <Button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 z-10 hover:bg-gray-100 transition-colors"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <motion.div
            className="py-12 px-8 bg-gray-50 rounded-2xl shadow-md"
            key={currentTestimonial}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote className="text-2xl md:text-3xl font-medium mb-8 text-center">
              &quot;{testimonials[currentTestimonial].quote}&quot;
            </blockquote>
            <div className="text-center">
              <div className="font-semibold text-lg">
                {testimonials[currentTestimonial].name}
              </div>
              <div className="text-gray-600">
                {testimonials[currentTestimonial].title}
              </div>
            </div>
          </motion.div>

          <Button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 z-10 hover:bg-gray-100 transition-colors"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="flex justify-center mt-8">
            {testimonials.map((testimonial, index) => (
              <Button
                key={testimonial.name}
                className={`h-3 w-3 rounded-full mx-1 ${index === currentTestimonial ? "bg-black" : "bg-gray-300"}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
