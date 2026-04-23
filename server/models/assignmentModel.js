import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submissionType: {
    type: String,
    enum: ['file', 'text', 'link'],
    required: true,
  },
  content: {
    type: String,
    required: true, // File path, text content, or URL
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  isLate: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['submitted', 'late_submitted', 'evaluated'],
    default: 'submitted',
  },
  marks: {
    type: Number,
    min: 0,
    max: 100,
  },
  feedback: {
    type: String,
  },
  evaluatedAt: {
    type: Date,
  },
});

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
    enum: ['Software Engineering', 'Data Science', 'Web Development', 'Mobile Development', 'Database', 'DevOps', 'Other'],
  },
  details: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  submissionTypes: [{
    type: String,
    enum: ['file', 'text', 'link'],
    required: true,
  }],
  submissions: [submissionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to check for late submissions
assignmentSchema.pre('save', function(next) {
  try {
    if (this.submissions && Array.isArray(this.submissions)) {
      this.submissions.forEach(submission => {
        if (submission.submittedAt && submission.submittedAt > this.deadline) {
          submission.isLate = true;
          if (submission.status === 'submitted') {
            submission.status = 'late_submitted';
          }
        }
      });
    }
   
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    next(error);
  }
});

export default mongoose.model("Assignment", assignmentSchema);