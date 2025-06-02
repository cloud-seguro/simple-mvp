"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/views/landing-page/navbar";
import Footer from "@/components/views/landing-page/Footer";
import { HelpAccordion } from "@/components/views/help/HelpAccordion";

export default function AyudaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1 bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Page Header */}
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                ¿Cómo podemos ayudarte?
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Encuentra respuestas a todas tus preguntas sobre Ciberseguridad
                Simple y nuestros servicios
              </p>

              {/* Search Input */}
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Buscar preguntas frecuentes..."
                  className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-gray-200 bg-white focus:border-gray-400 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white px-8"
                  asChild
                >
                  <Link href="/#evaluacion">Comenzar Evaluación</Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8" asChild>
                  <Link href="/contacto">Contactar Soporte</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* FAQ Accordion */}
          <HelpAccordion searchTerm={searchTerm} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
