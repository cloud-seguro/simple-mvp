"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/views/landing-page/navbar";
import { Suspense, lazy, useEffect } from "react";

const Footer = lazy(() => import("@/components/views/landing-page/Footer"));

// Loading fallback
const FooterLoading = () => <div className="h-48 bg-gray-100"></div>;

export default function TermsPage() {
  // Adjust body padding for fixed navbar
  useEffect(() => {
    // Save the current padding to restore it later
    const originalPadding = document.body.style.paddingTop;

    // Set padding for the fixed navbar
    document.body.style.paddingTop = "76px";

    // Cleanup function to restore original padding when component unmounts
    return () => {
      document.body.style.paddingTop = originalPadding;
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-8 md:pt-12">
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6">
              TÉRMINOS Y CONDICIONES DE USO
            </h1>
            <p className="text-gray-500 mb-8">
              Ciberseguridad Simple | Última actualización: 5 de mayo de 2025
            </p>

            <p className="mb-6">
              Ciberseguridad Simple es una iniciativa de Cloud Seguro SAS,
              diseñada para acercar la ciberseguridad a empresas de todos los
              tamaños de forma simple, ética y responsable. Al usar esta
              plataforma, aceptas los siguientes Términos y Condiciones de forma
              plena y sin reservas.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              1. Objeto del Servicio
            </h2>
            <p className="mb-4">
              Ciberseguridad Simple ofrece herramientas digitales para:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Diagnóstico de nivel de madurez en ciberseguridad,</li>
              <li>Detección de exposición pública a través de Scan,</li>
              <li>Revisión de filtraciones públicas mediante Breach,</li>
              <li>
                Modelos y servicios complementarios (addons) para evaluar temas
                específicos como nube, phishing, vulnerabilidades, etc.
              </li>
            </ul>
            <p className="mb-6">
              Estas herramientas son informativas y no constituyen una
              auditoría, prueba técnica ni certificación formal. Los resultados
              deben usarse con criterio profesional y siempre validarse antes de
              tomar decisiones críticas.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. Autorización de Uso y Declaración de Responsabilidad
            </h2>
            <p className="mb-4">
              Al ingresar, registrarse o adquirir cualquiera de los servicios,
              el usuario declara expresamente que cuenta con la autorización de
              la empresa u organización para usar las herramientas, actuar en su
              nombre y validar su uso dentro del marco legal y contractual
              correspondiente.
            </p>
            <p className="mb-4">
              Así mismo, el usuario se compromete a no utilizar la plataforma
              para cargar, tratar o analizar datos sensibles o confidenciales,
              tales como:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Secretos industriales o comerciales,</li>
              <li>Información marcada como confidencial,</li>
              <li>Credenciales o contraseñas,</li>
              <li>Datos personales de carácter sensible.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. Confidencialidad y Alcance
            </h2>
            <p className="mb-4">
              A efectos de este acuerdo, se entiende por Información
              Confidencial todo contenido que:
            </p>
            <p className="mb-2">
              a) brinde a una organización o tercero una ventaja competitiva, o
              cuya divulgación resulte perjudicial; y
            </p>
            <p className="mb-4">
              b) esté marcado como &quot;Confidencial&quot;,
              &quot;Privado&quot;, &quot;Restringido&quot; o se deba asumir
              razonablemente como confidencial.
            </p>
            <p className="mb-4">
              Ciberseguridad Simple no recopila ni maneja este tipo de
              información, y el usuario reconoce que es su responsabilidad no
              introducirla en ningún flujo operativo.
            </p>
            <p className="mb-6">
              En caso de divulgación accidental, el usuario debe notificar
              inmediatamente a Cloud Seguro SAS para su eliminación segura.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. Sobre las Herramientas: Precisión y Alcance
            </h2>
            <h3 className="text-lg font-medium mt-4 mb-2">
              Evaluación de madurez
            </h3>
            <p className="mb-4">
              El resultado del nivel de madurez depende única y exclusivamente
              de las respuestas entregadas por el usuario. La herramienta no
              verifica ni valida internamente la veracidad de los datos. Para
              mayor exactitud, puede contratar una auditoría especializada.
            </p>
            <h3 className="text-lg font-medium mt-4 mb-2">Scan</h3>
            <p className="mb-4">
              Scan identifica posibles vulnerabilidades públicas de forma
              superficial. No explota fallas, no accede a sistemas ni reemplaza
              una prueba de pentesting o ethical hacking, las cuales deben
              realizarse por consultores especializados bajo metodologías
              formales (OWASP, OSSTMM, etc.).
            </p>
            <h3 className="text-lg font-medium mt-4 mb-2">Modelos y Add-ons</h3>
            <p className="mb-6">
              Los modelos adicionales o &quot;add-ons&quot; de la plataforma
              están diseñados para complementar los diagnósticos generales (por
              ejemplo, seguridad en nube, phishing o SaaS). Cada uno de estos
              debe interpretarse de forma contextual y validarse
              profesionalmente antes de tomar decisiones técnicas o legales.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Uso Responsable
            </h2>
            <p className="mb-4">Está estrictamente prohibido:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                Usar la plataforma para evaluar sistemas o dominios sin
                consentimiento de su titular,
              </li>
              <li>
                Introducir información personal o confidencial de terceros
              </li>
              <li>
                Manipular los resultados para fines comerciales engañosos,
              </li>
              <li>
                Usar las herramientas con fines maliciosos, competitivos o
                desleales.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Protección de Datos Personales
            </h2>
            <p className="mb-4">
              Cumplimos con la Ley 1581 de 2012, el Decreto 1377 de 2013 y las
              guías de la Superintendencia de Industria y Comercio (SIC).
              Aplicamos los principios de:
            </p>
            <ul className="mb-4">
              <li>
                <strong>Finalidad:</strong> tratamos solo los datos necesarios.
              </li>
              <li>
                <strong>Seguridad:</strong> protegemos la información con
                controles técnicos y organizativos.
              </li>
              <li>
                <strong>Circulación restringida:</strong> no compartimos datos
                sin autorización previa.
              </li>
            </ul>
            <p className="mb-6">
              Para peticiones, quejas o reclamos (PQR) sobre protección de
              datos, escríbenos a: contacto@ciberseguridadsimple.com
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              7. Contraseñas y Buenas Prácticas
            </h2>
            <p className="mb-4">
              Ciberseguridad Simple no solicita, almacena ni procesa contraseñas
              o credenciales.
            </p>
            <p className="mb-4">Recomendamos:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                No usar contraseñas simples como &quot;123456&quot; o
                &quot;admin&quot;,
              </li>
              <li>Aplicar autenticación multifactor,</li>
              <li>Cambiar claves regularmente y mantenerlas seguras.</li>
            </ul>
            <p className="mb-6">
              La ciberseguridad debe ser simple, pero tus contraseñas no.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              8. Derechos de Autor y Propiedad Intelectual
            </h2>
            <p className="mb-4">
              Todo el contenido, software, marca, diseño, informes, modelos y
              documentación asociados a Ciberseguridad Simple son propiedad de
              Cloud Seguro SAS y están protegidos por las leyes de propiedad
              intelectual.
            </p>
            <p className="mb-6">
              Queda prohibido copiar, modificar, redistribuir o utilizar el
              contenido sin autorización expresa.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              9. Limitación de Responsabilidad
            </h2>
            <p className="mb-4">
              En la máxima medida permitida por la ley, Cloud Seguro SAS y sus
              aliados, proveedores y empleados no serán responsables por daños
              indirectos, incidentales, especiales, punitivos o consecuentes
              derivados del uso de la plataforma.
            </p>
            <p className="mb-4">Esto incluye, pero no se limita a:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Pérdida de datos</li>
              <li>Interrupción del negocio</li>
              <li>Decisiones técnicas erradas,</li>
              <li>Costos por servicios sustitutos.</li>
            </ul>
            <p className="mb-6">
              Estas limitaciones seguirán vigentes incluso si algún recurso
              limitado no cumple su propósito esencial. Al usar la plataforma
              entiendes que debes analizar, comprender la información
              suministrada.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              10. Modificaciones
            </h2>
            <p className="mb-6">
              Estos Términos y Condiciones pueden ser actualizados en cualquier
              momento. La versión vigente estará siempre disponible en la
              plataforma con su fecha de publicación. Te recomendamos revisarlos
              periódicamente.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">11. Contacto</h2>
            <p className="mb-6">
              Para información adicional, contratación de servicios
              especializados o temas legales: contacto@ciberseguridadsimple.com
            </p>

            <Separator className="my-8" />

            <p className="text-center text-lg font-medium">
              La ciberseguridad puede ser simple. Ese es nuestro propósito.
            </p>
          </div>
        </div>
      </main>
      <Suspense fallback={<FooterLoading />}>
        <Footer />
      </Suspense>
    </>
  );
}
