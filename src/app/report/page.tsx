"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ReportPage() {
    const reportLinks = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "History", href: "/dashboard#history" },
        { name: "Sources", href: "/sources" },
    ];

    const reportCTA = {
        name: "New Analysis",
        href: "/submit",
    };

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
                        <span className="text-indigo-300 text-[10px] font-bold tracking-[0.2em] uppercase">System Scan: #TL-8291-X</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-white max-w-4xl mx-auto">
                        Advanced Credibility Analysis Report
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-slate-500 font-mono text-sm">
                        <span className="material-symbols-outlined text-xs">link</span>
                        <span className="hover:text-indigo-400 transition-colors cursor-default whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] md:max-w-none">
                            https://financial-insight-news.net/reports/market-volatility-2024
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    <div className="lg:col-span-5 glass-panel p-10 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none"></div>
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[10px] border-slate-800/50 shadow-inner"></div>
                            {/* Radial Gauge Simulation */}
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle
                                    className="text-indigo-600"
                                    cx="128" cy="128" fill="transparent" r="118"
                                    stroke="currentColor" strokeWidth="10"
                                    strokeDasharray="741" strokeDashoffset="163"
                                    strokeLinecap="round"
                                ></circle>
                            </svg>
                            <div className="absolute inset-[15%] glass-panel rounded-full flex flex-col items-center justify-center border-slate-700/50 shadow-2xl">
                                <span className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">78<span className="text-3xl text-indigo-400">%</span></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Confidence Score</span>
                            </div>
                            <div className="absolute inset-[-10%] border border-indigo-500/10 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>
                        </div>
                        <div className="mt-10 text-center relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">High Credibility</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-light">AI validation confirms factual consistency with minor sensationalism markers.</p>
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
                                    <p className="text-slate-500 text-xs font-mono">NEURAL_ANALYSIS_COMPLETE_VER_4.0</p>
                                </div>
                            </div>
                            <p className="text-slate-300 text-lg leading-relaxed mb-10 font-light">
                                Content demonstrates a high degree of technical accuracy. Neural linguistic patterns detected <span className="text-cyan-400 font-semibold border-b border-cyan-400/30">moderate sensationalism</span> in header strings. Source authority is categorized as <span className="text-purple-400 font-semibold">Tier 1 Niche Financial</span>.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="glass-panel bg-slate-800/20 p-5 rounded-2xl border-white/5 group hover:border-cyan-400/50 transition-colors">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-sans">Fact Sync</span>
                                <span className="text-2xl font-bold text-cyan-400">92.4%</span>
                            </div>
                            <div className="glass-panel bg-slate-800/20 p-5 rounded-2xl border-white/5 group hover:border-indigo-400/50 transition-colors">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-sans">Source Rank</span>
                                <span className="text-2xl font-bold text-indigo-400">Top 15</span>
                            </div>
                            <div className="glass-panel bg-slate-800/20 p-5 rounded-2xl border-white/5 group hover:border-purple-400/50 transition-colors">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-sans">Bias Index</span>
                                <span className="text-2xl font-bold text-purple-400">0.14</span>
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
                                { label: "Network Age", value: "12.4 Standard Years", mono: true },
                                { label: "Entity Ownership", value: "Insight Media Group", bold: true, color: "text-cyan-400" },
                                { label: "Reputation Tag", value: "Verified_Reliable", badge: true, color: "bg-cyan-400/20 text-cyan-400 border-cyan-400/30" },
                                { label: "Domain Weight", value: "64.0 / 100", mono: true },
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
                            <h3 className="text-lg font-bold text-white tracking-wide uppercase">Linguistic Signals</h3>
                        </div>
                        <div className="space-y-8">
                            {[
                                { label: "Neutrality Coefficient", value: 85, color: "from-indigo-400 to-purple-400" },
                                { label: "Headline Hyperbole", value: 24, color: "bg-amber-400/80" },
                                { label: "Systemic Bias", value: 10, color: "bg-cyan-400/80" },
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

                <section className="mb-12">
                    <h3 className="text-sm font-black text-slate-600 mb-6 flex items-center gap-3 uppercase tracking-[0.3em] font-sans">
                        <span className="h-px w-8 bg-slate-800"></span>
                        External Verification Nodes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link className="group glass-panel p-6 rounded-2xl border-white/5 hover:border-indigo-400/50 transition-all flex items-center gap-6" href="/methodology">
                            <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center font-mono text-xl text-indigo-400 border border-white/5 shadow-inner">S</div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold group-hover:text-indigo-400 transition-colors flex items-center gap-2 uppercase tracking-tight">
                                    Snopes Archive
                                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                                </h4>
                                <p className="text-xs text-slate-500 mt-1 font-medium font-sans">Reference Match: Historical datasets confirmed.</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
                        </Link>
                        <Link className="group glass-panel p-6 rounded-2xl border-white/5 hover:border-purple-400/50 transition-all flex items-center gap-6" href="/methodology">
                            <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center font-mono text-xl text-purple-400 border border-white/5 shadow-inner">P</div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold group-hover:text-purple-400 transition-colors flex items-center gap-2 uppercase tracking-tight">
                                    Politifact Pulse
                                    <span className="material-symbols-outlined text-[14px]">token</span>
                                </h4>
                                <p className="text-xs text-slate-500 mt-1 font-medium font-sans">Claim Verification: No active flags detected.</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
                        </Link>
                    </div>
                </section>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-12 border-t border-white/5">
                    <Link href="/feedback" className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-full shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest border border-white/20">
                        <span className="material-symbols-outlined text-sm">share</span>
                        Broadcast Analysis
                    </Link>
                    <Link href="/methodology" className="w-full sm:w-auto px-10 py-4 glass-panel text-slate-300 font-black border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">database</span>
                        Methodology Data
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
