import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  codeLab: {
    type: String, // Optional code lab content
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lessons: [lessonSchema],
  isExpanded: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String, // URL to thumbnail image
  },
  modules: [moduleSchema],
  totalLessons: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate total lessons before saving
courseSchema.pre('save', function(next) {
  this.totalLessons = this.modules.reduce((total, module) => total + module.lessons.length, 0);
  next();
});

export default mongoose.model("Course", courseSchema);