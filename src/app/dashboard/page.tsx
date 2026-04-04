"use client";

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

function computeTrustTier(avgScore: number): { label: string; level: number } {
    if (avgScore >= 85) return { label: "Trust Tier 1", level: 1 };
    if (avgScore >= 60) return { label: "Trust Tier 2", level: 2 };
    return { label: "Trust Tier 3", level: 3 };
}

export default function DashboardPage() {
    const [historyItems, setHistoryItems] = useState<any[]>([]);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [historyRes, userRes] = await Promise.all([
                    fetch("/api/submissions"),
                    fetch("/api/auth/me"),
                ]);

                if (historyRes.ok) {
                    const data = await historyRes.json();
                    setHistoryItems(data);
                }
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const avgScore = historyItems.length > 0
        ? Math.round(historyItems.reduce((acc, curr) => acc + curr.trustScore, 0) / historyItems.length)
        : 0;
    const trustTier = computeTrustTier(avgScore);

    return (
        <div className="flex min-h-screen bg-[#0b0b1a] grid-bg">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 max-w-7xl">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">User Dashboard</h2>
                        <p className="text-slate-400">Welcome back{user ? `, ${user.name}` : ""}. Monitoring global truth metrics.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">System Status</div>
                            <div className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Sync Active
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Glass Card */}
                <section className="glass rounded-2xl p-8 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                    <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white">{user?.name || "Loading..."}</h3>
                                <span className="bg-indigo-600/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-600/30">
                                    {historyItems.length > 0 ? trustTier.label : "New Member"}
                                </span>
                                {user?.role && (
                                    <span className="bg-slate-700/30 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-600/30">
                                        {user.role}
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-slate-500 text-xs font-semibold uppercase mb-1">Total Analysis</div>
                                    <div className="text-2xl font-bold text-indigo-500">{historyItems.length}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs font-semibold uppercase mb-1">Average Score</div>
                                    <div className="text-2xl font-bold text-white">
                                        {historyItems.length > 0 ? avgScore : "--"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs font-semibold uppercase mb-1">Member Since</div>
                                    <div className="text-2xl font-bold text-white">
                                        {user ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "--"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs font-semibold uppercase mb-1">Verified</div>
                                    <div className="text-2xl font-bold text-emerald-500">
                                        {historyItems.filter(i => i.status === "VERIFIED").length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Quick Actions */}
                <section className="mb-10">
                    <h3 className="text-xl font-bold text-white mb-6">AI Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="/analyze" className="group p-6 rounded-2xl border border-indigo-500/10 bg-indigo-600/[0.03] hover:bg-indigo-600/[0.06] transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-indigo-400">neurology</span>
                                </div>
                                <h4 className="text-sm font-bold text-white">AI Analyze</h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">Fake news detection, sentiment, summarization, claim extraction &amp; source credibility.</p>
                        </a>
                        <a href="/analyze" className="group p-6 rounded-2xl border border-purple-500/10 bg-purple-600/[0.03] hover:bg-purple-600/[0.06] transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-purple-400">smart_toy</span>
                                </div>
                                <h4 className="text-sm font-bold text-white">AI Chat</h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">Chat with our AI about fact-checking, media literacy, and misinformation detection.</p>
                        </a>
                        <a href="/submit" className="group p-6 rounded-2xl border border-cyan-500/10 bg-cyan-600/[0.03] hover:bg-cyan-600/[0.06] transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-cyan-400">fact_check</span>
                                </div>
                                <h4 className="text-sm font-bold text-white">Verify Claim</h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">Submit a claim for cross-reference verification against trusted sources.</p>
                        </a>
                    </div>
                </section>

                {/* History Section */}
                <section id="history">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Submission History</h3>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center py-20 text-slate-500 uppercase tracking-widest font-mono text-xs animate-pulse">
                                Retrieving Historical Data...
                            </div>
                        ) : historyItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-white/5 rounded-xl">
                                <span className="material-symbols-outlined text-4xl text-slate-700 mb-4">history</span>
                                <p className="text-slate-500 text-sm">No analysis history found.</p>
                                <Link href="/submit" className="mt-4 text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-widest">
                                    Start New Analysis
                                </Link>
                            </div>
                        ) : (
                            historyItems.map((item) => {
                                let sourceDisplay = "Text Claim";
                                try {
                                    if (item.url) sourceDisplay = new URL(item.url).hostname;
                                } catch { /* keep default */ }

                                return (
                                    <div
                                        key={item.id}
                                        className="group flex items-center gap-6 p-4 bg-slate-900/40 border border-white/5 rounded-xl hover:border-indigo-600/50 transition-all hover:bg-indigo-600/[0.02]"
                                    >
                                        <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-slate-800 relative flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-600 text-sm">{item.url ? "link" : "article"}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                                <span>{sourceDisplay}</span>
                                                <span>•</span>
                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="text-lg font-semibold truncate text-white group-hover:text-indigo-400 transition-colors">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Trust Score</div>
                                                <div className={`text-lg font-bold ${item.trustScore > 70 ? "text-emerald-500" : item.trustScore > 40 ? "text-amber-500" : "text-red-500"}`}>
                                                    {item.trustScore}/100
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded text-xs font-bold border ${item.status === "VERIFIED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                    item.status === "RELIABLE" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                                                        item.status === "FLAGGED" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                            "bg-red-500/10 text-red-500 border-red-500/20"
                                                }`}>
                                                {item.status}
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href="/analyze"
                                                    className="p-2 text-slate-500 hover:text-purple-400 hover:bg-purple-600/10 rounded transition-all"
                                                    title="AI Analysis"
                                                >
                                                    <span className="material-symbols-outlined">neurology</span>
                                                </Link>
                                                <Link
                                                    href={`/report?id=${item.id}`}
                                                    className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-600/10 rounded transition-all"
                                                    title="View Report"
                                                >
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
                <div className="mt-20">
                    <Footer />
                </div>
            </main>
        </div>
    );
}
