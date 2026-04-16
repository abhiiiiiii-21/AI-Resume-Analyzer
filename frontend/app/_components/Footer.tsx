import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { VideoText } from '@/components/ui/video-text'


const Footer = () => {
  return (
    <section className="relative font-inter -mt-20">
      {/* <div className='flex items-center justify-center pt-10'>
       <Image src="/CTA/blue.svg" className="h-full w-full" width="1179" height="284" alt='logo' />
      </div> */}

       <div className="relative h-[500px] w-full overflow-hidden">
        <VideoText src="/CTA/blue.mp4" maskSrc="/Logo/Black.png"/>
       </div>
    </section>
  )
}

export default Footer