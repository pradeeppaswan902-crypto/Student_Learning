import express from 'express';
import {
  getCourses,
  getCourseDetails,
  markLessonComplete,
  recordLessonView,
  markCourseComplete,
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all courses for the user
router.get('/', getCourses);

// Get course details
router.get('/:courseId', getCourseDetails);

// Mark lesson as complete
router.post('/:courseId/modules/:moduleIndex/lessons/:lessonIndex/complete', markLessonComplete);

// Record lesson view
router.post('/:courseId/modules/:moduleIndex/lessons/:lessonIndex/view', recordLessonView);

// Mark course as complete (demo feature)
router.post('/:courseId/complete', markCourseComplete);

export default router;