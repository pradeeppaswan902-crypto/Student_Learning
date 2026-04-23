import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
    enum: ['Software Engineering', 'Data Science', 'Marketing', 'Finance', 'Design', 'Engineering', 'Other']
  },
  details: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  requiredSkills: [{
    type: String,
    required: true,
  }],
  applicationLink: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['job', 'internship'],
    default: 'job'
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Job", jobSchema);