"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="py-32 px-4 md:py-40 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black">
              Hacemos lo complejo de la Ciberseguridad Simple
            </h1>
            <p className="text-lg md:text-xl mb-8 text-black">
              La ciberseguridad no tiene que ser difícil ni costosa. Con nuestro enfoque, te ayudamos a entender tu
              nivel actual de seguridad a través de evaluaciones personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-black text-white px-6 py-6 rounded-md hover:bg-gray-800 transition-all text-lg">
                  Comenzar Evaluación
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-black text-black px-6 py-6 rounded-md hover:bg-black hover:text-white transition-all text-lg"
                >
                  Saber Más
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <motion.svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                aria-label="Círculo animado"
                role="img"
              >
                <g fill="none" stroke="black" strokeWidth="2">
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="70"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.path
                    d="M100,30 L100,170 M30,100 L170,100"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.path
                    d="M65,65 L135,135 M65,135 L135,65"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1, repeat: Number.POSITIVE_INFINITY }}
                  />
                </g>
                <circle cx="100" cy="100" r="30" fill="black">
                  <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite" />
                </circle>
              </motion.svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

