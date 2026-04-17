import { ArrowUpRight } from 'lucide-react'
import React from 'react'
import { Button } from './button'

const ButtonCTA = () => {
    return (
        <Button className="font-manrope relative bg-white hover:bg-white text-[#0257A6] text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer">
            <span className="relative z-10 transition-all duration-500">
                Get Started
            </span>
            <div className="absolute right-1 w-10 h-10 bg-[#0257A6] text-[#0257A6] rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                <ArrowUpRight size={16} className="text-white" />
            </div>
        </Button>
    )
}

export default ButtonCTA