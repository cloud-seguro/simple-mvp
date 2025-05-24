"use client";

import { motion } from "framer-motion";
import { Shield, Users, Search, ArrowUpRight } from "lucide-react";

export default function ModulesSection() {
  const tableVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <section className="bg-white" id="modulos">
      <div className="max-w-6xl mx-auto px-4">
        {/* Modules Section */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🧩 Nuestros módulos (addons)
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-6">
            Conecta solo lo que tu empresa necesita. Cada módulo es un addon que
            puedes activar con un clic desde tu dashboard.
          </p>
        </motion.div>

        {/* Modules Table */}
        <motion.div
          className="overflow-x-auto mb-8"
          variants={tableVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <table className="w-full border-collapse border-spacing-0 rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-black text-white">
              <tr>
                <th className="text-left p-4">Módulo</th>
                <th className="text-left p-4">Función</th>
              </tr>
            </thead>
            <tbody>
              <motion.tr
                variants={tableRowVariants}
                className="bg-white hover:bg-gray-100"
              >
                <td className="p-4 border-t font-semibold">Simple Evalúa</td>
                <td className="p-4 border-t">
                  Diagnóstico del estado actual de ciberseguridad y plan de
                  mejora.
                </td>
              </motion.tr>
              <motion.tr
                variants={tableRowVariants}
                className="bg-white hover:bg-gray-100"
              >
                <td className="p-4 border-t font-semibold">Simple Breach</td>
                <td className="p-4 border-t">
                  Revisa si los datos de tu empresa han sido comprometidos o
                  filtrados.
                </td>
              </motion.tr>
              <motion.tr
                variants={tableRowVariants}
                className="bg-white hover:bg-gray-100"
              >
                <td className="p-4 border-t font-semibold">Simple Scan</td>
                <td className="p-4 border-t">
                  Escanea tu sitio web o aplicaciones en busca de
                  vulnerabilidades.
                </td>
              </motion.tr>
              <motion.tr
                variants={tableRowVariants}
                className="bg-white hover:bg-gray-100"
              >
                <td className="p-4 border-t font-semibold">Simple API</td>
                <td className="p-4 border-t">
                  Analiza la seguridad de tus APIs. Las APIs son el principal
                  riesgo en fintech.
                </td>
              </motion.tr>
              <motion.tr
                variants={tableRowVariants}
                className="bg-white hover:bg-gray-100"
              >
                <td className="p-4 border-t font-semibold">Simple Contrata</td>
                <td className="p-4 border-t">
                  Accede al mejor equipo de profesionales de ciberseguridad en
                  LATAM.
                </td>
              </motion.tr>
            </tbody>
          </table>
        </motion.div>

        {/* Why Choose Simple */}
        <motion.div
          className="bg-gray-50 rounded-xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">
            ¿Por qué elegir Ciberseguridad Simple?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <Shield className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="font-medium">Sin tecnicismos innecesarios.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <ArrowUpRight className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="font-medium">
                  Herramientas accionables y modulares.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <Users className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="font-medium">
                  Ideal para startups, pymes y fintechs.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <Search className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="font-medium">
                  Ahorra tiempo y mejora tu seguridad desde hoy.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
