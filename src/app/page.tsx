import Head from "next/head";
import Header from "@/components/views/landing-page/Header";
import Hero from "@/components/views/landing-page/Hero";
import SocialProof from "@/components/views/landing-page/SocialProof";
import Features from "@/components/views/landing-page/Features";
import About from "@/components/views/landing-page/About";
import Testimonials from "@/components/views/landing-page/Testimonials";
import CTA from "@/components/views/landing-page/CTA";
import Footer from "@/components/views/landing-page/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Head>
        <title>POSITIVE-Next: Your Mind&apos;s Best Friend</title>
        <meta
          name="description"
          content="POSITIVE-Next helps you turn your mind into your best friend and overcome mental saboteurs."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow">
        <Hero />
        <SocialProof />
        <Features />
        <About />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
