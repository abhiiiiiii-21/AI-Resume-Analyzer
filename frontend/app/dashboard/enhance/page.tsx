"use client";

import React from 'react'
import FileUpload from './_components/FileUpload'
import InputText from './_components/InputText'
import { SparklesIcon } from 'lucide-react'

const Page = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
            <span className="size-1.5 rounded-full inline-block" style={{ background: '#1C4ED6', opacity: 0.4 }} />
            AI Resume Enhancer
            <span className="size-1.5 rounded-full inline-block" style={{ background: '#1C4ED6', opacity: 0.4 }} />
          </div>
          <h1 className="text-[28px] font-medium tracking-tight text-foreground leading-snug mb-3">
            Tailor your resume for any{' '}
            <span style={{ color: '#1C4ED6' }}>role</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Upload your resume and paste the job description. The AI will align your experience to the role and generate an optimized PDF.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">

          {/* Card Header */}
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {[
                { n: '1', label: 'Resume' },
                { n: '2', label: 'Job details' },
                { n: '3', label: 'Enhance' },
              ].map((step, i) => (
                <React.Fragment key={step.n}>
                  {i > 0 && <span className="text-border">→</span>}
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-5 rounded-full border flex items-center justify-center text-[11px] font-medium"
                      style={{ borderColor: '#1C4ED6', color: '#1C4ED6' }}
                    >
                      {step.n}
                    </span>
                    {step.label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Two Column Body */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 md:border-r border-b md:border-b-0 border-border/60">
              <p className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: '#1C4ED6' }}>
                Your resume
              </p>
              <FileUpload />
            </div>
            <div className="p-6">
              <p className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: '#1C4ED6' }}>
                Job description
              </p>
              <InputText />
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
                <circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5.5v.5"/>
              </svg>
              Files are processed securely and not stored.
            </p>

            {/* Enhance Button with slide animation */}
            <button
              className="group inline-flex items-center gap-2 px-3 h-8 rounded-md text-[13px] font-medium text-white cursor-pointer border-none transition-transform hover:scale-[1.02]"
              style={{ background: '#1C4ED6' }}
            >
              {/* Sliding text */}
              <div className="relative overflow-hidden leading-tight">
                <span
                  className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full after:content-[attr(data-text)] after:absolute after:left-0 after:top-full after:whitespace-nowrap"
                  data-text="Enhance resume"
                >
                  Enhance resume
                </span>
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Page