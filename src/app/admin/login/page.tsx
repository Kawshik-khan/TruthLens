"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.user.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    setError("Access Denied: Administrative privileges required.");
                }
            } else {
                const data = await res.json();
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Encryption failure: Secure link could not be established.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 font-sans">
            <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(rgba(244, 63, 94, 0.15) 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
            <div className="fixed -top-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <main className="relative z-10 w-full max-w-md px-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-indigo-600/20 border border-red-500/30 mb-6 group hover:scale-105 transition-all duration-500">
                        <span className="material-symbols-outlined text-red-500 text-5xl group-hover:rotate-12 transition-transform">security</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tighter italic">Command <span className="text-red-500">Center</span></h1>
                    <p className="text-slate-500 mt-3 text-[10px] uppercase tracking-[0.4em] font-bold">Classified Access Only</p>
                </div>

                <div className="glass-panel rounded-3xl p-10 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-indigo-500 to-red-500 animate-pulse"></div>

                    <form className="space-y-8" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl text-center flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest group-focus-within:text-red-500 transition-colors" htmlFor="email">Admin Identity</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-lg group-focus-within:text-red-500 transition-colors">badge</span>
                                    <input
                                        className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white outline-none transition-all placeholder:text-slate-700 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 font-mono text-sm"
                                        id="email" placeholder="admin@truthlens.ai" type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest group-focus-within:text-red-500 transition-colors" htmlFor="password">Encrypted Override</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-lg group-focus-within:text-red-500 transition-colors">key</span>
                                    <input
                                        className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white outline-none transition-all placeholder:text-slate-700 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 font-mono text-sm"
                                        id="password" placeholder="••••••••••••" type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 text-xs uppercase tracking-[0.2em]"
                        >
                            {isLoading ? "Authenticating..." : "Authorize Access"}
                            <span className="material-symbols-outlined text-sm">shield</span>
                        </button>
                    </form>
                </div>

                <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse"></div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black">Restricted Intelligence Area</span>
                    </div>
                    <Link href="/login" className="text-[10px] text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs">arrow_back</span>
                        Return to Researcher Portal
                    </Link>
                </div>
            </main>
        </div>
    );
}
