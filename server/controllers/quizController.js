import Quiz from '../models/quizModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import UserProgress from '../models/userProgressModel.js';
import Course from '../models/courseModel.js';

// Get all quizzes for a user
export const getQuizzes = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all quizzes
    const quizzes = await Quiz.find({}).populate('course', 'name');

    // Get user's quiz attempts
    const attempts = await QuizAttempt.find({ user: userId });

    // Create a map of quiz attempts for quick lookup
    const attemptMap = {};
    attempts.forEach(attempt => {
      attemptMap[attempt.quiz.toString()] = attempt;
    });

    // Combine quiz data with attempt data
    const quizzesWithAttempts = quizzes.map(quiz => {
      const attempt = attemptMap[quiz._id.toString()];
      return {
        _id: quiz._id,
        title: quiz.title,
        duration: quiz.duration,
        totalQuestions: quiz.totalQuestions,
        course: quiz.course,
        lastAttempt: attempt ? {
          score: attempt.score,
          completedAt: attempt.completedAt,
          isPassed: attempt.isPassed,
        } : null,
      };
    });

    res.json(quizzesWithAttempts);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get quiz details (without answers)
export const getQuizDetails = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Return quiz without correct answers
    const quizData = {
      _id: quiz._id,
      title: quiz.title,
      duration: quiz.duration,
      totalQuestions: quiz.totalQuestions,
      questions: quiz.questions.map(q => ({
        question: q.question,
        type: q.type,
        options: q.options,
      })),
    };

    res.json(quizData);
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit quiz attempt
export const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let correctCount = 0;
    let incorrectCount = 0;

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers.find(a => a.questionIndex === index);
      if (userAnswer) {
        const isCorrect = question.correctAnswers.every(correct =>
          userAnswer.selectedAnswers.includes(correct)
        ) && userAnswer.selectedAnswers.every(answer =>
          question.correctAnswers.includes(answer)
        );

        if (isCorrect) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      } else {
        incorrectCount++;
      }
    });

    const score = Math.round((correctCount / quiz.totalQuestions) * 100);
    const isPassed = score >= 60; // Assuming 60% is passing

    // Save quiz attempt
    const attempt = new QuizAttempt({
      user: userId,
      quiz: quizId,
      answers,
      score,
      correctCount,
      incorrectCount,
      timeTaken,
      isPassed,
    });

    await attempt.save();

    // If quiz is part of a lesson, mark lesson as completed if passed
    if (quiz.lesson && isPassed) {
      // Find the course and lesson indices
      const course = await Course.findOne({ 'modules.lessons._id': quiz.lesson });
      if (course) {
        let moduleIndex = -1;
        let lessonIndex = -1;

        course.modules.forEach((module, mIdx) => {
          module.lessons.forEach((lesson, lIdx) => {
            if (lesson._id.toString() === quiz.lesson.toString()) {
              moduleIndex = mIdx;
              lessonIndex = lIdx;
            }
          });
        });

        if (moduleIndex !== -1 && lessonIndex !== -1) {
          // Update user progress
          let progress = await UserProgress.findOne({
            user: userId,
            course: course._id,
          });

          if (!progress) {
            progress = new UserProgress({
              user: userId,
              course: course._id,
              completedLessons: [],
            });
          }

          // Check if lesson is already completed
          const existingCompletion = progress.completedLessons.find(
            cl => cl.moduleIndex === moduleIndex && cl.lessonIndex === lessonIndex
          );

          if (!existingCompletion) {
            progress.completedLessons.push({
              moduleIndex,
              lessonIndex,
              completedAt: new Date(),
            });
            await progress.save();
          }
        }
      }
    }

    // Return results with explanations
    const results = {
      score,
      correctCount,
      incorrectCount,
      isPassed,
      questions: quiz.questions.map((question, index) => ({
        question: question.question,
        correctAnswers: question.correctAnswers,
        explanation: question.explanation,
        userAnswer: answers.find(a => a.questionIndex === index)?.selectedAnswers || [],
        isCorrect: (() => {
          const userAnswer = answers.find(a => a.questionIndex === index);
          if (!userAnswer) return false;
          return question.correctAnswers.every(correct =>
            userAnswer.selectedAnswers.includes(correct)
          ) && userAnswer.selectedAnswers.every(answer =>
            question.correctAnswers.includes(answer)
          );
        })(),
      })),
    };

    res.json(results);
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get quiz attempts for a user
export const getQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const attempts = await QuizAttempt.find({
      user: userId,
      quiz: quizId,
    }).sort({ completedAt: -1 });

    res.json(attempts);
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};