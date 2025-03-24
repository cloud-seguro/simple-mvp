import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer
      className="bg-white text-gray-800 py-16 px-4 border-t border-gray-200"
      id="contacto"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">SIMPLE</h3>
            <p className="text-gray-600">
              Hacemos lo complejo de la Ciberseguridad Simple
            </p>
            <Separator className="my-6" />
            <div className="flex space-x-6">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-yellow-500 transition-colors"
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
                className="hover:text-yellow-500 transition-colors"
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
                className="hover:text-yellow-500 transition-colors"
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
            <h3 className="text-xl font-semibold">Evaluaciones</h3>
            <Separator className="my-4" />
            <ul className="space-y-3">
              <li>
                <Link
                  href="/evaluacion-inicial"
                  className="text-gray-600 hover:text-yellow-500 transition-colors"
                >
                  Evaluación Inicial
                </Link>
              </li>
              <li>
                <Link
                  href="/evaluacion-avanzada"
                  className="text-gray-600 hover:text-yellow-500 transition-colors"
                >
                  Evaluación Avanzada
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-yellow-500 transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/metodologia"
                  className="text-gray-600 hover:text-yellow-500 transition-colors"
                >
                  Metodología
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recursos</h3>
            <Separator className="my-4" />
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-yellow-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/casos-de-exito"
                  className="text-gray-600 hover:text-yellow-500 transition-colors"
                >
                  Casos de éxito
                </Link>
              </li>
              <li>
                <Link
                  href="/guias"
                  className="text-gray-600 hover:text-yellow-500 transition-colors"
                >
                  Guías
                </Link>
              </li>
              <li>
                <Link
                  href="/webinars"
                  className="text-gray-600 hover:text-yellow-500 transition-colors"
                >
                  Webinars
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contacto</h3>
            <Separator className="my-4" />
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span>info@simplesec.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📱</span>
                <span>+34 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>Madrid, España</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-gray-600 text-sm">
          <p>
            &copy; {new Date().getFullYear()} SIMPLE. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
