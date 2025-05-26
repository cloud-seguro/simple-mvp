"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HyperText } from "@/components/magicui/hyper-text";
import { Button } from "@/components/ui/button";
import { Shield, Users, Target, Award } from "lucide-react";

export default function AboutHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavClick = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  return (
    <section className="py-32 px-4 md:py-40 mt-16 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <HyperText
              className="text-4xl font-bold leading-tight text-black mb-4"
              startOnView={true}
            >
              Nosotros Somos SIMPLE
            </HyperText>
            <p className="text-lg text-gray-600 mb-8">
              Conoce al equipo que está transformando la ciberseguridad
              empresarial
            </p>
          </motion.div>

          <motion.div className="flex justify-center mb-8">
            <div className="relative w-full max-w-[280px] h-[280px]">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-black"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-4 rounded-full bg-yellow-400 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <Shield className="w-24 h-24 text-black" />
              </motion.div>

              {/* Floating Icons */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Users className="w-6 h-6 text-black" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <Target className="w-6 h-6 text-black" />
              </motion.div>
              <motion.div
                className="absolute top-1/2 -left-6 bg-white rounded-full p-3 shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                <Award className="w-6 h-6 text-black" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <div className="flex flex-col gap-4">
              <Button
                className="w-full bg-black text-white px-6 py-6 rounded-md hover:bg-gray-800 transition-all transform hover:-translate-y-1 text-lg"
                onClick={() => handleNavClick("#mision")}
              >
                Conocer Nuestra Misión
              </Button>
              <Button
                className="w-full bg-yellow-400 text-black px-6 py-6 rounded-md hover:bg-yellow-500 transition-all transform hover:-translate-y-1 text-lg"
                onClick={() => handleNavClick("#equipo")}
              >
                Conocer al Equipo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HyperText
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black"
              startOnView={true}
            >
              Nosotros Somos SIMPLE
            </HyperText>
            <p className="text-xl mb-6 text-gray-600">
              Somos un equipo apasionado de expertos en ciberseguridad que cree
              que la protección digital no debe ser complicada ni costosa.
            </p>
            <p className="text-lg mb-8 text-gray-700">
              Nuestra misión es democratizar la ciberseguridad, haciendo que las
              mejores prácticas de protección sean accesibles para todas las
              empresas, independientemente de su tamaño.
            </p>
            <div className="flex flex-row gap-4">
              <Button
                className="bg-black text-white px-6 py-4 rounded-md hover:bg-gray-800 transition-all transform hover:-translate-y-1 text-lg"
                onClick={() => handleNavClick("#mision")}
              >
                Nuestra Misión
              </Button>
              <Button
                className="bg-yellow-400 text-black px-6 py-4 rounded-md hover:bg-yellow-500 transition-all transform hover:-translate-y-1 text-lg"
                onClick={() => handleNavClick("#equipo")}
              >
                Conocer al Equipo
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md h-96">
              <motion.div
                className="absolute inset-0 rounded-3xl border-4 border-black"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-6 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <Shield className="w-32 h-32 text-black" />
              </motion.div>

              {/* Floating Icons with Animation */}
              <motion.div
                className="absolute -top-6 -right-6 bg-white rounded-full p-4 shadow-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                whileHover={{ scale: 1.1 }}
              >
                <Users className="w-8 h-8 text-black" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-full p-4 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.4 }}
                whileHover={{ scale: 1.1 }}
              >
                <Target className="w-8 h-8 text-black" />
              </motion.div>
              <motion.div
                className="absolute top-1/2 -left-8 bg-white rounded-full p-4 shadow-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                whileHover={{ scale: 1.1 }}
              >
                <Award className="w-8 h-8 text-black" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
