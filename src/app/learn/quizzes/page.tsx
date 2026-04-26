"use client";

import Navbar from "@/components/Footer";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import { useState, useEffect } from "react";
import Link from "next/link";

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
  createdAt: string;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { value: "SYNTHETIC_MEDIA", label: "Synthetic Media" },
    { value: "ALGORITHMIC_BIAS", label: "Algorithmic Bias" },
    { value: "COGNITIVE_WARFARE", label: "Cognitive Warfare" },
    { value: "DATA_ETHICS", label: "Data Ethics" }
  ];

  const difficulties = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" }
  ];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, selectedCategory, selectedDifficulty, searchTerm]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("/api/quizzes");
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data.quizzes);
      }
    } catch (error) {
      console.error("Quizzes fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty);
    }

    setFilteredQuizzes(filtered);
  };

  const handleStartQuiz = (quizId: string) => {
    window.location.href = `/learn/quizzes/${quizId}`;
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-600 selection:text-white pb-32">
      <Navbar />

      <header className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase mb-10 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Interactive Quiz Hub
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-10 text-white tracking-tighter leading-[0.9] uppercase italic">
            Test Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-400 not-italic">Knowledge</span>
          </h1>

          <p className="text-xl text-slate-400 mb-14 max-w-3xl mx-auto font-light leading-relaxed">
            Challenge yourself with interactive quizzes covering synthetic media detection, algorithmic bias, cognitive warfare tactics, and data ethics principles.
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="relative group bg-slate-900/50 border border-white/5 rounded-2xl p-2 transition-all hover:border-indigo-500/30 focus-within:border-indigo-500 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <div className="flex items-center">
                <span className="material-symbols-outlined ml-4 text-slate-500">search</span>
                <input
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 px-4 py-3 text-lg font-medium"
                  placeholder="Search quizzes..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-indigo-600 hover:bg-indigo-500 text-slate-950 px-10 py-3.5 rounded-xl font-black text-xs tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20">
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-16">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? "" : cat.value)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase border transition-all ${
                  selectedCategory === cat.value
                    ? `bg-indigo-600 border-indigo-600 text-slate-950 shadow-lg shadow-indigo-600/20`
                    : "border-white/5 text-slate-500 hover:text-white hover:border-indigo-500/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {difficulties.map((diff, i) => (
              <button
                key={i}
                onClick={() => setSelectedDifficulty(selectedDifficulty === diff.value ? "" : diff.value)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase border transition-all ${
                  selectedDifficulty === diff.value
                    ? `bg-amber-600 border-amber-600 text-slate-950 shadow-lg shadow-amber-600/20`
                    : "border-white/5 text-slate-500 hover:text-white hover:border-amber-500/50"
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Available Quizzes</h2>
            <p className="text-slate-400">
              {filteredQuizzes.length} of {quizzes.length} quizzes found
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedDifficulty("");
                setSearchTerm("");
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 text-slate-500 uppercase tracking-[0.3em] font-mono text-xs animate-pulse">
              <span className="material-symbols-outlined animate-spin">refresh</span>
              Loading quiz database...
            </div>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">quiz</span>
            <p className="text-slate-500 text-lg italic mb-4">No quizzes found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedDifficulty("");
                setSearchTerm("");
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStartQuiz={handleStartQuiz}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
