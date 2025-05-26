"use client";

import { Suspense, lazy } from "react";
import Navbar from "@/components/views/landing-page/navbar";
import Hero from "@/components/views/landing-page/Hero";

// Lazy load components that are further down the page
const EvaluationOptions = lazy(
  () => import("@/components/views/landing-page/evaluation-options")
);
const ModulesSection = lazy(
  () => import("@/components/views/landing-page/modules-section")
);
const DashboardSection = lazy(
  () => import("@/components/views/landing-page/dashboard-section")
);
const Benefits = lazy(() => import("@/components/views/landing-page/benefits"));
const MissionRocket = lazy(
  () => import("@/components/views/landing-page/mission-rocket")
);
const Testimonial = lazy(
  () => import("@/components/views/landing-page/Testimonials")
);
const SimplifiedPricing = lazy(
  () => import("@/components/views/landing-page/simplified-pricing")
);
const Footer = lazy(() => import("@/components/views/landing-page/Footer"));

// Loading fallbacks
const SectionLoading = () => (
  <div className="w-full h-96 flex items-center justify-center bg-gray-50">
    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Suspense fallback={<SectionLoading />}>
        <section id="modulos" className="py-24 bg-white">
          <ModulesSection />
        </section>
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <section id="evaluacion" className="py-24">
          <EvaluationOptions />
        </section>
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <section id="beneficios" className="py-24 bg-white">
          <Benefits />
        </section>
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <section id="dashboard" className="py-24 bg-gray-50">
          <DashboardSection />
        </section>
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <section id="mision" className="py-24 bg-gray-50">
          <MissionRocket />
        </section>
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <section id="testimonios" className="py-24">
          <Testimonial />
        </section>
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <section id="precios" className="py-24 bg-gray-50">
          <SimplifiedPricing />
        </section>
      </Suspense>
      <Suspense fallback={<div className="h-48 bg-gray-100"></div>}>
        <Footer />
      </Suspense>
    </main>
  );
}
