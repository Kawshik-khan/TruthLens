"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Search, Clock, BookOpen, Bookmark, Star } from "lucide-react";

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
        <div className="min-h-screen text-white font-sans pb-32">
            <Navbar />

            <header className="relative pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Education Hub
                        </h1>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto">
                            Master the methodologies used by bad actors and learn to identify truth in the digital age.
                        </p>
                    </div>

                    {/* Large Search Bar */}
                    <div className="mb-12">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/50" />
                            <input
                                className="w-full glass-input rounded-2xl py-6 px-16 text-white placeholder:text-white/50 text-lg"
                                placeholder="Search articles, guides, and resources..."
                                type="text"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                className={`px-6 py-3 rounded-full text-sm font-medium border transition-all ${
                                    i === 0
                                        ? "bg-white text-black border-white"
                                        : "border-white/20 text-white/70 hover:text-white hover:border-white/40"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6">
                {/* Featured Article Hero Card */}
                    <div className="bento-item p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/2">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm font-medium">
                                    FEATURED
                                </span>
                                <span className="text-white/60 text-sm">Deepfakes</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Spotting Deepfakes: The Ultimate Guide to Visual Literacy
                            </h2>
                            <p className="text-white/70 text-lg mb-6">
                                As synthetic media becomes indistinguishable from reality, learning the subtle markers of AI-generated content is critical.
                            </p>
                            <div className="flex items-center gap-6 text-sm text-white/60">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>8 min read</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    <span>Advanced</span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <img
                                alt="Featured article"
                                className="w-full h-64 lg:h-full object-cover rounded-xl"
                                src={modules[0].image}
                            />
                        </div>
                    </div>
                </div>

                {/* Masonry Bento Content Cards */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {modules.slice(1).map((module, i) => (
                        <article
                            key={i}
                            className="bento-item break-inside-avoid p-6"
                        >
                            <div className="relative mb-4 overflow-hidden rounded-xl aspect-video">
                                <img
                                    alt={module.title}
                                    className="w-full h-full object-cover"
                                    src={module.image}
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                                <button className="absolute top-3 right-3 p-2 glass-panel rounded-full opacity-0 hover:opacity-100 transition-opacity">
                                    <Bookmark className="w-4 h-4 text-white" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${module.tagColor.replace('text-', 'text-').replace('bg-', 'bg-').replace('border-', 'border-')}`}>
                                        {module.tag}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-white line-clamp-2">
                                    {module.title}
                                </h3>

                                <p className="text-white/70 text-sm line-clamp-3">
                                    {module.desc}
                                </p>

                                <div className="flex items-center justify-between text-sm text-white/60">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{module.time.split(' ')[0]}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            <span>Advanced</span>
                                        </div>
                                    </div>
                                    <span>{module.date}</span>
                                </div>
                             </div>
                        </article>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
