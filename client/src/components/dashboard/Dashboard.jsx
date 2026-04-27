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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        
        setDashboardData({
          academicScore: res.data.academicScore || 0,
          assignmentSummary: res.data.assignmentSummary || {
            completedAssignments: 0,
            totalAssignments: 0,
            averageScore: 0,
            evaluatedAssignments: 0,
          },
          learningStreak: res.data.learningStreak || 0,
          skills: res.data.skills || { acquired: 0, total: 0 },
          weeklyActivity: res.data.weeklyActivity || [],
          recentActivities: res.data.recentActivities || [],
          events: res.data.events || [],
          leaderboard: res.data.leaderboard || [],
        });

      } catch (error) {
        console.error('Dashboard API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dashboardRefreshTick]);

  return (
    <div className="bg-gray-50 min-h-screen p-6 my-6">

      {/* Greeting */}
      <GreetingSection studentName={user?.name || 'Student'} />

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <AcademicScoreCard score={dashboardData.academicScore} />
        <AssignmentSummary summary={dashboardData.assignmentSummary} loading={loading} />
        <LearningStreak streak={dashboardData.learningStreak} />
      </div>

      {/* Skills + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <SkillsAcquired
          acquired={dashboardData.skills.acquired}
          total={dashboardData.skills.total}
        />

        <div className="lg:col-span-2">
          <WeeklyActivityChart data={dashboardData.weeklyActivity} />
        </div>
      </div>

      {/* Events + Leaderboard + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <EventsCalendar events={dashboardData.events} />

        <Leaderboard students={dashboardData.leaderboard} />

        <RecentActivities activities={dashboardData.recentActivities} />
      </div>

    </div>
  );
};

export default Dashboard;