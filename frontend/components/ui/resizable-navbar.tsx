"use client";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import Image from "next/image";

import React, { useRef, useState } from "react";


interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
    children?: {
      title: string;
      href: string;
      icon: React.ReactNode;
      description: string;
    }[];
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <div
      className={cn("fixed inset-x-0 top-6 z-[60] w-full px-4 lg:px-8", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
            child as React.ReactElement<{ visible?: boolean }>,
            { visible },
          )
          : child,
      )}
    </div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <div
      className={cn(
        "relative mx-auto hidden w-full max-w-[1100px] flex-row items-center justify-between gap-6 self-start rounded-full bg-[rgba(20,20,20,0.75)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] px-4 py-2 lg:flex shadow-2xl transition-all duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "hidden flex-1 flex-row items-center justify-center space-x-1 text-[14px] font-medium text-white/80 lg:flex lg:space-x-4",
        className,
      )}
    >
      {items.map((item, idx) => (
        <div
          onMouseEnter={() => setHovered(idx)}
          className="relative flex items-center justify-center"
          key={`link-${idx}`}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-[rgba(255,255,255,0.08)]"
            />
          )}
          <a
            href={item.link}
            onClick={onItemClick}
            className="relative px-3 py-2 z-20 whitespace-nowrap text-white/80 transition-all duration-200 hover:text-white hover:opacity-100"
          >
            {item.name}
          </a>

          <AnimatePresence>
            {item.children && hovered === idx && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full pt-4 z-50 left-1/2 -translate-x-1/2"
              >
                <div className="bg-white rounded-[20px] border border-[rgba(0,0,0,0.08)] p-3 w-[320px] shadow-2xl backdrop-blur-[12px]">
                  <ul className="grid w-full gap-1">
                    {item.children.map((childItem, childIdx) => (
                      <li key={childIdx} className="group list-none">
                        <a
                          href={childItem.href}
                          className="flex gap-4 items-start rounded-xl p-3 hover:bg-black/5 transition-colors"
                        >
                          <div className="border border-neutral-200 rounded-lg p-2.5 flex items-center justify-center bg-neutral-100 text-neutral-700">
                            {childItem.icon}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium leading-none text-neutral-900">
                              {childItem.title}
                            </div>
                            <p className="text-neutral-500 line-clamp-2 pt-1.5 text-xs leading-snug">
                              {childItem.description}
                            </p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-white/80 dark:bg-neutral-950/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:bg-neutral-950",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <X className="text-black dark:text-white" onClick={onClick} />
  ) : (
    <Menu className="text-black dark:text-white" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <div className="flex flex-1 justify-start">
      <a
        href="#"
        className="relative z-20 flex items-center space-x-2 px-2 py-1"
      >
        <span className="font-bold text-white text-lg tracking-tight">resumind</span>
        {/* <Image src="/Logo/full.png" className="w-[130px] h-auto object-contain" alt="Logo" width={200} height={60} /> */}
      </a>
    </div>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
    | React.ComponentPropsWithoutRef<"a">
    | React.ComponentPropsWithoutRef<"button">
  )) => {
  const baseStyles =
    "px-4 py-2 rounded-xl text-[14px] font-medium relative inline-flex items-center justify-center cursor-pointer transition-all duration-200 inline-block text-center whitespace-nowrap border border-transparent";

  const variantStyles = {
    primary:
      "bg-blue-600/90 text-white hover:scale-[1.02] hover:brightness-105",
    secondary: "bg-transparent shadow-none text-white/80 hover:text-white hover:bg-[rgba(255,255,255,0.05)]",
    dark: "bg-black text-white hover:scale-[1.02]",
    gradient:
      "bg-gradient-to-b from-blue-500/90 to-blue-600/90 text-white hover:scale-[1.02] hover:brightness-105",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
