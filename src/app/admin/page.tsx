"use client";

import AdminSidebar from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
    const [stats, setStats] = useState({
        totalSubmissions: 0,
        totalSources: 0,
        totalFeedback: 0,
        recentSubmissions: [] as any[],
    });
    const [advStats, setAdvStats] = useState({
        totalSearches: 0,
        topSearchers: [] as any[],
        topTopics: [] as any[],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [subsRes, sourcesRes, feedbackRes, advRes] = await Promise.all([
                    fetch("/api/admin/submissions"),
                    fetch("/api/admin/sources"),
                    fetch("/api/admin/feedback"),
                    fetch("/api/admin/stats"),
                ]);

                if (subsRes.ok && sourcesRes.ok && feedbackRes.ok && advRes.ok) {
                    const subs = await subsRes.json();
                    const sources = await sourcesRes.json();
                    const feedback = await feedbackRes.json();
                    const adv = await advRes.json();

                    setStats({
                        totalSubmissions: subs.length,
                        totalSources: sources.length,
                        totalFeedback: feedback.length,
                        recentSubmissions: subs.slice(0, 5),
                    });

                    setAdvStats(adv);
                }
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-300 grid-bg font-sans">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-10 max-w-7xl">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,1)]"></span>
                            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.3em]">System Online // Neural Link Established</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight leading-tight italic">Intelligence <br /><span className="text-sky-500">Operations Center</span></h1>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {/* Total Intelligence Searches Card */}
                    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group border-white/5 bg-sky-500/5 transition-all hover:bg-sky-500/10 hover:border-sky-500/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl text-sky-500">radar</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Global Searches</span>
                        </div>
                        <div className="flex items-end justify-between px-1">
                            <h3 className="text-4xl font-bold text-white mono-data glow-text-blue font-mono">{advStats.totalSearches}</h3>
                            <div className="text-[10px] font-bold text-sky-500 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20 font-mono">SYNCED</div>
                        </div>
                    </div>

                    {/* Pending Anomalies */}
                    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-white/[0.02] border-white/5 transition-all hover:bg-amber-500/5 hover:border-amber-500/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl text-amber-500">inbox</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Feedback Buffer</span>
                        </div>
                        <div className="flex items-end justify-between px-1">
                            <h3 className="text-4xl font-bold text-amber-500 mono-data glow-text-amber font-mono">{stats.totalFeedback}</h3>
                            <div className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20 font-mono">PENDING</div>
                        </div>
                    </div>

                    {/* Sources Card */}
                    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border-white/5 transition-all hover:bg-indigo-500/5 hover:border-indigo-500/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl text-slate-500">language</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Indexed Domains</span>
                        </div>
                        <div className="flex items-end justify-between px-1">
                            <h3 className="text-4xl font-bold text-white mono-data font-mono">{stats.totalSources}</h3>
                            <div className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10 font-mono">STABLE</div>
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-emerald-500/5 border-emerald-500/10">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl text-emerald-500">grid_view</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-black text-emerald-900/40 uppercase tracking-widest">Total Submissions</span>
                        </div>
                        <div className="flex items-end justify-between px-1">
                            <h3 className="text-4xl font-bold text-emerald-500 mono-data font-mono">{stats.totalSubmissions}</h3>
                            <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 font-mono">ACTIVE</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* User Activity Leaderboard */}
                    <div className="lg:col-span-2 glass-panel rounded-3xl border border-white/10 overflow-hidden bg-slate-900/40">
                        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3 italic">
                                <span className="material-symbols-outlined text-sky-400">groups</span>
                                Top Intelligence Operators
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold font-mono">Volume of Verification Sequences Initiated</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/40 text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">
                                        <th className="px-8 py-4">Operator Identity</th>
                                        <th className="px-8 py-4">Mission Email</th>
                                        <th className="px-8 py-4 text-right">Verification Count</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-sans">
                                    {advStats.topSearchers?.map((user: any, i: number) => (
                                        <tr key={i} className="hover:bg-sky-400/[0.02] transition-colors group">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-sky-400 border border-sky-400/20 group-hover:bg-sky-500 group-hover:text-white transition-all">
                                                        {i + 1}
                                                    </div>
                                                    <span className="font-bold text-white text-sm uppercase tracking-tight">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-xs font-mono text-slate-500">{user.email}</td>
                                            <td className="px-8 py-4 text-right">
                                                <span className="text-sm font-black font-mono text-sky-500">{user.searchCount}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {advStats.topSearchers?.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-10 text-center text-slate-600 font-mono text-xs uppercase tracking-widest italic">
                                                No operator activity recorded in the current cycle.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Search Topics */}
                    <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col bg-slate-900/40">
                        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3 italic">
                                <span className="material-symbols-outlined text-amber-500">trending_up</span>
                                Trending Topics
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold font-mono">High-Priority Intel Vectors</p>
                        </div>
                        <div className="flex-1 p-6 space-y-4">
                            {advStats.topTopics?.map((topic: any, i: number) => (
                                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-sky-500/30 transition-all hover:bg-white/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                                            Topic #{i + 1}
                                        </div>
                                        <div className="text-[10px] font-black text-sky-400 font-mono italic">{topic.count} Ref</div>
                                    </div>
                                    <div className="font-bold text-white text-xs uppercase leading-relaxed line-clamp-2 group-hover:text-sky-400 transition-colors">
                                        {topic.title}
                                    </div>
                                </div>
                            ))}
                            {advStats.topTopics?.length === 0 && (
                                <div className="h-full flex items-center justify-center p-10 text-center text-slate-600 font-mono text-[10px] uppercase tracking-[0.2em] italic leading-relaxed">
                                    Awaiting further intelligence data for vector analysis.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submissions Table - Redesigned */}
                <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 mb-12 bg-slate-900/40">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-3 italic">
                                <span className="material-symbols-outlined text-sky-400">dynamic_feed</span>
                                Active Intelligence Stream
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold font-mono">Real-time Cross-referencing Activity</p>
                        </div>
                        <Link href="/admin/review" className="px-5 py-2.5 text-xs font-bold bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-400/20 rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                            Global Review Interface
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="p-20 text-center text-slate-600 uppercase tracking-[0.3em] font-mono text-xs animate-pulse">Scanning Neural Network...</div>
                        ) : stats.recentSubmissions.length === 0 ? (
                            <div className="p-20 text-center text-slate-600 font-mono text-xs uppercase tracking-widest italic">No transmissions detected.</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/40 text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">
                                        <th className="px-8 py-5">Intel Descriptor</th>
                                        <th className="px-8 py-5">Trust Coefficient</th>
                                        <th className="px-8 py-5">Operator</th>
                                        <th className="px-8 py-5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-sans">
                                    {stats.recentSubmissions.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-sky-400/[0.03] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-sm group-hover:text-sky-400 transition-colors uppercase tracking-tight line-clamp-1">{item.title}</span>
                                                    <span className="text-[10px] text-slate-500 font-mono mt-1 truncate max-w-sm">{item.url}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 bg-white/5 h-1 rounded-full overflow-hidden border border-white/5">
                                                        <div
                                                            className={`h-full ${item.trustScore > 70 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : item.trustScore > 40 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`}
                                                            style={{ width: `${item.trustScore}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-xs font-bold font-mono ${item.trustScore > 70 ? "text-green-500" : item.trustScore > 40 ? "text-amber-500" : "text-red-500"}`}>{item.trustScore}%</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{item.user?.name || "System"}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === "VERIFIED" ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" : item.status === "FAKE" ? "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"}`}></span>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.status}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="mt-20">
                    <Footer />
                </div>
            </main>
        </div>
    );
}
