"use client";

import Link from "next/link";
import Navbar from "@/components/views/landing-page/navbar";
import Footer from "@/components/views/landing-page/Footer";
import { useEffect } from "react";

export default function NotFound() {
  // Set the document title
  useEffect(() => {
    document.title = "404 - Artículo no encontrado | SIMPLE";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-36 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              404 - Artículo no encontrado
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Lo sentimos, el artículo que estás buscando no existe o ha sido
              eliminado.
            </p>
            <Link
              href="/blog"
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors"
              legacyBehavior={false}
            >
              Volver al blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
