"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 py-24 relative overflow-hidden shrink-0">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-500/5 to-transparent -z-10"></div>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/30 rounded flex items-center justify-center">
                                <span className="material-symbols-outlined text-indigo-400 text-2xl italic">lens_blur</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white uppercase italic">TruthLens</span>
                        </div>
                        <p className="text-slate-500 font-light max-w-sm mb-10 leading-relaxed text-sm">
                            Operating at the intersection of journalism, data science, and digital literacy to mitigate the impact of distributed disinformation networks.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: "share", href: "#" },
                                { icon: "alternate_email", href: "#" },
                                { icon: "monitoring", href: "#" },
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:bg-indigo-600/10 hover:text-indigo-400 transition-all"
                                    href={social.href}
                                >
                                    <span className="material-symbols-outlined text-sm">{social.icon}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-black text-white mb-8 uppercase text-[10px] tracking-[0.3em] opacity-30">Directories</h4>
                        <ul className="space-y-4 text-xs font-black tracking-widest text-slate-500">
                            <li><Link className="hover:text-indigo-400 transition-colors uppercase" href="/learn">EDUCATION_HUB</Link></li>
                            <li><Link className="hover:text-indigo-400 transition-colors uppercase" href="/submit">VERIFY_ENGINE</Link></li>
                            <li><Link className="hover:text-indigo-400 transition-colors uppercase" href="/sources">SOURCE_DB</Link></li>
                            <li><Link className="hover:text-indigo-400 transition-colors uppercase" href="/report">REPORTS_v2</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-white mb-8 uppercase text-[10px] tracking-[0.3em] opacity-30">Core</h4>
                        <ul className="space-y-4 text-xs font-black tracking-widest text-slate-500">
                            <li><Link className="hover:text-indigo-400 transition-colors uppercase" href="/">ABOUT_OS</Link></li>
                            <li><Link className="hover:text-indigo-400 transition-colors uppercase" href="/methodology">METHODOLOGY</Link></li>
                            <li><Link className="hover:text-indigo-400 transition-colors uppercase" href="/methodology">PRIVACY_PROT</Link></li>
                            <li><Link className="hover:text-indigo-400 transition-colors uppercase" href="/feedback">CONNECT_SYS</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-700">
                    <p>© 2024 TruthLens Archive System. Encrypted Deployment.</p>
                    <div className="flex gap-8">
                        <Link className="hover:text-white transition-colors" href="/methodology">Access Policy</Link>
                        <Link className="hover:text-white transition-colors" href="/feedback">Feedback</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
