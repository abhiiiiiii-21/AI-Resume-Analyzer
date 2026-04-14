import React from 'react';

const SkillsList = ({ title, skills, type = 'matched' }) => {
  if (!skills || skills.length === 0) return null;

  const isMatched = type === 'matched';
  const headerIcon = isMatched ? (
    <svg className="w-6 h-6 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) : (
    <svg className="w-6 h-6 text-rose-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  );

  const badgeClass = isMatched
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
    : 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm';

  return (
    <div className={`p-8 rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col relative`}>
      <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
        {headerIcon}
        {title}
        <span className="ml-auto text-xs font-bold px-2.5 py-1 bg-slate-50 rounded-full text-slate-500 border border-slate-200">
          {skills.length} count
        </span>
      </h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, i) => (
          <span
            key={i}
            className={`px-4 py-2 text-sm font-semibold tracking-wide border rounded-xl transition-all cursor-default ${badgeClass}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsList;
