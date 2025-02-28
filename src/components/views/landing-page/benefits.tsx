"use client"

import { motion } from "framer-motion"
import { CheckCircle, Shield, FileText } from "lucide-react"

export default function Benefits() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Beneficios de nuestras evaluaciones</h2>
        <p className="text-lg max-w-3xl mx-auto">
          Descubre cómo nuestras evaluaciones pueden ayudarte a mejorar la seguridad de tu empresa
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Benefit 1 */}
        <motion.div
          className="bg-teal-400 rounded-xl p-8 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-6 text-black">
            <CheckCircle size={48} />
          </div>
          <h3 className="text-xl font-bold mb-4 text-black">Identificación de riesgos</h3>
          <p className="text-black/90">
            Nuestras evaluaciones te ayudan a identificar los riesgos de seguridad específicos de tu empresa,
            permitiéndote priorizar tus esfuerzos de protección.
          </p>
        </motion.div>

        {/* Benefit 2 */}
        <motion.div
          className="bg-teal-300 rounded-xl p-8 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-6 text-black">
            <Shield size={48} />
          </div>
          <h3 className="text-xl font-bold mb-4 text-black">Cumplimiento normativo</h3>
          <p className="text-black/90">
            Evalúa tu nivel de cumplimiento con estándares como ISO 27001, NIST y otras regulaciones relevantes para tu
            industria.
          </p>
        </motion.div>

        {/* Benefit 3 */}
        <motion.div
          className="bg-teal-400 rounded-xl p-8 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-6 text-black">
            <FileText size={48} />
          </div>
          <h3 className="text-xl font-bold mb-4 text-black">Plan de acción claro</h3>
          <p className="text-black/90">
            Recibe recomendaciones personalizadas y un plan de acción claro para mejorar tu postura de seguridad de
            manera efectiva y eficiente.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        className="mt-20 bg-orange-500 rounded-xl p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold mb-2 text-white">85%</h3>
            <p className="text-lg text-white/90">de las empresas mejoran su seguridad tras la evaluación</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2 text-white">60%</h3>
            <p className="text-lg text-white/90">reducción en incidentes de seguridad</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2 text-white">90%</h3>
            <p className="text-lg text-white/90">de satisfacción con nuestras recomendaciones</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

