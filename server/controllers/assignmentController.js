import Assignment from '../models/assignmentModel.js';
import User from '../models/userModel.js';

// Get all assignments with user submission status
export const getAssignments = async (req, res) => {
  try {
    const userId = req.user.id;

    const assignments = await Assignment.find({});

    const assignmentsWithStatus = assignments.map(assignment => {
      const userSubmission = assignment.submissions.find(
        sub => sub.student.toString() === userId
      );

      let status = 'not_submitted';
      if (userSubmission) {
        status = userSubmission.status;
      } else if (new Date() > assignment.deadline) {
        status = 'overdue';
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
        submittedAt: userSubmission?.submittedAt,
        isLate: userSubmission?.isLate,
        marks: userSubmission?.marks,
        feedback: userSubmission?.feedback,
      };
    });

    res.json(assignmentsWithStatus);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get assignment details with submissions
export const getAssignmentDetails = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user.id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const userSubmission = assignment.submissions.find(
      sub => sub.student.toString() === userId
    );

    const assignmentData = {
      _id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      field: assignment.field,
      details: assignment.details,
      deadline: assignment.deadline,
      submissionTypes: assignment.submissionTypes,
      userSubmission: userSubmission ? {
        submissionType: userSubmission.submissionType,
        content: userSubmission.content,
        submittedAt: userSubmission.submittedAt,
        isLate: userSubmission.isLate,
        status: userSubmission.status,
        marks: userSubmission.marks,
        feedback: userSubmission.feedback,
        evaluatedAt: userSubmission.evaluatedAt,
      } : null,
    };

    res.json(assignmentData);
  } catch (error) {
    console.error('Error fetching assignment details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit an assignment
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { submissionType, content } = req.body;
    const userId = req.user.id;

    console.log('=== Assignment Submission ===');
    console.log('Assignment ID:', assignmentId);
    console.log('Student ID:', userId);
    console.log('Submission Type:', submissionType);
    console.log('Content Length:', content?.length || 0);
    console.log('Request Body:', req.body);

    const assignment = await Assignment.findById(assignmentId);
    console.log('Assignment found:', !!assignment);
    if (!assignment) {
      console.log('Assignment not found for ID:', assignmentId);
      return res.status(404).json({ message: 'Assignment not found' });
    }

    console.log('Assignment submission types:', assignment.submissionTypes);
    // Check if submission type is allowed
    if (!assignment.submissionTypes.includes(submissionType)) {
      console.log('Invalid submission type:', submissionType);
      return res.status(400).json({ message: 'Invalid submission type' });
    }

    // Check if user already submitted
    const existingSubmissionIndex = assignment.submissions.findIndex(
      sub => sub.student.toString() === userId
    );

    console.log('Existing submission index:', existingSubmissionIndex);

    const submittedAt = new Date();
    const isLate = submittedAt > assignment.deadline;
    const status = isLate ? 'late_submitted' : 'submitted';

    console.log('Is Late:', isLate);
    console.log('Status:', status);

    if (existingSubmissionIndex >= 0) {
      // Update existing submission
      assignment.submissions[existingSubmissionIndex].submissionType = submissionType;
      assignment.submissions[existingSubmissionIndex].content = content;
      assignment.submissions[existingSubmissionIndex].submittedAt = submittedAt;
      assignment.submissions[existingSubmissionIndex].isLate = isLate;
      assignment.submissions[existingSubmissionIndex].status = status;
      console.log('Updated existing submission');
    } else {
      // Add new submission
      assignment.submissions.push({
        student: userId,
        submissionType,
        content,
        submittedAt,
        isLate,
        status,
      });
      console.log('Added new submission');
    }

    console.log('Saving assignment...');
    await assignment.save();
    console.log('✅ Submission saved successfully');

    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      isLate,
      status,
      submittedAt,
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Evaluate assignment (demo feature)
export const evaluateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { studentId, marks, feedback } = req.body;
    
    // Use current user's ID if studentId is not properly provided
    const userId = studentId === 'current_user' ? req.user.id : studentId;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.find(
      sub => sub.student.toString() === userId
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = 'evaluated';
    submission.evaluatedAt = new Date();

    await assignment.save();

    console.log('=== Assignment Evaluated ===');
    console.log('Assignment ID:', assignmentId);
    console.log('Student ID:', userId);
    console.log('Marks:', marks);
    console.log('Feedback:', feedback);

    res.json({
      success: true,
      message: 'Assignment evaluated successfully',
      marks,
      feedback,
    });
  } catch (error) {
    console.error('Error evaluating assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get assignment summary for dashboard
export const getAssignmentSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const assignments = await Assignment.find({});
    const totalAssignments = assignments.length;

    let completedCount = 0;
    let totalMarks = 0;
    let evaluatedCount = 0;

    assignments.forEach(assignment => {
      const userSubmission = assignment.submissions.find(
        sub => sub.student.toString() === userId
      );

      if (userSubmission) {
        if (userSubmission.status === 'evaluated') {
          completedCount++;
          evaluatedCount++;
          totalMarks += userSubmission.marks || 0;
        } else if (userSubmission.status === 'submitted' || userSubmission.status === 'late_submitted') {
          completedCount++;
        }
      }
    });

    const averageScore = evaluatedCount > 0 ? Math.round(totalMarks / evaluatedCount) : 0;

    res.json({
      totalAssignments,
      completedAssignments: completedCount,
      averageScore,
      evaluatedAssignments: evaluatedCount,
    });
  } catch (error) {
    console.error('Error fetching assignment summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};