import React, { useState, useEffect } from 'react';
import api from '../../confiq/api';

const AssignmentSummary = ({ summary: initialSummary = null, loading: externalLoading = false }) => {
  const [summary, setSummary] = useState(initialSummary || {
    completedAssignments: 0,
    totalAssignments: 0,
    averageScore: 0,
    evaluatedAssignments: 0,
  });
  const [loading, setLoading] = useState(!initialSummary && externalLoading);

  useEffect(() => {
    if (initialSummary) {
      setSummary(initialSummary);
      setLoading(externalLoading);
      return;
    }

    const fetchSummary = async () => {
      try {
        const response = await api.get('/assignments/summary');
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching assignment summary:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [initialSummary, externalLoading]);

  const { completedAssignments, totalAssignments, averageScore } = summary;
  const remaining = totalAssignments - completedAssignments;
  const percentage = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ">
      <div className="flex items-center justify-between  pt-4 px-2">
        <h3 className="text-gray-600 font-semibold text-sm">
          Assignment Progress
        </h3>
        <span className="text-2xl">📝</span>
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 text-sm">Completed</span>
          <span className="text-gray-800 font-bold">{completedAssignments}/{totalAssignments}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {percentage}% Complete
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-green-600 text-sm font-semibold">{completedAssignments}</p>
          <p className="text-gray-600 text-xs">Completed</p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <p className="text-orange-600 text-sm font-semibold">{remaining}</p>
          <p className="text-gray-600 text-xs">Pending</p>
        </div>
      </div>

      {averageScore > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Average Score</span>
            <span className="text-sm font-semibold text-blue-600">{averageScore}/100</span>
          </div>
        </div>
      )}

      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Updates on submission or evaluation
        </p>
      </div>
    </div>
  );
};

export default AssignmentSummary;
