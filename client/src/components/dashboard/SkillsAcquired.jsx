import React from 'react';

const SkillsAcquired = ({ acquired = 0, total = 0 }) => {
  const percentage = total > 0 ? (acquired / total) * 100 : 0;

  const skillsList = [
    'React',
    'JavaScript',
    'Tailwind CSS',
    'Node.js',
    'MongoDB',
    'Python',
    'Git',
    'Problem Solving',
    'Web Design',
    'API Development',
    'Database Design',
    'Testing'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-600 font-semibold text-sm">
          Skills Acquired
        </h3>
        <span className="text-2xl"></span>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 text-sm">Progress</span>
          <span className="text-gray-800 font-bold">{acquired}/{total}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          {percentage.toFixed(0)}% Skills Unlocked
        </p>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-xs text-gray-600 font-semibold mb-3">Recently Acquired:</p>
        <div className="flex flex-wrap gap-2">
          {skillsList.slice(0, acquired).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-200 text-purple-800"
            >
              {skill} ✓
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Unlock skills by completing modules
        </p>
      </div>
    </div>
  );
};

export default SkillsAcquired;
