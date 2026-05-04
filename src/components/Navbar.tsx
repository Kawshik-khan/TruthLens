"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

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
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();

    const defaultLinks = [
        { name: "Analyzer", href: "/submit" },
        { name: "AI Analyze", href: "/analyze" },
        { name: "Sources", href: "/sources" },
        { name: "Education", href: "/learn" },
        { name: "Methodology", href: "/methodology" },
        { name: "Feedback", href: "/feedback" },
    ];

    const displayLinks = links || defaultLinks;
    const primaryAction = cta || { name: "Start Analysis", href: "/submit" };

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-white/8 bg-black/65 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(37,99,235,0.18)] transition-all duration-300 group-hover:border-blue-400/40 group-hover:bg-blue-500/10">
                        <img src="/logo.png" alt="TruthLens Logo" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-xl font-semibold tracking-tight text-white sm:text-2xl">TruthLens</span>
                </Link>

                <div className="hidden items-center gap-9 lg:flex">
                    {displayLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="group relative text-sm font-medium text-slate-300 transition-colors duration-300 hover:text-white">
                            <span>{link.name}</span>
                            <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-blue-400 to-cyan-300 transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                    ))}
                </div>

                <div className="hidden items-center gap-3 sm:flex">
                    {isAuthenticated ? (
                        <Link href="/dashboard" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all duration-300 hover:from-emerald-500 hover:to-green-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                            <span>Dashboard</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/90 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white">
                                Sign In
                            </Link>
                            <Link href={primaryAction.href} className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 hover:from-blue-500 hover:to-sky-400 hover:shadow-[0_0_40px_rgba(37,99,235,0.5)]">
                                <span>{primaryAction.name}</span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </Link>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setMobileOpen((value) => !value)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-white/20 hover:bg-white/10 lg:hidden"
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            <AnimatePresence>
                {mobileOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/8 bg-black/90 px-4 pb-5 pt-3 backdrop-blur-2xl lg:hidden"
                    >
                        <div className="mx-auto flex max-w-7xl flex-col gap-2">
                            {displayLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-base font-medium text-white/90 transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight className="h-4 w-4 text-blue-300" />
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                {isAuthenticated ? (
                                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="col-span-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-4 text-center text-sm font-semibold text-white shadow-[0_0_28px_rgba(16,185,129,0.3)] transition-all duration-300 hover:from-emerald-500 hover:to-green-400">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-2xl border border-white/10 px-4 py-4 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-white/5">
                                            Sign In
                                        </Link>
                                        <Link href={primaryAction.href} onClick={() => setMobileOpen(false)} className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-4 text-center text-sm font-semibold text-white shadow-[0_0_28px_rgba(37,99,235,0.3)] transition-all duration-300 hover:from-blue-500 hover:to-sky-400">
                                            {primaryAction.name}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </nav>
    );
}
