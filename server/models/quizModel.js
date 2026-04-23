import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['single', 'multiple'],
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswers: [{
    type: Number, // Index of correct options
    required: true,
  }],
  explanation: {
    type: String, // Optional explanation
  },
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  questions: [questionSchema],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course.modules.lessons', // Reference to specific lesson
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Quiz", quizSchema);