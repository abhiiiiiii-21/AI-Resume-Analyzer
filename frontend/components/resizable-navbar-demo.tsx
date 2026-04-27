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
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";



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
          href: "/resume-builder",
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
    <div className="relative w-full font-manrope">
      <Navbar>
        {/* Desktop Navigation */}
        
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex flex-1 items-center justify-end gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <NavbarButton variant="secondary" className="rounded-full px-6">Login</NavbarButton>
              </SignInButton>
              <SignUpButton mode="modal">
                <NavbarButton variant="primary" className="rounded-full px-6">Get Started</NavbarButton>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
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
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                </SignInButton>
                <SignUpButton mode="modal">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Get Started
                  </NavbarButton>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <div className="flex justify-center p-2 border border-neutral-200 rounded-xl">
                   <UserButton showName />
                </div>
              </Show>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
