"use client";

import { motion } from "framer-motion";
import { Calendar, Trophy, Users, Shield, Zap, Star } from "lucide-react";

export default function AboutTimeline() {
  const milestones = [
    {
      year: "2020",
      title: "El Inicio",
      description:
        "Fundación de SIMPLE con la visión de democratizar la ciberseguridad empresarial.",
      icon: Star,
      color: "from-purple-500 to-purple-700",
      achievements: [
        "Primeros 10 clientes",
        "Desarrollo del MVP",
        "Equipo fundador",
      ],
    },
    {
      year: "2021",
      title: "Crecimiento Exponencial",
      description:
        "Expansión del equipo y desarrollo de nuestra plataforma integral de ciberseguridad.",
      icon: Zap,
      color: "from-blue-500 to-blue-700",
      achievements: [
        "100+ empresas protegidas",
        "Certificaciones ISO 27001",
        "Premio a la innovación",
      ],
    },
    {
      year: "2022",
      title: "Reconocimiento del Mercado",
      description:
        "Consolidación como líder en ciberseguridad accesible para PyMEs en Latinoamérica.",
      icon: Trophy,
      color: "from-green-500 to-green-700",
      achievements: [
        "300+ clientes activos",
        "Expansión regional",
        "Alianzas estratégicas",
      ],
    },
    {
      year: "2023",
      title: "Innovación Continua",
      description:
        "Lanzamiento de IA para detección de amenazas y automatización de respuestas.",
      icon: Shield,
      color: "from-orange-500 to-orange-700",
      achievements: ["IA implementada", "SOC 24/7", "500+ empresas seguras"],
    },
    {
      year: "2024",
      title: "El Futuro Es Ahora",
      description:
        "Liderando la transformación digital segura con soluciones de próxima generación.",
      icon: Users,
      color: "from-yellow-500 to-yellow-700",
      achievements: [
        "Expansión internacional",
        "Nuevos servicios",
        "Equipo de 50+ expertos",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
          Nuestra Historia
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Desde nuestros humildes comienzos hasta convertirnos en líderes de la
          ciberseguridad accesible. Cada año ha sido un paso hacia nuestra
          visión de proteger a todas las empresas.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <motion.div
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 md:transform md:-translate-x-1/2"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{ transformOrigin: "top" }}
        />

        {/* Timeline Items */}
        <div className="space-y-12">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              className={`relative flex items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } flex-row`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Timeline Node */}
              <motion.div
                className="absolute left-4 md:left-1/2 w-4 h-4 bg-white border-4 border-yellow-500 rounded-full md:transform md:-translate-x-1/2 z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.5 }}
              />

              {/* Content Card */}
              <div
                className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  {/* Year Badge */}
                  <motion.div
                    className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-4"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{milestone.year}</span>
                  </motion.div>

                  {/* Icon and Title */}
                  <div className="flex items-start space-x-4 mb-4">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${milestone.color} flex items-center justify-center flex-shrink-0`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <milestone.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                      Logros Destacados
                    </h4>
                    <div className="space-y-2">
                      {milestone.achievements.map(
                        (achievement, achievementIndex) => (
                          <motion.div
                            key={achievement}
                            className="flex items-center space-x-2"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.2 + achievementIndex * 0.1 + 0.6,
                            }}
                            viewport={{ once: true }}
                          >
                            <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                            <span className="text-gray-700 text-sm">
                              {achievement}
                            </span>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Future Vision Section */}
      <motion.div
        className="mt-20 bg-gradient-to-br from-black to-gray-900 rounded-3xl p-8 md:p-12 text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-center">
          <motion.h3
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            El Futuro de la Ciberseguridad
          </motion.h3>

          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Continuamos innovando para hacer que la ciberseguridad sea más
            inteligente, más accesible y más efectiva. Nuestro objetivo es
            proteger a 10,000 empresas para el 2026.
          </motion.p>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              {
                title: "IA Avanzada",
                desc: "Inteligencia artificial de próxima generación para detección de amenazas",
              },
              {
                title: "Automatización Total",
                desc: "Respuesta automática a incidentes sin intervención humana",
              },
              {
                title: "Educación Global",
                desc: "Formación en ciberseguridad para equipos de todas las empresas",
              },
            ].map((vision, index) => (
              <motion.div
                key={vision.title}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-bold mb-3 text-yellow-400">
                  {vision.title}
                </h4>
                <p className="text-gray-400">{vision.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
