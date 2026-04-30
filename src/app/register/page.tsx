"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, Users, Activity, UserPlus, CheckCircle } from "lucide-react";
import { config } from "@/lib/config";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState(config.auth.defaultUserRole);
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
                // Auto-login after successful registration
                const loginRes = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                    credentials: "include", // Important: includes cookies
                });

                if (loginRes.ok) {
                    // Cookie is automatically set by browser
                    // Redirect to dashboard
                    router.push("/dashboard");
                } else {
                    // If auto-login fails, redirect to login page
                    router.push("/login");
                }
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
        <div className="min-h-screen flex relative overflow-hidden font-sans">
            {/* Left Side - Brand Story */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <div className="max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold text-white mb-4">Join TruthLens</h1>
                        <p className="text-white/70 text-lg">Be part of the future of information verification</p>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.div
                            className="bento-item p-6"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                                    <UserPlus className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Free to Start</h3>
                                    <p className="text-white/60 text-sm">No credit card required</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bento-item p-6"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Secure & Private</h3>
                                    <p className="text-white/60 text-sm">Your data stays protected</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bento-item p-6"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                                    <Activity className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Instant Access</h3>
                                    <p className="text-white/60 text-sm">Start verifying claims immediately</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Panel */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Brand Identity - Mobile Only */}
                    <div className="text-center mb-8 lg:hidden">
                        <Link href="/" className="inline-flex items-center justify-center p-3 rounded-xl glass-panel border-white/10 mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </Link>
                        <h1 className="text-3xl font-bold text-white tracking-tight">TruthLens</h1>
                        <p className="text-white/60 text-lg">Create your account</p>
                    </div>

                    {/* Registration Card */}
                    <motion.div
                        className="glass-panel rounded-2xl p-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <form className="space-y-6" onSubmit={handleRegister}>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                                    {error}
                                </div>
                            )}
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="full-name">Full Name</label>
                                <input
                                    className="w-full glass-input rounded-lg py-3 px-4 text-white outline-none transition-all placeholder:text-white/50"
                                    id="full-name" placeholder="Enter your full name" required type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="email">Email Address</label>
                                <input
                                    className="w-full glass-input rounded-lg py-3 px-4 text-white outline-none transition-all placeholder:text-white/50"
                                    id="email" placeholder="Enter your email" required type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="password">Password</label>
                                <div className="relative">
                                    <input
                                        className="w-full glass-input rounded-lg py-3 px-4 pr-12 text-white outline-none transition-all placeholder:text-white/50"
                                        id="password" placeholder="Create a password" required type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-3">Your Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {config.auth.availableRoles.filter(r => r !== 'ADMIN').map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`flex items-center justify-center p-3 rounded-lg border transition-all ${role === r ? "border-blue-500/40 bg-blue-500/10 text-blue-400" : "border-white/10 glass-panel text-white/70 hover:border-white/20"}`}
                                        >
                                            <span className="text-sm font-medium">{r}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Primary CTA */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black font-semibold py-3.5 rounded-lg hover:bg-white/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>

                        {/* Card Footer */}
                        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center gap-4">
                            <p className="text-white/60 text-sm">
                                Already have an account?
                                <Link className="text-blue-400 hover:text-blue-300 font-semibold ml-2" href="/login">Sign in</Link>
                            </p>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-emerald-500/20">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Secure Registration</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
