"use client";

import Link from "next/link";

interface NavLink {
    name: string;
    href: string;
}

interface NavbarProps {
    links?: NavLink[];
    cta?: {
        name: string;
        href: string;
    };
}

export default function Navbar({ links, cta }: NavbarProps) {
    const defaultLinks = [
        { name: "Analyzer", href: "/submit" },
        { name: "AI Analyze", href: "/analyze" },
        { name: "Sources", href: "/sources" },
        { name: "Education", href: "/learn" },
        { name: "Methodology", href: "/methodology" },
        { name: "Feedback", href: "/feedback" },
    ];

    const displayLinks = links || defaultLinks;

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-5 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/30 group-hover:border-indigo-600/60 transition-colors overflow-hidden">
                        <img src="/logo.png" alt="TruthLens Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-display font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 uppercase italic">TruthLens</span>
                </Link>
                <div className="hidden lg:flex items-center gap-10">
                    {displayLinks.map((link) => (
                        <Link key={link.href} className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href={link.href}>
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    {cta ? (
                        <Link href={cta.href} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-400/50">
                            {cta.name}
                        </Link>
                    ) : (
                        <Link href="/auth" className="px-6 py-2.5 rounded-full text-sm font-semibold border border-white/10 hover:bg-white/5 transition-all text-white">
                            Member Access
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
