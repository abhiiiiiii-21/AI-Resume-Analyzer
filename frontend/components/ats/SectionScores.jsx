import React from 'react';

const sections = [
  { key: 'skills',     label: 'Skills'     },
  { key: 'experience', label: 'Experience' },
  { key: 'education',  label: 'Education'  },
  { key: 'projects',   label: 'Projects'   },
];

export default function SectionScores({ scores }) {
  return (
    <div className="space-y-4">
      {sections.map(({ key, label }) => {
        const val = scores?.[key] ?? 0;
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-[#9CA3AF]">{label}</span>
              <span className="text-xs font-bold font-mono text-[#F9FAFB]">{val}%</span>
            </div>
            <div className="w-full h-2 bg-[#1F2937] rounded-full overflow-hidden border border-white/5 shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#3B82F6] to-[#6366F1]"
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
