"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/views/landing-page/navbar"
import Hero from "@/components/views/landing-page/Hero"
import EvaluationOptions from "@/components/views/landing-page/evaluation-options"
import Testimonial from "@/components/views/landing-page/Testimonials"
import DiscoverSection from "@/components/views/landing-page/discover-section"
import Footer from "@/components/views/landing-page/Footer"
import Benefits from "@/components/views/landing-page/benefits"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <motion.section id="evaluacion" className="py-24" {...fadeInUp}>
        <EvaluationOptions />
      </motion.section>
      <motion.section id="beneficios" className="py-24 bg-gray-50" {...fadeInUp}>
        <Benefits />
      </motion.section>
      <motion.section id="testimonios" className="py-24" {...fadeInUp}>
        <Testimonial />
      </motion.section>
      <motion.section id="descubre" {...fadeInUp}>
        <DiscoverSection />
      </motion.section>
      <Footer />
    </main>
  )
}

