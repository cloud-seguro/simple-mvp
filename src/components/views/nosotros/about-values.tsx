"use client";

import { motion } from "framer-motion";
import { Lightbulb, Users, Shield, Rocket, Eye, HandHeart } from "lucide-react";

export default function AboutValues() {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovación Constante",
      description:
        "Buscamos continuamente nuevas formas de simplificar y mejorar la ciberseguridad.",
      color: "from-yellow-400 to-yellow-500",
      iconColor: "text-black",
    },
    {
      icon: Users,
      title: "Cliente Primero",
      description:
        "Cada decisión que tomamos tiene como centro el éxito y la satisfacción de nuestros clientes.",
      color: "from-black to-gray-800",
      iconColor: "text-white",
    },
    {
      icon: Shield,
      title: "Seguridad Sin Compromiso",
      description:
        "Nunca sacrificamos la calidad de la protección por la facilidad de uso.",
      color: "from-yellow-500 to-yellow-600",
      iconColor: "text-black",
    },
    {
      icon: Eye,
      title: "Transparencia Total",
      description:
        "Comunicamos de manera clara y honesta sobre nuestros servicios, precios y procesos.",
      color: "from-gray-800 to-black",
      iconColor: "text-white",
    },
    {
      icon: Rocket,
      title: "Mejora Continua",
      description:
        "Evolucionamos constantemente para ofrecer mejores soluciones y experiencias.",
      color: "from-yellow-300 to-yellow-400",
      iconColor: "text-black",
    },
    {
      icon: HandHeart,
      title: "Impacto Positivo",
      description:
        "Trabajamos para hacer del mundo digital un lugar más seguro para todos.",
      color: "from-black to-gray-900",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
          Nuestros Valores
        </h2>
        <p className="text-xl text-black max-w-3xl mx-auto">
          Los principios fundamentales que guían cada aspecto de nuestro trabajo
          y definen quiénes somos como empresa.
        </p>
      </motion.div>

      {/* Values Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            className="group relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-yellow-200 h-full relative overflow-hidden group-hover:shadow-xl transition-all duration-300">
              {/* Background Gradient on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Icon */}
              <motion.div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 relative z-10`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <value.icon className={`w-8 h-8 ${value.iconColor}`} />
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-black relative z-10">
                {value.title}
              </h3>
              <p className="text-black leading-relaxed relative z-10">
                {value.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quote Section */}
      <motion.div
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8 md:p-12 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.blockquote
          className="text-2xl md:text-3xl font-bold text-black mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          &ldquo;Nuestros valores no son solo palabras en la pared, son la
          brújula que guía cada decisión, cada interacción y cada
          innovación.&rdquo;
        </motion.blockquote>

        <motion.div
          className="flex items-center justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-1 h-8 bg-black rounded-full" />
          <div>
            <p className="font-semibold text-black text-lg">Equipo SIMPLE</p>
            <p className="text-black/80">Ciberseguridad Simple</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black">
          ¿Compartes Nuestros Valores?
        </h3>
        <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
          Si crees en la transparencia, la innovación y en hacer de la
          ciberseguridad algo accesible para todos, somos el equipo indicado
          para proteger tu empresa.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.querySelector("#contacto");
              if (element) {
                const yOffset = -100;
                const y =
                  element.getBoundingClientRect().top +
                  window.pageYOffset +
                  yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
            }}
          >
            Trabajemos Juntos
          </motion.button>

          <motion.button
            className="bg-white text-black border-2 border-black px-8 py-4 rounded-xl font-semibold hover:bg-yellow-50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.querySelector("#equipo");
              if (element) {
                const yOffset = -100;
                const y =
                  element.getBoundingClientRect().top +
                  window.pageYOffset +
                  yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
            }}
          >
            Conocer al Equipo
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black">
          ¿Por qué creemos en la transparencia total?
        </h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          Creemos en la transparencia total. Nuestros clientes tienen derecho a
          saber exactamente cómo protegemos sus datos, qué medidas implementamos
          y por qué tomamos cada decisión de seguridad.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          La confianza se construye con hechos, no con promesas. Por eso, cada
          &ldquo;recomendación&rdquo; que hacemos está respaldada por evidencia
          sólida y mejores prácticas de la industria.
        </p>
      </motion.div>
    </div>
  );
}
