
"use client";

import ButtonCTA from '@/components/Buttons/buttonCTA'
import Image from 'next/image'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const CTA = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={containerRef} className="relative -mt-20 h-[860px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[20%] w-full h-[140%]">
        <Image
          src="/CTA/3.jpg"
          alt="CTA image"
          width={1920}
          height={1200}
          className="w-full h-full object-cover"
          priority
        />
      </motion.div>


      <div className='relative z-10 h-full flex flex-col items-start justify-center gap-8 pl-16'>

        <p className='text-white text-5xl font-bold font-manrope max-w-4xl tracking-tight leading-tight'>
          Upgrade Your Resume. <br /> Unlock More Opportunities.
        </p>

        <ButtonCTA />
      </div>
    </section>
  )
}

export default CTA