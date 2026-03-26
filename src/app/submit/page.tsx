"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SubmitPage() {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [error, setError] = useState("");

    const isValid = content.trim().length >= 10;

    const handleAnalyze = async () => {
        if (!isValid) return;
        setIsLoading(true);
        setAnalysisResult(null);
        setError("");

        try {
            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: content.trim() }),
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data);
            } else {
                const errData = await response.json();
                if (response.status === 401) {
                    setError("Please log in to verify claims.");
                    setTimeout(() => { window.location.href = "/login"; }, 2000);
                } else {
                    setError(errData.error || "Verification failed");
                }
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "VERIFIED": return "text-emerald-500";
            case "RELIABLE": return "text-blue-400";
            case "FLAGGED": return "text-amber-500";
            case "FAKE": return "text-red-500";
            default: return "text-slate-400";
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case "VERIFIED": return "bg-emerald-500/10 border-emerald-500/20";
            case "RELIABLE": return "bg-blue-500/10 border-blue-500/20";
            case "FLAGGED": return "bg-amber-500/10 border-amber-500/20";
            case "FAKE": return "bg-red-500/10 border-red-500/20";
            default: return "bg-slate-500/10 border-slate-500/20";
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status) {
            case "VERIFIED": return "Multiple independent sources corroborate this information. High confidence in accuracy.";
            case "RELIABLE": return "Some supporting evidence found across verified networks. Moderate confidence.";
            case "FLAGGED": return "Limited corroboration found. This claim should be treated with caution.";
            case "FAKE": return "No corroborating evidence found. This information is likely fabricated or heavily misleading.";
            default: return "Analysis complete.";
        }
    };

    return (
        <div className="dark transition-all duration-700">
            <div className="fixed inset-0 tech-grid pointer-events-none"></div>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            <Navbar />

            <main className="relative pt-40 pb-24 px-6 min-h-screen flex flex-col items-center">
                <div className="max-w-4xl w-full text-center space-y-8 mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-600/5 border border-blue-600/20 text-blue-500 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        Neural Processing Active
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-white">
                        Verify Any <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-indigo-400 to-indigo-300">Information Claim</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                        Paste any news headline, claim, or statement. Our AI engine will cross-reference it against verified sources to determine its credibility.
                    </p>
                </div>

                <div className="max-w-4xl w-full space-y-10">
                    {/* Text Input Area */}
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
                        <div className="relative glass-input rounded-[2rem] shadow-2xl overflow-hidden">
                            <div className="flex items-center gap-3 px-8 pt-6 pb-2">
                                <span className="material-symbols-outlined text-blue-500 text-xl">fact_check</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Enter your claim to verify</span>
                            </div>
                            <textarea
                                className="w-full px-8 pb-6 pt-2 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 font-display text-lg tracking-wide outline-none resize-none min-h-[150px]"
                                placeholder="Type or paste any claim, news headline, or statement here...

Example: &quot;Scientists discover water on Mars in 2024&quot;"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <div className="px-8 pb-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {content.length > 0 && (
                                        <span className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 ${isValid ? "text-emerald-500" : "text-slate-600"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${isValid ? "bg-emerald-500 animate-pulse" : "bg-slate-700"}`}></span>
                                            {content.trim().length} chars {isValid ? "— Ready" : "— Min 10 chars"}
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="bg-blue-600 hover:bg-blue-500 text-slate-950 px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 group/btn"
                                    onClick={handleAnalyze}
                                    disabled={!isValid || isLoading}
                                >
                                    <span className="text-sm uppercase tracking-widest">{isLoading ? "Analyzing" : "Verify Claim"}</span>
                                    <span className={`material-symbols-outlined text-xl transition-transform ${isLoading ? "animate-spin" : "group-hover/btn:translate-x-1"}`}>
                                        {isLoading ? "data_thresholding" : "cognition"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center py-4 px-6 rounded-2xl">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center py-20 space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-2 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-600 animate-pulse">radar</span>
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="font-mono text-sm tracking-[0.3em] text-blue-500 uppercase animate-pulse">Analyzing Claim</p>
                                <p className="text-xs text-slate-500 max-w-xs mx-auto">Cross-referencing against verified sources and fact-check databases...</p>
                            </div>
                        </div>
                    )}

                    {/* Analysis Result */}
                    {analysisResult && (
                        <div className="opacity-100 transform translate-y-0 transition-all duration-700 ease-out">
                            <div className="relative group/card overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-md metadata-glow">
                                <div className="p-8 flex flex-col gap-6">
                                    {/* Header with status and score */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-tighter ${getStatusColor(analysisResult.status)}`}>
                                                    {analysisResult.status}
                                                </span>
                                                <span className="text-slate-600 font-mono text-[10px]">// Analysis complete</span>
                                            </div>
                                            <h3 className="text-xl font-display font-semibold text-white leading-tight mb-2">
                                                {analysisResult.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Trust Score</div>
                                                <div className={`text-4xl font-display font-bold ${getStatusColor(analysisResult.status)}`}>{analysisResult.trustScore}%</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submitted claim text */}
                                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[14px]">format_quote</span>
                                            Submitted Claim
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed italic">
                                            &ldquo;{analysisResult.content}&rdquo;
                                        </p>
                                    </div>

                                    {/* Verdict */}
                                    <div className={`p-6 border rounded-2xl ${getStatusBg(analysisResult.status)}`}>
                                        <div className={`flex items-center gap-3 mb-2 ${getStatusColor(analysisResult.status)}`}>
                                            <span className="material-symbols-outlined">
                                                {analysisResult.status === "VERIFIED" ? "verified" :
                                                    analysisResult.status === "RELIABLE" ? "check_circle" :
                                                        analysisResult.status === "FLAGGED" ? "warning" : "dangerous"}
                                            </span>
                                            <span className="font-bold uppercase tracking-widest text-xs">
                                                {analysisResult.status === "VERIFIED" ? "Claim Verified" :
                                                    analysisResult.status === "RELIABLE" ? "Likely Reliable" :
                                                        analysisResult.status === "FLAGGED" ? "Caution Advised" : "Likely False"}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {analysisResult.aiAnalysis || getStatusMessage(analysisResult.status)}
                                        </p>
                                    </div>

                                    {/* Citations */}
                                    {JSON.parse(analysisResult.citations || "[]").length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-blue-400 mb-2">
                                                <span className="material-symbols-outlined text-lg">travel_explore</span>
                                                <span className="font-bold uppercase tracking-widest text-xs">Reference Sources</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {JSON.parse(analysisResult.citations || "[]").map((cite: any, i: number) => (
                                                    <a key={i} href={cite.url} target="_blank" rel="noopener noreferrer" className="group/link p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex justify-between items-center">
                                                        <div>
                                                            <div className="text-xs text-blue-400 font-bold mb-1">{cite.source}</div>
                                                            <div className="text-sm text-slate-200 group-hover/link:text-white transition-colors">{cite.title}</div>
                                                        </div>
                                                        <span className="material-symbols-outlined text-slate-600 group-hover/link:text-blue-500 transition-colors">open_in_new</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer with actions */}
                                    <div className="mt-4 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full border border-white/10 p-0.5">
                                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-400 text-sm">shield</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Scan ID</p>
                                                <p className="text-xs text-slate-200 font-mono">{analysisResult.id?.slice(0, 12)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => { setAnalysisResult(null); setContent(""); }}
                                                className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">refresh</span>
                                                New Check
                                            </button>
                                            <Link href={`/report?id=${analysisResult.id}`} className="text-blue-500 hover:text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                Full Report
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Cards */}
                <div className="max-w-5xl w-full mt-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link href="/learn" className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all border-t-blue-600/20">
                            <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-xl flex items-center justify-center mb-6 border border-blue-600/20 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all">
                                <span className="material-symbols-outlined">menu_book</span>
                            </div>
                            <h4 className="font-display font-bold text-xl mb-3 text-white">Education Hub</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">Master the methodologies used by bad actors to manipulate public perception.</p>
                        </Link>
                        <Link href="/sources" className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all border-t-indigo-500/20">
                            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                                <span className="material-symbols-outlined">database</span>
                            </div>
                            <h4 className="font-display font-bold text-xl mb-3 text-white">Bias Database</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">Access bias ratings for global news publications from the source explorer.</p>
                        </Link>
                        <Link href="/dashboard" className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all border-t-indigo-600/20">
                            <div className="w-12 h-12 bg-indigo-600/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6 border border-indigo-600/20 group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all">
                                <span className="material-symbols-outlined">history_toggle_off</span>
                            </div>
                            <h4 className="font-display font-bold text-xl mb-3 text-white">Analysis Log</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">Secure history of your past claim verifications and trend comparisons.</p>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
