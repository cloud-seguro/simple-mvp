"use client";

import Navbar from "@/components/views/landing-page/navbar";
import Footer from "@/components/views/landing-page/Footer";

export default function BlogPostLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-36 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <article className="max-w-3xl mx-auto">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-8"></div>

            <header className="mb-8 animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="w-full h-[400px] mb-8 bg-gray-200 rounded-lg"></div>
            </header>

            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mt-8"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mt-8"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
