"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

const steps = [
  {
    num: "1",
    title: "Test your whole body",
    desc: "Get a comprehensive blood draw at one of our 2,000+ partner labs or from the comfort of your own home.",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=800&auto=format&fit=crop"
  },
  {
    num: "2",
    title: "An actionable plan",
    desc: "Easy to understand results and a clear health plan with tailored recommendations on diet, lifestyle changes & supplements.",
    image: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=800&auto=format&fit=crop"
  },
  {
    num: "3",
    title: "A connected ecosystem",
    desc: "You can book additional diagnostics, buy curated supplements with members-only discounts in your Superpower dashboard.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white text-black font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-16 md:mb-24 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          How it works
        </motion.h2>
        
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-12">
          {steps.map((step, index) => (
            <motion.div 
              key={step.num} 
              className="flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden mb-6">
                <img src={step.image} alt={step.title} className="object-cover w-full h-full" />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-[#ff5a36] text-white flex items-center justify-center text-xs font-semibold mr-4">
                  {step.num}
                </div>
              </div>
              <h3 className="text-2xl font-medium mb-3 text-gray-900 tracking-tight">{step.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col w-full">
          {/* Images Row */}
          <div className="grid grid-cols-3 gap-8 lg:gap-12">
             {steps.map((step, index) => (
               <motion.div 
                 key={`img-${step.num}`} 
                 className="w-full relative"
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: false, margin: "-50px" }}
                 transition={{ duration: 0.6, delay: index * 0.15 }}
               >
                 <div className="aspect-[4/3] rounded-[2rem] overflow-hidden">
                    <img src={step.image} alt={step.title} className="object-cover w-full h-full" />
                 </div>
               </motion.div>
             ))}
          </div>
          
          {/* Timeline Nodes Row */}
          <div className="relative w-full my-10 flex items-center">
             <motion.div 
               className="absolute left-0 right-0 h-[1.5px] bg-[#ff5a36] z-0 origin-left" 
               initial={{ scaleX: 0 }}
               whileInView={{ scaleX: 1 }}
               viewport={{ once: false, margin: "-50px" }}
               transition={{ duration: 1, ease: "easeOut" }}
             />
             <div className="grid grid-cols-3 gap-8 lg:gap-12 w-full relative z-10">
                {steps.map((step, index) => (
                   <div key={`node-${step.num}`} className="flex justify-start">
                      <motion.div 
                        className="w-7 h-7 bg-[#ff5a36] text-white flex items-center justify-center text-sm font-semibold shadow-sm"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                      >
                        {step.num}
                      </motion.div>
                   </div>
                ))}
             </div>
          </div>

          {/* Texts Row */}
          <div className="grid grid-cols-3 gap-8 lg:gap-12">
             {steps.map((step, index) => (
               <motion.div 
                 key={`text-${step.num}`} 
                 className="pr-4 lg:pr-8"
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: false, margin: "-50px" }}
                 transition={{ duration: 0.6, delay: index * 0.15 + 0.1 }}
               >
                 <h3 className="text-2xl lg:text-3xl font-medium mb-4 text-gray-900 tracking-tight">{step.title}</h3>
                 <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                   {step.desc}
                 </p>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;