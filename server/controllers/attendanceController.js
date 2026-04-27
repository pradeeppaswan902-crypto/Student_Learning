import Attendance from '../models/attendanceModel.js';
import Course from '../models/courseModel.js';
import UserProgress from '../models/userProgressModel.js';

// Get aggregated monthly attendance summary for a user (all courses combined)
export const getMonthlyAttendanceSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const attendanceRecords = await Attendance.find({ user: userId }).sort({
      sessionDate: -1,
    });

    const monthlySummary = {};
    attendanceRecords.forEach((record) => {
      const monthKey = record.sessionDate.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlySummary[monthKey]) {
        monthlySummary[monthKey] = {
          month: monthKey,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
        };
      }
      monthlySummary[monthKey].total++;
      monthlySummary[monthKey][record.status]++;
    });

    const monthlyData = Object.values(monthlySummary)
      .map((m) => ({
        ...m,
        attendancePercentage: m.total > 0 ? Math.round((m.present / m.total) * 100) : 0,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    res.json({ monthlySummary: monthlyData });
  } catch (error) {
    console.error('Error fetching monthly attendance summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get attendance for all courses for a user
export const getAttendanceOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all courses with attendance data
    const courses = await Course.find({});

    const attendanceData = await Promise.all(
      courses.map(async (course) => {
        // Get all attendance records for this user and course
        const attendanceRecords = await Attendance.find({
          user: userId,
          course: course._id,
        }).sort({ sessionDate: -1 });

        // Calculate attendance percentage
        const totalSessions = attendanceRecords.length;
        const presentSessions = attendanceRecords.filter(record => record.status === 'present').length;
        const attendancePercentage = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;

        // Update user progress with attendance percentage
        await UserProgress.findOneAndUpdate(
          { user: userId, course: course._id },
          { attendancePercentage },
          { upsert: true }
        );

        return {
          courseId: course._id,
          courseName: course.name,
          attendancePercentage,
          totalSessions,
          presentSessions,
          absentSessions: totalSessions - presentSessions,
          recentSessions: attendanceRecords.slice(0, 10), // Last 10 sessions
        };
      })
    );

    res.json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance overview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get detailed attendance for a specific course
export const getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const attendanceRecords = await Attendance.find({
      user: userId,
      course: courseId,
    }).sort({ sessionDate: -1 });

    // Calculate statistics
    const totalSessions = attendanceRecords.length;
    const presentSessions = attendanceRecords.filter(record => record.status === 'present').length;
    const absentSessions = attendanceRecords.filter(record => record.status === 'absent').length;
    const lateSessions = attendanceRecords.filter(record => record.status === 'late').length;
    const attendancePercentage = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;

    // Group by month for monthly summary
    const monthlySummary = {};
    attendanceRecords.forEach(record => {
      const monthKey = record.sessionDate.toISOString().slice(0, 7); // YYYY-MM format
      if (!monthlySummary[monthKey]) {
        monthlySummary[monthKey] = {
          month: monthKey,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
        };
      }
      monthlySummary[monthKey].total++;
      monthlySummary[monthKey][record.status]++;
    });

    const monthlyData = Object.values(monthlySummary).sort((a, b) => b.month.localeCompare(a.month));

    res.json({
      course: {
        _id: course._id,
        name: course.name,
        instructor: course.instructor,
      },
      statistics: {
        totalSessions,
        presentSessions,
        absentSessions,
        lateSessions,
        attendancePercentage,
      },
      sessionHistory: attendanceRecords,
      monthlySummary: monthlyData,
    });
  } catch (error) {
    console.error('Error fetching course attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark attendance (for instructors - demo purposes)
export const markAttendance = async (req, res) => {
  try {
    const { courseId, userId, sessionDate, status, sessionType, notes } = req.body;

    const attendance = new Attendance({
      user: userId,
      course: courseId,
      sessionDate: new Date(sessionDate),
      status,
      sessionType: sessionType || 'lecture',
      notes,
      markedBy: req.user.id, // Instructor marking the attendance
    });

    await attendance.save();

    // Update user progress attendance percentage
    const attendanceRecords = await Attendance.find({ user: userId, course: courseId });
    const totalSessions = attendanceRecords.length;
    const presentSessions = attendanceRecords.filter(record => record.status === 'present').length;
    const attendancePercentage = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;

    await UserProgress.findOneAndUpdate(
      { user: userId, course: courseId },
      { attendancePercentage },
      { upsert: true }
    );

    res.json({ success: true, attendance });
  } catch (error) {
    console.error('Error marking attendance:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance already marked for this session' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};