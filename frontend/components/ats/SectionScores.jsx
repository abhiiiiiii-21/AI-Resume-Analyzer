import React from 'react';

const sections = [
  { key: 'skills',     label: 'Skills'     },
  { key: 'experience', label: 'Experience' },
  { key: 'education',  label: 'Education'  },
  { key: 'projects',   label: 'Projects'   },
];

export default function SectionScores({ scores }) {
  return (
    <div className="space-y-5">
      {sections.map(({ key, label }) => {
        const val = scores?.[key] ?? 0;
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider font-manrope">{label}</span>
              <span className="text-xs font-bold text-neutral-900 font-manrope">{val}%</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out bg-[#1C4ED6]"
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
