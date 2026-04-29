import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../confiq/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Quizes = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { refreshDashboard } = useAuth(); // 🔥 IMPORTANT

  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [time, setTime] = useState(0);
  const [result, setResult] = useState(null);

  // ================= FETCH QUIZ =================
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/lesson/${lessonId}`);
        setQuiz(res.data);
        setTime(res.data.duration * 60);
      } catch (err) {
        toast.error("Quiz not found for this lesson");
      }
    };

    fetchQuiz();
  }, [lessonId]);

  // ================= TIMER =================
  useEffect(() => {
    if (!quiz) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  const formatTime = () => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const selectOption = (qIndex, optIndex) => {
    const copy = [...answers];
    copy[qIndex] = optIndex;
    setAnswers(copy);
  };

  // ================= SUBMIT QUIZ =================
  const submitQuiz = async () => {
    if (!quiz) return;

    try {
      const formattedAnswers = answers.map((ans, i) => ({
        questionIndex: i,
        selectedAnswers: [ans],
      }));

      const res = await api.post(`/quizzes/${quiz._id}/attempt`, {
        answers: formattedAnswers,
        timeTaken: quiz.duration * 60 - time,
      });

      setResult(res.data);

      // 🔥 IMPORTANT: dashboard update trigger
      refreshDashboard();

      toast.success("Quiz Submitted Successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Submit failed");
    }
  };

  // ================= LOADING =================
  if (!quiz)
    return <div className="pt-[80px] text-center">Loading...</div>;

  // ================= RESULT SCREEN =================
  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-[80px]">
        <div className="bg-white p-8 rounded shadow text-center w-96">

          <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>

          <p className="text-blue-600 text-xl font-bold">
            Score: {result.score}%
          </p>

          <p>Correct Answers: {result.correctCount}</p>
          <p>Wrong Answers: {result.incorrectCount}</p>

          <div className="flex flex-col gap-3 mt-5">

            <button
              onClick={() => {
                refreshDashboard(); // 🔥 ensure update
                navigate("/dashboard");
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Go to Dashboard
            </button>

            <button
              onClick={() => {
                setResult(null);
                setIndex(0);
                setAnswers([]);
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Retry Quiz
            </button>

          </div>
        </div>
      </div>
    );
  }

  const q = quiz.questions[index];

  return (
    <div className="min-h-screen bg-gray-100 pt-[80px] flex justify-center p-4">
      <div className="w-full max-w-3xl">

        {/* HEADER */}
        <div className="bg-white shadow p-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
            >
              ⬅ Back
            </button>

            <h1 className="font-bold">{quiz.title}</h1>
          </div>

          <span className="text-red-600 font-bold">
            ⏰ {formatTime()}
          </span>

        </div>

        {/* QUESTION */}
        <div className="bg-white mt-6 p-6 rounded shadow">

          <h2 className="text-xl font-semibold mb-4">
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <label key={i} className="block border p-3 rounded cursor-pointer">
                <input
                  type="radio"
                  checked={answers[index] === i}
                  onChange={() => selectOption(index, i)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>

          {/* NAV BUTTONS */}
          <div className="flex justify-between mt-6">

            <button
              onClick={() => setIndex((p) => Math.max(p - 1, 0))}
              disabled={index === 0}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Prev
            </button>

            {index === quiz.questions.length - 1 ? (
              <button
                onClick={submitQuiz}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={() => setIndex((p) => p + 1)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Quizes;