"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (res.ok) {
                router.push("/login");
            } else {
                const data = await res.json();
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0b0b1a] font-sans text-slate-200 min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
            <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] z-0"></div>
            <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] z-0"></div>

            <div className="w-full max-w-xl px-6 py-12 relative z-10">
                {/* Brand Identity */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-indigo-500/20 border border-indigo-500/30 mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all hover:bg-indigo-500/30">
                        <span className="material-icons text-indigo-400 text-4xl">travel_explore</span>
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">TruthLens</h1>
                    <p className="text-slate-400 text-lg">Join the mission to identify truth in a digital world.</p>
                </div>

                {/* Registration Card */}
                <div className="glass-panel rounded-2xl p-8 md:p-10">
                    <h2 className="text-xl font-semibold text-white mb-8 border-l-4 border-indigo-500 pl-4">Create Your Account</h2>
                    <form className="space-y-6" onSubmit={handleRegister}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400" htmlFor="full-name">Full Name</label>
                            <div className="relative rounded-lg border border-white/10 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">person</span>
                                <input
                                    className="block w-full bg-slate-900/50 border-0 pl-10 pr-4 py-3 text-white focus:ring-0 focus:outline-none placeholder:text-slate-600 rounded-lg"
                                    id="full-name" placeholder="Alex Thorne" required type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400" htmlFor="email">Email Address</label>
                            <div className="relative rounded-lg border border-white/10 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">alternate_email</span>
                                <input
                                    className="block w-full bg-slate-900/50 border-0 pl-10 pr-4 py-3 text-white focus:ring-0 focus:outline-none placeholder:text-slate-600 rounded-lg"
                                    id="email" placeholder="alex@truthlens.ai" required type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400" htmlFor="password">Security Password</label>
                            <div className="relative rounded-lg border border-white/10 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">lock</span>
                                <input
                                    className="block w-full bg-slate-900/50 border-0 pl-10 pr-12 py-3 text-white focus:ring-0 focus:outline-none placeholder:text-slate-600 rounded-lg"
                                    id="password" placeholder="••••••••••••" required type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-400">Identify Your Role</label>
                            <div className="grid grid-cols-3 gap-3">
                                {["STUDENT", "EDUCATOR", "RESEARCHER"].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${role === r ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-400" : "border-white/10 bg-white/5 text-slate-400 hover:border-slate-500"}`}
                                    >
                                        <span className="material-icons text-lg mb-1">{r === "STUDENT" ? "school" : r === "EDUCATOR" ? "co_present" : "science"}</span>
                                        <span className="text-[10px] uppercase tracking-wider font-bold">{r}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Primary CTA */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2 group uppercase text-sm tracking-widest disabled:opacity-50"
                            >
                                {isLoading ? "Joining..." : "Join TruthLens"}
                                <span className="material-icons text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </button>
                        </div>
                    </form>

                    {/* Card Footer */}
                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                        <p className="text-slate-400 text-sm">
                            Already have an account?
                            <Link className="text-indigo-400 hover:underline underline-offset-4 font-semibold ml-2" href="/login">Log in</Link>
                        </p>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="material-icons text-emerald-500 text-[12px]">verified_user</span>
                            <span className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase">Secure 256-bit Registration</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
