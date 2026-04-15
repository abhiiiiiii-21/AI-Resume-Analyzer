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

  const r = 72;
  const stroke = 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;
  const trackOpacity = 1;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative">
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
          <circle
            cx="90" cy="90" r={r} fill="none"
            stroke="url(#sg)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            filter="url(#glow)"
            style={{ opacity: trackOpacity, transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black tracking-tight text-[#F9FAFB] drop-shadow-md">
            {animated}<span className="text-xl font-light text-[#9CA3AF]">%</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1 text-[#9CA3AF]">ATS Match Score</span>
        </div>
      </div>
    </div>
  );
}
