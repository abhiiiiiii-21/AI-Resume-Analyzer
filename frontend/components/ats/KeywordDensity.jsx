import React from 'react';

export default function KeywordDensity({ keywordDensity }) {
  if (!keywordDensity || Object.keys(keywordDensity).length === 0) return null;

  const entries = Object.entries(keywordDensity);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="space-y-4">
      {entries.map(([skill, count]) => {
        const pct = count === 0 ? 0 : Math.max(Math.round((count / max) * 100), 6);
        return (
          <div key={skill} className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-neutral-800 w-24 truncate capitalize font-manrope">{skill}</span>
            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div
                className="h-full rounded-full transition-all duration-700 bg-[#1C4ED6]"
                style={{
                  width: `${pct}%`,
                  opacity: count === 0 ? 0.3 : 1
                }}
              />
            </div>
            <span className="text-[10px] font-bold text-neutral-600 w-6 text-right font-manrope">
              {count}×
            </span>
          </div>
        );
      })}
    </div>
  );
}
