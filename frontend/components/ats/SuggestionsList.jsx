import React from 'react';

const SuggestionsList = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:col-span-3 relative group">
      
      <h3 className="text-xl font-bold mb-8 text-slate-800 flex items-center">
        <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        Actionable Intelligence
      </h3>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((suggestion, i) => (
          <li key={i} className="flex items-start bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow duration-300">
            <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-blue-100/50 border border-blue-200 text-blue-600 text-sm font-bold mr-4">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-slate-600 leading-relaxed text-sm font-medium pt-0.5">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionsList;
