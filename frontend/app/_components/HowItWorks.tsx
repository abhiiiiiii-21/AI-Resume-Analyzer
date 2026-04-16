"use client";

import React from "react";
import { motion } from "motion/react";
import { Status, StatusIndicator, StatusLabel } from "@/components/kibo-ui/status";

const steps = [
  {
    num: "1",
    title: "Upload your resume",
    desc: "Sign in and upload your existing resume or paste your details. Talvix securely prepares your data for enhancement.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop"
  },
  {
    num: "2",
    title: "Enhance with AI",
    desc: "Our AI analyzes your resume and improves content, structure, and keywords to match industry standards.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop"
  },
  {
    num: "3",
    title: "Download & apply",
    desc: "Get a polished, ATS-friendly resume ready to download and use for job applications instantly.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop"
  }
];

const HowItWorks = () => {
  return (
    <main className="py-24 text-black overflow-hidden">
      <div className="flex items-center justify-center flex-col gap-8 mb-15">
        <Status status="maintenance" className="border-neutral-200 shadow-2xs font-manrope">
          <StatusIndicator />
          <StatusLabel>How It Works</StatusLabel>
        </Status>

        <div className="flex items-center justify-center flex-col text-center gap-2">
          <h2 className="text-3xl font-medium tracking-tight text-gray-900 font-manrope">
            Build a job-winning resume in minutes
          </h2>

          <p className="text-gray-600 font-inter text-center max-w-2xl">
            Our AI guides you step-by-step to create a professional resume tailored to your goals.
          </p>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden mb-6">
                <img src={step.image} alt={step.title} className="object-cover w-full h-full" />
              </div>

              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-[#1C4ED6] text-white flex items-center justify-center text-xs font-semibold mr-4">
                  {step.num}
                </div>
              </div>

              <h3 className="text-xl font-medium mb-3 text-gray-900">
                {step.title}
              </h3>

              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col w-full">

          {/* Images */}
          <div className="grid grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden">
                  <img src={step.image} alt={step.title} className="object-cover w-full h-full" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative w-full my-10 flex items-center">
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-[#1C4ED6] z-0 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1 }}
            />

            <div className="grid grid-cols-3 gap-8 lg:gap-12 w-full relative z-10">
              {steps.map((step, index) => (
                <div key={step.num} className="flex justify-start">
                  <motion.div
                    className="w-8 h-8 bg-[#1C4ED6] text-white flex items-center justify-center text-sm font-semibold rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.2 }}
                  >
                    {step.num}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="grid grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <h3 className="text-xl lg:text-2xl font-medium mb-4 text-gray-900">
                  {step.title}
                </h3>

                <p className="text-gray-600 lg:text-base">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
};

export default HowItWorks;