"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, Users, Activity, CheckCircle } from "lucide-react";
import { config } from "@/lib/config";
import { setAuthState } from "@/lib/auth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
                
                // Store the token and user data using auth utilities
                try {
                    setAuthState(data.token, data.user);
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 100);
                    
                } catch (authError) {
                    setError("Error saving login information");
                }
            } else {
                const data = await res.json();
                setError(data.error || "Login failed");
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
                        <h1 className="text-4xl font-bold text-white mb-4">TruthLens</h1>
                        <p className="text-white/70 text-lg">Advanced AI-driven verification for the information age</p>
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
                                    <Shield className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">99.9% Accuracy</h3>
                                    <p className="text-white/60 text-sm">Enterprise-grade verification</p>
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
                                    <Users className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">10,000+ Users</h3>
                                    <p className="text-white/60 text-sm">Trusted by professionals worldwide</p>
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
                                    <h3 className="text-white font-semibold">Real-time Analysis</h3>
                                    <p className="text-white/60 text-sm">Instant misinformation detection</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Panel */}
            <div className="flex-1 flex items-center justify-center p-6">
                <main className="w-full max-w-md">
                    {/* Branding Area - Mobile Only */}
                    <div className="text-center mb-8 lg:hidden">
                        <Link href="/" className="inline-flex items-center justify-center p-3 rounded-xl glass-panel border-white/10 mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </Link>
                        <h1 className="text-3xl font-bold text-white tracking-tight">TruthLens</h1>
                        <p className="text-white/60 mt-2 text-sm uppercase tracking-widest">AI-Powered Verification</p>
                    </div>

                    {/* Login Card */}
                    <motion.div
                        className="glass-panel rounded-2xl p-8 transition-all duration-300"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="email">Email Address</label>
                            <input
                                className="w-full glass-input rounded-lg py-3 px-4 text-white outline-none transition-all placeholder:text-white/50"
                                id="email" placeholder="Enter your email" type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-white/70" htmlFor="password">Password</label>
                                <Link className="text-sm text-blue-400 hover:text-blue-300 transition-colors" href="mailto:support@example.com">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    className="w-full glass-input rounded-lg py-3 px-4 pr-12 text-white outline-none transition-all placeholder:text-white/50"
                                    id="password" placeholder="Enter your password" type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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

                        {/* Action Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-semibold py-3.5 rounded-lg hover:bg-white/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-black px-4 text-white/60">Or continue with</span>
                            </div>
                        </div>

                        {/* SSO Options */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center p-3 rounded-lg glass-panel border-white/10 hover:bg-white/5 transition-colors">
                                <span className="text-white/70 text-sm">Google</span>
                            </button>
                            <button className="flex items-center justify-center p-3 rounded-lg glass-panel border-white/10 hover:bg-white/5 transition-colors">
                                <span className="text-white/70 text-sm">GitHub</span>
                            </button>
                        </div>

                        <p className="mt-8 text-center text-sm text-white/60">
                            Don't have an account?
                            <Link className="text-blue-400 font-semibold hover:text-blue-300 ml-2" href="/register">Sign up</Link>
                        </p>
                    </motion.div>

                    {/* Security Badge */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-white/60 uppercase tracking-widest font-medium">Secure Environment · SSL 256-bit</span>
                    </div>
                </main>
            </div>
        </div>
    );
}
