"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

interface SourceData {
    id: string;
    domain: string;
    name: string;
    tier: string; // TRUSTED, QUESTIONABLE, DISINFO
    biasIndex: number;
    auditDate: string;
    auditor: string;
}

interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: string;
}

function getTierDisplay(tier: string) {
    switch (tier) {
        case "TRUSTED":
            return { label: "Trusted", color: "text-blue-500 bg-blue-500/10", borderColor: "text-blue-500 border-blue-600/30 bg-blue-600/5 shadow-[0_0_10px_rgba(59,130,246,0.2)]", barColor: "bg-blue-600/20 group-hover:bg-blue-600" };
        case "QUESTIONABLE":
            return { label: "Mixed", color: "text-amber-500 bg-amber-500/10", borderColor: "text-amber-500 border-amber-500/30 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.2)]", barColor: "bg-amber-500/20 group-hover:bg-amber-500" };
        case "DISINFO":
            return { label: "Untrusted", color: "text-purple-500 bg-purple-500/10", borderColor: "text-purple-500 border-purple-600/30 bg-purple-600/5 shadow-[0_0_10px_rgba(168,85,247,0.2)]", barColor: "bg-purple-500/20 group-hover:bg-purple-500" };
        default:
            return { label: tier, color: "text-slate-500 bg-slate-500/10", borderColor: "text-slate-500 border-slate-600/30 bg-slate-600/5", barColor: "bg-slate-500/20 group-hover:bg-slate-500" };
    }
}

function generateBars(): number[] {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 8) + 2);
}

export default function SourcesPage() {
    const [sources, setSources] = useState<SourceData[]>([]);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sourcesRes, userRes] = await Promise.all([
                    fetch("/api/sources"),
                    fetch("/api/auth/me"),
                ]);

                if (sourcesRes.ok) {
                    const data = await sourcesRes.json();
                    setSources(data);
                }
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Failed to fetch sources:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredSources = sources.filter(s =>
        s.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const trustedCount = sources.filter(s => s.tier === "TRUSTED").length;
    const mixedCount = sources.filter(s => s.tier === "QUESTIONABLE").length;
    const untrustedCount = sources.filter(s => s.tier === "DISINFO").length;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600/30 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="fixed inset-0 grid-bg pointer-events-none opacity-50"></div>
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative flex flex-col h-screen">
                {/* Header */}
                <header className="h-20 border-b border-white/5 glass-panel px-8 flex items-center justify-between shrink-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            <span className="material-symbols-outlined text-white text-2xl font-bold italic">insights</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">TruthLens <span className="text-blue-600 not-italic">Source Explorer</span></h1>
                    </div>
                    <div className="flex-1 max-w-2xl px-12">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                            <input
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-12 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none placeholder:text-slate-600 text-white"
                                placeholder="Search domain reputation (e.g. bbc.com, nytimes.com)..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded bg-slate-800 border border-slate-700">
                                <span className="text-[10px] font-black text-slate-500 tracking-tighter">⌘ K</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 transition-all flex items-center gap-2 text-slate-400 group">
                            <span className="material-symbols-outlined text-sm group-hover:text-blue-500">compare_arrows</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Compare</span>
                        </button>
                        <div className="h-8 w-[1px] bg-white/10"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-black uppercase tracking-tight text-white">{user?.name || "Guest"}</p>
                                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">{user?.role || "Anonymous"}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-blue-600/30 p-0.5 bg-slate-800 flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-400">
                                    {user?.name ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?"}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-80 border-r border-white/5 glass-panel overflow-y-auto p-8 space-y-12 shrink-0">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Reputation Category</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Trusted", count: trustedCount, active: true },
                                    { label: "Mixed Reliability", count: mixedCount },
                                    { label: "Untrustworthy", count: untrustedCount },
                                ].map((cat, i) => (
                                    <label key={i} className={`flex items-center justify-between group cursor-pointer ${!cat.active && "opacity-60 hover:opacity-100"} transition-all`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded border ${cat.active ? "bg-blue-600 border-blue-600" : "border-slate-700 bg-slate-900"} flex items-center justify-center transition-all`}>
                                                {cat.active && <span className="material-symbols-outlined text-[14px] text-slate-950 font-black">check</span>}
                                            </div>
                                            <span className={`text-sm font-bold uppercase tracking-tight ${cat.active ? "text-white" : "text-slate-500 group-hover:text-blue-500"}`}>{cat.label}</span>
                                        </div>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-500">{cat.count}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Neural Region</h3>
                            <div className="relative">
                                <select className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-white focus:ring-1 focus:ring-blue-600 outline-none appearance-none cursor-pointer">
                                    <option>Global Analysis</option>
                                    <option>North America</option>
                                    <option>European Union</option>
                                    <option>Asia Pacific</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Intelligence Focus</h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "Politics", active: true },
                                    { label: "Finance" },
                                    { label: "Science" },
                                    { label: "Technology" },
                                    { label: "Climate" },
                                ].map((tag, i) => (
                                    <span
                                        key={i}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${tag.active
                                            ? "bg-blue-600/10 text-blue-500 border-blue-600/30"
                                            : "bg-slate-900 text-slate-500 border-slate-800 hover:border-blue-600/50 hover:text-blue-500"
                                            }`}
                                    >
                                        {tag.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8">
                            <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-600/20 shadow-inner">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-blue-500 text-lg">verified_user</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Neural Verification</span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                                    TruthLens utilizing AI-driven sentiment and factual accuracy mapping to determine reputation scores in real-time.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Grid Area */}
                    <section className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-950/20">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Domain Intelligence</h2>
                                <p className="text-slate-500 text-sm mt-1">
                                    {isLoading ? "Loading sources..." : `Monitoring ${sources.length} indexed source${sources.length !== 1 ? "s" : ""}`}
                                </p>
                            </div>
                            <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5 shadow-inner">
                                <button className="px-5 py-2 bg-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-blue-600/20">Grid</button>
                                <button className="px-5 py-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">List</button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20 text-slate-500 uppercase tracking-widest font-mono text-xs animate-pulse">
                                Scanning Source Network...
                            </div>
                        ) : filteredSources.length === 0 && sources.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-white/5 rounded-xl">
                                <span className="material-symbols-outlined text-4xl text-slate-700 mb-4">database</span>
                                <p className="text-slate-500 text-sm mb-2">No sources indexed yet.</p>
                                <p className="text-slate-600 text-xs">Sources can be added by administrators via the admin panel.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredSources.map((source) => {
                                    const tierInfo = getTierDisplay(source.tier);
                                    const bars = generateBars();
                                    const reliability = Math.max(0, Math.min(100, (1 - source.biasIndex) * 100));

                                    return (
                                        <div key={source.id} className="glass-panel p-6 rounded-2xl border-white/5 hover:border-blue-600/40 transition-all cursor-pointer group bg-slate-900/40 hover:-translate-y-1 shadow-xl">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center p-2 shadow-inner group-hover:border-blue-500/50 transition-colors">
                                                        <span className="text-[10px] font-black text-white italic opacity-80">{source.name.slice(0, 3).toUpperCase()}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">{source.domain}</h4>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{source.name}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-[0.15em] border ${tierInfo.borderColor}`}>
                                                    {tierInfo.label}
                                                </span>
                                            </div>

                                            <div className="mb-8">
                                                <div className="flex justify-between items-end mb-3">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter italic">Reliability_Index</span>
                                                    <span className={`text-xs font-black ${tierInfo.color.split(" ")[0]}`}>{reliability.toFixed(1)}%</span>
                                                </div>
                                                <div className="h-12 w-full flex items-end gap-[3px] border-b border-white/5 pb-1">
                                                    {bars.map((h, bi) => (
                                                        <div
                                                            key={bi}
                                                            className={`flex-1 rounded-t-sm transition-all duration-500 ${tierInfo.barColor}`}
                                                            style={{ height: `${h * 10}%`, opacity: 0.3 + (bi / 6) * 0.7 }}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                                                <span className="group-hover:text-slate-300 transition-colors">Bias: {source.biasIndex.toFixed(2)}</span>
                                                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                    {new Date(source.auditDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Add Source Card */}
                                <div className="border-2 border-dashed border-slate-800 rounded-2xl hover:border-blue-600/40 hover:bg-blue-600/5 transition-all cursor-pointer group flex flex-col items-center justify-center p-8 min-h-[220px]">
                                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-blue-500 group-hover:border-blue-500/50 group-hover:scale-110 transition-all">
                                        <span className="material-symbols-outlined text-3xl">add</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-4 group-hover:text-white transition-colors">Submit_New_Node</span>
                                </div>
                            </div>
                        )}

                        {/* Status Footer */}
                        <div className="mt-16 flex items-center justify-between glass-panel px-8 py-4 rounded-xl border border-blue-600/10 bg-slate-900/40 shadow-2xl">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural Engine Operational</span>
                                </div>
                                <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Nodes:</span>
                                        <span className="text-[10px] font-black text-blue-500 uppercase">{sources.length} Active</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Filtered:</span>
                                        <span className="text-[10px] font-black text-blue-500 uppercase">{filteredSources.length}</span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Live data from database...</span>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
}
