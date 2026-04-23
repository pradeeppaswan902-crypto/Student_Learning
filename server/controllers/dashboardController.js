import Assignment from '../models/assignmentModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import UserProgress from '../models/userProgressModel.js';
import Course from '../models/courseModel.js';

const getDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const getLastSevenDays = () => {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    days.push({
      key: getDateKey(day),
      day: day.toLocaleDateString('en-US', { weekday: 'short' }),
      lessons: 0,
      time: 0,
    });
  }
  return days;
};

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const assignments = await Assignment.find({});
    const quizAttempts = await QuizAttempt.find({ user: userId });
    const progressRecords = await UserProgress.find({ user: userId });
    const courses = await Course.find({});

    // Assignment Summary
    const totalAssignments = assignments.length;
    let completedAssignments = 0;
    let evaluatedAssignments = 0;
    let totalAssignmentMarks = 0;

    assignments.forEach((assignment) => {
      const submission = assignment.submissions.find(
        (sub) => sub.student.toString() === userId
      );
      if (submission) {
        completedAssignments += 1;

        if (submission.status === 'evaluated') {
          evaluatedAssignments += 1;
          totalAssignmentMarks += submission.marks || 0;
        }
      }
    });

    const assignmentAverage = evaluatedAssignments > 0
      ? Math.round(totalAssignmentMarks / evaluatedAssignments)
      : 0;

    // Course and Skills
    let totalModules = 0;
    const moduleLessonCountMap = {};

    courses.forEach((course) => {
      course.modules.forEach((module, moduleIndex) => {
        totalModules += 1;
        moduleLessonCountMap[`${course._id}:${moduleIndex}`] = module.lessons.length;
      });
    });

    let acquiredSkills = 0;
    const completedModuleLessons = {};

    progressRecords.forEach((progress) => {
      progress.completedLessons.forEach((lesson) => {
        const key = `${progress.course}:${lesson.moduleIndex}`;
        completedModuleLessons[key] = (completedModuleLessons[key] || 0) + 1;
      });
    });

    Object.entries(completedModuleLessons).forEach(([key, count]) => {
      if (moduleLessonCountMap[key] && count >= moduleLessonCountMap[key]) {
        acquiredSkills += 1;
      }
    });

    const skillsAcquired = acquiredSkills;
    const skillsTotal = totalModules;

    // Weekly activity chart and streak
    const weekData = getLastSevenDays();
    const activityDays = new Set();

    progressRecords.forEach((progress) => {
      progress.completedLessons.forEach((lesson) => {
        const key = getDateKey(lesson.completedAt);
        activityDays.add(key);
        const day = weekData.find((item) => item.key === key);
        if (day) {
          day.lessons += 1;
          day.time += 15; // approximate 15 minutes per lesson
        }
      });
    });

    quizAttempts.forEach((attempt) => {
      const key = getDateKey(attempt.completedAt);
      activityDays.add(key);
      const day = weekData.find((item) => item.key === key);
      if (day) {
        day.time += attempt.timeTaken ? Math.round(attempt.timeTaken / 60) : 0;
      }
    });

    assignments.forEach((assignment) => {
      const submission = assignment.submissions.find(
        (sub) => sub.student.toString() === userId
      );
      if (submission) {
        const key = getDateKey(submission.submittedAt);
        activityDays.add(key);
      }
    });

    const todayKey = getDateKey(now);
    let streak = 0;
    for (let i = 0; i < 30; i += 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const key = getDateKey(date);
      if (activityDays.has(key)) {
        streak += 1;
      } else {
        break;
      }
    }

    // Course completion progress
    let totalCompletedLessons = 0;
    let totalLessons = 0;

    courses.forEach((course) => {
      const courseTotalLessons = course.modules.reduce(
        (sum, module) => sum + module.lessons.length,
        0
      );
      totalLessons += courseTotalLessons;
    });

    progressRecords.forEach((progress) => {
      totalCompletedLessons += progress.completedLessons.length;
    });

    const courseCompletionPercentage = totalLessons > 0
      ? Math.round((totalCompletedLessons / totalLessons) * 100)
      : 0;

    // Academic score calculation
    const weightSum = (evaluatedAssignments > 0 ? 0.4 : 0)
      + (quizAttempts.length > 0 ? 0.4 : 0)
      + (totalLessons > 0 ? 0.2 : 0);

    const weightedScore = (
      (evaluatedAssignments > 0 ? assignmentAverage * 0.4 : 0)
      + (quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length) * 0.4
        : 0)
      + (totalLessons > 0 ? courseCompletionPercentage * 0.2 : 0)
    );

    const academicScore = weightSum > 0
      ? Math.round(weightedScore / weightSum)
      : 0;

    // Upcoming events
    const upcomingAssignments = assignments
      .filter((assignment) => assignment.deadline > now)
      .map((assignment) => ({
        id: `assignment-${assignment._id}`,
        title: assignment.title,
        date: assignment.deadline,
        type: 'assignment',
      }));

    const dummyEvents = [
      {
        id: 'event-1',
        title: 'Monthly Hackathon',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4),
        type: 'event',
      },
      {
        id: 'event-2',
        title: 'Community Study Group',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        type: 'event',
      },
    ];

    const events = [...upcomingAssignments.slice(0, 3), ...dummyEvents]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    // Leaderboard (dummy data is allowed for this feature)
    const leaderboard = [
      { rank: 1, name: 'Aditya Kumar', score: 980 },
      { rank: 2, name: 'Priya Sharma', score: 925 },
      { rank: 3, name: 'Rahul Patel', score: 895 },
      { rank: 4, name: 'Sneha Gupta', score: 870 },
      { rank: 5, name: 'Vikram Singh', score: 845 },
      { rank: 6, name: 'Anjali Mehta', score: 820 },
      { rank: 7, name: 'Rohan Das', score: 795 },
      { rank: 8, name: 'Nina Kapoor', score: 770 },
      { rank: 9, name: 'Amit Joshi', score: 740 },
      { rank: 10, name: 'Simran Kaur', score: 715 },
    ];

    res.json({
      academicScore,
      assignmentSummary: {
        completedAssignments,
        totalAssignments,
        averageScore: assignmentAverage,
        evaluatedAssignments,
      },
      learningStreak: streak,
      skills: {
        acquired: skillsAcquired,
        total: skillsTotal,
      },
      weeklyActivity: weekData,
      events,
      leaderboard,
      courseCompletionPercentage,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
