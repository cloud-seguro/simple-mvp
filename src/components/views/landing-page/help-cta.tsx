import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpCTA() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-8 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-black">
          ¿Tienes preguntas?
        </h2>
        <p className="text-base md:text-lg max-w-3xl mx-auto px-4 text-black opacity-90">
          Visita nuestro centro de ayuda para encontrar respuestas detalladas
          sobre la plataforma
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-gray-50 rounded-xl p-8 md:p-12 border border-gray-200 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">
              Centro de Ayuda
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Encuentra respuestas a todas tus dudas sobre ciberseguridad y
              nuestra plataforma
            </p>
          </div>

          <Button
            size="lg"
            className="w-full bg-black hover:bg-gray-800 text-white px-6 py-6 rounded-md transition-all transform hover:-translate-y-1 text-lg"
            asChild
          >
            <Link href="/ayuda">Ir a centro de ayuda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
