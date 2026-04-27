import Assignment from "../models/assignmentModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   GET ALL ASSIGNMENTS
========================= */
export const getAssignments = async (req, res) => {
  try {
    const userId = req.user.id;

    const assignments = await Assignment.find({});

    const assignmentsWithStatus = assignments.map((assignment) => {
      const userSubmission = assignment.submissions.find(
        (sub) => sub?.student?.toString() === userId
      );

      let status = "not_submitted";

      if (userSubmission) {
        status = userSubmission.status;
      } else if (new Date() > assignment.deadline) {
        status = "overdue";
      }

      return {
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        field: assignment.field,
        details: assignment.details,
        deadline: assignment.deadline,
        submissionTypes: assignment.submissionTypes,
        status,
        submittedAt: userSubmission?.submittedAt || null,
        isLate: userSubmission?.isLate || false,
        marks: userSubmission?.marks || 0,
        feedback: userSubmission?.feedback || "",
      };
    });

    res.json(assignmentsWithStatus);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ASSIGNMENT DETAILS
========================= */
export const getAssignmentDetails = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user.id;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const userSubmission = assignment.submissions.find(
      (sub) => sub?.student?.toString() === userId
    );

    res.json({
      _id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      field: assignment.field,
      details: assignment.details,
      deadline: assignment.deadline,
      submissionTypes: assignment.submissionTypes,
      userSubmission: userSubmission
        ? {
            submissionType: userSubmission.submissionType,
            content: userSubmission.content,
            submittedAt: userSubmission.submittedAt,
            isLate: userSubmission.isLate,
            status: userSubmission.status,
            marks: userSubmission.marks || 0,
            feedback: userSubmission.feedback || "",
            evaluatedAt: userSubmission.evaluatedAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching assignment details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   SUBMIT ASSIGNMENT
========================= */
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { submissionType } = req.body;
    const userId = req.user.id;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (!assignment.submissionTypes.includes(submissionType)) {
      return res.status(400).json({ message: "Invalid submission type" });
    }

    let content = req.body.content || "";

    // If file upload, store file URL as content
    if (submissionType === "file") {
      if (!req.file) {
        return res.status(400).json({ message: "File is required" });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "assignments",
            resource_type: "auto",
          },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        );
        stream.end(req.file.buffer);
      });

      content = result.secure_url;
    } else {
      if (!content || !content.trim()) {
        return res.status(400).json({ message: "Submission content is required" });
      }
    }

    const submittedAt = new Date();
    const isLate = submittedAt > assignment.deadline;
    const status = isLate ? "late_submitted" : "submitted";

    const existingIndex = assignment.submissions.findIndex(
      (sub) => sub?.student?.toString() === userId
    );

    if (existingIndex !== -1) {
      assignment.submissions[existingIndex] = {
        ...assignment.submissions[existingIndex],
        submissionType,
        content,
        submittedAt,
        isLate,
        status,
      };
    } else {
      assignment.submissions.push({
        student: userId,
        submissionType,
        content,
        submittedAt,
        isLate,
        status,
      });
    }

    await assignment.save();

    res.json({
      success: true,
      message: "Assignment submitted successfully",
      isLate,
      status,
      submittedAt,
      fileUrl: submissionType === "file" ? content : null,
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   EVALUATE ASSIGNMENT
========================= */
export const evaluateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { studentId, marks, feedback } = req.body;

    const userId = studentId === "current_user" ? req.user.id : studentId;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const submission = assignment.submissions.find(
      (sub) => sub?.student?.toString() === userId
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = "evaluated";
    submission.evaluatedAt = new Date();

    await assignment.save();

    res.json({
      success: true,
      message: "Assignment evaluated successfully",
      marks,
      feedback,
    });
  } catch (error) {
    console.error("Error evaluating assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DASHBOARD SUMMARY (FIXED)
========================= */
export const getAssignmentSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const assignments = await Assignment.find({});
    const totalAssignments = assignments.length;

    let completedAssignments = 0;
    let evaluatedAssignments = 0;
    let totalMarks = 0;

    assignments.forEach((assignment) => {
      const submission = assignment.submissions.find(
        (sub) => sub?.student?.toString() === userId
      );

      if (submission) {
        completedAssignments++;

        if (submission.status === "evaluated") {
          evaluatedAssignments++;
          totalMarks += submission.marks || 0;
        }
      }
    });

    const averageScore =
      evaluatedAssignments > 0
        ? Math.round(totalMarks / evaluatedAssignments)
        : 0;

    res.json({
      totalAssignments,
      completedAssignments,
      averageScore,
      evaluatedAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignment summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};