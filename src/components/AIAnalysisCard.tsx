"use client";

interface AIAnalysisCardProps {
    title: string;
    icon: string;
    status: "idle" | "loading" | "success" | "error";
    accentColor: string; // e.g., "blue", "emerald", "amber", "purple", "rose", "cyan"
    children?: React.ReactNode;
    onAction?: () => void;
    actionLabel?: string;
    actionDisabled?: boolean;
}

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    blue: { bg: "bg-blue-500/5", border: "border-blue-500/20", text: "text-blue-400", glow: "shadow-blue-500/10" },
    emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", glow: "shadow-emerald-500/10" },
    amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-400", glow: "shadow-amber-500/10" },
    purple: { bg: "bg-purple-500/5", border: "border-purple-500/20", text: "text-purple-400", glow: "shadow-purple-500/10" },
    rose: { bg: "bg-rose-500/5", border: "border-rose-500/20", text: "text-rose-400", glow: "shadow-rose-500/10" },
    cyan: { bg: "bg-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400", glow: "shadow-cyan-500/10" },
};

export default function AIAnalysisCard({
    title,
    icon,
    status,
    accentColor,
    children,
    onAction,
    actionLabel,
    actionDisabled,
}: AIAnalysisCardProps) {
    const colors = colorMap[accentColor] || colorMap.blue;

    return (
        <div className={`relative group rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-lg ${colors.glow}`}>
            {/* Glow effect */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 ${colors.bg} blur-[80px] rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-700`}></div>

            {/* Header */}
            <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.bg} border ${colors.border}`}>
                        <span className={`material-symbols-outlined text-lg ${colors.text}`}>{icon}</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${status === "loading" ? "bg-amber-500 animate-pulse" :
                                status === "success" ? "bg-emerald-500" :
                                    status === "error" ? "bg-red-500" : "bg-slate-600"
                                }`}></span>
                            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">
                                {status === "loading" ? "Processing" :
                                    status === "success" ? "Complete" :
                                        status === "error" ? "Failed" : "Ready"}
                            </span>
                        </div>
                    </div>
                </div>

                {onAction && (
                    <button
                        onClick={onAction}
                        disabled={actionDisabled || status === "loading"}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed
                            ${status === "loading"
                                ? "bg-slate-800 text-slate-500"
                                : `${colors.bg} ${colors.text} border ${colors.border} hover:bg-opacity-20`
                            }`}
                    >
                        {status === "loading" ? (
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                Analyzing
                            </span>
                        ) : (
                            actionLabel || "Analyze"
                        )}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="relative p-6">
                {status === "loading" && !children && (
                    <div className="flex flex-col items-center py-8 space-y-4">
                        <div className="relative">
                            <div className={`w-12 h-12 border-2 border-slate-800 rounded-full`}>
                                <div className={`w-full h-full border-2 border-transparent border-t-current ${colors.text} rounded-full animate-spin`}></div>
                            </div>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 animate-pulse">
                            Running neural analysis...
                        </span>
                    </div>
                )}

                {status === "error" && !children && (
                    <div className="flex items-center gap-3 py-4 px-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                        <span className="material-symbols-outlined text-red-500">error</span>
                        <span className="text-sm text-red-400">Analysis failed. Please try again.</span>
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}
