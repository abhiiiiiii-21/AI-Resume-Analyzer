"use client"

import React, { ElementType, ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface VideoTextProps {
  src: string
  maskSrc?: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  preload?: "auto" | "metadata" | "none"
  children?: ReactNode // ✅ FIXED (optional now)
  fontSize?: string | number
  fontWeight?: string | number
  textAnchor?: string
  dominantBaseline?: string
  fontFamily?: string
  as?: ElementType
}

export function VideoText({
  src,
  maskSrc,
  children,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  fontSize = 20,
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
  as: Component = "div",
}: VideoTextProps) {
  const [svgMask, setSvgMask] = useState("")

  // ✅ SAFE content handling
  const content = children
    ? React.Children.toArray(children).join("")
    : ""

  useEffect(() => {
    // Skip SVG generation if using image mask
    if (maskSrc) return

    const updateSvgMask = () => {
      if (!content) return // ✅ avoid empty mask

      const responsiveFontSize =
        typeof fontSize === "number" ? `${fontSize}vw` : fontSize

      const newSvgMask = `
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
          <text 
            x='50%' 
            y='50%' 
            font-size='${responsiveFontSize}' 
            font-weight='${fontWeight}' 
            text-anchor='${textAnchor}' 
            dominant-baseline='${dominantBaseline}' 
            font-family='${fontFamily}'
            fill='white'
          >
            ${content}
          </text>
        </svg>
      `
      setSvgMask(newSvgMask)
    }

    updateSvgMask()
    window.addEventListener("resize", updateSvgMask)
    return () => window.removeEventListener("resize", updateSvgMask)
  }, [
    content,
    fontSize,
    fontWeight,
    textAnchor,
    dominantBaseline,
    fontFamily,
    maskSrc,
  ])

  // ✅ Decide mask source safely
  const mask =
    maskSrc || svgMask
      ? maskSrc
        ? `url(${maskSrc})`
        : `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`
      : "none"

  return (
    <Component className={cn("relative size-full", className)}>
      {/* Mask Container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      >
        <video
          className="h-full w-full object-cover"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          playsInline
        >
          <source src={src} />
        </video>
      </div>

      {/* Accessibility */}
      {content && <span className="sr-only">{content}</span>}
    </Component>
  )
}