import { Button } from "@/components/ui/button";
import { Shield, Clock, BookOpen } from "lucide-react";

export default function ThreePillars() {
  return (
    <section className="py-20 px-4" id="servicios">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Nuestros tres pilares para fortalecer tu empresa
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-yellow-400 rounded-lg p-8 flex flex-col h-full">
            <div className="mb-6">
              <Shield size={48} className="text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Evalúa tu nivel de madurez
            </h3>
            <p className="mb-6 flex-grow">
              Existen diferentes niveles y marcos de referencia en
              ciberseguridad, como NIST, CIS, ISO 27001. Con nuestra evaluación,
              descubrirás tu nivel de madurez a través de preguntas sencillas.
            </p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-black mr-2">✔</span>
                <span>
                  Básico: No cuentas con medidas de seguridad implementadas.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">✔</span>
                <span>
                  Especializado: Ya tienes procesos, Framework como ISO 27001,
                  NIST y controles.
                </span>
              </li>
            </ul>
            <Button className="mt-auto text-black font-semibold flex items-center hover:underline">
              Realiza la evaluación
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-label="Flecha derecha"
                role="img"
              >
                <title>Flecha derecha</title>
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>

          {/* Pillar 2 */}
          <div className="bg-orange-400 rounded-lg p-8 flex flex-col h-full">
            <div className="mb-6">
              <Clock size={48} className="text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Contrata un servicio a tu medida
            </h3>
            <p className="mb-6 flex-grow">
              Luego de conocer tu nivel de madurez, elige la solución que mejor
              se adapte a tu empresa. No pagues de más, contrata exactamente lo
              que necesitas.
            </p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-black mr-2">•</span>
                <span>💼 Servicio por horas: Asesoría especializada.</span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">•</span>
                <span>🔍 Auditorías y pruebas de pentesting.</span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">•</span>
                <span>📊 Planes personalizados.</span>
              </li>
            </ul>
            <Button className="mt-auto text-black font-semibold flex items-center hover:underline">
              Agenda una consulta
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-label="Flecha derecha"
                role="img"
              >
                <title>Flecha derecha</title>
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>

          {/* Pillar 3 */}
          <div className="bg-teal-400 rounded-lg p-8 flex flex-col h-full">
            <div className="mb-6">
              <BookOpen size={48} className="text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Aprende y mantente informado
            </h3>
            <p className="mb-6 flex-grow">
              La ciberseguridad es un proceso continuo. Accede a contenido
              exclusivo y mantente actualizado con las mejores estrategias.
            </p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-black mr-2">•</span>
                <span>
                  Blog y artículos: Aprende sobre riesgos, tendencias y buenas
                  prácticas.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">•</span>
                <span>
                  Casos de éxito: Descubre cómo otras empresas han mejorado su
                  seguridad.
                </span>
              </li>
            </ul>
            <Button className="mt-auto text-black font-semibold flex items-center hover:underline">
              Explora nuestro contenido
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-label="Flecha derecha"
                role="img"
              >
                <title>Flecha derecha</title>
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
