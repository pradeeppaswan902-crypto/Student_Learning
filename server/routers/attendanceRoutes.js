import express from 'express';
import {
  getAttendanceOverview,
  getMonthlyAttendanceSummary,
  getCourseAttendance,
  markAttendance,
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get attendance overview for all courses
router.get('/', getAttendanceOverview);

// Get aggregated monthly summary (all courses)
router.get('/monthly', getMonthlyAttendanceSummary);

// Get detailed attendance for a specific course
router.get('/:courseId', getCourseAttendance);

// Mark attendance (instructor only - demo)
router.post('/mark', markAttendance);

export default router;