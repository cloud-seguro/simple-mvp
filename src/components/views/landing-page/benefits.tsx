"use client"

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Shield, FileText } from "lucide-react";
import { useState } from "react";

interface BenefitCard {
  id: number;
  icon: JSX.Element;
  title: string;
  description: string;
  bgColor: string;
  stats: {
    number: string;
    description: string;
  }[];
}

export default function Benefits() {
  const benefits: BenefitCard[] = [
    {
      id: 1,
      icon: <CheckCircle size={48} />,
      title: "Identificación de riesgos",
      description:
        "Nuestras evaluaciones te ayudan a identificar los riesgos de seguridad específicos de tu empresa, permitiéndote priorizar tus esfuerzos de protección.",
      bgColor: "bg-teal-400",
      stats: [
        { number: "95%", description: "de precisión en detección" },
        { number: "48h", description: "tiempo promedio de análisis" },
      ],
    },
    {
      id: 2,
      icon: <Shield size={48} />,
      title: "Cumplimiento normativo",
      description:
        "Evalúa tu nivel de cumplimiento con estándares como ISO 27001, NIST y otras regulaciones relevantes para tu industria.",
      bgColor: "bg-blue-400",
      stats: [
        { number: "100%", description: "cobertura normativa" },
        { number: "+25", description: "frameworks soportados" },
      ],
    },
    {
      id: 3,
      icon: <FileText size={48} />,
      title: "Plan de acción claro",
      description:
        "Recibe recomendaciones personalizadas y un plan de acción claro para mejorar tu postura de seguridad de manera efectiva y eficiente.",
      bgColor: "bg-purple-400",
      stats: [
        { number: "30%", description: "menos tiempo de implementación" },
        { number: "85%", description: "tasa de adopción" },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Beneficios de nuestras evaluaciones
        </h2>
        <p className="text-lg max-w-3xl mx-auto">
          Descubre cómo nuestras evaluaciones pueden ayudarte a mejorar la
          seguridad de tu empresa
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {benefits.map((benefit) => (
          <motion.div
            key={benefit.id}
            className={`${benefit.bgColor} rounded-xl p-8 overflow-hidden transition-shadow`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              transition: { duration: 0.2 }
            }}
          >
            <div>
              <div className="mb-6 text-black">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-black">
                {benefit.title}
              </h3>
              <p className="text-black/90 h-40">{benefit.description}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 pt-6 border-t border-black/20"
            >
              <div className="grid grid-cols-2 gap-4">
                {benefit.stats.map((stat, index) => (
                  <motion.div
                    key={`${benefit.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-black">
                      {stat.number}
                    </div>
                    <div className="text-sm text-black/80">
                      {stat.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

