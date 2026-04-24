import React from 'react';

const RecentActivities = ({ activities }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lesson_completed':
        return '📚';
      case 'lesson_viewed':
        return '👁️';
      case 'quiz_attempted':
        return '🧠';
      case 'assignment_submitted':
        return '📝';
      default:
        return '📌';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activities</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.description}</p>
                {activity.score !== undefined && (
                  <p className="text-xs text-gray-600">Score: {activity.score}%</p>
                )}
                <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivities;