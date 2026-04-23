# Dashboard Integration & Setup Guide

## Quick Start

### 1. Installation Complete ✅
All required dependencies have been installed:
```bash
npm install recharts  # Already installed for charts
```

### 2. Components Created ✅
All 8 dashboard components are ready:
- ✅ GreetingSection.jsx
- ✅ AcademicScoreCard.jsx
- ✅ AssignmentSummary.jsx
- ✅ LearningStreak.jsx
- ✅ SkillsAcquired.jsx
- ✅ WeeklyActivityChart.jsx
- ✅ EventsCalendar.jsx
- ✅ Leaderboard.jsx

### 3. Running the Application

**Development Mode:**
```bash
cd client
npm run dev
```

**Production Build:**
```bash
npm run build
npm run preview
```

---

## 🔌 Backend Integration

### Environment Setup

Create `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Fetch Dashboard Data

Create `src/services/dashboardService.js`:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const dashboardService = {
  // Get all dashboard data
  getDashboardData: async (studentId) => {
    const response = await axios.get(`${API_URL}/dashboard/${studentId}`);
    return response.data;
  },

  // Get academic score
  getAcademicScore: async (studentId) => {
    const response = await axios.get(`${API_URL}/scores/${studentId}`);
    return response.data.score;
  },

  // Get assignment progress
  getAssignmentProgress: async (studentId) => {
    const response = await axios.get(`${API_URL}/assignments/${studentId}`);
    return response.data;
  },

  // Get learning streak
  getLearningStreak: async (studentId) => {
    const response = await axios.get(`${API_URL}/streak/${studentId}`);
    return response.data.streak;
  },

  // Get skills acquired
  getSkillsAcquired: async (studentId) => {
    const response = await axios.get(`${API_URL}/skills/${studentId}`);
    return response.data;
  },

  // Get weekly activity
  getWeeklyActivity: async (studentId) => {
    const response = await axios.get(`${API_URL}/activity/weekly/${studentId}`);
    return response.data.activities;
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    const response = await axios.get(`${API_URL}/events`);
    return response.data.events;
  },

  // Get leaderboard
  getLeaderboard: async (limit = 10) => {
    const response = await axios.get(`${API_URL}/leaderboard?limit=${limit}`);
    return response.data.students;
  }
};
```

---

## 📝 Backend API Specifications

### 1. GET `/api/dashboard/:studentId`
**Response:**
```json
{
  "academicScore": 78,
  "assignmentsCompleted": 12,
  "assignmentsTotal": 15,
  "learningStreak": 7,
  "skillsAcquired": 8,
  "skillsTotal": 12,
  "weeklyActivity": [
    { "day": "Mon", "lessons": 3, "time": 120 },
    ...
  ],
  "events": [
    { "id": 1, "title": "Java Quiz", "date": "2026-04-25", "type": "quiz" },
    ...
  ],
  "leaderboard": [
    { "rank": 1, "name": "Aditya Kumar", "score": 950 },
    ...
  ]
}
```

### 2. GET `/api/scores/:studentId`
**Response:**
```json
{
  "score": 78,
  "previousScore": 76,
  "performance": "Good"
}
```

### 3. GET `/api/assignments/:studentId`
**Response:**
```json
{
  "completed": 12,
  "total": 15,
  "percentage": 80,
  "recentSubmissions": [...]
}
```

### 4. GET `/api/streak/:studentId`
**Response:**
```json
{
  "streak": 7,
  "activeDays": [
    { "date": "2026-04-21", "type": "lesson" },
    ...
  ]
}
```

### 5. GET `/api/skills/:studentId`
**Response:**
```json
{
  "acquired": 8,
  "total": 12,
  "skills": [
    { "id": 1, "name": "React", "earnedDate": "2026-03-15" },
    ...
  ]
}
```

### 6. GET `/api/activity/weekly/:studentId`
**Response:**
```json
{
  "activities": [
    { "day": "Mon", "lessons": 3, "time": 120 },
    { "day": "Tue", "lessons": 2, "time": 90 },
    ...
  ]
}
```

### 7. GET `/api/events`
**Query Parameters:**
- `limit` (optional): Number of events to return

**Response:**
```json
{
  "events": [
    {
      "id": 1,
      "title": "Java Quiz",
      "date": "2026-04-25",
      "type": "quiz",
      "description": "Mid-term Java assessment"
    },
    ...
  ]
}
```

### 8. GET `/api/leaderboard`
**Query Parameters:**
- `limit` (optional, default: 10): Number of students to return
- `page` (optional, default: 1): Page number

**Response:**
```json
{
  "students": [
    { "rank": 1, "name": "Aditya Kumar", "score": 950, "level": "Master" },
    { "rank": 2, "name": "Priya Sharma", "score": 925, "level": "Expert" },
    ...
  ]
}
```

---

## 🔄 Real-Time Updates with WebSocket (Optional)

For live updates without page refresh:

```javascript
// src/services/websocketService.js
export const initializeWebSocket = (studentId) => {
  const ws = new WebSocket(`ws://localhost:5000/socket`);

  ws.onopen = () => {
    ws.send(JSON.stringify({
      action: 'subscribe',
      studentId: studentId,
      channels: ['dashboard', 'scores', 'events']
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Emit to Redux/Context for real-time updates
    handleRealtimeUpdate(data);
  };

  return ws;
};
```

---

## 🎯 Updating Dashboard in Real-Time

Update the Dashboard component to fetch real data:

```javascript
// src/components/dashboard/Dashboard.jsx (Updated)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
// ... other imports

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData(user._id);
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
      
      // Refresh every 30 seconds
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!dashboardData) return <div className="p-6">No data available</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <GreetingSection studentName={user.name} />
      {/* ... rest of components with real data */}
    </div>
  );
};

export default Dashboard;
```

---

## 🧪 Testing the Dashboard

### Unit Tests Example (using Vitest):

```javascript
// src/components/dashboard/__tests__/AcademicScoreCard.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AcademicScoreCard from '../AcademicScoreCard';

describe('AcademicScoreCard', () => {
  it('displays correct score', () => {
    render(<AcademicScoreCard score={85} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('shows Excellent for score >= 80', () => {
    render(<AcademicScoreCard score={85} />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('shows Good for score 70-79', () => {
    render(<AcademicScoreCard score={75} />);
    expect(screen.getByText('Good')).toBeInTheDocument();
  });
});
```

---

## 📊 Sample Dashboard Data for Testing

Use this dummy data when backend is not ready:

```javascript
// src/data/dashboardDummy.js
export const dummyDashboardData = {
  academicScore: 78,
  assignmentsCompleted: 12,
  assignmentsTotal: 15,
  learningStreak: 7,
  skillsAcquired: 8,
  skillsTotal: 12,
  weeklyActivity: [
    { day: 'Mon', lessons: 3, time: 120 },
    { day: 'Tue', lessons: 2, time: 90 },
    { day: 'Wed', lessons: 5, time: 180 },
    { day: 'Thu', lessons: 4, time: 150 },
    { day: 'Fri', lessons: 3, time: 110 },
    { day: 'Sat', lessons: 2, time: 80 },
    { day: 'Sun', lessons: 1, time: 30 },
  ],
  events: [
    { id: 1, title: 'Java Quiz', date: new Date(2026, 3, 25), type: 'quiz' },
    { id: 2, title: 'Project Submission', date: new Date(2026, 3, 28), type: 'assignment' },
  ],
  leaderboard: [
    { rank: 1, name: 'Aditya Kumar', score: 950 },
    { rank: 2, name: 'Priya Sharma', score: 925 },
    { rank: 3, name: 'Rahul Patel', score: 895 },
  ]
};
```

---

## 🚀 Deployment

### Build for Production:
```bash
npm run build
```

### Environment Variables for Production:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_ENV=production
```

### Optimization Tips:
1. Enable gzip compression on server
2. Use CDN for static assets
3. Enable code splitting in Vite
4. Optimize images
5. Cache API responses appropriately

---

## 🐛 Troubleshooting

### Issue: Chart not displaying
**Solution:** Check that Recharts is properly installed:
```bash
npm install recharts
```

### Issue: Student name not showing
**Solution:** Ensure login passes user data to AuthContext:
```javascript
login(token, { name: 'Student Name', email: 'student@email.com' });
```

### Issue: Styling looks broken
**Solution:** Verify Tailwind CSS is properly configured:
```bash
npm run build
```

### Issue: Real-time updates not working
**Solution:** Check API endpoint is returning correct data structure

---

## 📞 Support & Maintenance

For issues or questions:
1. Check the DASHBOARD_GUIDE.md for component details
2. Review API specifications above
3. Check browser console for errors
4. Verify backend API endpoints are working

---

**Last Updated:** April 21, 2026
