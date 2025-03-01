"use client"

import { motion } from "framer-motion"

export function AnimatedSecuritySVG() {
  return (
    <div className="relative w-full max-w-[250px] aspect-square">
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 50,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
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
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
          <motion.path
            d="M100,30 L100,170 M30,100 L170,100"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 0.5,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
          <motion.path
            d="M65,65 L135,135 M65,135 L135,65"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 1,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        </g>
        <circle cx="100" cy="100" r="30" fill="black">
          <animate
            attributeName="r"
            values="30;35;30"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </motion.svg>
    </div>
  )
} 