import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-4" id="contacto">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              SIMPLE
            </h3>
            <p className="text-gray-300">
              Hacemos lo complejo de la Ciberseguridad Simple
            </p>
            <Separator className="my-6 bg-gray-700" />
            <div className="flex space-x-6">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                onClick={() =>
                  window.open("https://facebook.com/simplesec", "_blank")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-label="Facebook"
                  role="img"
                >
                  <title>Facebook</title>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                onClick={() =>
                  window.open("https://instagram.com/simplesec", "_blank")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-label="Instagram"
                  role="img"
                >
                  <title>Instagram</title>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                onClick={() =>
                  window.open(
                    "https://linkedin.com/company/simplesec",
                    "_blank"
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-label="LinkedIn"
                  role="img"
                >
                  <title>LinkedIn</title>
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Button>
            </div>
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
                  href="/faq"
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                  <span>Preguntas Frecuentes</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/metodologia"
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                  <span>Metodología</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-yellow-400">Recursos</h3>
            <Separator className="my-4 bg-gray-700" />
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/casos-de-exito"
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                  <span>Casos de éxito</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/guias"
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                  <span>Guías</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/webinars"
                  className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                  <span>Webinars</span>
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
                <span>info@simplesec.com</span>
              </li>
              <li className="flex items-center space-x-3 group hover:text-yellow-400 transition-colors">
                <Button className="h-8 w-8 p-0 bg-yellow-400 hover:bg-yellow-500">
                  <Phone className="h-4 w-4 text-black" />
                </Button>
                <span>+34 123 456 789</span>
              </li>
              <li className="flex items-center space-x-3 group hover:text-yellow-400 transition-colors">
                <Button className="h-8 w-8 p-0 bg-yellow-400 hover:bg-yellow-500">
                  <MapPin className="h-4 w-4 text-black" />
                </Button>
                <span>Madrid, España</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} SIMPLE. Todos los derechos
              reservados.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/terminos"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              Términos y Condiciones
            </Link>
            <Link
              href="/privacidad"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              Política de Privacidad
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
