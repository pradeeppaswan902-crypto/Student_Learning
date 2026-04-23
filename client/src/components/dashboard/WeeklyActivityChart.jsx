import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const WeeklyActivityChart = ({ data = [] }) => {
  const [chartType, setChartType] = useState('lessons');

  const toggleChartType = () => {
    setChartType(chartType === 'lessons' ? 'time' : 'lessons');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-600 font-semibold text-sm">
            Weekly Learning Activity
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            {chartType === 'lessons' 
              ? 'Lessons completed per day' 
              : 'Time spent learning (minutes)'}
          </p>
        </div>
        <button
          onClick={toggleChartType}
          className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition"
        >
          {chartType === 'lessons' ? '⏱️ Show Time' : '📚 Show Lessons'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'lessons' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar
              dataKey="lessons"
              fill="#3b82f6"
              name="Lessons"
              radius={[8, 8, 0, 0]}
              animationDuration={500}
            />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="time"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Time (mins)"
              animationDuration={500}
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-blue-600 text-sm font-semibold">
            {data.reduce((acc, day) => acc + day.lessons, 0)}
          </p>
          <p className="text-gray-600 text-xs">Total Lessons</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-purple-600 text-sm font-semibold">
            {data.reduce((acc, day) => acc + day.time, 0)} min
          </p>
          <p className="text-gray-600 text-xs">Total Time</p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyActivityChart;
