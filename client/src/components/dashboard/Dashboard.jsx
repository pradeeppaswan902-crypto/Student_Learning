import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../confiq/api';

import GreetingSection from './GreetingSection';
import AcademicScoreCard from './AcademicScoreCard';
import AssignmentSummary from './AssignmentSummary';
import LearningStreak from './LearningStreak';
import SkillsAcquired from './SkillsAcquired';
import WeeklyActivityChart from './WeeklyActivityChart';
import EventsCalendar from './EventsCalendar';
import Leaderboard from './Leaderboard';
import RecentActivities from './RecentActivities';

const Dashboard = () => {
  const { user, dashboardRefreshTick } = useAuth();

  const [dashboardData, setDashboardData] = useState({
    academicScore: 0,
    assignmentSummary: {
      completedAssignments: 0,
      totalAssignments: 0,
      averageScore: 0,
      evaluatedAssignments: 0,
    },
    learningStreak: 0,
    skills: {
      acquired: 0,
      total: 0,
    },
    weeklyActivity: [],
    recentActivities: [],
    events: [],
    leaderboard: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await api.get('/dashboard/summary');

        setDashboardData({
          academicScore: res.data.academicScore || 0,
          assignmentSummary: res.data.assignmentSummary || {},
          learningStreak: res.data.learningStreak || 0,
          skills: res.data.skills || {},
          weeklyActivity: res.data.weeklyActivity || [],
          recentActivities: res.data.recentActivities || [],
          events: res.data.events || [],
          leaderboard: res.data.leaderboard || [],
        });

      } catch (error) {
        console.error('Dashboard API Error:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dashboardRefreshTick]);

  // 🔥 LOADING UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );
  }

  // 🔥 ERROR UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <h2 className="text-xl font-semibold">Failed to load dashboard</h2>
        <p className="text-sm mt-2">Please check backend connection</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-8 ">

      {/* Greeting */}
      <div className="mb-6">
        <GreetingSection studentName={user?.name || 'Student'} />
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <AcademicScoreCard score={dashboardData.academicScore} />

        <AssignmentSummary
          summary={dashboardData.assignmentSummary}
        />

        <LearningStreak streak={dashboardData.learningStreak} />
      </div>

      {/* Skills + Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-6">

        <SkillsAcquired
          acquired={dashboardData.skills.acquired}
          total={dashboardData.skills.total}
        />

        <div className="xl:col-span-2 w-full overflow-x-auto">
          <WeeklyActivityChart data={dashboardData.weeklyActivity} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">

        <EventsCalendar events={dashboardData.events} />

        <div className="overflow-x-auto">
          <Leaderboard students={dashboardData.leaderboard} />
        </div>

        <RecentActivities activities={dashboardData.recentActivities} />
      </div>

    </div>
  );
};


export default Dashboard;