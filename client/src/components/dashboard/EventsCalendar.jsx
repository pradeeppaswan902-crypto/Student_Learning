import React, { useState } from 'react';

const EventsCalendar = ({ events = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const getEventIcon = (type) => {
    switch (type) {
      case 'quiz':
        return '📝';
      case 'assignment':
        return '📋';
      case 'event':
        return '🎉';
      default:
        return '📌';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'quiz':
        return 'border-l-4 border-blue-500 bg-blue-50';
      case 'assignment':
        return 'border-l-4 border-orange-500 bg-orange-50';
      case 'event':
        return 'border-l-4 border-green-500 bg-green-50';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const parseDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (date) => {
    const parsed = parseDate(date);
    if (!parsed) return 'Invalid date';

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isUpcoming = (date) => {
    const parsed = parseDate(date);
    if (!parsed) return false;
    return parsed > new Date();
  };

  // ✅ FIXED: safe filtering + proper sorting
  const upcomingEvents = (events || [])
    .filter((event) => isUpcoming(event.date))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const displayEvents = expanded
    ? upcomingEvents
    : upcomingEvents.slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-600 font-semibold text-sm">
          Upcoming Events
        </h3>
        <span className="text-2xl">📅</span>
      </div>

      {displayEvents.length > 0 ? (
        <div className="space-y-3">
          {displayEvents.map((event, index) => (
            <div
              key={event.id || index}
              className={`p-4 rounded-lg ${getEventColor(event.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {getEventIcon(event.type)}
                  </span>

                  <div>
                    <p className="text-gray-800 font-semibold text-sm">
                      {event.title}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2 py-1 bg-white rounded-full text-gray-700">
                  {event.type
                    ? event.type.charAt(0).toUpperCase() +
                      event.type.slice(1)
                    : 'Event'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            🎉 No upcoming events scheduled
          </p>
        </div>
      )}

      {upcomingEvents.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 py-2 text-blue-600 text-sm font-semibold hover:bg-blue-50 rounded-lg transition"
        >
          {expanded ? '▲ Show Less' : '▼ Show All Events'}
        </button>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {upcomingEvents.length} upcoming event
          {upcomingEvents.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default EventsCalendar;