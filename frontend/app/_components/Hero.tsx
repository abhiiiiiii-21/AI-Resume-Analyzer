"use client"
import HoverBorderGradientDemo from '@/components/hover-border-gradient-demo'
import ShinyText from '@/components/ShinyText'
import ButtonWithIconDemo from '@/components/ui/button-witn-icon'
import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'

const Hero = () => {
  return (
    <div className="min-h-screen w-full relative">

      {/* <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      /> */}

      <div className='absolute inset-0 z-10 flex flex-col items-center justify-center w-full px-4 gap-8'>
        <div className="">
          <HoverBorderGradientDemo/>
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


      {/* <div className='absolute inset-0 z-0'>
        <Image src="/Hero/Blue.png" alt="Hero" width={100} height={100} className='w-full h-full object-cover' />
      </div> */}

    </div>
  )
}

export default Hero