"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { config } from "@/lib/config";

export default function LoginPage() {
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
                router.push("/dashboard");
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none opacity-50" style={{ backgroundImage: "radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
            <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Main Content */}
            <main className="relative z-10 w-full max-w-md px-6">
                {/* Branding Area */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/20 border border-primary/30 mb-4 transition-all hover:bg-primary/30">
                        <span className="material-icons text-primary text-4xl">center_focus_strong</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{config.app.name}</h1>
                    <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest">{config.app.tagline}</p>
                </div>

                {/* Login Card */}
                <div className="glass-panel rounded-2xl p-8 transition-all duration-300">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2 ml-1" htmlFor="email">Corporate Email</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons text-slate-500 text-sm">alternate_email</span>
                                <input
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                                    id="email" placeholder={`username@${config.auth.domainWhitelist[0] || 'example.com'}`} type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-semibold text-slate-500 uppercase ml-1" htmlFor="password">Security Key</label>
                                <Link className="text-xs text-primary hover:text-primary/80 transition-colors font-medium" href={`mailto:${config.app.supportEmail}`}>Lost access?</Link>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons text-slate-500 text-sm">lock_open</span>
                                <input
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                                    id="password" placeholder="••••••••••••" type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-lg btn-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? "Initializing..." : "Initialize Session"}
                            <span className="material-icons text-sm">arrow_forward</span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0f172a] px-3 text-slate-500 font-medium tracking-wider">Secure SSO</span>
                        </div>
                    </div>

                    {/* SSO Options */}
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <button key={i} className="flex items-center justify-center p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors group">
                                <div className="w-5 h-5 bg-slate-700 rounded-sm opacity-50"></div>
                            </button>
                        ))}
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        New researcher?
                        <Link className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-2" href="/register">Initialize account</Link>
                    </p>
                </div>

                {/* Security Badge */}
                <div className="mt-8 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">Secure Environment · SSL 256-bit</span>
                </div>
            </main>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-10 hidden xl:block">
                <div className="p-4 glass-panel rounded-lg border-l-4 border-l-primary">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800">
                            <img alt="Marcus K." className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkdMR1o7qKvrWAFKNgotBW4fa1-6LwLqXI6S5foP27_jYvAEtjZ4ghEuO8gY_juQBV02CGJrKboG2wku8QHUH3a5jVuTHIoBRJjYWMQyAHvxGqkFHVGxXGbwP7eEokYcSOL-PnrjoLnR_N3e4E8D7Lf1J0KGc3Up3Z2UehSpV8_u8P8HMrsvs_6teMdlu2X6GnX0W27vt5HtYJHWegg61Cq3mDYfIYJKamtbaYmBKgJlomHFcJVO_MGvr3k9x8908Xuv3ikcBJAGE" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-300 font-bold">Verified Operator</p>
                            <p className="text-[10px] text-primary">Marcus K. Intelligence Dir.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
