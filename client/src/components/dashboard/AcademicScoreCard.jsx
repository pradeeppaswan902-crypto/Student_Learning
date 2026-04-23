import React from 'react';

const AcademicScoreCard = ({ score = 0 }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getScorePercentage = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600 font-semibold text-sm mb-2">
            Overall Performance
          </h3>
          <p className="text-gray-400 text-xs mb-4">
            Based on assignments, quizzes & courses
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">{score}%</p>
              <p className="text-xs text-gray-500">Score</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className={`text-sm font-semibold ${
          score >= 80 ? 'text-green-600' : 
          score >= 60 ? 'text-yellow-600' : 
          'text-red-600'
        }`}>
          {getScorePercentage(score)} 📊
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Updates in real-time as you complete activities
        </p>
      </div>
    </div>
  );
};

export default AcademicScoreCard;
