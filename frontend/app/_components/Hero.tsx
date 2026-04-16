"use client"
import HoverBorderGradientDemo from '@/components/hover-border-gradient-demo'
import ShinyText from '@/components/ShinyText'
import ButtonWithIconDemo from '@/components/Buttons/button-witn-icon'
import { Button } from '@/components/Buttons/button'
import React from 'react'
import Image from 'next/image'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { LogoCloud } from '@/components/logo-cloud'

const Hero = () => {
  return (
    <div className="min-h-screen w-full relative pb-30">

      {/* Base background color */}
      <div className="absolute inset-0 z-0 bg-white" />

      {/* Dotted pattern with linear fade-out mask */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.15) 1px, transparent 0)",
          backgroundSize: "20px 20px",
          maskImage: "linear-gradient(to bottom, black 10%, transparent 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <ContainerScroll
          titleComponent={
            <div className='flex flex-col items-center justify-center w-full px-4 gap-8 mb-8 md:mb-24'>
              <div className="">
                <HoverBorderGradientDemo />
              </div>

              <div className='flex flex-col items-center justify-center text-center gap-6'>
                <h1 className='text-5xl md:text-6xl font-semibold max-w-2xl tracking-tight text-neutral-900 font-manrope'>
                  Build Smarter Resumes. Get Hired Faster{" "}
                  <span>
                    <ShinyText
                      text=" with AI"
                      speed={2}
                      delay={0}
                      color="#1C4ED6"
                      shineColor="#ffffff"
                      spread={120}
                      direction="left"
                      yoyo={false}
                      pauseOnHover={false}
                      disabled={false}
                    />
                  </span>
                </h1>
                <p className='text-sm md:text-lg max-w-2xl text-neutral-600 font-light'>
                  Create, optimize, and analyze your resume with AI-powered tools from ATS scoring to role-based enhancements, all in one place.
                </p>
              </div>

              <div className='flex flex-row justify-center gap-4 w-full px-4'>
                <Button variant="outline" className="cursor-pointer rounded-full h-12 px-8 font-manrope font-medium border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300">
                  Learn More
                </Button>
                <ButtonWithIconDemo />
              </div>
            </div>
          }
        >
          <Image
            src={`/Hero/Dashboard.png`}
            alt="hero dashboard screenshot"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top border border-neutral-200 dark:border-white/10"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      <section className="relative z-10 w-full flex flex-col items-center justify-center -mt-15">
        <h2 className="mb-3 text-center font-light text-neutral-500 text-base tracking-tight md:text-base font-manrope">
          <span className="font-semibold">Helping users land roles at top companies</span>
        </h2>

        <LogoCloud />
      </section>

    </div>
  )
}

export default Hero