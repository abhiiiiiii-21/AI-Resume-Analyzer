import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { VideoText } from '@/components/ui/video-text'
import { Link001, Link002 } from '@/components/ui/skiper-ui/skiper40'

const Footer = () => {
  return (
    <section className="relative font-inter -mt-20 z-10">
      <div className="w-full bg-white rounded-t-[3rem] flex flex-col shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">

        {/* Video Mask Header */}
        <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] w-full">
          <VideoText src="/Footer/blue.mp4" maskSrc="/Logo/Black.png" />
        </div>


        <div className="w-full max-w-8xl mx-auto px-8 md:px-16 lg:px-8 pb-10 text-gray-800 flex flex-col gap-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 text-sm font-inter">


            <div className="flex flex-col">
              <h3 className="text-gray-900 font-manrope font-semibold mb-6">Platform</h3>
              <div className="flex flex-col gap-4">
                <Link001 href="/">Home</Link001>
                <Link001 href="/how-it-works">How it works</Link001>
                <Link001 href="/features">Features</Link001>
              </div>
            </div>


            <div className="flex flex-col">
              <h3 className="text-gray-900 font-manrope font-semibold mb-6">Tools</h3>
              <div className="flex flex-col gap-4">
                <Link001 href="/ai-enhancer">AI Enhancer</Link001>
                <Link001 href="/ats">ATS Checker</Link001>
                <Link001 href="/templates">Templates</Link001>
                <Link001 href="/examples">Examples</Link001>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-900 font-manrope font-semibold mb-6">Company</h3>
              <div className="flex flex-col gap-4">
                <Link001 href="/about">About Us</Link001>
                <Link001 href="/careers">Careers</Link001>
                <Link001 href="/contact">Contact</Link001>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-900 font-manrope font-semibold mb-6">Legal</h3>
              <div className="flex flex-col gap-4">
                <Link001 href="/privacy">Privacy Policy</Link001>
                <Link001 href="/terms">Terms of Service</Link001>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 text-xs font-inter text-gray-500">
            <p>© {new Date().getFullYear()} Resumind. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-6 md:mt-0">
              <Link002 href="/privacy">LinkedIn</Link002>
              <Link002 href="/privacy">Instagram</Link002>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Footer