"use client";

import AdminSidebar from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Source {
  id: string;
  domain: string;
  name: string;
  tier: "TRUSTED" | "QUESTIONABLE" | "DISINFO";
  biasIndex: number;
  credibilityScore: number;
  category: string;
  region?: string;
  description?: string;
  lastUpdated: string;
  auditDate: string;
  auditor: string;
  biasHistory: Array<{
    biasIndex: number;
    tier: string;
    auditDate: string;
    auditor: string;
    reason?: string;
  }>;
}

export default function AdminSourcesPage() {
    const [sources, setSources] = useState<Source[]>([]);
    const [filteredSources, setFilteredSources] = useState<Source[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTier, setSelectedTier] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingSource, setEditingSource] = useState<Source | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<Source | null>(null);

  const categories = ["NEWS", "SOCIAL_MEDIA", "BLOG", "FORUM", "GOVERNMENT", "EDUCATIONAL"];
  const tiers = ["TRUSTED", "QUESTIONABLE", "DISINFO"];
    const [selectedSource, setSelectedSource] = useState<any>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const res = await fetch("/api/admin/sources");
                if (res.ok) {
                    const data = await res.json();
                    setSources(data);
                }
            } catch (error) {
                console.error("Sources fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSources();
    }, []);

    const handleEdit = (source: any) => {
        setSelectedSource(source);
        setIsPanelOpen(true);
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 ml-72 flex flex-col min-w-0 relative">
                <header className="h-20 border-b border-indigo-600/10 flex items-center justify-between px-8 bg-slate-900/50 shrink-0">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="relative w-full max-w-md">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-xl">search</span>
                            <input
                                className="w-full bg-slate-900/50 border border-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-lg pl-10 py-2 text-sm text-white outline-none transition-all"
                                placeholder="Search domain, entity or reputation score..."
                                type="text"
                            />
                        </div>
                    </div>
                    <button className="ml-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-indigo-600/20 transition-all whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Source
                    </button>
                </header>

                <div className="flex-1 overflow-hidden flex flex-col p-8">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">Source Management</h1>
                            <p className="text-slate-500 text-sm">Overseeing {sources.length} indexed intelligence nodes</p>
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-900/40 rounded-xl border border-indigo-600/10 overflow-hidden flex flex-col shadow-2xl">
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            {isLoading ? (
                                <div className="flex justify-center py-20 text-slate-500 uppercase tracking-widest font-mono text-xs animate-pulse">
                                    Scanning Global Sources...
                                </div>
                            ) : sources.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <span className="material-symbols-outlined text-4xl text-slate-700 mb-4">public_off</span>
                                    <p className="text-slate-500 text-sm italic">No intelligence sources indexed.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-slate-900 z-10 border-b border-indigo-600/10">
                                        <tr className="text-[11px] uppercase tracking-widest text-slate-500">
                                            <th className="px-6 py-4 font-semibold">Source / Domain</th>
                                            <th className="px-6 py-4 font-semibold">Reputation Tier</th>
                                            <th className="px-6 py-4 font-semibold text-center">Bias Index</th>
                                            <th className="px-6 py-4 font-semibold">Last Audit</th>
                                            <th className="px-6 py-4 font-semibold text-right">Ops</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-indigo-600/5">
                                        {sources.map((source) => (
                                            <tr
                                                key={source.id}
                                                className="hover:bg-indigo-600/5 cursor-pointer transition-all group"
                                                onClick={() => handleEdit(source)}
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shadow-inner">
                                                            <span className="material-symbols-outlined text-indigo-500 text-lg">language</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{source.domain}</p>
                                                            <p className="text-xs text-slate-500 italic font-light">{source.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-2 py-1 rounded border text-[10px] font-black uppercase tracking-tight ${source.tier === "TRUSTED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                        source.tier === "QUESTIONABLE" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                            "bg-red-500/10 text-red-400 border-red-500/20"
                                                        }`}>
                                                        {source.tier}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                                            <div className="h-full bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.3)]" style={{ width: `${(1 - source.biasIndex) * 100}%` }}></div>
                                                        </div>
                                                        <span className="text-[10px] mt-1 font-bold text-slate-500 uppercase tracking-tighter">SCORE: {source.biasIndex}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs font-bold text-slate-300">{new Date(source.auditDate).toLocaleDateString()}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">{source.auditor}</p>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-indigo-400 transition-colors">more_vert</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Audit Log Preview Segment */}
                    <div className="mt-8 flex gap-8 items-start h-40 shrink-0">
                        <div className="flex-1 bg-slate-900 border border-indigo-600/10 rounded-xl p-6 flex flex-col shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-indigo-500">history</span>
                                    Audit Log Stream
                                </h3>
                                <Link className="text-[10px] text-indigo-500 font-bold hover:underline uppercase tracking-widest" href="/admin/cms">View All</Link>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                <div className="flex items-start gap-3 text-xs border-l-2 border-indigo-600/30 pl-3 py-1">
                                    <p className="text-slate-500 whitespace-nowrap font-mono">Live</p>
                                    <p className="text-slate-300">System <span className="text-indigo-500 font-bold uppercase tracking-tight">Scanner</span> monitoring {sources.length} intelligence nodes</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-72 bg-indigo-600/5 border border-indigo-600/20 rounded-xl p-6 flex flex-col justify-between shadow-xl">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">System Health</p>
                                <p className="text-3xl font-black tracking-tighter text-white">99.9%</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] text-slate-500 font-bold uppercase italic tracking-tight">Active Scanners</p>
                                <div className="flex gap-1 h-8 items-end">
                                    {[4, 6, 3, 7, 5].map((h, i) => (
                                        <div key={i} className="w-1.5 bg-indigo-600 rounded-full" style={{ height: `${h * 10}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Panel (Edit Source) */}
                {isPanelOpen && (
                    <div className="absolute inset-y-0 right-0 w-[450px] bg-slate-900 border-l border-indigo-600/20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-[100] flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-8 border-b border-indigo-600/10 flex items-center justify-between bg-slate-950/50">
                            <div>
                                <h2 className="text-xl font-bold uppercase tracking-tight text-white italic">Intelligence Node</h2>
                                <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase mt-1">{selectedSource?.domain}</p>
                            </div>
                            <button
                                onClick={() => setIsPanelOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Node Information</p>
                                <div className="p-6 bg-slate-950 border border-white/5 rounded-xl space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-slate-500">Domain</span>
                                        <span className="text-xs font-bold text-white uppercase">{selectedSource?.domain}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-slate-500">Identity</span>
                                        <span className="text-xs font-bold text-white uppercase">{selectedSource?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-slate-500">Reputation Tier</span>
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${selectedSource?.tier === "TRUSTED" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                            }`}>{selectedSource?.tier}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">Auditor Metadata</label>
                                <textarea
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none min-h-[150px] resize-none font-light leading-relaxed"
                                    value={selectedSource?.auditLog || "Verified via standard automated audit protocols. No significant anomalies detected."}
                                    readOnly
                                ></textarea>
                                <p className="text-[10px] text-slate-600 italic font-medium uppercase tracking-tighter">Verified by {selectedSource?.auditor} on {new Date(selectedSource?.auditDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="p-8 border-t border-indigo-600/10 bg-slate-950/80">
                            <button
                                onClick={() => setIsPanelOpen(false)}
                                className="w-full py-4 rounded-xl bg-slate-800 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-all text-white"
                            >
                                DISMISS NODE
                            </button>
                        </div>
                    </div>
                )}
                <div className="p-8">
                    <Footer />
                </div>
            </main>
        </div>
    );
}
