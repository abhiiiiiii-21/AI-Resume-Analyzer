import React, { useEffect, useState } from 'react';

const ScoreCard = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const incrementTime = 20;
    const totalSteps = Math.ceil(duration / incrementTime);
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);

  // Premium vivid colors for light mode
  const getGradient = (s) => {
    if (s >= 80) return { stop1: '#10B981', stop2: '#059669', text: 'text-emerald-500' };
    if (s >= 50) return { stop1: '#F43F5E', stop2: '#E11D48', text: 'text-rose-500' };
    return { stop1: '#ef4444', stop2: '#dc2626', text: 'text-red-500' };
  };

  const colors = getGradient(score);
  const radius = 75;
  const stroke = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full relative overflow-hidden group">
      
      {/* Background soft shadow mapping to the score color */}
      <div 
        className="absolute inset-x-0 bottom-0 top-1/2 opacity-5 pointer-events-none transition-colors duration-1000 ease-out" 
        style={{ background: `radial-gradient(ellipse at bottom, ${colors.stop1} 0%, transparent 70%)` }}
      />

      <h3 className="text-xl font-bold mb-8 text-slate-800 relative z-10">Match Probability</h3>
      
      <div className="relative flex items-center justify-center mb-6">
        
        <svg className="w-52 h-52 transform -rotate-90 relative z-10 transition-transform hover:scale-105 duration-500">
          <defs>
            <linearGradient id="scoreGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.stop1} />
              <stop offset="100%" stopColor={colors.stop2} />
            </linearGradient>
            
            <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={colors.stop1} floodOpacity="0.3" />
            </filter>
          </defs>
          
          {/* Track background */}
          <circle
            className="text-slate-100 stroke-current"
            strokeWidth={stroke}
            cx="104"
            cy="104"
            r={radius}
            fill="transparent"
          />
          
          {/* Animated score path line */}
          <circle
            stroke="url(#scoreGradientLight)"
            className="transition-all ease-out"
            style={{ transitionDuration: '1.5s', transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}
            strokeWidth={stroke}
            strokeLinecap="round"
            cx="104"
            cy="104"
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter="url(#shadowFilter)"
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <span className={`text-6xl font-black ${colors.text} tracking-tighter`}>
            {animatedScore}<span className="text-3xl text-slate-300 font-bold ml-1">%</span>
          </span>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 font-semibold text-center mt-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
        {score >= 80 ? "Highly Matched Profile" : score >= 50 ? "Moderate Alignment" : "Needs Significant Optimization"}
      </p>
    </div>
  );
};

export default ScoreCard;
