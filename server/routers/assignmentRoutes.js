import express from 'express';
import {
  getAssignments,
  getAssignmentDetails,
  submitAssignment,
  evaluateAssignment,
  getAssignmentSummary,
} from '../controllers/assignmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all assignments for the user
router.get('/', getAssignments);

// Get assignment summary for dashboard
router.get('/summary', getAssignmentSummary);

// Get assignment details
router.get('/:assignmentId', getAssignmentDetails);

// Submit an assignment
router.post('/:assignmentId/submit', upload.single('file'), submitAssignment);

// Evaluate assignment (demo feature)
router.post('/:assignmentId/evaluate', evaluateAssignment);

export default router;