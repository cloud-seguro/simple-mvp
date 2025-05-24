"use client";

import { motion } from "framer-motion";
import {
  Linkedin,
  Mail,
  Shield,
  Code,
  Database,
  Users as UsersIcon,
} from "lucide-react";

export default function AboutTeam() {
  const teamMembers = [
    {
      name: "Ana García",
      role: "CEO & Fundadora",
      bio: "15 años de experiencia en ciberseguridad empresarial. Ex-CISO de Fortune 500.",
      icon: Shield,
      color: "from-blue-500 to-blue-700",
      expertise: [
        "Estrategia de Seguridad",
        "Gestión de Riesgos",
        "Compliance",
      ],
    },
    {
      name: "Carlos Mendoza",
      role: "CTO",
      bio: "Arquitecto de sistemas de seguridad con más de 12 años desarrollando soluciones escalables.",
      icon: Code,
      color: "from-green-500 to-green-700",
      expertise: ["Arquitectura de Seguridad", "DevSecOps", "Cloud Security"],
    },
    {
      name: "María López",
      role: "Head of Security Operations",
      bio: "Especialista en detección de amenazas y respuesta a incidentes con certificaciones CISSP y CEH.",
      icon: Database,
      color: "from-purple-500 to-purple-700",
      expertise: ["SOC Operations", "Threat Hunting", "Incident Response"],
    },
    {
      name: "David Rodríguez",
      role: "Head of Customer Success",
      bio: "Experto en transformación digital y adopción de tecnologías de seguridad en empresas.",
      icon: UsersIcon,
      color: "from-orange-500 to-orange-700",
      expertise: ["Customer Experience", "Training", "Implementation"],
    },
  ];

  const stats = [
    { number: "50+", label: "Años de experiencia combinada" },
    { number: "20+", label: "Certificaciones profesionales" },
    { number: "500+", label: "Clientes satisfechos" },
    { number: "24/7", label: "Disponibilidad del equipo" },
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
          Conoce a Nuestro Equipo
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Un grupo de expertos apasionados por hacer que la ciberseguridad sea
          accesible, comprensible y efectiva para todas las empresas.
        </p>
      </motion.div>

      {/* Team Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
              {stat.number}
            </div>
            <div className="text-gray-600 text-sm md:text-base">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Team Members Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            className="group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
              {/* Header with Icon and Basic Info */}
              <div className="flex items-start space-x-6 mb-6">
                <motion.div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <member.icon className="w-10 h-10 text-white" />
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-black mb-1">
                    {member.name}
                  </h3>
                  <p className="text-lg font-semibold text-gray-600 mb-3">
                    {member.role}
                  </p>

                  {/* Social Links */}
                  <div className="flex space-x-3">
                    <motion.button
                      className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Linkedin className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                      className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Mail className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 leading-relaxed mb-6">{member.bio}</p>

              {/* Expertise Tags */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                  Especialidades
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: skillIndex * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, backgroundColor: "#fef3c7" }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Culture Section */}
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12 text-white"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Nuestra Cultura de Trabajo
            </h3>
            <div className="space-y-4">
              {[
                "Colaboración transparente y comunicación abierta",
                "Aprendizaje continuo y crecimiento profesional",
                "Balance entre trabajo y vida personal",
                "Innovación como motor de cambio",
                "Compromiso con la excelencia en el servicio",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-yellow-400 rounded-2xl p-8 text-black">
              <h4 className="text-2xl font-bold mb-4">¿Quieres Unirte?</h4>
              <p className="text-lg mb-6">
                Siempre estamos buscando talento excepcional que comparta
                nuestra pasión por simplificar la ciberseguridad.
              </p>
              <motion.button
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Oportunidades
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
