"use client";

import { motion } from "framer-motion";
import { CheckCircle, Shield, FileText } from "lucide-react";

interface BenefitCard {
  id: number;
  icon: React.ReactNode;
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
      bgColor: "bg-white text-black border-2 border-black",
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
      bgColor: "bg-yellow-400",
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
      bgColor: "bg-orange-500 text-white",
      stats: [
        { number: "30%", description: "menos tiempo de implementación" },
        { number: "85%", description: "tasa de adopción" },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.8,
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <motion.div
        className="text-center mb-8 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
          Beneficios de nuestras evaluaciones
        </h2>
        <p className="text-base md:text-lg max-w-3xl mx-auto px-4">
          Descubre cómo nuestras evaluaciones pueden ayudarte a mejorar la
          seguridad de tu empresa
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {benefits.map((benefit) => (
          <motion.div
            key={benefit.id}
            className={`${benefit.bgColor} rounded-xl p-6 md:p-8 overflow-hidden transition-shadow`}
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              transition: { duration: 0.2 },
            }}
          >
            <div>
              <div className="mb-4 md:mb-6">{benefit.icon}</div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                {benefit.title}
              </h3>
              <p className="text-sm md:text-base h-auto md:h-40 opacity-90">
                {benefit.description}
              </p>
            </div>

            <motion.div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-current/20">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {benefit.stats.map((stat, index) => (
                  <motion.div
                    key={`${benefit.id}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-xl md:text-2xl font-bold">
                      {stat.number}
                    </div>
                    <div className="text-xs md:text-sm opacity-80">
                      {stat.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
