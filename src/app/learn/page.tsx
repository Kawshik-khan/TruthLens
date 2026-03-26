"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LearnPage() {
    const categories = ["All Modules", "Synthetic Media", "Algorithmic Bias", "Cognitive Warfare", "Data Ethics"];

    const modules = [
        {
            title: "Spotting Deepfakes: The Ultimate Guide to Visual Literacy",
            desc: "As synthetic media becomes indistinguishable from reality, learning the subtle markers of AI-generated content is critical.",
            tag: "AI_VERIFY",
            tagColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
            time: "08:00 MIN",
            date: "Oct 12.23",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBibcemRTJuB-DBQgqRl4rLQSXcQJPCuqE71HWd1bV1Wm9t5nh9T3ZMwbhr3S65rpdybirIfJrT__L9hc1D0lHhE4c80t0eEPVnuhBZcd7X0CT1QhOvhbg0AH5M65IxQaL1_oO8Z3BExXB2cPwOUwmhDuGA9yG1QKwNTHY5wXAgbwKdQqbkNpJNCPTyZWTQg0K85qtHqXjvkp9R6txj2q2nV-gCxWcpDIPcjhMuMqN2sBLob0AbDyWOXjurkQxSNkT3nd5K7Kgv3GM",
        },
        {
            title: "The Echo Chamber Effect: Why We Only Hear What We Like",
            desc: "Decoding how algorithms and cognitive biases trap us in feedback loops that reinforce existing mental models.",
            tag: "ALGO_LOOP",
            tagColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
            time: "06:00 MIN",
            date: "Oct 10.23",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkG2Ml6i_vY7chcPxyjX6nir_OEfLabPlYJXLXjQQhQpFZL02iXVZ_8W45BMImKo-6Ly59pj-SaSlx7D5WHpYoNsd-xlCFhzQUNX6dMXTokiwohoH0tFiIz5Suxr-XumujRwWApX1ZKrMhO6NnNmO_tF48cssRIAs5zGFPHQkfm9G330LtUzoi1OIklBmHiq6WcBQW37zGhixrQRE7iU3lU48xF3npx65klQAhQNFWne726piAIOiVCDFyNAUJM7-DsiIahF0pIR4",
        },
        {
            title: "Evolution of Misinformation: From Yellow Journalism to Bots",
            desc: "A historical forensic study on how fake news has transitioned through technological eras into the bot age.",
            tag: "ARCHIVE_LOG",
            tagColor: "text-indigo-300 bg-indigo-500/10 border-indigo-500/30",
            time: "12:00 MIN",
            date: "Oct 05.23",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfAEDxQhaqlX3sCAMp2xq0rc05eeXpnhnkSszZpfNHzFvzYcSfM7jCea9jEoMH2XqLS8LzSnGb906j8LH_Gq6Z9wWVE8z4kpmVXg-24SBlAYEbfUuCXgJfHhkLbpEoyK2-U1xLMrJ6bMSKq-AXs4WAMBX94UB557uW5Q5ZtBJwfrXpbTpfshrbjuog3JTT1WQf83hoqwMGpFq1ZLzBZWa_9eGFFReyRX3MLwlqqi1xqFhlJbL16Zi5Xs0wrK3FdRIVjczf2oXOSXo",
        },
        {
            title: "The Checklist: 5 Steps to Verify Any Social Media Post",
            desc: "A practical, shareable forensic framework for everyday users to quickly debunk viral disinformation.",
            tag: "TOOLKIT",
            tagColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
            time: "05:00 MIN",
            date: "Sep 28.23",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC28F5t5NyWblpIEYYgSyf1raMfpWQ3ZwKTz4No9YuzUenm3qC7Bf2KqJkXtPMjdL7NPEeOWRrgAluL2y9JOKBSnKGZG2T0c2-liarf__Le_owwkeX56IWXK4MJqKst0glxhwkiypcyUHaDM9vvcEaA3f15N5g6OWFsOx-SW2th3d5dXlbZCCeGLVVICXYp0tj4Jqy9U9nks6QLaKqq8PfnsVkVZaZyrFKKsHowSi2ciP72WTXrrbNqwWhCx34tZ6ZAicwD5vHV4mo",
        },
        {
            title: "Decoding Bias: How Language Shapes News Perception",
            desc: "Analysis of framing effects and emotionally charged language used by major media outlets globally.",
            tag: "LINGUISTICS",
            tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
            time: "10:00 MIN",
            date: "Sep 22.23",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1uXOBVDj1B-U8OWJq528t2Bc7Yr_HVieMerhYt-vqh_K81EI-NHGR5RBEV6xTC17IPcy93Uad7PB9lYcE-IrO_yIxjp2JdV_Op5GyoSdIOOkExXq2F-yOVZUDXHB_g9Ftml7J0nZtg_P8DpKPpz5vEjGL-58JB21EOrD5U8pgp5mA6wIKYGOUHxH28lcyuipi4X-ooVSGCwOH-fQCTIEeyQDzdiM8scu_db12Qlq0ZGYqDAzqnztq-lDbboxPQupIHNoMNy2gXGg",
        },
        {
            title: "Privacy in the Information Age: Protecting Your Digital Self",
            desc: "Why data privacy is a primary media literacy issue in the era of targeted algorithmic manipulation.",
            tag: "PRIV_SHIELD",
            tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
            time: "07:00 MIN",
            date: "Sep 15.23",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp33x7sHmSiyaFYN8PNPsFENXByeuWktlVjBEx4M4jbfK8xtLPGPk94GSnv-K15L-Pc3FUf2SZSYwaLKlJhzOWya2jFlztBf7Ug34ULoU9K3BSla5jZ5WH2nEpWT_nzLEL_zARiszXzR--WNtcbWoWVSzu2w5kUpWRCs3RJ2UhYDycQxm8gt2gLq0Y0bqgNHm_Ghnv84QT5Pvu--Pe94BFTn5TmuY0ItAplHPhC9uN_hhnF55gYPKF3IJa_5AH1iesM2EaAB2rA-A",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-600 selection:text-white pb-32">
            <Navbar />

            <header className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase mb-10 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Intel Database v.4.0
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-10 text-white tracking-tighter leading-[0.9] uppercase italic">
                        Education <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-400 not-italic">Hub</span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-14 max-w-3xl mx-auto font-light leading-relaxed">
                        A high-fidelity digital archive dedicated to deconstructing synthetic media, algorithmic bias, and the architecture of misinformation networks.
                    </p>

                    <div className="max-w-2xl mx-auto">
                        <div className="relative group bg-slate-900/50 border border-white/5 rounded-2xl p-2 transition-all hover:border-indigo-500/30 focus-within:border-indigo-500 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                            <div className="flex items-center">
                                <span className="material-symbols-outlined ml-4 text-slate-500">search</span>
                                <input
                                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 px-4 py-3 text-lg font-medium"
                                    placeholder="Query the archive..."
                                    type="text"
                                />
                                <button className="bg-indigo-600 hover:bg-indigo-500 text-slate-950 px-10 py-3.5 rounded-xl font-black text-xs tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20">
                                    Execute
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mt-16 mt-16">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase border transition-all ${i === 0
                                    ? "bg-indigo-600 border-indigo-600 text-slate-950 shadow-lg shadow-indigo-600/20"
                                    : "border-white/5 text-slate-500 hover:text-white hover:border-indigo-500/50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {modules.map((module, i) => (
                        <article key={i} className="glass-panel group rounded-3xl overflow-hidden transition-all duration-500 flex flex-col bg-slate-900/40 border-white/5 hover:border-indigo-500/40 shadow-2xl">
                            <div className="relative overflow-hidden aspect-[16/10] grayscale group-hover:grayscale-0 transition-all duration-700">
                                <img
                                    alt={module.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                                    src={module.image}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                                <div className="absolute top-6 left-6">
                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-lg ${module.tagColor}`}>
                                        {module.tag}
                                    </span>
                                </div>
                            </div>

                            <div className="p-10 flex flex-col flex-grow">
                                <div className="flex items-center gap-6 mb-6">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">timer</span> {module.time}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{module.date}</span>
                                </div>

                                <h3 className="text-2xl font-black mb-6 text-white group-hover:text-indigo-400 transition-colors tracking-tight leading-tight uppercase italic">
                                    {module.title}
                                </h3>

                                <p className="text-slate-400 text-sm font-light leading-relaxed mb-10 flex-grow">
                                    {module.desc}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                                    <button className="flex items-center gap-3 text-indigo-500 font-black text-[10px] uppercase tracking-widest group-hover:gap-5 transition-all">
                                        Initialize Read <span className="material-symbols-outlined text-sm font-black">arrow_forward_ios</span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination Segment */}
                <div className="mt-32 flex flex-col items-center gap-10">
                    <div className="flex items-center gap-4">
                        <button className="w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:border-indigo-500 transition-all shadow-inner">
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        <button className="w-12 h-12 rounded-xl bg-indigo-600 text-slate-950 font-black text-sm shadow-lg shadow-indigo-600/20 transition-transform active:scale-95">01</button>
                        <button className="w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500 transition-all text-sm font-black shadow-inner">02</button>
                        <button className="w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500 transition-all text-sm font-black shadow-inner">03</button>
                        <span className="px-3 text-slate-800 font-black tracking-widest uppercase text-xs">•••</span>
                        <button className="w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500 transition-all text-sm font-black shadow-inner">12</button>
                        <button className="w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:border-indigo-500 transition-all shadow-inner">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                    <div className="px-6 py-2 bg-slate-900 rounded-full border border-white/5 shadow-inner">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Displaying Records 001-006 / Total Sync: 072</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
