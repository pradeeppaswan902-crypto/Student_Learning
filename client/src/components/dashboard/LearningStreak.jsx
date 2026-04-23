import React from 'react';

const LearningStreak = ({ streak = 0 }) => {
  const getLevelBadge = (streakDays) => {
    if (streakDays >= 30) return { level: 'Master', color: 'text-purple-600', bg: 'bg-purple-50' };
    if (streakDays >= 14) return { level: 'Expert', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (streakDays >= 7) return { level: 'Intermediate', color: 'text-green-600', bg: 'bg-green-50' };
    return { level: 'Beginner', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  };

  const badge = getLevelBadge(streak);

  // Generate visual representation of fire 🔥
  const fireIntensity = Math.min(streak / 30, 1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-600 font-semibold text-sm">
          Learning Streak
        </h3>
        <span className="text-3xl" style={{ opacity: 0.5 + fireIntensity * 0.5 }}>🔥</span>
      </div>

      <div className="text-center mb-6">
        <p className="text-4xl font-bold text-orange-600 mb-2">
          {streak}
        </p>
        <p className="text-gray-600 text-sm">
          {streak === 1 ? 'Day Active' : 'Days Active'}
        </p>
      </div>

      <div className={`${badge.bg} p-3 rounded-lg text-center mb-4`}>
        <p className={`${badge.color} font-semibold text-sm`}>
          {badge.level} Level
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-xs text-gray-600 mb-2 font-semibold">Active Days Count:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>✓ Lesson opened</li>
          <li>✓ Assignment submitted</li>
          <li>✓ Quiz attempted</li>
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Keep the streak going! 
        </p>
      </div>
    </div>
  );
};

export default LearningStreak;
