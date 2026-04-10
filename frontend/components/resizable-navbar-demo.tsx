"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { Sparkles, PenTool, ScanText, BookText } from "lucide-react";

export default function NavbarDemo() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "How it works",
      link: "#features",
    },
    {
      name: "Tools",
      link: "#pricing",
      children: [
        {
          title: "AI Resume Builder",
          href: "/ai-builder",
          icon: <Sparkles strokeWidth={2} className="w-4 h-4" />,
          description: "Build a resume from scratch using AI",
        },
        {
          title: "Resume Enhancer",
          href: "/enhancer",
          icon: <PenTool strokeWidth={2} className="w-4 h-4" />,
          description: "Enhance your resume based on job roles",
        },
        {
          title: "ATS Score Checker",
          href: "/ats-checker",
          icon: <ScanText strokeWidth={2} className="w-4 h-4" />,
          description: "Check ATS score and improve visibility",
        },
        {
          title: "Manual Resume Builder",
          href: "/manual-builder",
          icon: <BookText strokeWidth={2} className="w-4 h-4" />,
          description: "Create resumes manually with full control",
        },
      ],
    },
    {
      name: "Templates",
      link: "#contact",
    },
    {
      name: "Examples",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Get Started</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Get Started
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
