import React, { useEffect, useState } from 'react';

export default function CircularScore({ score }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = score / 60;
    const t = setInterval(() => {
      current += step;
      if (current >= score) { setAnimated(score); clearInterval(t); }
      else setAnimated(Math.floor(current));
    }, 16);
    return () => clearInterval(t);
  }, [score]);

  const r = 70;
  const stroke = 12;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative">
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }} className="drop-shadow-sm">
          <defs>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1C4ED6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle 
            cx="90" cy="90" r={r} 
            fill="none" 
            stroke="#F1F5F9" 
            strokeWidth={stroke} 
          />
          {/* Progress circle */}
          <circle
            cx="90" cy="90" r={r} fill="none"
            stroke="url(#sg)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-0.5">
            <span className="text-5xl font-bold tracking-tight text-neutral-900 font-manrope">
              {animated}
            </span>
            <span className="text-xl font-bold text-neutral-500 font-manrope">%</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1 text-neutral-600 font-manrope">ATS Score</span>
        </div>
      </div>
    </div>
  );
}
