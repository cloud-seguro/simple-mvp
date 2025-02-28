"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function DiscoverSection() {
  return (
    <div className="relative overflow-hidden animate-color-transition">
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 md:mb-0 md:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Descubre tus vulnerabilidades de seguridad
            </h2>
            <p className="text-xl mb-12 text-white/90 leading-relaxed">
              Las amenazas cibernéticas afectan la forma en que manejas el trabajo y los desafíos empresariales. Protege
              lo que más importa.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="bg-black text-white px-8 py-4 text-lg rounded-md hover:bg-white hover:text-black transition-all transform"
              >
                Descubre tus vulnerabilidades
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-1/2 flex justify-center"
          >
            <svg viewBox="0 0 200 200" className="w-64 h-64" aria-label="Círculo animado" role="img">
              <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="8" />
              <circle cx="70" cy="80" r="10" fill="white" />
              <circle cx="130" cy="80" r="10" fill="white" />
              <path d="M 60 130 Q 100 160 140 130" fill="none" stroke="white" strokeWidth="8" />
            </svg>
          </motion.div>
        </div>
      </div>
      {/* The animation is now defined in globals.css */}
    </div>
  )
}

