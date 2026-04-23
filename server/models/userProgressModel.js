import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
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
  completedLessons: [{
    moduleIndex: Number,
    lessonIndex: Number,
    completedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  attendancePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Compound index to ensure one progress record per user per course
userProgressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model("UserProgress", userProgressSchema);