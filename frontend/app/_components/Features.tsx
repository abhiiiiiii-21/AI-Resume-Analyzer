import { FeatureSection } from '@/components/feature-section'
import { Status, StatusIndicator, StatusLabel } from '@/components/kibo-ui/status'
import React from 'react'

const Features = () => {
  return (
    <section className=''>
      <div className='flex items-center justify-center flex-col gap-8 mb-15 mt-25'>
        <Status status="maintenance" className="border-neutral-200 shadow-2xs font-manrope">
          <StatusIndicator />
          <StatusLabel>Features</StatusLabel>
        </Status>

        <div className="flex items-center justify-center flex-col text-center gap-2">
          <h2 className="text-3xl font-medium tracking-tight text-gray-900 font-manrope">
            Everything you need to build a resume
          </h2>

          <p className="text-gray-600 font-inter text-center max-w-2xl">
            Craft professional resumes faster and increase your chances of getting hired.
          </p>
        </div>
      </div>

      <div>
        <FeatureSection/>
      </div>
    </section>
  )
}

export default Features