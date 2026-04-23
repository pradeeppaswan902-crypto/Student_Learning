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
import Alumni from './Alumni';

const Dashboard = () => {
  const { user } = useAuth();
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
    weeklyActivity: [
      { day: 'Mon', lessons: 0, time: 0 },
      { day: 'Tue', lessons: 0, time: 0 },
      { day: 'Wed', lessons: 0, time: 0 },
      { day: 'Thu', lessons: 0, time: 0 },
      { day: 'Fri', lessons: 0, time: 0 },
      { day: 'Sat', lessons: 0, time: 0 },
      { day: 'Sun', lessons: 0, time: 0 },
    ],
    events: [],
    leaderboard: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6 my-6">
      {/* Greeting Section */}
      <GreetingSection studentName={user?.name || 'Student'} />

      {/* Top Row - Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <AcademicScoreCard score={dashboardData.academicScore} />
        <AssignmentSummary summary={dashboardData.assignmentSummary} loading={loading} />
        <LearningStreak streak={dashboardData.learningStreak} />
      </div>

      {/* Second Row - Skills and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <SkillsAcquired 
          acquired={dashboardData.skills.acquired} 
          total={dashboardData.skills.total} 
        />
        <div className="lg:col-span-2">
          <WeeklyActivityChart data={dashboardData.weeklyActivity} />
        </div>
      </div>

      {/* Third Row - Events and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <EventsCalendar events={dashboardData.events} />
        <Leaderboard students={dashboardData.leaderboard} />
      </div>

      {/* Fourth Row - Alumni Module */}
      <div className="mt-6">
        <Alumni />
      </div>
    </div>
  );
};

export default Dashboard;