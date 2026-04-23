import Course from '../models/courseModel.js';
import UserProgress from '../models/userProgressModel.js';
import User from '../models/userModel.js';

// Get all courses with user progress
export const getCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all courses
    let courses = await Course.find({});

    // Calculate totalLessons if not set
    courses = courses.map(course => {
      if (!course.totalLessons || course.totalLessons === 0) {
        const calculated = course.modules.reduce((total, module) => total + module.lessons.length, 0);
        course.totalLessons = calculated;
      }
      return course;
    });

    console.log('=== Fetching Courses ===');
    courses.forEach(course => {
      console.log(`Course: ${course.name}, Total Lessons: ${course.totalLessons}`);
    });

    // Get user progress for each course
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const progress = await UserProgress.findOne({
          user: userId,
          course: course._id,
        });

        const completedLessons = progress?.completedLessons?.length || 0;
        const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
        const progressPercentage = totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

        return {
          _id: course._id,
          name: course.name,
          instructor: course.instructor,
          thumbnail: course.thumbnail,
          progressPercentage,
          attendancePercentage: progress?.attendancePercentage || 0,
          isCompleted: progressPercentage === 100,
          totalLessons,
          completedLessons,
        };
      })
    );

    res.json(coursesWithProgress);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get course details with modules and lessons
export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Calculate totalLessons when not set
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    
    console.log(`=== Course Details: ${course.name} ===`);
    console.log(`Total Lessons: ${totalLessons}`);

    const progress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    });

    // ✅ SAFE completed lessons
    const completedLessons = progress?.completedLessons || [];

    const completedLessonIds = new Set(
      completedLessons.map(
        (cl) => `${cl.moduleIndex}-${cl.lessonIndex}`
      )
    );

    // ✅ MODULE PROGRESS
    const modulesWithProgress = course.modules.map((module, moduleIndex) => {
      const completedLessonsInModule = module.lessons.filter((_, lessonIndex) =>
        completedLessonIds.has(`${moduleIndex}-${lessonIndex}`)
      ).length;

      const moduleProgress =
        module.lessons.length > 0
          ? Math.round(
              (completedLessonsInModule / module.lessons.length) * 100
            )
          : 0;

      return {
        name: module.name,
        progressPercentage: moduleProgress,
        isExpanded: false,
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          ...lesson.toObject(),
          isCompleted: completedLessonIds.has(
            `${moduleIndex}-${lessonIndex}`
          ),
        })),
      };
    });

    // ✅ COURSE PROGRESS (FIXED)
    const totalCompletedLessons = completedLessons.length;

    const courseProgress =
      totalLessons > 0
        ? Math.round((totalCompletedLessons / totalLessons) * 100)
        : 0;

    res.json({
      _id: course._id,
      name: course.name,
      instructor: course.instructor,
      thumbnail: course.thumbnail,
      modules: modulesWithProgress,
      progressPercentage: courseProgress,
      attendancePercentage: progress?.attendancePercentage || 0,
      totalLessons,
      completedLessons: totalCompletedLessons,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark lesson as complete
export const markLessonComplete = async (req, res) => {
  try {
    const { courseId, moduleIndex, lessonIndex } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.modules[moduleIndex] || !course.modules[moduleIndex].lessons[lessonIndex]) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Update or create user progress
    let progress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    });

    if (!progress) {
      progress = new UserProgress({
        user: userId,
        course: courseId,
        completedLessons: [],
        attendancePercentage: 0,
      });
    }

    // Check if lesson is already completed
    const existingCompletion = progress.completedLessons.find(
      cl => cl.moduleIndex === parseInt(moduleIndex) && cl.lessonIndex === parseInt(lessonIndex)
    );

    if (!existingCompletion) {
      progress.completedLessons.push({
        moduleIndex: parseInt(moduleIndex),
        lessonIndex: parseInt(lessonIndex),
        completedAt: new Date(),
      });
    }

    // Update attendance percentage based on completed lessons
    const attendancePercentage = course.totalLessons > 0
      ? Math.round((progress.completedLessons.length / course.totalLessons) * 100)
      : 0;
    progress.attendancePercentage = attendancePercentage;

    progress.lastAccessed = new Date();
    await progress.save();

    // Calculate updated progress
    const totalCompletedLessons = progress.completedLessons.length;
    
    // Calculate total lessons from modules (not stored totalLessons field)
    const calculatedTotalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    
    const courseProgress = calculatedTotalLessons > 0
      ? Math.round((totalCompletedLessons / calculatedTotalLessons) * 100)
      : 0;

    // Calculate module progress
    const module = course.modules[moduleIndex];
    const completedLessonsInModule = progress.completedLessons.filter(
      cl => cl.moduleIndex === parseInt(moduleIndex)
    ).length;
    const moduleProgress = module.lessons.length > 0
      ? Math.round((completedLessonsInModule / module.lessons.length) * 100)
      : 0;

    console.log('=== Lesson Completion Debug ===');
    console.log('Course ID:', courseId);
    console.log('Calculated Total Lessons:', calculatedTotalLessons);
    console.log('Completed Lessons:', totalCompletedLessons);
    console.log('Calculated Course Progress:', courseProgress);
    console.log('Module Progress:', moduleProgress);
    console.log('Module Index:', moduleIndex, 'Lesson Index:', lessonIndex);

    res.json({
      success: true,
      courseProgress,
      moduleProgress,
      totalCompletedLessons,
      attendancePercentage,
    });
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark course as complete (demo feature)
export const markCourseComplete = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create or update progress with all lessons completed
    let progress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    });

    if (!progress) {
      progress = new UserProgress({
        user: userId,
        course: courseId,
        completedLessons: [],
      });
    }

    // Mark all lessons as completed
    const allCompletedLessons = [];
    course.modules.forEach((module, moduleIndex) => {
      module.lessons.forEach((lesson, lessonIndex) => {
        allCompletedLessons.push({
          moduleIndex,
          lessonIndex,
          completedAt: new Date(),
        });
      });
    });

    progress.completedLessons = allCompletedLessons;
    progress.attendancePercentage = 100; // Set to 100% when course is completed
    progress.lastAccessed = new Date();
    await progress.save();

    // Calculate total lessons for response
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);

    console.log('=== Course Completion ===');
    console.log('Course:', course.name);
    console.log('Total Lessons Completed:', allCompletedLessons.length);
    console.log('Course Progress: 100%');

    res.json({
      success: true,
      message: 'Course marked as complete',
      progressPercentage: 100,
      attendancePercentage: 100,
      completedLessons: allCompletedLessons.length,
      totalLessons,
    });
  } catch (error) {
    console.error('Error marking course complete:', error);
    res.status(500).json({ message: 'Server error' });
  }
};