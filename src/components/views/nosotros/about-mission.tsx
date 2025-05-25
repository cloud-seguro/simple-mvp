"use client";

import { motion } from "framer-motion";
import { CheckCircle, Shield, Zap, Heart } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function AboutMission() {
  const missionPoints = [
    {
      icon: Shield,
      title: "Protección Accesible",
      description:
        "Hacer que la ciberseguridad de nivel empresarial sea accesible para empresas de todos los tamaños.",
    },
    {
      icon: Zap,
      title: "Simplicidad Técnica",
      description:
        "Transformar conceptos complejos en soluciones claras y accionables.",
    },
    {
      icon: Heart,
      title: "Compromiso Genuino",
      description:
        "Acompañar a nuestros clientes en cada paso de su journey de ciberseguridad.",
    },
  ];

  const achievements = [
    { number: "500+", label: "Empresas Protegidas" },
    { number: "99.9%", label: "Tiempo de Actividad" },
    { number: "24/7", label: "Soporte Técnico" },
    { number: "0", label: "Brechas de Seguridad" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <BlurFade className="text-center mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6 text-black"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Nuestra Misión
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Nuestra misión es democratizar la ciberseguridad, haciendo que las
          mejores prácticas y herramientas de protección estén al alcance de
          todas las organizaciones, sin importar su tamaño o presupuesto.
          Creemos que la seguridad no debe ser un privilegio de unos pocos, sino
          un derecho fundamental en el mundo digital.
        </motion.p>
        <motion.p
          className="text-xl text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Trabajamos incansablemente para crear un ecosistema donde la
          &ldquo;seguridad por diseño&rdquo; sea la norma, no la excepción.
        </motion.p>
      </BlurFade>

      {/* Mission Points Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {missionPoints.map((point, index) => (
          <motion.div
            key={point.title}
            className="text-center group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <point.icon className="w-10 h-10 text-black" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4 text-black">
              {point.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{point.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Detailed Mission Statement */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-6 text-black">
            ¿Por qué SIMPLE?
          </h3>
          <div className="space-y-4">
            {[
              "La ciberseguridad no debe ser un privilegio exclusivo de grandes corporaciones",
              "Cada empresa merece protección de clase mundial, sin importar su presupuesto",
              "La complejidad técnica no debe ser una barrera para la seguridad",
              "Las soluciones deben ser tan intuitivas como efectivas",
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 text-black">
            <h4 className="text-2xl font-bold mb-4">Nuestro Compromiso</h4>
            <p className="text-lg leading-relaxed mb-6">
              &ldquo;Creemos que la seguridad digital debe ser tan natural como
              cerrar la puerta de tu oficina al final del día.&rdquo;
            </p>
            <div className="text-right">
              <p className="font-semibold">— Equipo SIMPLE</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Achievements Section */}
      <motion.div
        className="bg-black rounded-2xl p-8 md:p-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-bold text-center mb-12 text-white">
          Nuestro Impacto
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                {achievement.number}
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                {achievement.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
