# Student Learning Management System

A comprehensive learning management platform with an interactive student dashboard, real-time analytics, and course management.

## 📊 Features

### ✨ Student Dashboard (NEW - Fully Implemented)
**8 Mandatory Components:**
- 🎯 **Greeting Section** - Time-aware personalized greeting
- 📈 **Academic Score Card** - Real-time performance tracking
- 📝 **Assignment Summary** - Completed/total assignments with progress
- 🔥 **Learning Streak** - Consecutive active learning days tracker
- ⭐ **Skills Acquired** - Badge-based skill unlock system
- 📊 **Weekly Activity Chart** - Interactive dual-mode charts (lessons/time)
- 📅 **Events Calendar** - Upcoming deadlines and events
- 🏆 **Leaderboard** - Ranked student comparison with medals

### Additional Features
- Responsive design (Mobile, Tablet, Desktop)
- Beautiful UI with Tailwind CSS
- Real-time update hooks prepared
- Dark mode ready
- Accessibility features included

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Student_Learnig_Management

# Install dependencies
cd client && npm install
cd ../server && npm install

# Install chart library for dashboard
cd ../client && npm install recharts
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📂 Project Structure

```
Student_Learnig_Management/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/dashboard/    # Dashboard components (NEW)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── GreetingSection.jsx
│   │   │   ├── AcademicScoreCard.jsx
│   │   │   ├── AssignmentSummary.jsx
│   │   │   ├── LearningStreak.jsx
│   │   │   ├── SkillsAcquired.jsx
│   │   │   ├── WeeklyActivityChart.jsx
│   │   │   ├── EventsCalendar.jsx
│   │   │   └── Leaderboard.jsx
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
├── server/                          # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
└── README.md

```

## 📚 Documentation

- **[Dashboard Guide](./README_DASHBOARD.md)** - Complete dashboard implementation details
- **[Integration Guide](./client/INTEGRATION_GUIDE.md)** - Backend API integration instructions
- **[Styling Guide](./client/STYLING_GUIDE.md)** - Theming and customization
- **[Quick Reference](./QUICK_REFERENCE.md)** - Handy quick reference for developers

## 🎯 Dashboard Components Overview

| Component | Purpose | Status |
|-----------|---------|--------|
| Greeting Section | Personalized time-aware greeting | ✅ Complete |
| Academic Score | Overall performance tracking | ✅ Complete |
| Assignments | Assignment progress tracking | ✅ Complete |
| Learning Streak | Engagement tracking | ✅ Complete |
| Skills | Skill acquisition tracking | ✅ Complete |
| Weekly Chart | Activity visualization | ✅ Complete |
| Events | Deadline management | ✅ Complete |
| Leaderboard | Competitive ranking | ✅ Complete |

## 🔧 Technologies Used

### Frontend
- **React** 19.2.5
- **React Router** 7.14.1
- **Tailwind CSS** 4.2.2
- **Recharts** (for charts)
- **Axios** (API calls)
- **Vite** (build tool)

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT Authentication**

## 🎨 Design

- Modern, clean UI with gradient backgrounds
- Responsive grid layout
- Smooth animations and transitions
- Color-coded information
- Emoji-based visual indicators
- Mobile-first approach

## 📱 Browser Support

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🔐 Authentication

- JWT-based authentication
- Secure token storage
- Protected routes
- User context management

## 📈 Real-Time Updates

All components support real-time updates when:
- Assignments are submitted/graded
- Quizzes are attempted
- Skills are unlocked
- Scores are updated

## 🚀 Deployment

### Production Build
```bash
cd client
npm run build
```

### Environment Variables
Create `.env` file:
```
VITE_API_URL=https://your-api-domain.com
```

## 🤝 Contributing

Contributions are welcome! Please follow the project guidelines for:
- Code style and formatting
- Component structure
- Documentation
- Testing

## 📝 License

This project is licensed under MIT License.

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review component source code
3. Check browser console for errors
4. Verify API endpoints

## ✅ Status

**Dashboard:** ✅ Fully Implemented and Ready  
**Last Updated:** April 21, 2026  
**Version:** 1.0
