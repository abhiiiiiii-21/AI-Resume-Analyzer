import React from 'react';

const SkillsList = ({ title, skills, type = 'matched' }) => {
  if (!skills || skills.length === 0) return null;

  const isMatched = type === 'matched';
  const headerTextClass = isMatched ? 'text-green-600' : 'text-red-500';
  const badgeClass = isMatched
    ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
    : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';

  return (
    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md h-full">
      <h3 className={`text-lg font-semibold mb-4 ${headerTextClass}`}>
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className={`px-3 py-1 text-sm font-medium border rounded-full transition-colors cursor-default ${badgeClass}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsList;
