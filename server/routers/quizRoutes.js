import express from 'express';
import {
  getQuizzes,
  getQuizDetails,
  submitQuizAttempt,
  getQuizAttempts,
  getQuizByLesson,
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all quizzes for the user
router.get('/', getQuizzes);

// Get quiz details
router.get('/:quizId', getQuizDetails);

// Submit quiz attempt
router.post('/:quizId/attempt', submitQuizAttempt);

// Get quiz attempts for a user
router.get('/:quizId/attempts', getQuizAttempts);

router.get("/lesson/:lessonId", getQuizByLesson);

export default router;