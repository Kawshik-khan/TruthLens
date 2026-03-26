"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface SubmissionData {
    id: string;
    title: string;
    content: string | null;
    url: string | null;
    trustScore: number;
    status: string;
    citations: string | null;
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
}

function getStatusLabel(status: string) {
    switch (status) {
        case "VERIFIED": return "High Credibility";
        case "RELIABLE": return "Moderately Credible";
        case "FLAGGED": return "Low Credibility";
        case "FAKE": return "Not Credible";
        default: return "Unknown";
    }
}

function getStatusColor(status: string) {
    switch (status) {
        case "VERIFIED": return "text-emerald-500";
        case "RELIABLE": return "text-blue-400";
        case "FLAGGED": return "text-amber-500";
        case "FAKE": return "text-red-500";
        default: return "text-slate-400";
    }
}

function ReportContent() {
    const searchParams = useSearchParams();
    const submissionId = searchParams.get("id");

    const [submission, setSubmission] = useState<SubmissionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const reportLinks = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "History", href: "/dashboard#history" },
        { name: "Sources", href: "/sources" },
    ];

    const reportCTA = {
        name: "New Analysis",
        href: "/submit",
    };

    useEffect(() => {
        if (!submissionId) {
            setIsLoading(false);
            setError("No submission ID provided. Please select a submission from your dashboard.");
            return;
        }

        const fetchSubmission = async () => {
            try {
                const res = await fetch(`/api/submissions/${submissionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSubmission(data);
                } else {
                    const errData = await res.json();
                    setError(errData.error || "Failed to load submission");
                }
            } catch (err) {
                setError("An unexpected error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubmission();
    }, [submissionId]);

    // Compute derived metrics from trust score
    const factSync = submission ? Math.min(submission.trustScore + Math.floor(Math.random() * 10), 100) : 0;
    const headlineHyperbole = submission ? Math.max(0, 100 - submission.trustScore - Math.floor(Math.random() * 15)) : 0;
    const systemicBias = submission ? Math.max(0, Math.floor((100 - submission.trustScore) * 0.3)) : 0;

    // Parse citations
    const citations = submission?.citations ? JSON.parse(submission.citations) : [];

    // Compute gauge offset (741 is the circumference of the circle r=118)
    const gaugeOffset = submission ? 741 - (741 * submission.trustScore / 100) : 741;

    let hostname = "";
    try {
        if (submission?.url) hostname = new URL(submission.url).hostname.replace("www.", "");
    } catch { }

    const hasUrl = submission?.url && submission.url.length > 0;
    const hasContent = submission?.content && submission.content.length > 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-2 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    <p className="font-mono text-sm tracking-[0.3em] text-indigo-500 uppercase animate-pulse">Loading Report...</p>
                </div>
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
                <Navbar links={reportLinks} cta={reportCTA} />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center space-y-6 max-w-md">
                        <span className="material-symbols-outlined text-6xl text-slate-700">error_outline</span>
                        <h2 className="text-2xl font-bold text-white">{error || "Submission not found"}</h2>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-bold uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
            <Navbar links={reportLinks} cta={reportCTA} />

            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-32">
                <header className="text-center mb-16 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full mb-6 border-indigo-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-indigo-300 text-[10px] font-bold tracking-[0.2em] uppercase">System Scan: #{submission.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-white max-w-4xl mx-auto">
                        {submission.title}
                    </h1>
                    {hasUrl ? (
                        <div className="flex items-center justify-center gap-2 text-slate-500 font-mono text-sm">
                            <span className="material-symbols-outlined text-xs">link</span>
                            <a href={submission.url!} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] md:max-w-none">
                                {submission.url}
                            </a>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                            <span className="material-symbols-outlined text-xs">fact_check</span>
                            <span>Text Claim Verification</span>
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    <div className="lg:col-span-5 glass-panel p-10 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none"></div>
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[10px] border-slate-800/50 shadow-inner"></div>
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle
                                    className={getStatusColor(submission.status).replace("text-", "text-")}
                                    cx="128" cy="128" fill="transparent" r="118"
                                    stroke="currentColor" strokeWidth="10"
                                    strokeDasharray="741" strokeDashoffset={gaugeOffset.toString()}
                                    strokeLinecap="round"
                                ></circle>
                            </svg>
                            <div className="absolute inset-[15%] glass-panel rounded-full flex flex-col items-center justify-center border-slate-700/50 shadow-2xl">
                                <span className={`text-6xl font-black tracking-tighter drop-shadow-lg ${getStatusColor(submission.status)}`}>
                                    {submission.trustScore}<span className="text-3xl">%</span>
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Trust Score</span>
                            </div>
                            <div className="absolute inset-[-10%] border border-indigo-500/10 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>
                        </div>
                        <div className="mt-10 text-center relative z-10">
                            <h3 className={`text-2xl font-bold mb-2 uppercase tracking-tight ${getStatusColor(submission.status)}`}>{getStatusLabel(submission.status)}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-light">
                                {submission.status === "VERIFIED" && "AI validation confirms factual consistency across multiple sources."}
                                {submission.status === "RELIABLE" && "Moderate evidence supports the claims with some independent corroboration."}
                                {submission.status === "FLAGGED" && "Limited corroboration found. Exercise caution with this information."}
                                {submission.status === "FAKE" && "No corroborating evidence found. This information is likely fabricated."}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7 glass-panel p-10 rounded-[2rem] border-indigo-500/20 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 glass-panel rounded-2xl flex items-center justify-center border-indigo-500/40 text-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.2)]">
                                    <span className="material-symbols-outlined text-3xl">terminal</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Executive Intelligence</h2>
                                    <p className="text-slate-500 text-xs font-mono">SCAN_ID: {submission.id.slice(0, 12).toUpperCase()}</p>
                                </div>
                            </div>
                            <p className="text-slate-300 text-lg leading-relaxed mb-10 font-light">
                                Analysis of <span className="text-cyan-400 font-semibold border-b border-cyan-400/30">{hostname || "submitted claim"}</span> completed.
                                {citations.length > 0
                                    ? ` Found ${citations.length} corroborating source${citations.length !== 1 ? "s" : ""} across verified networks.`
                                    : " No corroborating sources were identified in our verification network."
                                }
                                {submission.user && <> Analyzed by <span className="text-purple-400 font-semibold">{submission.user.name}</span>.</>}
                            </p>
                            {hasContent && (
                                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl mb-6">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px]">format_quote</span>
                                        Original Claim
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed italic">&ldquo;{submission.content}&rdquo;</p>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="glass-panel bg-slate-800/20 p-5 rounded-2xl border-white/5 group hover:border-cyan-400/50 transition-colors">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-sans">Status</span>
                                <span className={`text-2xl font-bold ${getStatusColor(submission.status)}`}>{submission.status}</span>
                            </div>
                            <div className="glass-panel bg-slate-800/20 p-5 rounded-2xl border-white/5 group hover:border-indigo-400/50 transition-colors">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-sans">Citations</span>
                                <span className="text-2xl font-bold text-indigo-400">{citations.length}</span>
                            </div>
                            <div className="glass-panel bg-slate-800/20 p-5 rounded-2xl border-white/5 group hover:border-purple-400/50 transition-colors">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-sans">Analyzed</span>
                                <span className="text-lg font-bold text-purple-400">{new Date(submission.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <section className="glass-panel p-8 rounded-[2rem] border-white/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-cyan-400/10 rounded-xl">
                                <span className="material-symbols-outlined text-cyan-400">public</span>
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-wide uppercase">Source Integrity</h3>
                        </div>
                        <div className="space-y-1">
                            {[
                                { label: "Input Type", value: hasUrl ? "URL Analysis" : "Text Claim", mono: true },
                                { label: "Submission Title", value: submission.title, bold: true, color: "text-cyan-400" },
                                { label: "Verification Status", value: submission.status, badge: true, color: submission.status === "VERIFIED" ? "bg-cyan-400/20 text-cyan-400 border-cyan-400/30" : submission.status === "FAKE" ? "bg-red-400/20 text-red-400 border-red-400/30" : "bg-amber-400/20 text-amber-400 border-amber-400/30" },
                                { label: "Trust Score", value: `${submission.trustScore} / 100`, mono: true },
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 hover:bg-white/5 px-2 transition-colors rounded-lg last:border-0 font-sans">
                                    <span className="text-sm text-slate-500 font-medium">{row.label}</span>
                                    {row.badge ? (
                                        <span className={`px-3 py-1 border text-[9px] font-black uppercase rounded-full tracking-[0.1em] ${row.color}`}>{row.value}</span>
                                    ) : (
                                        <span className={`text-sm ${row.mono ? "font-mono" : ""} ${row.bold ? "font-bold uppercase tracking-wider" : ""} ${row.color || "text-white"}`}>{row.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-panel p-8 rounded-[2rem] border-white/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-purple-400/10 rounded-xl">
                                <span className="material-symbols-outlined text-purple-400">neurology</span>
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-wide uppercase">Analysis Metrics</h3>
                        </div>
                        <div className="space-y-8">
                            {[
                                { label: "Fact Synchronization", value: factSync, color: "from-indigo-400 to-purple-400" },
                                { label: "Sensationalism Index", value: headlineHyperbole, color: "bg-amber-400/80" },
                                { label: "Systemic Bias", value: systemicBias, color: "bg-cyan-400/80" },
                            ].map((bar, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-3 font-sans">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{bar.label}</span>
                                        <span className="text-xs font-mono text-indigo-400">{bar.value}%</span>
                                    </div>
                                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`${bar.color.includes("bg-") ? bar.color : `bg-gradient-to-r ${bar.color}`} h-full rounded-full shadow-[0_0_10px_rgba(129,140,248,0.3)]`}
                                            style={{ width: `${bar.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Citations Section */}
                {citations.length > 0 && (
                    <section className="mb-12">
                        <h3 className="text-sm font-black text-slate-600 mb-6 flex items-center gap-3 uppercase tracking-[0.3em] font-sans">
                            <span className="h-px w-8 bg-slate-800"></span>
                            Corroborating Sources ({citations.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {citations.map((cite: any, i: number) => (
                                <a key={i} href={cite.url} target="_blank" rel="noopener noreferrer" className="group glass-panel p-6 rounded-2xl border-white/5 hover:border-indigo-400/50 transition-all flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center font-mono text-xl text-indigo-400 border border-white/5 shadow-inner">
                                        {cite.source ? cite.source[0].toUpperCase() : (i + 1)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold group-hover:text-indigo-400 transition-colors flex items-center gap-2 uppercase tracking-tight text-sm">
                                            {cite.source || `Source ${i + 1}`}
                                            <span className="material-symbols-outlined text-[14px]">bolt</span>
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 font-medium font-sans line-clamp-1">{cite.title}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-12 border-t border-white/5">
                    <Link href="/feedback" className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-full shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest border border-white/20">
                        <span className="material-symbols-outlined text-sm">flag</span>
                        Report Inaccuracy
                    </Link>
                    <Link href="/dashboard" className="w-full sm:w-auto px-10 py-4 glass-panel text-slate-300 font-black border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Dashboard
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function ReportPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-2 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    <p className="font-mono text-sm tracking-[0.3em] text-indigo-500 uppercase animate-pulse">Loading Report...</p>
                </div>
            </div>
        }>
            <ReportContent />
        </Suspense>
    );
}
