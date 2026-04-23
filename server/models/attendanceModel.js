import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  sessionDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true,
  },
  sessionType: {
    type: String,
    enum: ['lecture', 'lab', 'tutorial', 'exam'],
    default: 'lecture',
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Instructor who marked attendance
  },
  notes: {
    type: String, // Optional notes
  },
}, { timestamps: true });

// Compound index to ensure one attendance record per user per course per session
attendanceSchema.index({ user: 1, course: 1, sessionDate: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);