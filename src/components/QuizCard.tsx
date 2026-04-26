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

interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz: (quizId: string) => void;
}

export default function QuizCard({ quiz, onStartQuiz }: QuizCardProps) {
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "SYNTHETIC_MEDIA": return "Synthetic Media";
      case "ALGORITHMIC_BIAS": return "Algorithmic Bias";
      case "COGNITIVE_WARFARE": return "Cognitive Warfare";
      case "DATA_ETHICS": return "Data Ethics";
      default: return category;
    }
  };

  return (
    <div className="glass-panel group rounded-3xl overflow-hidden transition-all duration-500 flex flex-col bg-slate-900/40 border-white/5 hover:border-indigo-500/40 shadow-2xl">
      <div className="p-8 flex-grow">
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-lg ${getCategoryColor(quiz.category)}`}>
              {getCategoryLabel(quiz.category)}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-lg ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px]">timer</span>
            {quiz.timeLimit}m
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-400 transition-colors tracking-tight leading-tight uppercase italic">
          {quiz.title}
        </h3>

        <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
          {quiz.description}
        </p>

        <div className="flex items-center gap-6 mb-6 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined">quiz</span>
            <span>{quiz.questionCount} Questions</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined">stars</span>
            <span>{quiz.totalPoints} Points</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined">groups</span>
            <span>{quiz.attemptsCount} Attempts</span>
          </div>
        </div>
      </div>

      <div className="p-8 pt-0">
        <button
          onClick={() => onStartQuiz(quiz.id)}
          className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-slate-950 rounded-xl font-black text-xs tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 group-hover:gap-5"
        >
          <span className="material-symbols-outlined text-lg">play_arrow</span>
          Start Quiz
        </button>
      </div>
    </div>
  );
}
