"use client"

import { motion } from "framer-motion";
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
export default function DiscoverSection() {
  return (
    <div className="relative overflow-hidden animate-color-transition">
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-between py-12 md:py-24">
          <div className="text-center md:text-left w-full mb-8">
            <div className="h-[120px] md:h-[144px]">
              <TypingAnimation
                className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-white"
                startOnView={true}
              >
                Descubre tus vulnerabilidades de seguridad
              </TypingAnimation>
            </div>
          </div>

          {/* SVG moved up for mobile, reordered with flex on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0 md:order-last"
          >
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 md:w-64 md:h-64"
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

          <div className="w-full md:w-1/2">
            <p className="text-base md:text-xl mb-8 md:mb-12 text-white/90 leading-relaxed py-2 md:py-4 text-center md:text-left">
              Las amenazas cibernéticas afectan la forma en que manejas el
              trabajo y los desafíos empresariales. Protege lo que más importa.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto flex justify-center md:justify-start"
            >
              <InteractiveHoverButton className="w-full md:w-auto text-base md:text-lg">
                Descubre tus vulnerabilidades
              </InteractiveHoverButton>
            </motion.div>
          </div>
        </div>
      </div>
      {/* The animation is now defined in globals.css */}
    </div>
  );
}

