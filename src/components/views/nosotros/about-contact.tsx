"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutContact() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Escríbenos directamente",
      contact: "hola@ciberseguridadsimple.com",
      action: "Enviar Email",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: Phone,
      title: "Teléfono",
      description: "Habla con nuestro equipo",
      contact: "+52 55 1234 5678",
      action: "Llamar Ahora",
      color: "from-green-500 to-green-700",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chat directo con especialistas",
      contact: "+52 55 9876 5432",
      action: "Abrir WhatsApp",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      icon: Calendar,
      title: "Videoconferencia",
      description: "Agenda una reunión virtual",
      contact: "30 minutos gratis",
      action: "Agendar Cita",
      color: "from-purple-500 to-purple-700",
    },
  ];

  const officeLocations = [
    {
      city: "Ciudad de México",
      address: "Av. Reforma 350, Piso 25\nCol. Juárez, CDMX",
      hours: "Lun - Vie: 9:00 AM - 6:00 PM",
    },
    {
      city: "Guadalajara",
      address: "Av. López Mateos 2000\nZapopan, Jalisco",
      hours: "Lun - Vie: 9:00 AM - 6:00 PM",
    },
    {
      city: "Monterrey",
      address: "Av. Constitución 1234\nSan Pedro, Nuevo León",
      hours: "Lun - Vie: 9:00 AM - 6:00 PM",
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
          ¿Listo para Conversar?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Estamos aquí para responder todas tus preguntas sobre ciberseguridad y
          ayudarte a proteger tu empresa. Elige el método de contacto que
          prefieras.
        </p>
      </motion.div>

      {/* Contact Methods Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {contactMethods.map((method, index) => (
          <motion.div
            key={method.title}
            className="group relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full text-center group-hover:shadow-xl transition-all duration-300">
              {/* Icon */}
              <motion.div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mx-auto mb-4`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <method.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2 text-black">
                {method.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{method.description}</p>
              <p className="text-black font-semibold mb-4">{method.contact}</p>

              {/* Action Button */}
              <motion.button
                className={`w-full bg-gradient-to-r ${method.color} text-white py-2 px-4 rounded-lg font-semibold text-sm hover:shadow-lg transition-all`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {method.action}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Office Locations */}
      <motion.div
        className="mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-bold text-center mb-12 text-black">
          Nuestras Oficinas
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {officeLocations.map((office, index) => (
            <motion.div
              key={office.city}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <MapPin className="w-6 h-6 text-black" />
              </motion.div>

              <h4 className="text-xl font-bold mb-3 text-black">
                {office.city}
              </h4>
              <p className="text-gray-600 text-sm mb-2 whitespace-pre-line">
                {office.address}
              </p>
              <p className="text-gray-500 text-xs">{office.hours}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-8 md:p-12 text-center text-black"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Necesitas Protección Ahora?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            No esperes hasta que sea demasiado tarde. Nuestro equipo está listo
            para evaluar tus riesgos y diseñar una solución personalizada para
            tu empresa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-all"
                onClick={() => {
                  const element = document.querySelector("#evaluacion");
                  if (element) {
                    const yOffset = -100;
                    const y =
                      element.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  } else {
                    window.location.href = "/#evaluacion";
                  }
                }}
              >
                Comenzar Evaluación Gratuita
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-white text-black border-2 border-black px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all"
                onClick={() => {
                  // Simulate scheduling a call
                  window.location.href =
                    "mailto:hola@ciberseguridadsimple.com?subject=Solicitud de Consulta";
                }}
              >
                Agendar Consulta
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-black/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { icon: Users, number: "500+", label: "Clientes Protegidos" },
            { icon: Phone, number: "24/7", label: "Soporte Disponible" },
            { icon: Calendar, number: "15min", label: "Tiempo de Respuesta" },
            {
              icon: MessageCircle,
              number: "99%",
              label: "Satisfacción Cliente",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-black" />
              <div className="text-2xl font-bold text-black">{stat.number}</div>
              <div className="text-sm text-black/80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
