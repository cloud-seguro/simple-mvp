"use client";

import Navbar from "@/components/views/landing-page/navbar";
import Hero from "@/components/views/landing-page/Hero";
import EvaluationOptions from "@/components/views/landing-page/evaluation-options";
import Testimonial from "@/components/views/landing-page/Testimonials";
import DiscoverSection from "@/components/views/landing-page/discover-section";
import Footer from "@/components/views/landing-page/Footer";
import Benefits from "@/components/views/landing-page/benefits";
import SimplifiedPricing from "@/components/views/landing-page/simplified-pricing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <section id="evaluacion" className="py-24">
        <EvaluationOptions />
      </section>
      <section id="beneficios" className="py-24 bg-white">
        <Benefits />
      </section>
      <section id="testimonios" className="py-24">
        <Testimonial />
      </section>
      <section id="precios" className="py-24 bg-gray-50">
        <SimplifiedPricing />
      </section>
      <section id="descubre">
        <DiscoverSection />
      </section>
      <Footer />
    </main>
  );
}
