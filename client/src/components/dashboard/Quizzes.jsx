import React, { useState, useEffect } from 'react';
import api from '../../confiq/api';
import toast from 'react-hot-toast';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    let timer;
    if (isQuizActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleQuizSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizActive, timeLeft]);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (quiz) => {
    try {
      const response = await api.get(`/quizzes/${quiz._id}`);
      setSelectedQuiz({ ...quiz, ...response.data });
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setTimeLeft(quiz.duration * 60); // Convert minutes to seconds
      setIsQuizActive(true);
      setResults(null);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz');
    }
  };

  const handleAnswerSelect = (questionIndex, selectedAnswers) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionIndex === questionIndex);

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionIndex, selectedAnswers };
    } else {
      newAnswers.push({ questionIndex, selectedAnswers });
    }

    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuizSubmit = async () => {
    try {
      const response = await api.post(`/quizzes/${selectedQuiz._id}/attempt`, {
        answers,
        timeTaken: selectedQuiz.duration * 60 - timeLeft,
      });

      setResults(response.data);
      setIsQuizActive(false);
      toast.success('Quiz submitted successfully!');

      // Refresh quizzes to update progress
      fetchQuizzes();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentAnswer = (questionIndex) => {
    const answer = answers.find(a => a.questionIndex === questionIndex);
    return answer ? answer.selectedAnswers : [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="space-y-6 ">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setResults(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to Quiz
          </button>
          <h1 className="text-2xl font-bold">Quiz Results</h1>
        </div>

        {/* Score Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">{results.score}%</div>
            <div className="text-xl text-gray-600 mb-4">
              {results.correctCount} correct, {results.incorrectCount} incorrect
            </div>
            <div className={`text-lg font-semibold ${results.isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {results.isPassed ? 'PASSED' : 'FAILED'}
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          {results.questions.map((question, index) => (
            <div key={index} className={`p-6 rounded-lg shadow ${question.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className="font-semibold mb-3">Question {index + 1}: {question.question}</h3>

              <div className="space-y-2 mb-4">
                {selectedQuiz.questions[index].options.map((option, optionIndex) => {
                  const isSelected = question.userAnswer.includes(optionIndex);
                  const isCorrect = question.correctAnswers.includes(optionIndex);

                  let optionClass = 'p-2 rounded border ';
                  if (isCorrect) {
                    optionClass += 'bg-green-100 border-green-300 text-green-800';
                  } else if (isSelected && !isCorrect) {
                    optionClass += 'bg-red-100 border-red-300 text-red-800';
                  } else {
                    optionClass += 'bg-gray-100 border-gray-300';
                  }

                  return (
                    <div key={optionIndex} className={optionClass}>
                      {option}
                      {isCorrect && <span className="ml-2 text-green-600">✓ Correct</span>}
                      {isSelected && !isCorrect && <span className="ml-2 text-red-600">✗ Your answer</span>}
                    </div>
                  );
                })}
              </div>

              {question.explanation && (
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isQuizActive && selectedQuiz) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const currentAnswer = getCurrentAnswer(currentQuestionIndex);

    return (
      <div className="space-y-6 my-10">
        {/* Quiz Header */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{selectedQuiz.title}</h1>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-600">Time Remaining</div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1} of {selectedQuiz.totalQuestions}</span>
            <span>{answers.length} answered</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentAnswer.includes(index);
              return (
                <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type={currentQuestion.type === 'single' ? 'radio' : 'checkbox'}
                    name={`question-${currentQuestionIndex}`}
                    checked={isSelected}
                    onChange={() => {
                      if (currentQuestion.type === 'single') {
                        handleAnswerSelect(currentQuestionIndex, [index]);
                      } else {
                        const newSelection = isSelected
                          ? currentAnswer.filter(i => i !== index)
                          : [...currentAnswer, index];
                        handleAnswerSelect(currentQuestionIndex, newSelection);
                      }
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="flex-1">{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
            <button
              onClick={handleQuizSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-16">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quizzes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
              <div className="text-gray-600 mb-4">
                <p>{quiz.totalQuestions} questions</p>
                <p>{quiz.duration} minutes</p>
              </div>

              {quiz.lastAttempt && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Last attempt:</p>
                  <p className="font-semibold">{quiz.lastAttempt.score}%</p>
                  <p className="text-xs text-gray-500">
                    {new Date(quiz.lastAttempt.completedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <button
                onClick={() => startQuiz(quiz)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {quiz.lastAttempt ? 'Retake Quiz' : 'Start Quiz'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No quizzes available</p>
        </div>
      )}
    </div>
  );
};

export default Quizzes;