"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MethodologyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-600/30 selection:text-white pb-24 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 grid-bg pointer-events-none opacity-30"></div>

            <Navbar />

            <main className="relative pt-40">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 mb-40">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-lg">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                Open Algorithm Protocol
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black text-white mb-10 leading-[0.9] uppercase italic tracking-tighter">
                                Integrity via <span className="text-indigo-500 not-italic">Radical</span> Transparency.
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed max-w-xl mb-12 font-light">
                                TruthLens isn&apos;t a black box. We believe that for AI to fight misinformation, its own logic must be visible, auditable, and beyond reproach.
                            </p>
                            <div className="flex gap-6">
                                <button className="bg-indigo-600 text-slate-950 px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30">View GitHub Repo</button>
                                <button className="px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-white/10 text-white hover:bg-white/5 transition-all">Download Whitepaper</button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-20 bg-indigo-600/20 blur-[120px] rounded-full"></div>
                            <div className="relative glass-panel rounded-[2.5rem] p-4 border-indigo-500/20 shadow-2xl bg-slate-900/40">
                                <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-[2rem]">
                                    <div className="absolute inset-0 flex items-center justify-center scale-125 opacity-20 group-hover:opacity-40 transition-opacity">
                                        <div className="w-96 h-96 border border-indigo-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                        <div className="absolute w-64 h-64 border border-indigo-500/50 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                    </div>
                                    <div className="relative z-10 w-48 h-48 bg-indigo-600/10 border-2 border-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.4)]">
                                        <span className="material-symbols-outlined text-indigo-400 text-7xl font-light italic">insights</span>
                                    </div>
                                    <img
                                        alt="Neural network"
                                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzUCsHFU5CgjaIGL07lwUSH_ikJId_xRIo4jkGFQPuX505T6yVUmTdHDYYWMixxWnj2qFmllc2lgEJKBT-ngQTg-KaoubuhHkVJ09qcDRwuCE_47Wg4beCCPbK55fEBtLk1qCOgVGlwE7s3w9_M_VoorvSqM67vl3P6QDfgJSFoqOBL6PGxAfkUzOOZqnT6Jam55LXrJUVT5Mj55YhHsuEFsp1Dulqn6PEIUH5gasZnwqRckvAAVg-m6qm-d7NDoezxPjabGGL_K4"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Triple-Verification Engine */}
                <section className="max-w-7xl mx-auto px-6 mb-40">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-6">The Triple-Verification Engine</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                            Our scoring system processes every claim through three distinct layers of analysis to ensure a 99.4% accuracy rate in bias detection.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                title: "NLP Analysis",
                                icon: "psychology",
                                desc: "Using advanced Natural Language Processing to detect semantic drift, hyperbolic framing, and emotional manipulation tactics in text.",
                                points: ["Sentiment Analysis", "Logical Fallacy Detection", "Linguistic Bias Scoring"]
                            },
                            {
                                title: "Metadata Scrutiny",
                                icon: "fingerprint",
                                desc: "Every piece of content has a digital trail. We trace source origins, distribution patterns, and publisher history to determine credibility.",
                                points: ["Source Reputation Index", "Domain Age & History", "Distribution Bot-Detection"]
                            },
                            {
                                title: "Cross-referencing",
                                icon: "hub",
                                desc: "Real-time validation against our verified Knowledge Graph, consisting of over 500 million peer-reviewed facts and data points.",
                                points: ["Real-time Fact Checking", "Peer-review Verification", "Contradiction Mapping"]
                            }
                        ].map((box, i) => (
                            <div key={i} className="glass-panel p-10 rounded-3xl hover:border-indigo-500/50 transition-all group bg-slate-900/40 border-white/5">
                                <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-all duration-500 shadow-inner group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                                    <span className="material-symbols-outlined text-indigo-500 group-hover:text-slate-950 text-3xl transition-colors">{box.icon}</span>
                                </div>
                                <h3 className="text-2xl font-black mb-6 text-white uppercase italic tracking-tight transition-colors group-hover:text-indigo-400">{box.title}</h3>
                                <p className="text-slate-400 leading-relaxed mb-10 text-sm font-light">
                                    {box.desc}
                                </p>
                                <ul className="space-y-4">
                                    {box.points.map((p, pi) => (
                                        <li key={pi} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
                                            <span className="material-symbols-outlined text-indigo-500 text-sm font-black">check_circle</span>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Ethics Statement Section */}
                <section className="max-w-7xl mx-auto px-6 mb-40">
                    <div className="bg-indigo-600/5 rounded-[3rem] p-12 md:p-20 border border-indigo-500/10 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] -mr-60 -mt-60"></div>
                        <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-4xl font-black mb-8 text-white uppercase italic tracking-tighter">Neutrality First: Our Ethics Promise</h2>
                                <p className="text-lg text-slate-400 mb-12 leading-relaxed font-light">
                                    Our models are trained on diverse datasets to minimize algorithmic bias. We strictly adhere to privacy standards, ensuring that content analysis is performed without storing user identities or sensitive personal data.
                                </p>
                                <div className="space-y-10">
                                    <div className="flex gap-6">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-indigo-500/30 flex items-center justify-center bg-indigo-500/5 shadow-inner">
                                            <span className="material-symbols-outlined text-indigo-500 text-2xl font-bold">security</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white uppercase text-sm tracking-widest mb-2 italic">Zero Data Retention</h4>
                                            <p className="text-sm text-slate-500 font-medium">Inputs are encrypted and discarded immediately after analysis node completion.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-indigo-500/30 flex items-center justify-center bg-indigo-500/5 shadow-inner">
                                            <span className="material-symbols-outlined text-indigo-500 text-2xl font-bold">balance</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white uppercase text-sm tracking-widest mb-2 italic">Political Structural Neutrality</h4>
                                            <p className="text-sm text-slate-500 font-medium">Weighting systems are balanced by a multi-partisan decentralized ethics board.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-panel p-3 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-slate-900 border-white/5 group hover:border-indigo-500/30 transition-all">
                                <img
                                    alt="Ethics"
                                    className="w-full h-auto rounded-2xl grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAT1zMlkZjwuVX-IOn42mbCQZxgU8IScsEfeOoKxml868pOxDndy--FVPCtbhJZisyxvC6RglXski39miCa_4fU_GscQJ-F-bIOJS-FELzhdTAfNYdG78DNisLk6RUtYUUpng45N4z5gK4OHY9F0CAsA5CKrrBR7tVhvm9B-NCiKB4ZXEgzsxzwpeGKjUSUAYwZWt8IkU4Hz04sVvZSz5laELjViUOB9Fk9b0JlrHJ5clvCQOFQ5JKhJ217VRfHLC3Ta50kQFLrbc"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Limitations Section */}
                <section className="max-w-4xl mx-auto px-6">
                    <div className="glass-panel border-indigo-500/20 p-12 md:p-16 rounded-[3rem] relative overflow-hidden bg-slate-900/60 shadow-inner hover:border-indigo-500/40 transition-all group">
                        <div className="flex flex-col md:flex-row gap-10 items-start">
                            <div className="bg-indigo-600/10 p-5 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all">
                                <span className="material-symbols-outlined text-indigo-500 group-hover:text-slate-950 text-5xl font-black">warning_amber</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black mb-6 text-white uppercase italic tracking-tight">Known Limitations &amp; Boundary Cases</h3>
                                <p className="text-slate-400 leading-relaxed mb-10 font-light">
                                    While our AI is industry-leading, users should be aware of technical constraints. TruthLens is an interpretive resource meant to assist human judgment, not replace it.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-sm transition-all hover:bg-white/[0.08]">
                                        <strong className="text-white block mb-2 uppercase tracking-widest text-[10px] italic font-black text-indigo-400">Satire Detection_v2</strong>
                                        <span className="text-slate-500 font-medium">Subtle irony or extreme sarcasm can occasionally be flagged as factual deviation. Human audit recommended.</span>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-sm transition-all hover:bg-white/[0.08]">
                                        <strong className="text-white block mb-2 uppercase tracking-widest text-[10px] italic font-black text-indigo-400">Zero-Day Intel</strong>
                                        <span className="text-slate-500 font-medium">Breaking events occurring in the last 15 minutes may lack sufficient cross-reference latency.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
