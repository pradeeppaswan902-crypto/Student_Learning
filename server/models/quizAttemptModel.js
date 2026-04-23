import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  answers: [{
    questionIndex: Number,
    selectedAnswers: [Number], // Array of selected option indices
  }],
  score: {
    type: Number, // Percentage score
    required: true,
  },
  correctCount: {
    type: Number,
    required: true,
  },
  incorrectCount: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number, // Time taken in seconds
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  isPassed: {
    type: Boolean,
    default: false,
  },
});

// Compound index to ensure one attempt per user per quiz (for now, allowing multiple attempts)
quizAttemptSchema.index({ user: 1, quiz: 1 });

export default mongoose.model("QuizAttempt", quizAttemptSchema);