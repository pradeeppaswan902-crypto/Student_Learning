import React, { useState, useEffect } from 'react';
import api from '../../confiq/api';
import toast from 'react-hot-toast';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    submissionType: 'text',
    content: '',
  });

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);
      console.log('✅ Assignments fetched:', response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignmentDetails = async (assignmentId) => {
    try {
      const response = await api.get(`/assignments/${assignmentId}`);
      setSelectedAssignment(response.data);
      console.log('✅ Assignment details fetched:', response.data);
      
      // Pre-fill submission data if user has already submitted
      if (response.data.userSubmission) {
        setSubmissionData({
          submissionType: response.data.userSubmission.submissionType,
          content: response.data.userSubmission.content,
        });
      } else {
        setSubmissionData({ submissionType: 'text', content: '' });
      }
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      toast.error('Failed to load assignment details');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const submitAssignment = async () => {
    if (!submissionData.content.trim()) {
      toast.error('Please provide submission content');
      return;
    }

    setSubmitting(true);
    try {
      console.log('📤 Submitting assignment:', {
        assignmentId: selectedAssignment._id,
        ...submissionData
      });

      const response = await api.post(`/assignments/${selectedAssignment._id}/submit`, submissionData);
      
      console.log('✅ Submission successful:', response.data);
      toast.success('Assignment submitted successfully!');
      
      // Update selected assignment with new submission data
      const updatedAssignment = {
        ...selectedAssignment,
        userSubmission: {
          ...submissionData,
          submittedAt: response.data.submittedAt,
          isLate: response.data.isLate,
          status: response.data.status,
          marks: null,
          feedback: null,
          evaluatedAt: null,
        }
      };
      
      setSelectedAssignment(updatedAssignment);
      
      // Update the assignments list with new status
      setAssignments(prevAssignments =>
        prevAssignments.map(assignment =>
          assignment._id === selectedAssignment._id
            ? {
                ...assignment,
                status: response.data.status,
                submittedAt: response.data.submittedAt,
                isLate: response.data.isLate,
              }
            : assignment
        )
      );
      
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  // Simulate evaluation (mock instructor evaluation)
  const simulateEvaluation = async () => {
    if (!selectedAssignment.userSubmission || selectedAssignment.userSubmission.status === 'evaluated') {
      toast.error('Assignment cannot be evaluated');
      return;
    }

    setEvaluating(true);
    try {
      // Generate random marks between 70-95
      const marks = Math.floor(Math.random() * 26) + 70;
      const feedbackOptions = [
        "Great work! Your solution shows good understanding.",
        "Well done! Consider adding more comprehensive error handling next time.",
        "Excellent submission! Keep up the good work.",
        "Good effort! Your code structure is clean. Try to add more comments for clarity.",
        "Outstanding work! This demonstrates mastery of the topic.",
      ];
      const feedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];

      console.log('🎯 Simulating evaluation:', { marks, feedback });

      const response = await api.post(`/assignments/${selectedAssignment._id}/evaluate`, {
        studentId: 'current_user',
        marks,
        feedback,
      });

      console.log('✅ Evaluation successful:', response.data);
      toast.success('Assignment evaluated successfully!');

      // Update selected assignment with evaluation data
      const updatedAssignment = {
        ...selectedAssignment,
        userSubmission: {
          ...selectedAssignment.userSubmission,
          status: 'evaluated',
          marks: response.data.marks,
          feedback: response.data.feedback,
          evaluatedAt: new Date().toISOString(),
        }
      };

      setSelectedAssignment(updatedAssignment);

      // Update the assignments list with new status
      setAssignments(prevAssignments =>
        prevAssignments.map(assignment =>
          assignment._id === selectedAssignment._id
            ? {
                ...assignment,
                status: 'evaluated',
                marks: response.data.marks,
              }
            : assignment
        )
      );

    } catch (error) {
      console.error('Error evaluating assignment:', error);
      toast.error('Failed to evaluate assignment');
    } finally {
      setEvaluating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'not_submitted': return 'text-gray-600 bg-gray-100';
      case 'submitted': return 'text-green-600 bg-green-100';
      case 'late_submitted': return 'text-yellow-600 bg-yellow-100';
      case 'evaluated': return 'text-blue-600 bg-blue-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'not_submitted': return 'Not Submitted';
      case 'submitted': return 'Submitted';
      case 'late_submitted': return 'Late Submitted';
      case 'evaluated': return 'Evaluated';
      case 'overdue': return 'Overdue';
      default: return 'Unknown';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (deadline) => {
    return new Date() > new Date(deadline);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedAssignment) {
    return (
      <div className="space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedAssignment(null);
              setSubmissionData({ submissionType: 'text', content: '' });
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to Assignments
          </button>
          <div className="text-right my-4">
            <h1 className="text-2xl font-bold">{selectedAssignment.title}</h1>
            <div className="flex items-center gap-4 mt-2 flex-wrap justify-end">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAssignment.userSubmission?.status || 'not_submitted')}`}>
                {getStatusText(selectedAssignment.userSubmission?.status || 'not_submitted')}
              </span>
              <span className={`text-sm ${isOverdue(selectedAssignment.deadline) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                Deadline: {formatDate(selectedAssignment.deadline)}
              </span>
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Assignment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <strong>Field:</strong>
              <p className="text-gray-700">{selectedAssignment.field}</p>
            </div>
            <div>
              <strong>Deadline:</strong>
              <p className={`${isOverdue(selectedAssignment.deadline) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                {formatDate(selectedAssignment.deadline)}
              </p>
              {isOverdue(selectedAssignment.deadline) && !selectedAssignment.userSubmission && (
                <p className="text-red-600 text-sm mt-1">❌ Deadline has passed</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <strong>Description:</strong>
            <p className="text-gray-700 mt-2">{selectedAssignment.description}</p>
          </div>

          <div className="mb-4">
            <strong>Details:</strong>
            <p className="text-gray-700 mt-2">{selectedAssignment.details}</p>
          </div>

          <div>
            <strong>Submission Types Allowed:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedAssignment.submissionTypes.map(type => (
                <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {type === 'file' ? '📄 File Upload' : type === 'text' ? '📝 Text Input' : '🔗 External Link'}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Evaluation Results (if evaluated) */}
        {selectedAssignment.userSubmission?.status === 'evaluated' && (
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-lg font-semibold mb-4 text-green-800">✅ Evaluation Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Marks Awarded:</strong>
                <p className="text-3xl font-bold text-green-600">{selectedAssignment.userSubmission.marks}<span className="text-lg">/100</span></p>
              </div>
              <div>
                <strong>Evaluated At:</strong>
                <p className="text-gray-600">{formatDate(selectedAssignment.userSubmission.evaluatedAt)}</p>
              </div>
            </div>
            {selectedAssignment.userSubmission.feedback && (
              <div className="mt-4">
                <strong>📝 Instructor Feedback:</strong>
                <p className="text-gray-700 mt-2 p-3 bg-white rounded border italic">
                  "{selectedAssignment.userSubmission.feedback}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Submission Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Your Submission</h2>

          {selectedAssignment.userSubmission ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-medium">📅 Submitted At:</span>
                    <p className="text-sm text-gray-600">{formatDate(selectedAssignment.userSubmission.submittedAt)}</p>
                  </div>
                  {selectedAssignment.userSubmission.isLate && (
                    <span className="text-red-600 text-sm font-semibold">⚠️ LATE SUBMISSION</span>
                  )}
                </div>
                
                <div className="mb-3">
                  <span className="font-medium">📤 Submission Type:</span>
                  <span className="ml-2 text-gray-600">
                    {selectedAssignment.userSubmission.submissionType === 'file' ? '📄 File Upload' :
                     selectedAssignment.userSubmission.submissionType === 'text' ? '📝 Text Input' : '🔗 External Link'}
                  </span>
                </div>
                
                <div>
                  <span className="font-medium">Content:</span>
                  <div className="mt-2 p-3 bg-white rounded border text-gray-700 max-h-48 overflow-y-auto">
                    {selectedAssignment.userSubmission.submissionType === 'link' ? (
                      <a href={selectedAssignment.userSubmission.content} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:underline break-all">
                        🔗 {selectedAssignment.userSubmission.content}
                      </a>
                    ) : (
                      <pre className="whitespace-pre-wrap font-mono text-sm">{selectedAssignment.userSubmission.content}</pre>
                    )}
                  </div>
                </div>
              </div>

              {selectedAssignment.userSubmission.status !== 'evaluated' && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded border border-yellow-200">
                  <span className="text-yellow-600">⏳</span>
                  <p className="text-yellow-800">Your submission is pending evaluation.</p>
                  
                  {/* Demo: Evaluate Button */}
                  <button
                    onClick={simulateEvaluation}
                    disabled={evaluating}
                    className="ml-auto px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    {evaluating ? 'Evaluating...' : 'Simulate Evaluation (Demo)'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isOverdue(selectedAssignment.deadline) && (
                <div className="p-3 bg-red-50 rounded border border-red-200">
                  <p className="text-red-600 font-medium">❌ Submission Closed: Deadline has passed</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Submission Type</label>
                <select
                  value={submissionData.submissionType}
                  onChange={(e) => setSubmissionData({...submissionData, submissionType: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isOverdue(selectedAssignment.deadline)}
                >
                  {selectedAssignment.submissionTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'file' ? '📄 File Upload' : type === 'text' ? '📝 Text Input' : '🔗 External Link'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {submissionData.submissionType === 'file' ? '📄 File Path/URL' :
                   submissionData.submissionType === 'text' ? '📝 Text Content' : '🔗 External Link URL'}
                </label>
                {submissionData.submissionType === 'text' ? (
                  <textarea
                    value={submissionData.content}
                    onChange={(e) => setSubmissionData({...submissionData, content: e.target.value})}
                    placeholder="Enter your assignment content here..."
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    disabled={isOverdue(selectedAssignment.deadline)}
                  />
                ) : (
                  <input
                    type="url"
                    value={submissionData.content}
                    onChange={(e) => setSubmissionData({...submissionData, content: e.target.value})}
                    placeholder={submissionData.submissionType === 'file' ? 'Enter file path or upload URL' : 'Enter external link URL'}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isOverdue(selectedAssignment.deadline)}
                  />
                )}
              </div>

              <button
                onClick={submitAssignment}
                disabled={submitting || isOverdue(selectedAssignment.deadline)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-15">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📋 Assignments</h1>
        <span className="text-sm text-gray-600">{assignments.length} assignment(s)</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {assignments.map((assignment) => {
          const daysUntilDeadline = Math.ceil((new Date(assignment.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          const isOverdue = daysUntilDeadline < 0;
          
          return (
            <div 
              key={assignment._id} 
              className={`bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow ${isOverdue && !assignment.userSubmission ? 'border-l-4 border-red-600' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {assignment.field}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>

                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3 flex-wrap">
                    <span>📅 Deadline: {formatDate(assignment.deadline)}</span>
                    {daysUntilDeadline >= 0 ? (
                      <span className="text-blue-600">⏱️ {daysUntilDeadline} day(s) left</span>
                    ) : (
                      <span className="text-red-600 font-medium">⛔ {Math.abs(daysUntilDeadline)} day(s) overdue</span>
                    )}
                    {assignment.submittedAt && (
                      <span className="text-green-600">✓ Submitted: {formatDate(assignment.submittedAt)}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                      {getStatusText(assignment.status)}
                    </span>
                    {assignment.isLate && (
                      <span className="text-red-600 text-sm font-medium">⚠️ Late</span>
                    )}
                    {assignment.marks !== undefined && assignment.marks !== null && (
                      <span className="text-green-600 font-medium">
                        ⭐ Score: {assignment.marks}/100
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => fetchAssignmentDetails(assignment._id)}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">📭 No assignments available</p>
        </div>
      )}
    </div>
  );
};

export default Assignments;