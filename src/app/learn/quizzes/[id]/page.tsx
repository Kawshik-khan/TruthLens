"use client";

import Navbar from "@/components/Footer";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: string;
  options?: string;
  order: number;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeLimit: number;
  questionCount: number;
  totalPoints: number;
  attemptsCount: number;
  questions: QuizQuestion[];
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Array<{ answer: string }>>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted]);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`/api/quizzes/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setQuiz(data);
        setTimeLeft(data.timeLimit * 60); // Convert minutes to seconds
      } else {
        router.push("/learn/quizzes");
      }
    } catch (error) {
      console.error("Quiz fetch error:", error);
      router.push("/learn/quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setAnswers(new Array(quiz?.questions.length || 0).fill({ answer: "" }));
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = { answer };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${params.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      });

      if (res.ok) {
        const result = await res.json();
        router.push(`/learn/quizzes/${params.id}/result?data=${encodeURIComponent(JSON.stringify(result))}`);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to submit quiz");
      }
    } catch (error) {
      console.error("Quiz submission error:", error);
      alert("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "SYNTHETIC_MEDIA": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "ALGORITHMIC_BIAS": return "text-sky-400 bg-sky-500/10 border-sky-500/20";
      case "COGNITIVE_WARFARE": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "DATA_ETHICS": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "INTERMEDIATE": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "ADVANCED": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-400 uppercase tracking-[0.3em] font-mono text-xs">Loading Quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">error</span>
          <p className="text-slate-400 text-lg">Quiz not found</p>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Navbar />

      {!quizStarted ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-2xl mx-auto p-8">
            <div className="glass-panel rounded-3xl p-10 border border-white/10">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight uppercase italic">
                  {quiz.title}
                </h1>
                <div className="flex justify-center gap-4 mb-6">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${getCategoryColor(quiz.category)}`}>
                    {quiz.category.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <p className="text-slate-400 text-lg mb-8">{quiz.description}</p>
                
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-400">{quiz.questionCount}</p>
                    <p className="text-slate-500 text-sm">Questions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-400">{quiz.totalPoints}</p>
                    <p className="text-slate-500 text-sm">Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-400">{quiz.timeLimit}m</p>
                    <p className="text-slate-500 text-sm">Time Limit</p>
                  </div>
                </div>

                <button
                  onClick={handleStartQuiz}
                  className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-slate-950 rounded-xl font-black text-sm tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{quiz.title}</h2>
              <p className="text-slate-400">Question {currentQuestion + 1} of {quiz.questions.length}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className={`px-4 py-2 rounded-lg font-mono text-lg font-bold ${
                timeLeft < 60 ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-slate-400 bg-slate-500/10 border-slate-500/20"
              }`}>
                <span className="material-symbols-outlined mr-2">timer</span>
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={() => router.push("/learn/quizzes")}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
              >
                Exit Quiz
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="max-w-4xl mx-auto">
            <div className="glass-panel rounded-3xl p-10 border border-white/10">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  {currentQ.questionText}
                </h3>

                {currentQ.questionType === "MULTIPLE_CHOICE" && currentQ.options && (
                  <div className="space-y-4">
                    {JSON.parse(currentQ.options as string).map((option: string, index: number) => (
                      <label
                        key={index}
                        className="flex items-center p-4 bg-slate-800 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-700 hover:border-indigo-500/30 transition-all"
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={answers[currentQuestion]?.answer === option}
                          onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                          className="mr-4 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-300">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQ.questionType === "TRUE_FALSE" && (
                  <div className="space-y-4">
                    <label className="flex items-center p-4 bg-slate-800 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-700 hover:border-indigo-500/30 transition-all">
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value="True"
                        checked={answers[currentQuestion]?.answer === "True"}
                        onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                        className="mr-4 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-slate-300">True</span>
                    </label>
                    <label className="flex items-center p-4 bg-slate-800 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-700 hover:border-indigo-500/30 transition-all">
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value="False"
                        checked={answers[currentQuestion]?.answer === "False"}
                        onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                        className="mr-4 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-slate-300">False</span>
                    </label>
                  </div>
                )}

                {currentQ.questionType === "SHORT_ANSWER" && (
                  <textarea
                    value={answers[currentQuestion]?.answer || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Type your answer here..."
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm">
                    {currentQuestion + 1} / {quiz.questions.length}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {currentQ.points} points
                  </span>
                </div>

                {currentQuestion === quiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting || !answers[currentQuestion]?.answer}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-all disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    disabled={!answers[currentQuestion]?.answer}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-all disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
