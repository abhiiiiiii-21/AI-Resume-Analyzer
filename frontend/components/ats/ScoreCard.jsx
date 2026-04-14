import React from 'react';

const ScoreCard = ({ score }) => {
  const getColor = (s) => s >= 75 ? 'text-green-500' : s >= 50 ? 'text-yellow-500' : 'text-red-500';
  const getStroke = (s) => s >= 75 ? 'stroke-green-500' : s >= 50 ? 'stroke-yellow-500' : 'stroke-red-500';

  const radius = 55;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-2xl shadow-md h-full">
      <h3 className="text-xl font-bold mb-6 text-gray-800">ATS Match Score</h3>
      <div className="relative flex items-center justify-center">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            className="text-gray-100 stroke-current"
            strokeWidth={stroke}
            cx="72"
            cy="72"
            r={radius}
            fill="transparent"
          />
          <circle
            className={`${getStroke(score)} stroke-current transition-all duration-1000 ease-out`}
            strokeWidth={stroke}
            strokeLinecap="round"
            cx="72"
            cy="72"
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className={`absolute flex items-center justify-center text-4xl font-extrabold ${getColor(score)} bg-clip-text`}>
          {score}%
        </span>
      </div>
    </div>
  );
};

export default ScoreCard;
