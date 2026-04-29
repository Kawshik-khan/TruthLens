"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, AlertTriangle, CheckCircle, Send, FileText } from "lucide-react";

export default function FeedbackPage() {
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [feedbackId, setFeedbackId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("");
    const [severity, setSeverity] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const fullMessage = `[${category || "General"} - ${severity || "Normal"}] ${message}`;
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message: fullMessage }),
            });

            const data = await res.json();

            if (res.ok) {
                setFeedbackId(data.id);
                setSubmitted(true);
                setName("");
                setEmail("");
                setCategory("");
                setSeverity("");
                setMessage("");
                setTimeout(() => setSubmitted(false), 8000);
            } else {
                setError(data.error || "Failed to submit feedback");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-white font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="bento-grid">
                    {/* Left Side - Why Feedback Matters */}
                    <div className="bento-item col-span-12 lg:col-span-5 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                                <MessageSquare className="w-5 h-5 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Report an Issue</h2>
                        </div>
                    </div>

                    {/* Right Side - Modern Report Form */}
                    <div className="bento-item col-span-12 lg:col-span-7 p-8">

                        {submitted && (
                            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold">Feedback submitted successfully!</span>
                                </div>
                                <p className="text-sm mt-1">Reference ID: {feedbackId}</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                {error}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                                    <input
                                        className="w-full glass-input rounded-lg py-3 px-4 text-white outline-none transition-all placeholder:text-white/50"
                                        type="text"
                                        placeholder="Your full name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                                    <input
                                        className="w-full glass-input rounded-lg py-3 px-4 text-white outline-none transition-all placeholder:text-white/50"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Category Cards */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-3">Category</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: "Accuracy Issue", label: "Accuracy Issue", icon: AlertTriangle },
                                        { value: "Bug Report", label: "Bug Report", icon: MessageSquare },
                                        { value: "Feature Request", label: "Feature Request", icon: FileText },
                                        { value: "General Feedback", label: "General", icon: MessageSquare },
                                    ].map((cat) => (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => setCategory(cat.value)}
                                            className={`p-3 rounded-lg border transition-all flex items-center gap-3 ${
                                                category === cat.value
                                                    ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                                                    : "border-white/10 glass-panel text-white/70 hover:border-white/20"
                                            }`}
                                        >
                                            <cat.icon className="w-4 h-4" />
                                            <span className="text-sm">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Severity Selector */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-3">Severity</label>
                                <div className="flex gap-3">
                                    {[
                                        { value: "Low", color: "text-blue-400 border-blue-500/20" },
                                        { value: "Medium", color: "text-amber-400 border-amber-500/20" },
                                        { value: "High", color: "text-red-400 border-red-500/20" },
                                        { value: "Critical", color: "text-red-600 border-red-600/20" },
                                    ].map((sev) => (
                                        <button
                                            key={sev.value}
                                            type="button"
                                            onClick={() => setSeverity(sev.value)}
                                            className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                                                severity === sev.value
                                                    ? `${sev.color} bg-current/10`
                                                    : "border-white/10 text-white/70 hover:border-white/20"
                                            }`}
                                        >
                                            {sev.value}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                                <textarea
                                    className="w-full glass-input rounded-lg py-3 px-4 text-white outline-none transition-all placeholder:text-white/50 min-h-[120px] resize-none"
                                    placeholder="Describe the issue or provide your feedback..."
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? "Submitting..." : "Submit Feedback"}
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
