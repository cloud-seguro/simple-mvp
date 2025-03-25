"use client";

import Navbar from "@/components/views/landing-page/navbar";
import Footer from "@/components/views/landing-page/Footer";

export default function BlogLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-36 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
            <p className="text-lg text-gray-600 mb-12 text-center">
              Artículos sobre ciberseguridad, privacidad y protección de datos
            </p>

            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b pb-8 animate-pulse">
                  <div className="w-full h-64 mb-4 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
