"use client";

import Hero from "./_components/Hero";
import NavbarDemo from "@/components/resizable-navbar-demo";
import HowItWorks from "./_components/HowItWorks";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-neutral-100 font-inter">

      <main className="relative z-10 bg-neutral-100 rounded-b-[40px] overflow-hidden ">
        <NavbarDemo />
        <Hero />
      </main>


      <main className="relative z-0 -mt-10 pt-20 font-inter">
        <HowItWorks />
      </main>

    </div>
  );
}