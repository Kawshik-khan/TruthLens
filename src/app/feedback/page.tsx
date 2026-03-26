"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function FeedbackPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600/30 flex flex-col relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 grid-bg pointer-events-none opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

            <Navbar />

            <main className="flex-grow flex items-center justify-center p-6 pt-32 pb-20 relative z-10 font-display">
                <div className="w-full max-w-3xl glass-panel rounded-[2rem] p-10 md:p-16 shadow-2xl bg-slate-900/60 border-blue-600/10">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <span className="material-symbols-outlined text-[14px]">shield</span>
                            Intelligence Audit
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">Report Inaccuracy</h1>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                            Help us refine the TruthLens engine. Provide granular intelligence regarding any analytical discrepancies observed.
                        </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                    Session Node ID
                                    <span className="material-symbols-outlined text-[14px]">lock_open</span>
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-4 px-6 text-slate-400 font-mono tracking-widest text-xs cursor-not-allowed outline-none"
                                        readOnly
                                        type="text"
                                        defaultValue="TL-HUB-VER-2024-X"
                                    />
                                    <div className="absolute inset-0 bg-blue-600/[0.02] pointer-events-none"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500" htmlFor="reason">
                                    Discrepancy Vector
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-4 px-6 text-slate-200 text-xs font-bold uppercase tracking-widest appearance-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all outline-none cursor-pointer"
                                        id="reason"
                                        required
                                    >
                                        <option disabled value="">Select Vector</option>
                                        <option value="factual">Factual Misstatement</option>
                                        <option value="context">Semantic Drift</option>
                                        <option value="source">Unreliable Mapping</option>
                                        <option value="sentiment">Bias Miscalculation</option>
                                        <option value="other">Node Inconsistency</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500" htmlFor="evidence">
                                Operational Observations
                            </label>
                            <textarea
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-6 px-8 text-slate-200 placeholder:text-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all outline-none resize-none min-h-[150px] font-light leading-relaxed"
                                id="evidence"
                                placeholder="Log internal telemetry observations here..."
                                required
                            ></textarea>
                            <div className="flex justify-end">
                                <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.1em] italic">Min 20 characters required for node validation</span>
                            </div>
                        </div>

                        {/* Toggle Component */}
                        <div className="flex items-center justify-between p-6 bg-blue-600/5 rounded-2xl border border-blue-600/10 shadow-inner">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-600/20">
                                    <span className="material-symbols-outlined font-black">source</span>
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase tracking-tight text-white mb-0.5">Correct Source Linkage</p>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Enable to re-verify primary node documentation.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input defaultChecked className="sr-only peer" type="checkbox" />
                                <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:bg-blue-500 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-600 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600/20 peer-checked:border peer-checked:border-blue-600/30"></div>
                            </label>
                        </div>

                        <div className="pt-6">
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-500 text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
                                type="submit"
                            >
                                <span>Submit Security Report</span>
                                <span className="material-symbols-outlined text-sm font-black">rocket_launch</span>
                            </button>
                            <p className="text-center text-[10px] text-slate-600 font-bold mt-10 uppercase tracking-widest leading-loose">
                                By submitting, you authorize the <a className="text-blue-600 hover:text-white underline decoration-blue-600/30 underline-offset-4" href="/methodology">Accuracy Protocols</a> and node re-synchronization.
                            </p>
                        </div>
                    </form>
                </div>
            </main>

            {/* Success Notification */}
            {submitted && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 glass-panel border-emerald-500/40 px-8 py-4 rounded-full flex items-center gap-4 animate-in slide-in-from-bottom duration-500 bg-slate-950/80 backdrop-blur-3xl shadow-[0_0_40px_rgba(16,185,129,0.2)] z-[1000]">
                    <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Report Submitted // Tracking ID: #TRB-9102-X</span>
                </div>
            )}

            <Footer />
        </div>
    );
}
