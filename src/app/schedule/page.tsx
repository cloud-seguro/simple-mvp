"use client";

import { SimpleHeader } from "@/components/ui/simple-header";

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Agenda una Consultoría
            </h1>
            <p className="text-gray-600 mb-8">
              Selecciona el horario que mejor te convenga para discutir los
              resultados de tu evaluación con nuestros especialistas.
            </p>
            {/* Add your scheduling component here */}
          </div>
        </div>
      </main>
    </div>
  );
}
