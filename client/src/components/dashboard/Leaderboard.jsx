import React, { useState } from 'react';

const Leaderboard = ({ students = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '⭐';
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 2:
        return 'bg-gray-50 border-l-4 border-gray-400';
      case 3:
        return 'bg-orange-50 border-l-4 border-orange-500';
      default:
        return 'bg-white border-l-4 border-blue-300';
    }
  };

  const displayStudents = showAll ? students : students.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-600 font-semibold text-sm">
          Top Students Leaderboard
        </h3>
        <span className="text-2xl">🏆</span>
      </div>

      {students.length > 0 ? (
        <div className="space-y-2">
          {displayStudents.map((student, index) => (
            <div
              key={student.rank}
              className={`p-4 rounded-lg ${getRankColor(student.rank)} transition hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getMedalIcon(student.rank)}
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">
                      #{student.rank} - {student.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Points
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 font-bold text-lg">
                    {student.score}
                  </p>
                  <p className="text-xs text-gray-500">pts</p>
                </div>
              </div>

              {/* Progress bar for top 3 */}
              {student.rank <= 3 && (
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      student.rank === 1
                        ? 'bg-yellow-500'
                        : student.rank === 2
                        ? 'bg-gray-400'
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${((student.rank - 1) / students.length) * 100 + 30}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No students available in leaderboard
          </p>
        </div>
      )}

      {students.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-blue-600 text-sm font-semibold hover:bg-blue-50 rounded-lg transition"
        >
          {showAll ? '▲ Show Less' : '▼ View Full Leaderboard'}
        </button>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          🎯 Compete and climb the ranks!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
