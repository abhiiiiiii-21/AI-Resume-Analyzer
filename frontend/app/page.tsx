
import Hero from "./_components/Hero";
import NavbarDemo from "@/components/resizable-navbar-demo";
import HowItWorks from "./_components/HowItWorks";

export default function Home() {
  return (
    <div className="font-inter">
      <NavbarDemo/>
      <Hero/>
      <HowItWorks/>
    </div>
  );
}