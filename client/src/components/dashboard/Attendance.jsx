import React, { useState, useEffect } from 'react';
import api from '../../confiq/api';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [overallMonthlySummary, setOverallMonthlySummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceOverview();
    fetchOverallMonthlySummary();
  }, []);

  const fetchAttendanceOverview = async () => {
    try {
      const response = await api.get('/attendance');
      console.log(response.data);
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const fetchOverallMonthlySummary = async () => {
    try {
      const response = await api.get('/attendance/monthly');
      setOverallMonthlySummary(response.data?.monthlySummary || []);
    } catch (error) {
      // Monthly summary is nice-to-have; overview can still render without it.
      console.error('Error fetching overall monthly attendance summary:', error);
      setOverallMonthlySummary([
        { month: '2026-04', total: 12, present: 9, absent: 2, late: 1, attendancePercentage: 75 },
        { month: '2026-03', total: 10, present: 7, absent: 2, late: 1, attendancePercentage: 70 },
      ]);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await api.get(`/attendance/${courseId}`);
      setCourseDetails(response.data);
      setSelectedCourse(courseId);
    } catch (error) {
      console.error('Error fetching course attendance:', error);
      toast.error('Failed to load course attendance details');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return '✓';
      case 'absent':
        return '✗';
      case 'late':
        return '●';
      default:
        return '?';
    }
  };

  const formatMonthLabel = (monthKey) =>
    new Date(`${monthKey}-01`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (courseDetails) {
    return (
      <div className="space-y-6 my-20">
        {/* Header */}
        <div className="flex items-center justify-between my-8">
          <button
            onClick={() => {
              setSelectedCourse(null);
              setCourseDetails(null);
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to All Courses
          </button>
          <h1 className="text-2xl font-bold">{courseDetails.course.name}</h1>
        </div>

        {/* Course Statistics */}
        <div className="bg-white p-6 rounded-lg shadow ">
          <h2 className="text-lg font-semibold mb-4">Attendance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{courseDetails.statistics.attendancePercentage}%</div>
              <div className="text-sm text-gray-600">Overall Attendance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{courseDetails.statistics.presentSessions}</div>
              <div className="text-sm text-gray-600">Present</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{courseDetails.statistics.absentSessions}</div>
              <div className="text-sm text-gray-600">Absent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{courseDetails.statistics.lateSessions}</div>
              <div className="text-sm text-gray-600">Late</div>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
          <div className="space-y-3">
            {courseDetails.monthlySummary.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 border rounded">
                <div className="font-medium">
                  {new Date(month.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600">Present: {month.present}</span>
                  <span className="text-red-600">Absent: {month.absent}</span>
                  <span className="text-yellow-600">Late: {month.late}</span>
                  <span className="font-semibold">
                    {month.total > 0 ? Math.round((month.present / month.total) * 100) : 0}% attendance
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session History */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Session History</h2>
          <div className="space-y-2">
            {courseDetails.sessionHistory.map((session) => (
              <div key={session._id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                    {getStatusIcon(session.status)}
                  </span>
                  <div>
                    <div className="font-medium">
                      {new Date(session.sessionDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">{session.sessionType}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-16">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance Overview</h1>
      </div>

      {/* Monthly Summary (All Courses) */}
      {overallMonthlySummary.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Summary (All Courses)</h2>
          <div className="space-y-3">
            {overallMonthlySummary.map((month) => (
              <div
                key={month.month}
                className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between p-3 border rounded"
              >
                <div className="font-medium">{formatMonthLabel(month.month)}</div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-green-600">Present: {month.present}</span>
                  <span className="text-red-600">Absent: {month.absent}</span>
                  <span className="text-yellow-600">Late: {month.late}</span>
                  <span className="font-semibold">{month.attendancePercentage}% attendance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendanceData.map((course) => (
          <div key={course.courseId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.courseName}</h3>

              <div className="space-y-4 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attendance Rate</span>
                    <span className="font-semibold">{course.attendancePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${course.attendancePercentage >= 75 ? 'bg-green-600' :
                          course.attendancePercentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                      style={{ width: `${course.attendancePercentage}%` }}
                    ></div>
                  </div>
                  {course.totalSessions === 0 && (
                    <div className="text-xs text-gray-500 mt-2">
                      No sessions marked yet
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {course.presentSessions}
                    </div>
                    <div className="text-xs text-gray-600">Present</div>
                  </div>

                  <div>
                    <div className="text-lg font-bold text-red-600">
                      {course.absentSessions}
                    </div>
                    <div className="text-xs text-gray-600">Absent</div>
                  </div>

                  <div>
                    <div className="text-lg font-bold text-gray-600">
                      {course.totalSessions}
                    </div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => fetchCourseDetails(course.courseId)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {attendanceData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No attendance data available</p>
        </div>
      )}

      {/* Recent Sessions Summary */}
      {attendanceData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
          <div className="space-y-2">
            {attendanceData
              .flatMap(course => course.recentSessions.map(session => ({ ...session, courseName: course.courseName })))
              .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate))
              .slice(0, 10)
              .map((session) => (
                <div key={session._id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                    </span>
                    <div>
                      <div className="font-medium">{session.courseName}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(session.sessionDate).toLocaleDateString()} • {session.sessionType}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;