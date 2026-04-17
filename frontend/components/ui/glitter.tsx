"use client";

import React, { useEffect, useRef } from "react";

export const Glitter = ({
  color = "#ffffff",
  size = 1.5,
  density = 0.05,
}: {
  color?: string;
  size?: number;
  density?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    
    // Create an array to hold all our glitter particles
    const particles: { x: number; y: number; alpha: number; speed: number; seed: number }[] = [];

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      
      // Handle high-dpi displays for crispness
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      initParticles();
    };

    const initParticles = () => {
      particles.length = 0; // Clear existing
      
      // Calculate how many particles we need based on density config and area
      const area = width * height;
      const count = Math.floor(area * density * 0.01); // Magic number for nice distribution
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          alpha: Math.random(),
          speed: (Math.random() * 0.01) + 0.005,
          seed: Math.random(),
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // We parse the hex color to extract RGB so we can inject alpha
      // Defaulting to white if parsing fails
      let r = 255, g = 255, b = 255;
      if (color.startsWith('#') && color.length === 7) {
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
      }
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move particle upwards
        p.y -= (0.05 + p.seed * 0.15); // Speed based on seed, between 0.05 and 0.2 pixels per frame
        
        // Loop back to bottom if it goes off top
        if (p.y < -size) {
          p.y = height + size + Math.random() * 20;
          p.x = Math.random() * width;
        }

        // Twinkle logic
        p.alpha += p.speed;
        if (p.alpha > 1) {
          p.speed *= -1;
          p.alpha = 1;
        } else if (p.alpha <= 0) {
          p.speed *= -1;
          p.alpha = 0;
        }

        // Add a slight flicker
        const flicker = p.alpha * (0.5 + Math.sin(Date.now() * 0.005 + p.seed * 100) * 0.5);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${flicker})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    resize();
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, size, density]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};
