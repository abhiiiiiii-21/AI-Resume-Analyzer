"use client";

import Hero from "./_components/Hero";
import NavbarDemo from "@/components/resizable-navbar-demo";
import HowItWorks from "./_components/HowItWorks";
import { FAQs } from "./_components/FAQs";
import Features from "./_components/Features";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen font-inter">

      <main className="relative z-20 bg-neutral-100 rounded-b-[60px] overflow-hidden">
        <NavbarDemo />
        <Hero />
      </main>


      <main className="relative z-10 bg-neutral-100 rounded-b-[60px] overflow-hidden mt-[-50px] pt-10">
        <Features />
        <HowItWorks />
        <FAQs />
      </main>

      <main>
        <CTA />
      </main>

      <footer className="relative z-10 bg-neutral-100 rounded-t-[60px]">
        <Footer />
      </footer>
    </div>
  );
}