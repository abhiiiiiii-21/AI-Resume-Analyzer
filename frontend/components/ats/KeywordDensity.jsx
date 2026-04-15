import React from 'react';

export default function KeywordDensity({ keywordDensity }) {
  if (!keywordDensity || Object.keys(keywordDensity).length === 0) return null;

  const entries = Object.entries(keywordDensity);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="space-y-3">
      {entries.map(([skill, count]) => {
        const pct = count === 0 ? 0 : Math.max(Math.round((count / max) * 100), 6);
        const opacity = count === 0 ? 0.3 : count >= 2 ? 1 : 0.7;
        return (
          <div key={skill} className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-medium text-[#9CA3AF] w-24 truncate capitalize">{skill}</span>
            <div className="flex-1 h-1.5 bg-[#1F2937] rounded-full overflow-hidden border border-white/5 shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#3B82F6] to-[#6366F1]"
                style={{
                  width: `${pct}%`,
                  opacity: opacity
                }}
              />
            </div>
            <span className="text-[10px] font-bold font-mono w-6 text-right text-[#9CA3AF]">
              {count}×
            </span>
          </div>
        );
      })}
    </div>
  );
}
