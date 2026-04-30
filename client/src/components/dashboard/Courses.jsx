import React, { useState, useEffect } from 'react';
import api from '../../confiq/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const { refreshDashboard } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };
const navigate = useNavigate();

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setSelectedCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to load course details');
    }
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const markCourseComplete = async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/complete`);

      // Update selected course state immediately
      if (selectedCourse && selectedCourse._id === courseId) {
        setSelectedCourse(prevCourse => ({
          ...prevCourse,
          progressPercentage: response.data.progressPercentage,
          modules: prevCourse.modules.map(module => ({
            ...module,
            progressPercentage: 100,
            lessons: module.lessons.map(lesson => ({
              ...lesson,
              isCompleted: true,
            })),
          })),
        }));
      }

      toast.success('Course marked as complete!');
      refreshDashboard();

      // Refresh courses list
      const coursesResponse = await api.get('/courses');
      setCourses(coursesResponse.data);
    } catch (error) {
      console.error('Error marking course complete:', error);
      toast.error('Failed to mark course complete');
    }
  };

  const markLessonComplete = async (courseId, moduleIndex, lessonIndex) => {
    try {
      const response = await api.post(
        `/courses/${courseId}/modules/${moduleIndex}/lessons/${lessonIndex}/complete`
      );

      // Record lesson view
      await api.post(`/courses/${courseId}/modules/${moduleIndex}/lessons/${lessonIndex}/view`);

      console.log('Lesson complete response:', response.data);

      // Update selected course state immediately with returned data
      if (selectedCourse && selectedCourse._id === courseId) {
        const modIdx = parseInt(moduleIndex);
        const lesIdx = parseInt(lessonIndex);

        setSelectedCourse(prevCourse => ({
          ...prevCourse,
          progressPercentage: response.data.courseProgress,
          completedLessons: response.data.totalCompletedLessons,
          modules: prevCourse.modules.map((module, idx) => {
            if (idx === modIdx) {
              return {
                ...module,
                progressPercentage: response.data.moduleProgress,
                lessons: module.lessons.map((lesson, lessonIdx) =>
                  lessonIdx === lesIdx
                    ? { ...lesson, isCompleted: true }
                    : lesson
                ),
              };
            }
            return module;
          }),
        }));
      }

      toast.success('Lesson marked as complete!');
      refreshDashboard();

      // Refresh courses list to update overall progress
      await fetchCourses();
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast.error('Failed to mark lesson complete');
    }
  };

 const fetchQuizForLesson = async (lesson) => {
  try {
    toast.success(`Quiz started for ${lesson.title}`);

    // 👉 Quiz page open karo
    navigate(`/quiz/${lesson._id}`);

  } catch (error) {
    console.error(error);
    toast.error("Failed to start quiz");
  }
};

  const toggleModuleExpansion = (moduleIndex) => {
    if (!selectedCourse) return;

    const updatedModules = selectedCourse.modules.map((module, index) => ({
      ...module,
      isExpanded: index === moduleIndex ? !module.isExpanded : module.isExpanded,
    }));

    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="space-y-6 my-0 ">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedCourse(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to Courses
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold">{selectedCourse.name}</h1>
            <p className="text-gray-600">by {selectedCourse.instructor}</p>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Course Progress</h2>
            <span className="text-2xl font-bold text-blue-600">
              {selectedCourse.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${selectedCourse.progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {selectedCourse.completedLessons} of {selectedCourse.totalLessons} lessons completed
          </p>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {selectedCourse.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="bg-white rounded-lg shadow">
              <div
                className="p-4 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => toggleModuleExpansion(moduleIndex)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{module.name}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {module.progressPercentage}% complete
                    </span>
                    <span className={`transform transition-transform ${module.isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${module.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {module.isExpanded && (
                <div className="p-4 space-y-3">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className={`p-4 border rounded-lg ${lesson.isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{lesson.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className={`px-2 py-1 rounded text-xs ${lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                              }`}>
                              {lesson.difficulty}
                            </span>
                            {lesson.isCompleted && (
                              <span className="text-green-600">✓ Completed</span>
                            )}
                          </div>
                        </div>
                        {!lesson.isCompleted && (
                          <button
                            onClick={() => markLessonComplete(selectedCourse._id, moduleIndex, lessonIndex)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>

                      {lesson.isCompleted && (
                        <div className="mt-3 space-y-2">
                          <div>
                            <strong>Video:</strong>
                            <a
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Watch Video
                            </a>
                          </div>

                          <div>
                            <strong>Notes:</strong>
                            <p className="text-sm text-gray-700 mt-1">
                              {lesson.notes}
                            </p>
                          </div>

                          {/* YAHI ADD KARNA HAI */}
                          <div className="mt-4">
                            <button
                              onClick={() => fetchQuizForLesson(lesson)}
                              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                            >
                              Start Quiz 
                            </button>
                          </div>

                          {lesson.codeLab && (
                            <div>
                              <strong>Code Lab:</strong>
                              <p className="text-sm text-gray-700 mt-1">
                                {lesson.codeLab}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-0">

  {/* Header */}
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold">My Courses</h1>
  </div>

  {/* Courses Grid (3/3 Equal Frame) */}
  <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6 items-stretch">

    {courses.map((course) => (
      <div
        key={course._id}
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

        {/* Thumbnail */}
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.name}
            className="w-full h-48 object-cover"
          />
        )}

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">

          {/* Top */}
          <div>
            <h3 className="text-xl font-semibold mb-2 line-clamp-2">
              {course.name}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-1">
              by {course.instructor}
            </p>
          </div>

          {/* Middle Progress Section */}
          <div className="space-y-4 flex-1">

            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{course.progressPercentage}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Attendance */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Attendance</span>
                <span>{course.attendancePercentage}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.attendancePercentage}%` }}
                />
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-6">

            <button
              onClick={() => fetchCourseDetails(course._id)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              View Course
            </button>

            <button
              onClick={() => markCourseComplete(course._id)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
              disabled={course.progressPercentage === 100}
            >
              {course.progressPercentage === 100
                ? "Completed"
                : "Mark Complete"}
            </button>

          </div>

        </div>
      </div>
    ))}

  </div>

  {/* Empty State */}
  {courses.length === 0 && (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">No courses available</p>
    </div>
  )}

</div>
  );
};

export default Courses;