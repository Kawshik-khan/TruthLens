"use client";

import AdminSidebar from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminReviewPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch("/api/admin/submissions");
                if (res.ok) {
                    const data = await res.json();
                    setSubmissions(data);
                }
            } catch (error) {
                console.error("Admin fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 digital-grid font-sans">
            <AdminSidebar />

            <main className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 border-b border-indigo-600/10 flex items-center justify-between px-8 bg-slate-950/30 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold uppercase tracking-tight text-white">Review Queue</h2>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Live Monitor Active</span>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* Column Headers */}
                    <div className="grid grid-cols-12 gap-4 px-6 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <div className="col-span-5">URL / Headline</div>
                        <div className="col-span-2">Trust Score</div>
                        <div className="col-span-2">User</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center py-20 text-slate-500 uppercase tracking-widest font-mono text-xs animate-pulse">
                                Initializing Global Data Stream...
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-white/5 rounded-xl">
                                <span className="material-symbols-outlined text-4xl text-slate-700 mb-4">analytics</span>
                                <p className="text-slate-500 text-sm italic">No submissions awaiting review.</p>
                            </div>
                        ) : (
                            submissions.map((item) => (
                                <div key={item.id} className="glass-panel rounded-xl p-6 grid grid-cols-12 gap-4 items-center hover:border-indigo-600/30 transition-all">
                                    <div className="col-span-5 flex items-start gap-4">
                                        <div className="mt-1">
                                            <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-slate-100 mb-1 leading-tight hover:text-indigo-400 cursor-pointer transition-colors truncate">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 truncate font-mono">
                                                <span className="material-symbols-outlined text-[14px]">link</span>
                                                {item.url}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 flex items-center justify-center">
                                                <svg className="w-full h-full -rotate-90">
                                                    <circle className="text-slate-800" cx="20" cy="20" fill="transparent" r="18" stroke="currentColor" strokeWidth="3"></circle>
                                                    <circle className="text-indigo-600" cx="20" cy="20" fill="transparent" r="18" stroke="currentColor" strokeDasharray="113" strokeDashoffset={113 - (item.trustScore * 1.13)} strokeWidth="3" strokeLinecap="round"></circle>
                                                </svg>
                                                <span className="absolute text-[10px] font-black text-white">{item.trustScore}%</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{item.trustScore > 70 ? "Low Risk" : "Attention"}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-xs font-semibold text-slate-400">{item.user?.name || "Anonymous"}</div>
                                        <div className="text-[10px] text-slate-600 truncate">{item.user?.email}</div>
                                    </div>
                                    <div className="col-span-1">
                                        <span className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-tight ${item.status === "VERIFIED" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" :
                                                item.status === "FLAGGED" ? "text-red-500 border-red-500/20 bg-red-500/10" :
                                                    "text-amber-500 border-amber-500/20 bg-amber-500/10"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex justify-end gap-2">
                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 transition-colors" title="Add Note">
                                            <span className="material-symbols-outlined text-sm">note_add</span>
                                        </button>
                                        <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest">
                                            LOG
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer Toolbar */}
                <footer className="h-16 border-t border-indigo-600/10 px-8 flex items-center justify-between bg-slate-950/50 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> ACTIVE SUBMISSIONS ({submissions.length})</span>
                    </div>
                </footer>
                <div className="p-8">
                    <Footer />
                </div>
            </main>
        </div>
    );
}
