"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Database,
  Bell,
  Search,
  ArrowUpRight,
  Users,
} from "lucide-react";

export default function DashboardSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Dashboard Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tu panel de control de ciberseguridad
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Accede a recursos exclusivos con nuestra suscripción mensual
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Dashboard Features */}
          <motion.div
            className="flex flex-col space-y-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={item} className="flex items-start">
              <div className="bg-orange-400 p-3 rounded-full mr-4 flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Dashboard personalizado
                </h3>
                <p className="text-gray-600">
                  Visualiza tu progreso y estado de seguridad actual en un panel
                  intuitivo y fácil de entender.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} className="flex items-start">
              <div className="bg-orange-400 p-3 rounded-full mr-4 flex-shrink-0">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Análisis continuo
                </h3>
                <p className="text-gray-600">
                  Monitoreo constante de vulnerabilidades y alertas en tiempo
                  real sobre nuevas amenazas.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} className="flex items-start">
              <div className="bg-orange-400 p-3 rounded-full mr-4 flex-shrink-0">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Historial de reportes
                </h3>
                <p className="text-gray-600">
                  Accede a un historial completo de reportes y recomendaciones
                  personalizadas para tu empresa.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} className="flex items-start">
              <div className="bg-orange-400 p-3 rounded-full mr-4 flex-shrink-0">
                <ArrowUpRight className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Activa solo lo que necesites
                </h3>
                <p className="text-gray-600">
                  Contrata módulos adicionales específicos según las necesidades
                  de tu empresa, cuando los necesites.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Dashboard Mockup/Image */}
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gray-800 h-8 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-gray-100 p-6">
              <div className="bg-white rounded-lg p-4 shadow mb-4">
                <h4 className="font-bold text-lg mb-2">Estado de seguridad</h4>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="h-4 rounded-full bg-orange-400"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Nivel 3 - Definido</span>
                  <span>65%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <h5 className="font-semibold mb-2">Vulnerabilidades</h5>
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-sm text-green-600">
                    ↓ 3 desde el último mes
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <h5 className="font-semibold mb-2">Módulos activos</h5>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-blue-600">
                    Simple Breach, Simple Scan
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col md:flex-row justify-center gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/pricing">
            <Button className="bg-black text-white hover:bg-gray-800 w-full md:w-auto px-8 py-3">
              Conoce el plan mensual
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-2 border-black w-full md:w-auto px-8 py-3"
            >
              Acceder al dashboard
            </Button>
          </Link>
        </motion.div>

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
          className="bg-white rounded-xl p-8 shadow-lg"
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
