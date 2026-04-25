import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routers/authRoutes.js";
import courseRoutes from "./routers/courseRoutes.js";
import assignmentRoutes from "./routers/assignmentRoutes.js";
import quizRoutes from "./routers/quizRoutes.js";
import attendanceRoutes from "./routers/attendanceRoutes.js";
import backupClassRequestRoutes from "./routers/backupClassRequestRoutes.js";
import jobRoutes from "./routers/jobRoutes.js";
import dashboardRoutes from "./routers/dashboardRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/backup-classes", backupClassRequestRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Protected test route
app.get("/api/dashboard/test", protect, (req, res) => {
  res.json({ message: "Welcome to Dashboard 🔐" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

