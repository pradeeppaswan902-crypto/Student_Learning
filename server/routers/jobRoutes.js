import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all active jobs and internships
router.get('/', getJobs);

// Get job by ID
router.get('/:id', getJobById);

// Create new job listing (admin only - you might want to add admin middleware)
router.post('/', createJob);

// Update job listing (admin only)
router.put('/:id', updateJob);

// Delete/deactivate job listing (admin only)
router.delete('/:id', deleteJob);

export default router;