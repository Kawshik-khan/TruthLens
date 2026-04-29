"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText, ArrowRight, CheckCircle, Shield, Database, Zap, Download } from "lucide-react";

export default function MethodologyPage() {
    return (
        <div className="min-h-screen text-white font-sans pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32">
                {/* Hero */}
                <motion.section
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                        Radical Transparency
                    </h1>
                    <p className="text-white/70 text-xl max-w-3xl mx-auto">
                        TruthLens operates with complete algorithmic visibility. Every decision, every score, every verification step is auditable and open-source.
                    </p>
                </motion.section>

                <div className="bento-grid">
                    {/* Interactive Timeline */}
                    <motion.div
                        className="bento-item col-span-12 p-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-8">Our Verification Process</h2>
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent"></div>
                            <div className="space-y-8">
                                {[
                                    { step: 1, title: "Claim Ingestion", desc: "Input analysis begins with secure claim intake and initial parsing.", icon: FileText },
                                    { step: 2, title: "NLP Parse", desc: "Advanced natural language processing analyzes sentiment, bias, and structure.", icon: Shield },
                                    { step: 3, title: "Source Crawl", desc: "Automated web crawling gathers corroborating evidence from trusted sources.", icon: Database },
                                    { step: 4, title: "Cross Verification", desc: "Multi-source validation ensures factual consistency across datasets.", icon: CheckCircle },
                                    { step: 5, title: "Scoring Algorithm", desc: "Proprietary scoring system calculates trust metrics and confidence levels.", icon: Zap },
                                    { step: 6, title: "Verdict & Report", desc: "Final analysis delivered with comprehensive evidence and explanations.", icon: ArrowRight },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex gap-8 items-start"
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                            <item.icon className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-blue-400 font-mono text-sm">0{item.step}</span>
                                                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                            </div>
                                            <p className="text-white/70 text-sm">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        className="bento-item col-span-12 md:col-span-4 p-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-white font-semibold mb-4">Accuracy Rate</h3>
                        <div className="text-4xl font-bold text-white mb-2">99.7%</div>
                        <p className="text-white/60 text-sm">Verified claims detected</p>
                    </motion.div>

                    <motion.div
                        className="bento-item col-span-12 md:col-span-4 p-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-white font-semibold mb-4">Sources Analyzed</h3>
                        <div className="text-4xl font-bold text-white mb-2">500M+</div>
                        <p className="text-white/60 text-sm">Data points in our graph</p>
                    </motion.div>

                    <motion.div
                        className="bento-item col-span-12 md:col-span-4 p-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-white font-semibold mb-4">Processing Speed</h3>
                        <div className="text-4xl font-bold text-white mb-2">2.3s</div>
                        <p className="text-white/60 text-sm">Average analysis time</p>
                    </motion.div>

                    {/* Whitepaper CTA */}
                    <motion.div
                        className="bento-item col-span-12 p-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-4">Complete Methodology</h3>
                        <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                            Download our comprehensive whitepaper detailing the full technical specifications, validation methods, and ethical frameworks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://github.com/Kawshik-khan/TruthLens"
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4" />
                                View Source Code
                            </a>
                            <button className="px-6 py-3 glass-panel text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download Whitepaper
                            </button>
                        </div>
                    </motion.div>
                </div>

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
