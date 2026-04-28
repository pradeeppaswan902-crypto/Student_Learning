// controllers/dashboardController.js

import Assignment from '../models/assignmentModel.js';
import Quiz from '../models/quizModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import UserProgress from '../models/userProgressModel.js';
import Course from '../models/courseModel.js';
import User from '../models/userModel.js';

const getDateKey = (date) => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getLastSevenDays = () => {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    days.push({
      key: getDateKey(day),
      day: day.toLocaleDateString('en-US', {
        weekday: 'short',
      }),
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
    const quizzes = await Quiz.find({});
    const quizAttempts = await QuizAttempt.find({
      user: userId,
    }).populate('quiz', 'title');

    const progressRecords = await UserProgress.find({
      user: userId,
    }).populate('course', 'name');

    const courses = await Course.find({});

    // =====================================
    // ASSIGNMENT SUMMARY
    // =====================================

    const totalAssignments = assignments.length;
    let completedAssignments = 0;
    let evaluatedAssignments = 0;
    let totalAssignmentMarks = 0;

    assignments.forEach((assignment) => {
      const submission = assignment.submissions.find(
        (sub) => sub.student.toString() === userId
      );

      if (submission) {
        completedAssignments++;

        if (submission.status === 'evaluated') {
          evaluatedAssignments++;
          totalAssignmentMarks += submission.marks || 0;
        }
      }
    });

    const assignmentAverage =
      evaluatedAssignments > 0
        ? Math.round(totalAssignmentMarks / evaluatedAssignments)
        : 0;

    // =====================================
    // SKILLS ACQUIRED
    // =====================================

    let totalModules = 0;
    let acquiredSkills = 0;

    const moduleLessonCountMap = {};
    const completedModuleLessons = {};

    courses.forEach((course) => {
      course.modules.forEach((module, moduleIndex) => {
        totalModules++;

        const key = `${course._id}:${moduleIndex}`;
        moduleLessonCountMap[key] = module.lessons.length;
      });
    });

    progressRecords.forEach((progress) => {
      progress.completedLessons.forEach((lesson) => {
        const key = `${progress.course._id}:${lesson.moduleIndex}`;

        completedModuleLessons[key] =
          (completedModuleLessons[key] || 0) + 1;
      });
    });

    Object.entries(completedModuleLessons).forEach(
      ([key, count]) => {
        if (
          moduleLessonCountMap[key] &&
          count >= moduleLessonCountMap[key]
        ) {
          acquiredSkills++;
        }
      }
    );

    // =====================================
    // WEEKLY ACTIVITY CHART
    // =====================================

    const weekData = getLastSevenDays();
    const activityDays = new Set();

    const findDay = (key) =>
      weekData.find((item) => item.key === key);

    progressRecords.forEach((progress) => {
      progress.completedLessons.forEach((lesson) => {
        if (!lesson.completedAt) return;

        const key = getDateKey(lesson.completedAt);
        activityDays.add(key);

        const day = findDay(key);

        if (day) {
          day.lessons += 1;
          day.time += 15;
        }
      });

      progress.lessonViews.forEach((view) => {
        if (!view.viewedAt) return;

        const key = getDateKey(view.viewedAt);
        activityDays.add(key);

        const day = findDay(key);

        if (day) {
          day.time += 10;
        }
      });
    });

    quizAttempts.forEach((attempt) => {
      const date =
        attempt.completedAt ||
        attempt.submittedAt ||
        attempt.createdAt;

      if (!date) return;

      const key = getDateKey(date);
      activityDays.add(key);

      const day = findDay(key);

      if (day) {
        day.time += attempt.timeTaken
          ? Math.round(attempt.timeTaken / 60)
          : 0;
      }
    });

    assignments.forEach((assignment) => {
      const submission = assignment.submissions.find(
        (sub) => sub.student.toString() === userId
      );

      if (submission?.submittedAt) {
        const key = getDateKey(submission.submittedAt);
        activityDays.add(key);
      }
    });

    // =====================================
// LEARNING STREAK
// =====================================

let streak = 0;

const today = new Date(now);
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);

const todayKey = getDateKey(today);
const yesterdayKey = getDateKey(yesterday);

// Agar aaj ya kal activity hai tabhi streak calculate karo
if (
  activityDays.has(todayKey) ||
  activityDays.has(yesterdayKey)
) {
  // Agar aaj activity nahi hai to kal se start karo
  const current = activityDays.has(todayKey)
    ? new Date(today)
    : new Date(yesterday);

  for (let i = 0; i < 365; i++) {
    const key = getDateKey(current);

    if (activityDays.has(key)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
}

    // =====================================
    // COURSE COMPLETION %
    // =====================================

    let totalCompletedLessons = 0;
    let totalLessons = 0;

    courses.forEach((course) => {
      totalLessons += course.modules.reduce(
        (sum, module) => sum + module.lessons.length,
        0
      );
    });

    progressRecords.forEach((progress) => {
      totalCompletedLessons +=
        progress.completedLessons.length;
    });

    const courseCompletionPercentage =
      totalLessons > 0
        ? Math.round(
            (totalCompletedLessons / totalLessons) * 100
          )
        : 0;

    // =====================================
    // QUIZ SCORE
    // =====================================

    const averageQuizScore =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce(
              (sum, attempt) => sum + attempt.score,
              0
            ) / quizAttempts.length
          )
        : 0;

    // =====================================
    // ACADEMIC SCORE CARD
    // =====================================

    const weightSum =
      (evaluatedAssignments > 0 ? 0.4 : 0) +
      (quizAttempts.length > 0 ? 0.4 : 0) +
      (totalLessons > 0 ? 0.2 : 0);

    const weightedScore =
      (evaluatedAssignments > 0
        ? assignmentAverage * 0.4
        : 0) +
      (quizAttempts.length > 0
        ? averageQuizScore * 0.4
        : 0) +
      (totalLessons > 0
        ? courseCompletionPercentage * 0.2
        : 0);

    const academicScore =
      weightSum > 0
        ? Math.round(weightedScore / weightSum)
        : 0;

    // =====================================
    // LEADERBOARD (TOP STUDENTS)
    // =====================================

    const allUsers = await User.find({})
      .select('name')
      .limit(10);

    const leaderboard = allUsers.map((student, index) => ({
      rank: index + 1,
      name: student.name,
      points: 100 - index * 5, // dummy points
    }));

    // =====================================
    // FINAL RESPONSE
    // =====================================

    // =====================================
    // EVENTS (DUMMY + DEADLINES)
    // =====================================
    const events = [];

    assignments.forEach((a) => {
      if (!a.deadline) return;
      events.push({
        id: `assignment-${a._id}`,
        type: 'assignment',
        title: `${a.title} deadline`,
        date: a.deadline,
      });
    });

    quizzes.forEach((q) => {
      const base = q.createdAt ? new Date(q.createdAt) : new Date();
      const scheduled = new Date(base);
      scheduled.setDate(scheduled.getDate() + 7);

      events.push({
        id: `quiz-${q._id}`,
        type: 'quiz',
        title: `${q.title} (scheduled)`,
        date: scheduled,
      });
    });

    // A couple of platform events (dummy)
    events.push(
      {
        id: 'event-webinar',
        type: 'event',
        title: 'Career Webinar (Dummy)',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
      },
      {
        id: 'event-hackathon',
        type: 'event',
        title: 'Mini Hackathon (Dummy)',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
      }
    );

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
        acquired: acquiredSkills,
        total: totalModules,
      },

      weeklyActivity: weekData.map(
        ({ day, lessons, time }) => ({
          day,
          lessons,
          time,
        })
      ),

      courseCompletionPercentage,

      leaderboard,

      events,

      recentActivities: getRecentActivities(
        progressRecords,
        quizAttempts,
        assignments,
        userId
      ),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

const getRecentActivities = (
  progressRecords,
  quizAttempts,
  assignments,
  userId
) => {
  const activities = [];

  // Lesson Completed
  progressRecords.forEach((progress) => {
    progress.completedLessons.forEach((lesson) => {
      activities.push({
        type: 'lesson_completed',
        description: `Completed lesson in ${progress.course.name}`,
        date: lesson.completedAt,
      });
    });

    progress.lessonViews.forEach((view) => {
      activities.push({
        type: 'lesson_viewed',
        description: `Viewed lesson in ${progress.course.name}`,
        date: view.viewedAt,
      });
    });
  });

  // Quiz Attempted
  quizAttempts.forEach((attempt) => {
    activities.push({
      type: 'quiz_attempted',
      description: `Attempted quiz: ${attempt.quiz.title}`,
      date:
        attempt.completedAt || attempt.createdAt,
      score: attempt.score,
    });
  });

  // Assignment Submitted
  assignments.forEach((assignment) => {
    const submission = assignment.submissions.find(
      (sub) => sub.student.toString() === userId
    );

    if (submission?.submittedAt) {
      activities.push({
        type: 'assignment_submitted',
        description: `Submitted assignment: ${assignment.title}`,
        date: submission.submittedAt,
      });
    }
  });

  return activities
    .sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
    .slice(0, 10);
};