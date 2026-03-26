"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";

export default function ArticleDetailPage() {
    const params = useParams();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-600/30 selection:text-white relative">
            <Navbar />

            {/* Reading Progress Bar (Fixed) */}
            <div className="fixed left-0 top-0 h-full w-[2px] bg-indigo-600/10 z-[100]">
                <div className="w-full h-1/2 bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-32 md:py-48">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Article Content Column */}
                    <div className="lg:col-span-8">
                        <header className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">Intelligence_Module</span>
                                <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">8 Min Read</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-12 uppercase italic tracking-tighter">
                                The Deep Architecture of <span className="text-indigo-500 not-italic">Neural Networks</span>
                            </h1>

                            <div className="flex items-center gap-6">
                                <img
                                    alt="Author"
                                    className="w-14 h-14 rounded-full border-2 border-indigo-600/30 p-0.5"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRlssTVWKHnthaXUgw5s64RyYH8rYNjvkoOogresvkiMiom5A66LOHWHr8KITV7tMGnSpUSEgonjQv2dMBKCToNniXRxSRMP2XbwdwgDzjj7M6RMi31JPoUfsbgSIsLZ3h6kXAr4DXjnHAdCFJvMnz41Axihhl73noAfrQ-tYCaqJzDVj9KaynPCDHyVakaEBZitwe_kBoY8cfnJnrXTo3qlnk2fZhADF6g6lWOzJnddQ2cxmzD80mvcYNBiE59S2dUFVghlM95yg"
                                />
                                <div>
                                    <p className="font-black text-white uppercase italic tracking-tight text-lg">Dr. Julian Vance</p>
                                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em] mt-1">Senior ML Architect // Data_Ethics_Board</p>
                                </div>
                            </div>
                        </header>

                        <div className="relative group mb-16 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-white/5">
                            <img
                                alt="Featured"
                                className="w-full h-[500px] object-cover opacity-60 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEybItZBasyMM8wbApiYkUbuy-iOlZjIxPo8Q9R7IhuPn5rRcBHVKMZnHvI6W6WAXVJjaA0Ir9EppFfIDqZ4jWglMas6IRG5INd18VoBOCrjwQlLFY7WHLnWaF5LZNapfObRum3Av46Ji-o4BGX_JWr_sW5Os3GqjsU7iL0C9DE5wL-1SsI1Qavo0blQVRyZjZBrn8R6Yii1uf30BIJT4UEkUTOneYAjL6JmkQfXgz2-kMBe4dcxft5J4ykF0t5CmGdRYbNH2FMvk"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                        </div>

                        <article className="space-y-10">
                            <p className="text-2xl text-slate-400 font-light leading-relaxed mb-12 first-letter:text-7xl first-letter:font-black first-letter:text-indigo-500 first-letter:mr-4 first-letter:float-left">
                                In the landscape of artificial intelligence, neural networks serve as the fundamental backbone. Inspired by the biological neurons of the human brain, these mathematical constructs have evolved from simple perceptrons to deep architectures capable of generative mastery.
                            </p>

                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tight flex items-center gap-4">
                                <span className="w-12 h-1 bg-indigo-600 rounded-full"></span>
                                The Biological Blueprint
                            </h2>

                            <p className="text-lg text-slate-400 leading-relaxed font-light">
                                At its core, a neural network is an interconnected assembly of nodes, called neurons, that work in concert to process information. Each connection carries a weight that is adjusted during the learning process, effectively &quot;teaching&quot; the system how to recognize patterns.
                            </p>

                            <blockquote className="relative p-12 bg-indigo-600/5 rounded-3xl border-l-4 border-indigo-600 shadow-[20px_0_60px_rgba(99,102,241,0.1)]">
                                <p className="text-2xl font-light italic text-white leading-relaxed">
                                    &quot;The goal of deep learning is not to simulate the brain, but to simulate the results the brain achieves through mathematical approximation.&quot;
                                </p>
                                <span className="material-symbols-outlined absolute -top-4 -left-4 text-7xl opacity-10 text-indigo-400 font-light">format_quote</span>
                            </blockquote>

                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 font-mono overflow-x-auto shadow-inner">
                                <div className="flex gap-4 mb-4 opacity-30">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                </div>
                                <pre className="text-sm text-indigo-400/80 leading-relaxed">
                                    <code>
                                        {`# Initializing Gradient Sequence
for epoch in range(iterations):
    output = neuro_link(raw_data)
    delta = error_map(output, ground_truth)
    
    # Backpropagation Protocol Initiated
    delta.backward()
    structural_optimizer.step()`}
                                    </code>
                                </pre>
                            </div>

                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tight flex items-center gap-4">
                                <span className="w-12 h-1 bg-indigo-600 rounded-full"></span>
                                The Multi-Layer Perceptron (MLP)
                            </h2>

                            <p className="text-lg text-slate-400 leading-relaxed font-light">
                                An MLP consists of at least three layers of nodes: an input layer, a hidden layer, and an output layer. Except for the input nodes, each node is a neuron that uses a nonlinear activation function.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: "Input_Layer", icon: "login", desc: "Receives raw data and passes it to the first hidden layer." },
                                    { title: "Hidden_Nodes", icon: "hub", desc: "Perform mathematical transformations to extract features." },
                                    { title: "Output_Result", icon: "output", desc: "Produces the final prediction or classification." },
                                ].map((step, i) => (
                                    <div key={i} className="p-8 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group shadow-2xl">
                                        <span className="material-symbols-outlined text-indigo-500 mb-6 block text-3xl group-hover:scale-110 transition-transform">{step.icon}</span>
                                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-4 italic">{step.title}</h4>
                                        <p className="text-xs text-slate-500 leading-loose">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </article>

                        {/* Share Footer */}
                        <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Node_Distribution:</span>
                                <div className="flex gap-3">
                                    {["share", "link", "bookmark"].map(icon => (
                                        <button key={icon} className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-slate-950 transition-all flex items-center justify-center">
                                            <span className="material-symbols-outlined text-lg">{icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button className="flex items-center gap-3 text-slate-600 hover:text-rose-500 transition-colors group">
                                <span className="material-symbols-outlined text-sm">flag</span>
                                <span className="text-[10px] font-black uppercase tracking-widest group-hover:underline decoration-rose-500/30 underline-offset-4">Report Intelligence Discrepancy</span>
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        <div className="glass-panel p-8 rounded-3xl border-white/5 bg-slate-900/40 shadow-2xl">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-8 flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg">tag</span>
                                Operational Markers
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["NeuralNetworks", "DeepLearning", "AIArchitecture", "MachineLearning", "Mathematics"].map(tag => (
                                    <span key={tag} className="px-3 py-1.5 bg-indigo-600/5 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-slate-950 transition-all cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-3xl border-white/5 bg-slate-900/40 shadow-2xl">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-8 flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg">library_books</span>
                                Adjacent Intel
                            </h3>
                            <div className="space-y-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border border-white/5 group-hover:border-indigo-500/50 transition-colors">
                                                <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 group-hover:scale-110 transition-transform duration-700"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-black text-white uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors leading-relaxed">The Evolution of Transformer Systems Log_v.2</h4>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 underline decoration-white/5 underline-offset-4">Read Node</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Hook */}
                        <div className="bg-indigo-600 rounded-3xl p-10 text-slate-950 relative overflow-hidden group shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">Sync Intelligence</h3>
                                <p className="text-slate-950/70 text-sm font-bold leading-relaxed mb-8">Get weekly insights into the world of AI verification delivered to your neural net.</p>
                                <form className="space-y-4">
                                    <input
                                        className="w-full bg-slate-950/10 border border-slate-950/20 rounded-xl px-5 py-3 text-sm font-bold placeholder-slate-950/40 focus:ring-0 focus:border-slate-950/50 outline-none"
                                        placeholder="Terminal Email Address"
                                        type="email"
                                    />
                                    <button className="w-full bg-slate-950 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-lg">Initialize Sync</button>
                                </form>
                            </div>
                            <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[180px] opacity-10 font-thin italic -rotate-12 group-hover:rotate-0 transition-all duration-1000">send</span>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}
