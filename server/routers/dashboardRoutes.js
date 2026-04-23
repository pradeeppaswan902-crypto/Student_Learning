import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

// Dashboard summary for student landing page
router.get('/summary', getDashboardSummary);

export default router;
