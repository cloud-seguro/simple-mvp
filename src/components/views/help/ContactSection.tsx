import Link from "next/link";
import { MessageCircle, Mail, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Necesitas más ayuda?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Si no encontraste la respuesta que buscabas, nuestro equipo de soporte
          está disponible para ayudarte.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
            <MessageCircle className="h-6 w-6 text-gray-700" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Chat en Vivo</h3>
          <p className="text-gray-600 text-sm mb-6">
            Habla directamente con nuestro equipo de soporte técnico 24/7
          </p>
          <Button variant="outline" className="w-full">
            Iniciar Chat
          </Button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
            <Mail className="h-6 w-6 text-gray-700" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Soporte por Email
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Envíanos tu consulta detallada y recibe respuestas completas
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="mailto:soporte@simple.com">Enviar Email</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
            <Video className="h-6 w-6 text-gray-700" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Sesión Personalizada
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Programa una videollamada con un experto para ayuda especializada
          </p>
          <Button variant="outline" className="w-full">
            Programar Llamada
          </Button>
        </div>
      </div>

      {/* Additional CTA */}
      <div className="text-center mt-12 p-8 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          ¿Listo para comenzar?
        </h3>
        <p className="text-gray-600 mb-6">
          Inicia tu evaluación de ciberseguridad ahora y descubre cómo podemos
          ayudarte a proteger tu empresa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8"
            asChild
          >
            <Link href="/#evaluacion">Comenzar Evaluación</Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8" asChild>
            <Link href="/pricing">Ver Planes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
