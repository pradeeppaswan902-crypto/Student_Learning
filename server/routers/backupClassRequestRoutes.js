import express from "express";
import {
  createBackupClassRequest,
  getStudentBackupRequests,
  getAllBackupRequests,
  updateBackupRequestStatus,
  createDoubtRequest, // ✅ ADD THIS
} from "../controllers/backupClassRequestController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// ==================== STUDENT ====================

// ✅ Backup class
router.post("/backup", createBackupClassRequest);

// ✅ Doubt (NEW)
router.post("/doubt", upload.single('attachment'), createDoubtRequest);

// Get student requests
router.get("/student", getStudentBackupRequests);

// ==================== ADMIN ====================

router.get("/admin", getAllBackupRequests);
router.put("/admin/:id", updateBackupRequestStatus);

export default router;