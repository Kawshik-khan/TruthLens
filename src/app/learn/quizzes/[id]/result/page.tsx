"use client";

import Navbar from "@/components/Footer";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface QuizResult {
  success: boolean;
  score: number;
  totalPoints: number;
  scorePercentage: number;
  performanceLevel: string;
  results: Array<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
    explanation?: string;
  }>;
  progress: {
    id: string;
    completedAt: string;
    startedAt: string;
  };
  quiz: {
    title: string;
    category: string;
    difficulty: string;
  };
}

export default function QuizResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resultData = searchParams.get("data");
    if (resultData) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(resultData));
        setResult(parsedResult);
      } catch (error) {
        console.error("Failed to parse quiz result:", error);
        router.push("/learn/quizzes");
      }
    } else {
      router.push("/learn/quizzes");
    }
    setIsLoading(false);
  }, [searchParams, router]);

  const handleRetakeQuiz = () => {
    router.push(`/learn/quizzes/${params.id}`);
  };

  const handleBackToQuizzes = () => {
    router.push("/learn/quizzes");
  };

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case "EXCELLENT": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "GOOD": return "text-sky-400 bg-sky-500/10 border-sky-500/20";
      case "SATISFACTORY": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "NEEDS_IMPROVEMENT": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getPerformanceIcon = (level: string) => {
    switch (level) {
      case "EXCELLENT": return "emoji_events";
      case "GOOD": return "thumb_up";
      case "SATISFACTORY": return "check_circle";
      case "NEEDS_IMPROVEMENT": return "trending_up";
      default: return "quiz";
    }
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
          <p className="text-slate-400 uppercase tracking-[0.3em] font-mono text-xs">Loading Results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">error</span>
          <p className="text-slate-400 text-lg">No quiz results found</p>
        </div>
      </div>
    );
  }

  const timeTaken = Math.floor(
    (new Date(result.progress.completedAt).getTime() - new Date(result.progress.startedAt).getTime()) / 1000 / 60
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="material-symbols-outlined text-2xl text-indigo-400">quiz</span>
            <span className="text-lg font-bold text-white">Quiz Completed</span>
          </div>
          
          <h1 className="text-5xl font-black mb-4 text-white tracking-tighter leading-tight uppercase italic">
            {result.quiz.title}
          </h1>
          
          <div className="flex justify-center gap-4 mb-8">
            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${getCategoryColor(result.quiz.category)}`}>
              {result.quiz.category.replace('_', ' ')}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${getDifficultyColor(result.quiz.difficulty)}`}>
              {result.quiz.difficulty}
            </span>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 text-center">
            <p className="text-4xl font-bold text-indigo-400 mb-2">{result.scorePercentage}%</p>
            <p className="text-slate-500 text-sm uppercase tracking-wider">Score</p>
          </div>
          
          <div className="glass-panel rounded-2xl p-6 border border-white/5 text-center">
            <p className="text-4xl font-bold text-emerald-400 mb-2">{result.score}</p>
            <p className="text-slate-500 text-sm uppercase tracking-wider">Points Earned</p>
          </div>
          
          <div className="glass-panel rounded-2xl p-6 border border-white/5 text-center">
            <p className="text-4xl font-bold text-amber-400 mb-2">{result.totalPoints}</p>
            <p className="text-slate-500 text-sm uppercase tracking-wider">Total Points</p>
          </div>
          
          <div className="glass-panel rounded-2xl p-6 border border-white/5 text-center">
            <p className="text-4xl font-bold text-sky-400 mb-2">{timeTaken}m</p>
            <p className="text-slate-500 text-sm uppercase tracking-wider">Time Taken</p>
          </div>
        </div>

        {/* Performance Level */}
        <div className="glass-panel rounded-2xl p-8 border border-white/5 mb-12">
          <div className="flex items-center justify-center gap-6 mb-6">
            <span className={`material-symbols-outlined text-5xl ${getPerformanceColor(result.performanceLevel)}`}>
              {getPerformanceIcon(result.performanceLevel)}
            </span>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Performance: {result.performanceLevel}</h2>
              <p className="text-slate-400">
                {result.performanceLevel === "EXCELLENT" && "Outstanding work! You've mastered this topic."}
                {result.performanceLevel === "GOOD" && "Great job! You have a strong understanding."}
                {result.performanceLevel === "SATISFACTORY" && "Good effort! Consider reviewing the areas you missed."}
                {result.performanceLevel === "NEEDS_IMPROVEMENT" && "Keep practicing! Review the material and try again."}
              </p>
            </div>
          </div>
        </div>

        {/* Question Results */}
        <div className="glass-panel rounded-2xl border border-white/5 mb-12">
          <div className="p-8 border-b border-white/5">
            <h3 className="text-xl font-bold text-white mb-2">Question Review</h3>
            <p className="text-slate-400 text-sm">
              Review your answers and learn from the explanations
            </p>
          </div>
          
          <div className="divide-y divide-white/5">
            {result.results.map((questionResult, index) => (
              <div key={questionResult.questionId} className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    <span className={`material-symbols-outlined ${
                      questionResult.isCorrect 
                        ? "text-green-400 bg-green-500/10" 
                        : "text-red-400 bg-red-500/10"
                    }`}>
                      {questionResult.isCorrect ? "check" : "close"}
                    </span>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm font-bold text-slate-400">Question {index + 1}</span>
                      <span className="text-sm text-slate-500">{questionResult.points} points</span>
                    </div>
                    
                    <p className="text-white mb-4">{questionResult.questionText}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Your Answer:</p>
                        <p className={`p-3 rounded-lg ${
                          questionResult.isCorrect 
                            ? "bg-green-500/10 border-green-500/20 text-green-400" 
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}>
                          {questionResult.userAnswer || "No answer provided"}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Correct Answer:</p>
                        <p className="p-3 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 rounded-lg">
                          {questionResult.correctAnswer}
                        </p>
                      </div>
                    </div>
                    
                    {questionResult.explanation && (
                      <div className="mt-4">
                        <p className="text-sm font-bold text-slate-500 mb-2">Explanation:</p>
                        <p className="text-slate-400 text-sm leading-relaxed bg-slate-800/50 p-4 rounded-lg border border-white/5">
                          {questionResult.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-12">
          <button
            onClick={handleRetakeQuiz}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-slate-950 rounded-xl font-black text-sm tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-3"
          >
            <span className="material-symbols-outlined">refresh</span>
            Retake Quiz
          </button>
          
          <button
            onClick={handleBackToQuizzes}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-black text-sm tracking-widest uppercase transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Quizzes
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
