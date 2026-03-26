"use client";

import AdminSidebar from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await fetch("/api/admin/feedback");
                if (res.ok) {
                    const data = await res.json();
                    setFeedback(data);
                }
            } catch (error) {
                console.error("Feedback fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    const handleView = (ticket: any) => {
        setSelectedTicket(ticket);
        setIsPanelOpen(true);
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 ml-72 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-20 flex items-center justify-between px-8 border-b border-blue-600/10 bg-slate-950/50 backdrop-blur-md z-10 shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Feedback Hub</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Monitoring User Sentiment and Support Vectors</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden sm:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
                            <input
                                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 w-64 text-slate-300"
                                placeholder="Filter by user or message..."
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">Operator_08</p>
                                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Alpha Clearance</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400 font-bold">
                                OP
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-950">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: "Total Inquiries", value: feedback.length, icon: "chat", color: "text-blue-500" },
                            { label: "Critical Priority", value: "0", icon: "warning", color: "text-red-500" },
                            { label: "Avg Response", value: "1.2h", icon: "timer", color: "text-emerald-500" },
                        ].map((stat, i) => (
                            <div key={i} className="glass-panel p-6 rounded-2xl border-white/5 bg-slate-900/40">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                    <span className={`material-symbols-outlined ${stat.color} text-lg opacity-80`}>{stat.icon}</span>
                                </div>
                                <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass-panel rounded-2xl overflow-hidden mb-12 border-white/5 bg-slate-900/40 shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3 italic uppercase tracking-tight">
                                <span className="material-symbols-outlined text-blue-500">forum</span>
                                Support Stream
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <div className="p-12 text-center text-slate-500 animate-pulse font-mono text-xs uppercase tracking-[0.2em]">Intercepting User Streams...</div>
                            ) : feedback.length === 0 ? (
                                <div className="p-12 text-center text-slate-500 italic">No feedback entries detected in current temporal window.</div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-black/40 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <th className="px-8 py-5">Sender Identity</th>
                                            <th className="px-8 py-5">Intel Core</th>
                                            <th className="px-8 py-5">Transmission Date</th>
                                            <th className="px-8 py-5 text-right">Ops</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {feedback.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-600/[0.03] transition-colors cursor-pointer group" onClick={() => handleView(item)}>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 font-bold uppercase text-xs">
                                                            {item.name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight truncate">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">{item.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-xs text-slate-400 font-light truncate max-w-sm">{item.message}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(item.createdAt).toLocaleString()}</span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-blue-400 transition-colors">visibility</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {isPanelOpen && (
                    <div className="absolute inset-y-0 right-0 w-[500px] bg-slate-900 border-l border-blue-600/20 backdrop-blur-xl z-[200] shadow-[-20px_0_60px_rgba(0,0,0,0.6)] flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-8 border-b border-blue-600/10 flex items-center justify-between bg-slate-950/80">
                            <div>
                                <h3 className="font-black text-xl text-white uppercase italic tracking-tight">Transmission Detail</h3>
                                <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">ID: {selectedTicket?.id}</p>
                            </div>
                            <button
                                onClick={() => setIsPanelOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-500 transition-all font-bold"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Source Identity</label>
                                <div className="p-6 bg-slate-950 border border-white/5 rounded-2xl flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-3xl font-black text-blue-500 uppercase">
                                        {selectedTicket?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-white uppercase italic">{selectedTicket?.name}</p>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{selectedTicket?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Intercepted Transmission</label>
                                <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl text-slate-300 text-sm leading-relaxed font-light italic shadow-inner">
                                    "{selectedTicket?.message}"
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Audit Timestamp</label>
                                <p className="text-2xl font-black text-white tracking-widest tabular-nums">
                                    {new Date(selectedTicket?.createdAt).toLocaleTimeString()}
                                </p>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                    {new Date(selectedTicket?.createdAt).toDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="p-8 border-t border-blue-600/10 bg-slate-950/80">
                            <button
                                onClick={() => setIsPanelOpen(false)}
                                className="w-full py-5 rounded-2xl bg-blue-600 text-slate-950 text-xs font-black uppercase tracking-[0.25em] hover:bg-blue-500 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-[0.98]"
                            >
                                CLOSE FREQUENCY
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
