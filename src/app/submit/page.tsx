"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, Search, BookOpen, Database, History, ArrowRight, ExternalLink, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [error, setError] = useState("");
    const router = useRouter();
    const { isAuthenticated, user, isLoading: authLoading } = useAuth();

    // Debug authentication state changes
    useEffect(() => {
        console.log("Submit page - Auth state updated:", { isAuthenticated, user, authLoading });
    }, [isAuthenticated, user, authLoading]);

    // Redirect to login if auth has loaded and user is not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            console.log("Submit page - Not authenticated, redirecting to login");
            router.push("/login?next=/submit");
        }
    }, [authLoading, isAuthenticated, router]);

    const isValid = content.trim().length >= 10;

    const handleAnalyze = async () => {
        if (!isValid) return;
        
        // Check authentication before making API call
        if (!isAuthenticated) {
            setError("Please log in to verify claims.");
            setTimeout(() => { window.location.href = "/login"; }, 2000);
            return;
        }
        
        // Show user info for debugging
        console.log("Submit page - User authenticated:", isAuthenticated, "User:", user);
        setIsLoading(true);
        setAnalysisResult(null);
        setError("");

        try {
            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content: content.trim() }),
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data);
            } else {
                const errData = await response.json();
                if (response.status === 401) {
                    setError("Please log in to verify claims.");
                    setTimeout(() => { window.location.href = "/login"; }, 2000);
                } else {
                    setError(errData.error || "Verification failed");
                }
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "VERIFIED": return "text-emerald-500";
            case "RELIABLE": return "text-blue-400";
            case "FLAGGED": return "text-amber-500";
            case "FAKE": return "text-red-500";
            default: return "text-slate-400";
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case "VERIFIED": return "bg-emerald-500/10 border-emerald-500/20";
            case "RELIABLE": return "bg-blue-500/10 border-blue-500/20";
            case "FLAGGED": return "bg-amber-500/10 border-amber-500/20";
            case "FAKE": return "bg-red-500/10 border-red-500/20";
            default: return "bg-slate-500/10 border-slate-500/20";
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status) {
            case "VERIFIED": return "Multiple independent sources corroborate this information. High confidence in accuracy.";
            case "RELIABLE": return "Some supporting evidence found across verified networks. Moderate confidence.";
            case "FLAGGED": return "Limited corroboration found. This claim should be treated with caution.";
            case "FAKE": return "No corroborating evidence found. This information is likely fabricated or heavily misleading.";
            default: return "Analysis complete.";
        }
    };

    return (
        <>
            <Navbar />

            <main className="relative min-h-screen pt-24 pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Analyze Any Claim
                        </h1>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto">
                            Advanced AI-driven verification engine for misinformation detection.
                        </p>
                    </motion.div>

                    <div className="bento-grid">
                        {/* Main Input Panel */}
                        <motion.div
                            className="bento-item col-span-12 md:col-span-8 p-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                                    <Search className="w-5 h-5 text-blue-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Enter Your Claim</h2>
                            </div>

                            <textarea
                                className="w-full glass-input rounded-lg py-4 px-4 text-white outline-none transition-all placeholder:text-white/50 mb-4 min-h-[120px] resize-none"
                                placeholder="Paste any news headline, claim, or statement here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />

                            {/* Example Claims Chips */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {[
                                    "Scientists discover water on Mars in 2024",
                                    "COVID-19 vaccines contain microchips",
                                    "The moon landing was faked"
                                ].map((example, i) => (
                                    <button
                                        key={i}
                                        className="px-3 py-1.5 glass-panel text-white/70 hover:text-white rounded-lg text-sm transition-colors"
                                        onClick={() => setContent(example)}
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-white/60">
                                    {content.length} characters {isValid ? (isAuthenticated ? "(Ready to analyze)" : "(Please sign in to analyze)") : "(Minimum 10 characters)"}
                                </div>
                                <button
                                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all flex items-center gap-2 disabled:opacity-50"
                                    onClick={handleAnalyze}
                                    disabled={!isValid || isLoading || !isAuthenticated}
                                >
                                    {isLoading ? "Analyzing..." : !isAuthenticated ? "Sign in to Analyze" : "Start Analysis"}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Live AI Status Card */}
                        <motion.div
                            className="bento-item col-span-12 md:col-span-4 p-6"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Activity className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-white font-semibold">Live AI Status</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/70 text-sm">Sources Active</span>
                                    <span className="text-emerald-400 font-mono">1,247</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/70 text-sm">Processing Speed</span>
                                    <span className="text-blue-400 font-mono">2.3s</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/70 text-sm">Accuracy Rate</span>
                                    <span className="text-indigo-400 font-mono">99.7%</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature Cards */}
                        <motion.div
                            className="bento-item col-span-12 md:col-span-4 p-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link href="/learn" className="block h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                        <BookOpen className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="text-white font-semibold">Education Hub</h3>
                                </div>
                                <p className="text-white/70 text-sm">Learn about misinformation detection and media literacy.</p>
                            </Link>
                        </motion.div>

                        <motion.div
                            className="bento-item col-span-12 md:col-span-4 p-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link href="/sources" className="block h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                                        <Database className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-white font-semibold">Bias Database</h3>
                                </div>
                                <p className="text-white/70 text-sm">Explore credibility ratings for global news sources.</p>
                            </Link>
                        </motion.div>

                        <motion.div
                            className="bento-item col-span-12 md:col-span-4 p-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link href="/dashboard" className="block h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                                        <History className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <h3 className="text-white font-semibold">Analysis History</h3>
                                </div>
                                <p className="text-white/70 text-sm">View your past claim verifications and insights.</p>
                            </Link>
                        </motion.div>

                        {/* Analysis Results Section */}
                        {analysisResult && (
                            <motion.div
                                className="bento-item col-span-12 p-8"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getStatusBg(analysisResult.status)}`}>
                                        {analysisResult.status === "VERIFIED" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                                        {analysisResult.status === "RELIABLE" && <CheckCircle className="w-5 h-5 text-blue-400" />}
                                        {analysisResult.status === "FLAGGED" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                                        {analysisResult.status === "FAKE" && <XCircle className="w-5 h-5 text-red-500" />}
                                        {!["VERIFIED", "RELIABLE", "FLAGGED", "FAKE"].includes(analysisResult.status) && <Shield className="w-5 h-5 text-slate-400" />}
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Analysis Results</h2>
                                </div>

                                {/* Status and Trust Score */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className={`glass-panel rounded-lg p-6 border ${getStatusBg(analysisResult.status)}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white/70 text-sm">Verification Status</span>
                                            <span className={`font-bold ${getStatusColor(analysisResult.status)}`}>
                                                {analysisResult.status || "ANALYZING"}
                                            </span>
                                        </div>
                                        <p className="text-white/60 text-sm">
                                            {getStatusMessage(analysisResult.status)}
                                        </p>
                                    </div>
                                    <div className="glass-panel rounded-lg p-6 border border-slate-500/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white/70 text-sm">Trust Score</span>
                                            <span className="font-bold text-white">
                                                {analysisResult.trustScore || analysisResult.accuracy || 0}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all ${
                                                    (analysisResult.trustScore || analysisResult.accuracy || 0) >= 80 ? 'bg-emerald-500' :
                                                    (analysisResult.trustScore || analysisResult.accuracy || 0) >= 60 ? 'bg-blue-400' :
                                                    (analysisResult.trustScore || analysisResult.accuracy || 0) >= 40 ? 'bg-amber-500' :
                                                    'bg-red-500'
                                                }`}
                                                style={{ width: `${analysisResult.trustScore || analysisResult.accuracy || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* AI Analysis */}
                                {analysisResult.aiAnalysis && (
                                    <div className="glass-panel rounded-lg p-6 mb-8 border border-slate-500/20">
                                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-blue-400" />
                                            AI Analysis
                                        </h3>
                                        <p className="text-white/80 leading-relaxed">
                                            {analysisResult.aiAnalysis}
                                        </p>
                                    </div>
                                )}

                                {/* Citations from Serper Search */}
                                {analysisResult.citations && analysisResult.citations.length > 0 && (
                                    <div className="glass-panel rounded-lg p-6 border border-slate-500/20">
                                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                            <Search className="w-4 h-4 text-blue-400" />
                                            Found {analysisResult.citations.length} Sources
                                        </h3>
                                        <div className="space-y-3">
                                            {analysisResult.citations.map((citation: any, index: number) => (
                                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-600/30 hover:border-slate-500/50 transition-colors">
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">
                                                            {citation.title}
                                                        </h4>
                                                        <p className="text-white/60 text-xs mb-2">
                                                            {citation.source}
                                                        </p>
                                                        {citation.url && (
                                                            <a
                                                                href={citation.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                                                            >
                                                                <ExternalLink className="w-3 h-3" />
                                                                Visit Source
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* No Sources Found */}
                                {(!analysisResult.citations || analysisResult.citations.length === 0) && (
                                    <div className="glass-panel rounded-lg p-6 border border-amber-500/20">
                                        <div className="flex items-center gap-3 text-amber-400">
                                            <AlertTriangle className="w-5 h-5" />
                                            <span className="font-medium">No corroborating sources found</span>
                                        </div>
                                        <p className="text-white/60 text-sm mt-2">
                                            This claim could not be verified with external sources. Exercise caution when evaluating this information.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
