"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HyperText } from "@/components/magicui/hyper-text";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

// Simple animation component with reduced complexity
const SimpleAnimatedCircle = () => (
  <div className="relative w-full max-w-[250px] aspect-square mx-auto">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g fill="none" stroke="black" strokeWidth="2">
        <circle cx="100" cy="100" r="70" />
        <path d="M100,30 L100,170 M30,100 L170,100" />
        <path d="M65,65 L135,135 M65,135 L135,65" />
      </g>
      <circle cx="100" cy="100" r="30" fill="black" />
    </svg>
  </div>
);

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector("#evaluacion");
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  return (
    <section className="py-32 px-4 md:py-40 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Mobile Layout (Hidden on Desktop) */}
        <div className="flex flex-col md:hidden">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold leading-tight text-black">
              Hacemos lo complejo de la ciberseguridad, SIMPLE.
            </h1>
          </div>

          <div className="flex justify-center mb-8">
            <Suspense
              fallback={
                <div className="w-full max-w-[250px] aspect-square bg-gray-100 rounded-full"></div>
              }
            >
              <SimpleAnimatedCircle />
            </Suspense>
          </div>

          <div className="text-center">
            <p className="text-lg mb-8 text-black">
              Muchas empresas no acceden a servicios de ciberseguridad porque
              son costosos, técnicos o difíciles de entender. En Ciberseguridad
              Simple, transformamos lo difícil en soluciones claras, accesibles
              y accionables. Evalúa, mejora y protege tu empresa sin enredos.
            </p>
            <div className="flex flex-col gap-4">
              <Button
                className="w-full bg-black text-white px-6 py-6 rounded-md hover:bg-gray-800 transition-all text-lg"
                onClick={handleNavClick}
              >
                Comenzar Evaluación
              </Button>
              <Link href="/pricing" className="w-full" prefetch={false}>
                <Button className="w-full bg-white text-black border-2 border-black px-6 py-6 rounded-md hover:bg-gray-100 transition-all text-lg">
                  Ver Precios
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Layout (Hidden on Mobile) */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black">
              Hacemos lo complejo de la ciberseguridad, SIMPLE.
            </h1>
            <p className="text-xl mb-8 text-black">
              Muchas empresas no acceden a servicios de ciberseguridad porque
              son costosos, técnicos o difíciles de entender. En Ciberseguridad
              Simple, transformamos lo difícil en soluciones claras, accesibles
              y accionables. Evalúa, mejora y protege tu empresa sin enredos.
            </p>
            <p className="text-xl font-bold mb-8 text-black">
              🎯 Todo desde un solo lugar.
            </p>
            <div className="flex flex-row gap-4">
              <Button
                className="bg-black text-white px-6 py-6 rounded-md hover:bg-gray-800 transition-all text-lg"
                onClick={handleNavClick}
              >
                Comenzar Evaluación
              </Button>
              <Link href="/pricing" prefetch={false}>
                <Button className="bg-white text-black border-2 border-black px-6 py-6 rounded-md hover:bg-gray-100 transition-all text-lg">
                  Ver Precios
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <Suspense
              fallback={
                <div className="w-full max-w-md aspect-square bg-gray-100 rounded-full"></div>
              }
            >
              <SimpleAnimatedCircle />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
