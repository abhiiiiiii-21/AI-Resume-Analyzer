"use client";
import React from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ChevronRight } from "lucide-react";

export default function HoverBorderGradientDemo() {
  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full cursor-pointer"
        as="div"
        className="bg-[#EFF4FF] dark:bg-neutral-900 text-[#1C4ED6] dark:text-blue-400 flex items-center gap-2 pl-1 pr-3 py-1 text-xs font-medium cursor-pointer"
      >
        <span className="bg-[#1C4ED6] text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
          New
        </span>
        <span className="flex items-center">
          See Latest Templates <ChevronRight className="h-3 w-3 ml-0.5" />
        </span>
      </HoverBorderGradient>
    </div>
  );
}

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-black dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};
