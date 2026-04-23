# Quick Reference - Student Dashboard

## 🎯 Component Quick Access

| Component | File | Features | Props |
|-----------|------|----------|-------|
| Greeting | `GreetingSection.jsx` | Time-aware, Auto-updates | `studentName` |
| Score | `AcademicScoreCard.jsx` | Circular progress, Color-coded | `score` |
| Assignments | `AssignmentSummary.jsx` | Progress bar, Stat breakdown | `completed`, `total` |
| Streak | `LearningStreak.jsx` | Fire emoji, Level badges | `streak` |
| Skills | `SkillsAcquired.jsx` | Badges, Progress bar | `acquired`, `total` |
| Chart | `WeeklyActivityChart.jsx` | Dual charts, Toggleable | `data` (array) |
| Events | `EventsCalendar.jsx` | Expandable, Filtered | `events` (array) |
| Leaderboard | `Leaderboard.jsx` | Ranked, Medals, Medals | `students` (array) |

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install recharts

# Start development server
cd client && npm run dev

# Build for production
npm run build

# Run preview
npm run preview
```

---

## 📊 Sample Data Structure

```javascript
// Complete Dashboard Data
{
  academicScore: 78,                    // 0-100
  assignmentsCompleted: 12,             // Integer
  assignmentsTotal: 15,                 // Integer
  learningStreak: 7,                    // Days count
  skillsAcquired: 8,                    // Integer
  skillsTotal: 12,                      // Integer
  weeklyActivity: [                     // Array of 7 days
    { day: 'Mon', lessons: 3, time: 120 }
  ],
  events: [                             // Upcoming events
    { id: 1, title: 'Quiz', date: Date, type: 'quiz' }
  ],
  leaderboard: [                        // Top students
    { rank: 1, name: 'Student', score: 950 }
  ]
}
```

---

## 🎨 Colors Quick Reference

```
Blue-600:    #0284c7 - Primary
Purple-500:  #8b5cf6 - Secondary
Green-500:   #10b981 - Success
Orange-500:  #f59e0b - Warning
Red-500:     #ef4444 - Danger
Gray-50:     #f9fafb - Background
White:       #ffffff - Cards
```

---

## 💻 Common Props

```jsx
// Greeting
<GreetingSection studentName="Raj" />

// Score Card
<AcademicScoreCard score={78} />

// Assignment
<AssignmentSummary completed={12} total={15} />

// Streak
<LearningStreak streak={7} />

// Skills
<SkillsAcquired acquired={8} total={12} />

// Chart
<WeeklyActivityChart data={weeklyData} />

// Events
<EventsCalendar events={upcomingEvents} />

// Leaderboard
<Leaderboard students={topStudents} />
```

---

## 📱 Responsive Classes

```
grid-cols-1     - Mobile (1 column)
md:grid-cols-2  - Tablet (2 columns)
lg:grid-cols-3  - Desktop (3 columns)
gap-6           - Spacing between items
```

---

## 🔧 Common Customizations

### Change Primary Color (Blue → Purple)
1. Greeting: `from-blue-600` → `from-purple-600`
2. Progress: `fill="#3b82f6"` → `fill="#a855f7"`
3. Cards: `text-blue-600` → `text-purple-600`

### Change Grid Layout
```jsx
// From 3 cards per row to 2
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2
```

### Add More Events
```jsx
events: [
  { id: 1, title: 'Java Quiz', date: newDate, type: 'quiz' },
  // Add more events here
]
```

---

## 🐛 Manual Troubleshooting

**Chart Not Showing?**
```bash
npm install recharts
npm run dev  # Restart
```

**Styles Not Working?**
```bash
npm run build  # Rebuild CSS
```

**Import Errors?**
```bash
# Check file paths in error message
# Verify all components exist in src/components/dashboard/
```

---

## 📡 Backend API Endpoints (To Build)

```
GET  /api/dashboard/:studentId        → Full dashboard data
GET  /api/scores/:studentId            → Academic score only
GET  /api/assignments/:studentId       → Assignment progress
GET  /api/streak/:studentId            → Learning streak
GET  /api/skills/:studentId            → Skills acquired
GET  /api/activity/weekly/:studentId   → Weekly activity
GET  /api/events                       → Upcoming events
GET  /api/leaderboard?limit=10         → Top students
```

---

## 🎯 Component Hierarchy

```
Dashboard (main)
├── GreetingSection
├── Row 1
│   ├── AcademicScoreCard
│   ├── AssignmentSummary
│   └── LearningStreak
├── Row 2
│   ├── SkillsAcquired
│   └── WeeklyActivityChart
└── Row 3
    ├── EventsCalendar
    └── Leaderboard
```

---

## ⚡ Performance Tips

1. Use React.memo() for heavy components
2. Implement code splitting for charts
3. Cache API responses
4. Lazy load Events and Leaderboard
5. Optimize images and SVGs
6. Debounce resize events

---

## 📖 Documentation Maps

```
For Component Details    → DASHBOARD_GUIDE.md
For Backend Setup        → INTEGRATION_GUIDE.md
For Styling/Themes       → STYLING_GUIDE.md
For Full Overview        → README_DASHBOARD.md
```

---

## 🔐 Auth Context Usage

```javascript
import { useAuth } from '../context/AuthContext';

const { user, login, logout, loading } = useAuth();

// User object includes:
{
  token: 'jwt_token',
  name: 'Student Name',
  email: 'student@email.com'
}
```

---

## 🎁 Default Data (Dummy)

Used when backend not available:
- Score: 78%
- Assignments: 12/15
- Streak: 7 days
- Skills: 8/12
- Top Leaderboard: 5 students

---

## 📝 File Locations

```
src/
├── components/dashboard/
│   ├── Dashboard.jsx (MAIN)
│   ├── GreetingSection.jsx
│   ├── AcademicScoreCard.jsx
│   ├── AssignmentSummary.jsx
│   ├── LearningStreak.jsx
│   ├── SkillsAcquired.jsx
│   ├── WeeklyActivityChart.jsx
│   ├── EventsCalendar.jsx
│   └── Leaderboard.jsx
├── pages/
│   └── Dashboard.jsx (PAGE)
└── context/
    └── AuthContext.jsx (UPDATED)
```

---

## 🆘 Quick Fixes

| Issue | Fix |
|-------|-----|
| Chart blank | Check data format: `{ day, lessons, time }` |
| Name not showing | Login passes user data to AuthContext |
| Styling broken | Restart dev server after changes |
| Import errors | Verify file paths and component names |
| Props not updating | Check parent component state management |

---

## ✅ Deployment Checklist

- [ ] All components import correctly
- [ ] No console errors on load
- [ ] Charts render properly
- [ ] Responsive on mobile/tablet
- [ ] Backend API ready
- [ ] Environment variables configured
- [ ] Production build created
- [ ] Performance optimized

---

**Last Updated:** April 21, 2026  
**Status:** ✅ Ready for Use
