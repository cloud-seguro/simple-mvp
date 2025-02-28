"use client"

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function DiscoverSection() {
  const router = useRouter();

  const handleEvaluation = () => {
    router.push("/evaluation/initial");
  };

  return (
    <div className="relative overflow-hidden animate-color-transition">
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden py-12">
          <div className="text-center mb-8">
            <div className="h-[120px]">
              <TypingAnimation
                className="text-3xl font-bold mb-6 text-white"
                startOnView={true}
              >
                Descubre tus vulnerabilidades de seguridad
              </TypingAnimation>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48"
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

          <div className="text-center">
            <p className="text-base mb-8 text-white/90 leading-relaxed">
              Las amenazas cibernéticas afectan la forma en que manejas el
              trabajo y los desafíos empresariales. Protege lo que más importa.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="w-full"
              onClick={handleEvaluation}
            >
              <InteractiveHoverButton className="w-full text-base">
                Descubre tus vulnerabilidades
              </InteractiveHoverButton>
            </motion.div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-row items-center justify-between py-24">
          <div className="w-1/2">
            <div className="h-[144px]">
              <TypingAnimation
                className="text-5xl font-bold mb-8 text-white"
                startOnView={true}
              >
                Descubre tus vulnerabilidades de seguridad
              </TypingAnimation>
            </div>
            <p className="text-xl mb-12 text-white/90 leading-relaxed py-4">
              Las amenazas cibernéticas afectan la forma en que manejas el
              trabajo y los desafíos empresariales. Protege lo que más importa.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={handleEvaluation}
            >
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
            className="w-1/2 flex justify-center"
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

