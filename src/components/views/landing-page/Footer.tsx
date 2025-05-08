import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4" id="contacto">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              SIMPLE
            </h3>
            <p className="text-gray-300">
              Hacemos lo complejo de la Ciberseguridad Simple
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-yellow-400">
              Evaluaciones
            </h3>
            <Separator className="my-4 bg-gray-700" />
            <ul className="space-y-3">
              <li>
                <Link
                  href="/evaluacion-inicial"
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                  <span>Evaluación Inicial</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/evaluacion-avanzada"
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                  <span>Evaluación Avanzada</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                  <span>Blog</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-yellow-400">Contacto</h3>
            <Separator className="my-4 bg-gray-700" />
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center space-x-3 group hover:text-yellow-400 transition-colors">
                <Button className="h-8 w-8 p-0 bg-yellow-400 hover:bg-yellow-500">
                  <Mail className="h-4 w-4 text-black" />
                </Button>
                <span>contacto@ciberseguridadsimple.com</span>
              </li>
              <li className="flex items-center space-x-3 group hover:text-yellow-400 transition-colors">
                <Button className="h-8 w-8 p-0 bg-yellow-400 hover:bg-yellow-500">
                  <MapPin className="h-4 w-4 text-black" />
                </Button>
                <span>Bogotá, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} SIMPLE. Todos los derechos
              reservados.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/terminos"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
