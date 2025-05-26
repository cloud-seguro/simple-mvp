"use client";

import { Suspense, lazy } from "react";
import Navbar from "@/components/views/landing-page/navbar";

// Lazy load components that are further down the page
const AboutHero = lazy(() => import("@/components/views/nosotros/about-hero"));
const AboutTeam = lazy(() => import("@/components/views/nosotros/about-team"));
const AboutMission = lazy(
  () => import("@/components/views/nosotros/about-mission")
);
const AboutValues = lazy(
  () => import("@/components/views/nosotros/about-values")
);
const Footer = lazy(() => import("@/components/views/landing-page/Footer"));

// Loading fallbacks
const SectionLoading = () => (
  <div className="w-full h-96 flex items-center justify-center bg-white">
    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function NosotrosPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense fallback={<SectionLoading />}>
        <AboutHero />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <section id="equipo" className="py-24 bg-white">
          <AboutTeam />
        </section>
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <section id="mision" className="py-24 bg-white">
          <AboutMission />
        </section>
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <section id="valores" className="py-24 bg-white">
          <AboutValues />
        </section>
      </Suspense>
      <Suspense fallback={<div className="h-48 bg-white"></div>}>
        <Footer />
      </Suspense>
    </main>
  );
}
