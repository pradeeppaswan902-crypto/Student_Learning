import React, { useState, useEffect } from 'react';
import api from '../../confiq/api'
import toast from 'react-hot-toast';

const LearningSupport = () => {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [activeTab, setActiveTab] = useState('doubt');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [doubtForm, setDoubtForm] = useState({
    course: '',
    topic: '',
    description: '',
    attachment: null,
  });

  const [backupForm, setBackupForm] = useState({
    course: '',
    topic: '',
    description: '',
  });

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      const course = response.data;
      const courseTopics = course.modules?.map(module => module.name) || [];
      setTopics(courseTopics);
    } catch {
      toast.error('Failed to load topics');
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
      } catch {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseChange = (formType, courseId) => {
    if (formType === 'doubt') {
      setDoubtForm({ ...doubtForm, course: courseId, topic: '' });
    } else {
      setBackupForm({ ...backupForm, course: courseId, topic: '' });
    }
    if (courseId) {
      fetchCourseDetails(courseId);
    } else {
      setTopics([]);
    }
  };

  const handleSubmit = async (formType) => {
    const form = formType === 'doubt' ? doubtForm : backupForm;

    if (!form.course || !form.topic || !form.description.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (formType === 'backup') {
        // ✅ Backup API
        const response = await api.post('/backup-classes/backup', {
          course: form.course,
          topic: form.topic,
          description: form.description,
        });

        if (response.status === 201) {
          toast.success('Backup class request submitted successfully!');
          setBackupForm({ course: '', topic: '', description: '' });
          setTopics([]);
        }

      } else {
        // ✅ 🔥 Doubt API (NEW)
        const formData = new FormData();
        formData.append('course', form.course);
        formData.append('topic', form.topic);
        formData.append('description', form.description);

        // optional file
        if (form.attachment) {
          formData.append('attachment', form.attachment);
        }

        const response = await api.post('/backup-classes/doubt', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          toast.success('Doubt request submitted successfully!');
          setDoubtForm({ course: '', topic: '', description: '', attachment: null });
          setTopics([]);
        }
      }

    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    // Added top margin (mt-6) for extra spacing as requested
    <div className="max-w-3xl mx-auto my-10 p-4 p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Learning Support</h2>
        <p className="text-gray-600 text-sm">Get help with your learning journey</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-4 bg-gray-100 rounded-md p-1">
        <button
          onClick={() => setActiveTab('doubt')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${activeTab === 'doubt'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Doubt Submission
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${activeTab === 'backup'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Backup Class Request
        </button>
      </div>

      {/* Doubt Submission Form - good size (reference) */}
      {activeTab === 'doubt' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md">
            <h3 className="text-lg font-semibold text-blue-800">Submit Your Doubt</h3>
            <p className="text-blue-600 text-sm">Get clarification on course topics</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Course <span className="text-red-500">*</span>
              </label>
              <select
                value={doubtForm.course}
                onChange={(e) => handleCourseChange('doubt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Choose a course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Topic <span className="text-red-500">*</span>
              </label>
              <select
                value={doubtForm.topic}
                onChange={(e) => setDoubtForm({ ...doubtForm, topic: e.target.value })}
                disabled={!doubtForm.course}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
              >
                <option value="">Choose a topic</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Describe Your Doubt <span className="text-red-500">*</span>
            </label>
            <textarea
              value={doubtForm.description}
              onChange={(e) => setDoubtForm({ ...doubtForm, description: e.target.value })}
              placeholder="Please describe your doubt in detail..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Attach Screenshot or File <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative -mt-2">
              <input
                type="file"
                onChange={(e) =>
                  setDoubtForm({ ...doubtForm, attachment: e.target.files[0] })
                }
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                id="doubt-file"
              />

              <label
                htmlFor="doubt-file"
                className="flex items-center justify-center w-full px-3 py-1 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition text-sm"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-5 w-5 text-gray-400 mb-1"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <p className="text-xs text-gray-600">
                    {doubtForm.attachment
                      ? doubtForm.attachment.name
                      : "Upload file"}
                  </p>

                  <p className="text-[10px] text-gray-500 mt-0.5">
                    PNG, JPG, PDF, DOC
                  </p>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={() => handleSubmit('doubt')}
            disabled={submitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 flex items-center justify-center text-sm"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Doubt'
            )}
          </button>
        </div>
      )}

      {/* Backup Class Request Form - equal size to doubt form */}
      {activeTab === 'backup' && (
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md">
            <h3 className="text-lg font-semibold text-green-800">Request Backup Class</h3>
            <p className="text-green-600 text-sm">Schedule a makeup session for missed classes</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Course <span className="text-red-500">*</span>
              </label>
              <select
                value={backupForm.course}
                onChange={(e) => handleCourseChange('backup', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="">Choose a course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Topic or Session <span className="text-red-500">*</span>
              </label>
              <select
                value={backupForm.topic}
                onChange={(e) => setBackupForm({ ...backupForm, topic: e.target.value })}
                disabled={!backupForm.course}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 text-sm disabled:bg-gray-100"
              >
                <option value="">Choose a topic or session</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Additional Details <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              value={backupForm.description}
              onChange={(e) => setBackupForm({ ...backupForm, description: e.target.value })}
              placeholder="Any additional information about the backup class request..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          {/* Spacer div to match the file upload section height from doubt form */}
          <div className="space-y-1 invisible">
            <label className="block text-sm font-medium text-gray-700">Spacer</label>
            <div className="w-full px-3 py-2 border-2 border-dashed border-transparent rounded-md">
              {/* Invisible spacer to equalize height */}
            </div>
          </div>

          <button
            onClick={() => handleSubmit('backup')}
            disabled={submitting}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 transition disabled:opacity-50 flex items-center justify-center text-sm"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              'Request Backup Class'
            )}
          </button>
        </div>
      )}
    </div>
  );
};


export default LearningSupport;
