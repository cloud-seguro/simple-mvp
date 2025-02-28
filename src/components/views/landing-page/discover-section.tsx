"use client"

import { motion } from "framer-motion";
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
export default function DiscoverSection() {
  return (
    <div className="relative overflow-hidden animate-color-transition">
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-24">
          <div className="mb-12 md:mb-0 md:w-1/2">
            <div className="h-[180px] md:h-[144px]">
              <TypingAnimation
                className="text-4xl md:text-5xl font-bold mb-8 text-white"
                startOnView={true}
              >
                Descubre tus vulnerabilidades de seguridad
              </TypingAnimation>
            </div>
            <p className="text-xl mb-12 text-white/90 leading-relaxed py-4">
              Las amenazas cibernéticas afectan la forma en que manejas el
              trabajo y los desafíos empresariales. Protege lo que más importa.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <InteractiveHoverButton className="text-lg">
                Descubre tus vulnerabilidades
              </InteractiveHoverButton>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-1/2 flex justify-center"
          >
            <svg
              viewBox="0 0 200 200"
              className="w-64 h-64"
              aria-label="Círculo animado"
              role="img"
            >
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="white"
                strokeWidth="8"
              />
              <circle cx="70" cy="80" r="10" fill="white" />
              <circle cx="130" cy="80" r="10" fill="white" />
              <path
                d="M 60 130 Q 100 160 140 130"
                fill="none"
                stroke="white"
                strokeWidth="8"
              />
            </svg>
          </motion.div>
        </div>
      </div>
      {/* The animation is now defined in globals.css */}
    </div>
  );
}

