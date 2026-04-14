import React from 'react';

const SuggestionsList = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-md md:col-span-3">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Improvement Suggestions</h3>
      <ul className="space-y-4">
        {suggestions.map((suggestion, i) => (
          <li key={i} className="flex items-start">
            <span className="flex items-center justify-center min-w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-bold mr-3 mt-0.5">
              {i + 1}
            </span>
            <span className="text-gray-700 leading-relaxed text-base">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionsList;
