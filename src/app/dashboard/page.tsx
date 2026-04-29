"use client";

import AuthLayout from "@/components/AuthLayout";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Activity, Shield, Search, Bot, CheckCircle, TrendingUp, Target, Award } from "lucide-react";
import { getAuthHeader, requireAuth } from "@/lib/auth";

interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

function computeTrustTier(avgScore: number): { label: string; level: number } {
    if (avgScore >= 85) return { label: "Trust Tier 1", level: 1 };
    if (avgScore >= 60) return { label: "Trust Tier 2", level: 2 };
    return { label: "Trust Tier 3", level: 3 };
}

export default function DashboardPage() {
    const [historyItems, setHistoryItems] = useState<any[]>([]);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check authentication first
        requireAuth();

        const fetchData = async () => {
            try {
                const headers = getAuthHeader();
                
                const [historyRes, userRes] = await Promise.all([
                    fetch("/api/submissions", { headers }),
                    fetch("/api/auth/me", { headers }),
                ]);

                if (historyRes.ok) {
                    const data = await historyRes.json();
                    setHistoryItems(data);
                }
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const avgScore = historyItems.length > 0
        ? Math.round(historyItems.reduce((acc, curr) => acc + curr.trustScore, 0) / historyItems.length)
        : 0;
    const trustTier = computeTrustTier(avgScore);

    return (
        <AuthLayout>
            <main className="max-w-7xl">
                <div className="bento-grid">
                    {/* Top Hero Row */}
                    <motion.div
                        className="bento-item col-span-12 md:col-span-6 p-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <User className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Welcome back{user ? `, ${user.name}` : ""}</h2>
                                <p className="text-white/60">Ready to verify the truth?</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                <span className="text-indigo-400 font-semibold text-sm">{historyItems.length > 0 ? trustTier.label : "New Member"}</span>
                            </div>
                            {user?.role && (
                                <span className="text-white/60 text-sm">{user.role}</span>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        className="bento-item col-span-12 md:col-span-3 p-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-white font-semibold mb-4">Trust Tier</h3>
                        <div className="text-4xl font-bold text-white mb-2">{trustTier.level}</div>
                        <div className="text-white/60 text-sm">Level {trustTier.level}</div>
                    </motion.div>

                    <motion.div
                        className="bento-item col-span-12 md:col-span-3 p-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-white font-semibold mb-4">Weekly Stats</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">This Week</span>
                                <span className="text-white">{historyItems.filter(item => {
                                    const itemDate = new Date(item.createdAt);
                                    const weekAgo = new Date();
                                    weekAgo.setDate(weekAgo.getDate() - 7);
                                    return itemDate >= weekAgo;
                                }).length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Avg Score</span>
                                <span className="text-white">{historyItems.length > 0 ? avgScore : "--"}%</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Second Row - AI Tools */}
                    <motion.div
                        className="bento-item col-span-12 md:col-span-4 p-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <Link href="/submit" className="block h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                                    <Search className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-white font-semibold">Analyze</h3>
                            </div>
                            <p className="text-white/70 text-sm">Submit claims for AI-powered verification</p>
                        </Link>
                    </motion.div>

                    <motion.div
                        className="bento-item col-span-12 md:col-span-4 p-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/analyze" className="block h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-white font-semibold">Verify</h3>
                            </div>
                            <p className="text-white/70 text-sm">Deep analysis with source validation</p>
                        </Link>
                    </motion.div>

                    <motion.div
                        className="bento-item col-span-12 md:col-span-4 p-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href="/analyze" className="block h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                                    <Bot className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="text-white font-semibold">AI Chat</h3>
                            </div>
                            <p className="text-white/70 text-sm">Chat with AI about fact-checking</p>
                        </Link>
                    </motion.div>

                    {/* Third Row - Submission History */}
                    <motion.div
                        className="bento-item col-span-12 p-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-xl font-bold text-white mb-6">Recent Submissions</h3>
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="text-white/60">Loading history...</div>
                            </div>
                        ) : historyItems.length === 0 ? (
                            <div className="text-center py-12">
                                <Activity className="w-12 h-12 text-white/30 mx-auto mb-4" />
                                <p className="text-white/60 mb-4">No analysis history yet</p>
                                <Link href="/submit" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300">
                                    Start your first analysis →
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {historyItems.slice(0, 6).map((item) => {
                                    let sourceDisplay = "Text Claim";
                                    try {
                                        if (item.url) sourceDisplay = new URL(item.url).hostname;
                                    } catch { /* keep default */ }

                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/report?id=${item.id}`}
                                            className="bento-item p-6 hover:scale-[1.02] transition-transform"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    item.status === "VERIFIED" ? "bg-emerald-500/20" :
                                                    item.status === "RELIABLE" ? "bg-blue-500/20" :
                                                    item.status === "FLAGGED" ? "bg-amber-500/20" : "bg-red-500/20"
                                                }`}>
                                                    <CheckCircle className={`w-4 h-4 ${
                                                        item.status === "VERIFIED" ? "text-emerald-400" :
                                                        item.status === "RELIABLE" ? "text-blue-400" :
                                                        item.status === "FLAGGED" ? "text-amber-400" : "text-red-400"
                                                    }`} />
                                                </div>
                                                <div className="text-sm text-white/60">{sourceDisplay}</div>
                                            </div>
                                            <h4 className="text-white font-semibold mb-2 line-clamp-2">{item.title}</h4>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-white/60">{item.trustScore}%</span>
                                                <span className="text-white/60">{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Fourth Row - Analytics */}
                    <motion.div
                        className="bento-item col-span-12 md:col-span-3 p-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-white font-semibold mb-4">Claims Analyzed</h3>
                        <div className="text-4xl font-bold text-white mb-2">{historyItems.length}</div>
                        <div className="text-white/60 text-sm">Total submissions</div>
                    </motion.div>

                    <motion.div
                        className="bento-item col-span-12 md:col-span-3 p-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-white font-semibold mb-4">Accuracy Trend</h3>
                        <div className="text-4xl font-bold text-white mb-2">{historyItems.length > 0 ? avgScore : 0}%</div>
                        <div className="flex items-center justify-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-sm">Improving</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bento-item col-span-12 md:col-span-3 p-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-white font-semibold mb-4">Fake vs Real</h3>
                        <div className="text-4xl font-bold text-white mb-2">
                            {historyItems.length > 0 ? Math.round((historyItems.filter(i => i.status === "VERIFIED" || i.status === "RELIABLE").length / historyItems.length) * 100) : 0}%
                        </div>
                        <div className="text-white/60 text-sm">Verified claims</div>
                    </motion.div>

                    <motion.div
                        className="bento-item col-span-12 md:col-span-3 p-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-white font-semibold mb-4">Analysis Streak</h3>
                        <div className="text-4xl font-bold text-white mb-2">
                            {historyItems.filter(item => {
                                const itemDate = new Date(item.createdAt);
                                const today = new Date();
                                const diffTime = Math.abs(today.getTime() - itemDate.getTime());
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                return diffDays <= 7;
                            }).length}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Award className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm">This week</span>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-20">
                    <Footer />
                </div>
            </main>
        </AuthLayout>
    );
}
