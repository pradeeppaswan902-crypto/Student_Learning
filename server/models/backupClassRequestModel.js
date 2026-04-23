import mongoose from "mongoose";

const learningSupportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["doubt", "backup"], // 🔥 VERY IMPORTANT
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  attachment: {
    type: String, // only for doubt (optional)
  },
  status: {
    type: String,
    enum: ["pending", "resolved"], // keep simple (PRD)
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LearningSupport", learningSupportSchema);