"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypingAnimation } from "@/components/magicui/typing-animation";

const testimonials = [
  {
    quote:
      "Lo que buscábamos era un enfoque de ciberseguridad que fuera efectivo y simple de implementar. SIMPLESEC fue la solución perfecta para nosotros. Se alineó perfectamente con nuestros valores fundamentales.",
    name: "María Rodríguez",
    title: "CTO, Empresa Innovadora",
    avatar: "/avatars/maria.jpg", // Add these images to your public folder
    initials: "MR",
  },
  {
    quote:
      "La evaluación de SIMPLE nos ayudó a identificar vulnerabilidades que no sabíamos que teníamos. El proceso fue sencillo y las recomendaciones fueron claras y accionables.",
    name: "Carlos Méndez",
    title: "Director de IT, Grupo Empresarial",
    avatar: "/avatars/carlos.jpg",
    initials: "CM",
  },
  {
    quote:
      "Gracias a la evaluación avanzada, pudimos implementar medidas de seguridad que nos ayudaron a cumplir con la normativa ISO 27001. El equipo de SIMPLESEC fue fundamental en este proceso.",
    name: "Laura Sánchez",
    title: "CISO, Multinacional",
    avatar: "/avatars/laura.jpg",
    initials: "LS",
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
    <section className="py-20 px-4 bg-white" id="testimonios">
      <div className="max-w-4xl mx-auto">
        <TypingAnimation
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          startOnView={true}
        >
          Lo que dicen nuestros clientes
        </TypingAnimation>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hover:bg-white/80 transition-colors"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Card className="p-8 bg-white border-none shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <Quote className="h-12 w-12 text-yellow-500 mb-6" />
                  <p className="text-2xl md:text-3xl font-medium mb-8 text-gray-800 leading-relaxed">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarImage src={testimonials[currentTestimonial].avatar} alt={testimonials[currentTestimonial].name} />
                    <AvatarFallback>{testimonials[currentTestimonial].initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{testimonials[currentTestimonial].name}</h3>
                    <p className="text-gray-600">{testimonials[currentTestimonial].title}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hover:bg-white/80 transition-colors"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <Button
                key={`dot-${index}`}
                variant="ghost"
                size="icon"
                className={`h-3 w-3 rounded-full p-0 ${
                  index === currentTestimonial
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
