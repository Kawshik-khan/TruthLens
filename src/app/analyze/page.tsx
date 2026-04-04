"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";
import AIAnalysisCard from "@/components/AIAnalysisCard";

type TabKey = "fake-news" | "sentiment" | "summarize" | "claims" | "credibility";

interface TabConfig {
    key: TabKey;
    label: string;
    icon: string;
    color: string;
    description: string;
}

const TABS: TabConfig[] = [
    { key: "fake-news", label: "Fake News", icon: "fact_check", color: "rose", description: "Detect misinformation using zero-shot AI classification" },
    { key: "sentiment", label: "Sentiment", icon: "mood", color: "amber", description: "Analyze the emotional tone and bias of text" },
    { key: "summarize", label: "Summarize", icon: "summarize", color: "cyan", description: "Generate concise summaries with key bullet points" },
    { key: "claims", label: "Claims", icon: "manage_search", color: "purple", description: "Extract factual claims and named entities" },
    { key: "credibility", label: "Source Check", icon: "verified_user", color: "emerald", description: "Evaluate domain credibility and trustworthiness" },
];

export default function AnalyzePage() {
    const [activeTab, setActiveTab] = useState<TabKey>("fake-news");
    const [inputText, setInputText] = useState("");
    const [domainInput, setDomainInput] = useState("");
    const [results, setResults] = useState<Record<string, any>>({});
    const [statuses, setStatuses] = useState<Record<string, "idle" | "loading" | "success" | "error">>({});

    const activeConfig = TABS.find(t => t.key === activeTab)!;

    const setStatus = (key: string, status: "idle" | "loading" | "success" | "error") => {
        setStatuses(prev => ({ ...prev, [key]: status }));
    };

    const setResult = (key: string, data: any) => {
        setResults(prev => ({ ...prev, [key]: data }));
    };

    const runAnalysis = async (type: TabKey) => {
        if (type === "credibility") {
            if (!domainInput.trim()) return;
        } else {
            if (!inputText.trim() || inputText.trim().length < 10) return;
        }

        setStatus(type, "loading");

        try {
            let url = `/api/ai/${type}`;
            let body: any = {};

            if (type === "credibility") {
                body = { domain: domainInput.trim() };
            } else {
                body = { text: inputText.trim() };
            }

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();
                setResult(type, data);
                setStatus(type, "success");
            } else {
                const err = await response.json();
                if (response.status === 401) {
                    window.location.href = "/login";
                    return;
                }
                setResult(type, { error: err.error || "Analysis failed" });
                setStatus(type, "error");
            }
        } catch {
            setResult(type, { error: "Connection error. Is the AI service running?" });
            setStatus(type, "error");
        }
    };

    const runAllAnalyses = async () => {
        if (!inputText.trim() || inputText.trim().length < 10) return;
        const textTabs: TabKey[] = ["fake-news", "sentiment", "summarize", "claims"];
        await Promise.all(textTabs.map(tab => runAnalysis(tab)));
    };

    return (
        <div className="dark transition-all duration-700">
            <div className="fixed inset-0 tech-grid pointer-events-none"></div>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            <Navbar />

            <main className="relative pt-32 pb-20 px-6 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-600/5 border border-indigo-600/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                            </span>
                            AI Analysis Suite
                        </div>
                        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                            Deep Content{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                Analysis
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Leverage six AI-powered models to analyze text for misinformation, sentiment, credibility, and more.
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className="mb-10">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-3xl blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
                            <div className="relative glass-input rounded-2xl shadow-2xl overflow-hidden">
                                <div className="flex items-center gap-3 px-6 pt-5 pb-2">
                                    <span className="material-symbols-outlined text-indigo-400 text-xl">edit_note</span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                        {activeTab === "credibility" ? "Enter domain to check" : "Enter text to analyze"}
                                    </span>
                                </div>

                                {activeTab === "credibility" ? (
                                    <div className="px-6 pb-4">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-none text-white placeholder:text-slate-600 font-display text-lg tracking-wide outline-none py-3"
                                            placeholder="e.g., reuters.com, foxnews.com, infowars.com"
                                            value={domainInput}
                                            onChange={(e) => setDomainInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && runAnalysis("credibility")}
                                        />
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full px-6 pb-4 pt-2 bg-transparent border-none text-white placeholder:text-slate-600 text-base tracking-wide outline-none resize-none min-h-[140px]"
                                        placeholder="Paste any article, news headline, or statement here for AI analysis..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                )}

                                <div className="px-6 pb-4 flex items-center justify-between border-t border-white/5 pt-3">
                                    <div className="flex items-center gap-4">
                                        {activeTab !== "credibility" && inputText.length > 0 && (
                                            <span className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 ${inputText.trim().length >= 10 ? "text-emerald-500" : "text-slate-600"}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${inputText.trim().length >= 10 ? "bg-emerald-500 animate-pulse" : "bg-slate-700"}`}></span>
                                                {inputText.trim().length} chars
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {activeTab !== "credibility" && (
                                            <button
                                                onClick={runAllAnalyses}
                                                disabled={!inputText.trim() || inputText.trim().length < 10}
                                                className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                Run All
                                            </button>
                                        )}
                                        <button
                                            onClick={() => runAnalysis(activeTab)}
                                            disabled={activeTab === "credibility" ? !domainInput.trim() : (!inputText.trim() || inputText.trim().length < 10)}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                {statuses[activeTab] === "loading" ? "progress_activity" : "cognition"}
                                            </span>
                                            {statuses[activeTab] === "loading" ? "Analyzing" : "Analyze"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-thin">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all
                                    ${activeTab === tab.key
                                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/30"
                                        : "text-slate-500 hover:text-slate-300 border border-transparent hover:bg-white/5"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                {tab.label}
                                {statuses[tab.key] === "success" && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Active Tab Description */}
                    <div className="flex items-center gap-3 mb-6 px-1">
                        <span className={`material-symbols-outlined text-slate-600`}>{activeConfig.icon}</span>
                        <span className="text-sm text-slate-500">{activeConfig.description}</span>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        {/* Fake News Detection */}
                        {activeTab === "fake-news" && (
                            <AIAnalysisCard
                                title="Fake News Detection"
                                icon="fact_check"
                                status={statuses["fake-news"] || "idle"}
                                accentColor="rose"
                            >
                                {results["fake-news"] && statuses["fake-news"] === "success" && (
                                    <FakeNewsResult data={results["fake-news"]} />
                                )}
                                {results["fake-news"]?.error && statuses["fake-news"] === "error" && (
                                    <ErrorDisplay message={results["fake-news"].error} />
                                )}
                            </AIAnalysisCard>
                        )}

                        {/* Sentiment Analysis */}
                        {activeTab === "sentiment" && (
                            <AIAnalysisCard
                                title="Sentiment Analysis"
                                icon="mood"
                                status={statuses["sentiment"] || "idle"}
                                accentColor="amber"
                            >
                                {results["sentiment"] && statuses["sentiment"] === "success" && (
                                    <SentimentResult data={results["sentiment"]} />
                                )}
                                {results["sentiment"]?.error && statuses["sentiment"] === "error" && (
                                    <ErrorDisplay message={results["sentiment"].error} />
                                )}
                            </AIAnalysisCard>
                        )}

                        {/* Summarization */}
                        {activeTab === "summarize" && (
                            <AIAnalysisCard
                                title="Text Summarization"
                                icon="summarize"
                                status={statuses["summarize"] || "idle"}
                                accentColor="cyan"
                            >
                                {results["summarize"] && statuses["summarize"] === "success" && (
                                    <SummarizeResult data={results["summarize"]} />
                                )}
                                {results["summarize"]?.error && statuses["summarize"] === "error" && (
                                    <ErrorDisplay message={results["summarize"].error} />
                                )}
                            </AIAnalysisCard>
                        )}

                        {/* Claim Extraction */}
                        {activeTab === "claims" && (
                            <AIAnalysisCard
                                title="Claim & Entity Extraction"
                                icon="manage_search"
                                status={statuses["claims"] || "idle"}
                                accentColor="purple"
                            >
                                {results["claims"] && statuses["claims"] === "success" && (
                                    <ClaimsResult data={results["claims"]} />
                                )}
                                {results["claims"]?.error && statuses["claims"] === "error" && (
                                    <ErrorDisplay message={results["claims"].error} />
                                )}
                            </AIAnalysisCard>
                        )}

                        {/* Source Credibility */}
                        {activeTab === "credibility" && (
                            <AIAnalysisCard
                                title="Source Credibility Check"
                                icon="verified_user"
                                status={statuses["credibility"] || "idle"}
                                accentColor="emerald"
                            >
                                {results["credibility"] && statuses["credibility"] === "success" && (
                                    <CredibilityResult data={results["credibility"]} />
                                )}
                                {results["credibility"]?.error && statuses["credibility"] === "error" && (
                                    <ErrorDisplay message={results["credibility"].error} />
                                )}
                            </AIAnalysisCard>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
            <AIChatWidget />
        </div>
    );
}

/* ── Result Components ────────────────────────────────────────── */

function ErrorDisplay({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
            <span className="material-symbols-outlined text-red-500">error</span>
            <span className="text-sm text-red-400">{message}</span>
        </div>
    );
}

function ConfidenceGauge({ value, color }: { value: number; color: string }) {
    const percentage = Math.round(value * 100);
    const colorClasses: Record<string, string> = {
        emerald: "text-emerald-400 from-emerald-500",
        red: "text-red-400 from-red-500",
        amber: "text-amber-400 from-amber-500",
        blue: "text-blue-400 from-blue-500",
        rose: "text-rose-400 from-rose-500",
    };
    const cls = colorClasses[color] || colorClasses.blue;

    return (
        <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${percentage * 2.64} ${264 - percentage * 2.64}`}
                        className={cls.split(" ")[0]}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold font-mono ${cls.split(" ")[0]}`}>{percentage}%</span>
                </div>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Confidence</span>
        </div>
    );
}

function FakeNewsResult({ data }: { data: any }) {
    const labelColors: Record<string, { color: string; icon: string; bg: string }> = {
        TRUE: { color: "text-emerald-400", icon: "verified", bg: "bg-emerald-500/10 border-emerald-500/20" },
        FALSE: { color: "text-red-400", icon: "dangerous", bg: "bg-red-500/10 border-red-500/20" },
        MISLEADING: { color: "text-amber-400", icon: "warning", bg: "bg-amber-500/10 border-amber-500/20" },
        UNCERTAIN: { color: "text-slate-400", icon: "help", bg: "bg-slate-500/10 border-slate-500/20" },
    };
    const config = labelColors[data.label] || labelColors.UNCERTAIN;

    return (
        <div className="space-y-6">
            {/* Verdict Banner */}
            <div className={`flex items-center gap-4 p-5 rounded-xl border ${config.bg}`}>
                <span className={`material-symbols-outlined text-3xl ${config.color}`}>{config.icon}</span>
                <div className="flex-1">
                    <div className={`font-bold text-lg ${config.color}`}>{data.label}</div>
                    <p className="text-sm text-slate-300 mt-1">{data.explanation}</p>
                </div>
                <ConfidenceGauge value={data.confidence} color={data.label === "TRUE" ? "emerald" : data.label === "FALSE" ? "red" : "amber"} />
            </div>

            {/* Score Breakdown */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">analytics</span>
                    Score Breakdown
                </h4>
                {Object.entries(data.scores || {}).map(([label, score]: [string, any]) => (
                    <div key={label} className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-24 font-mono">{label}</span>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                                style={{ width: `${Math.round(score * 100)}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-mono text-slate-500 w-12 text-right">{Math.round(score * 100)}%</span>
                    </div>
                ))}
            </div>

            <ProcessingTime ms={data.processing_time_ms} model="facebook/bart-large-mnli" />
        </div>
    );
}

function SentimentResult({ data }: { data: any }) {
    const sentimentConfig: Record<string, { color: string; icon: string; emoji: string }> = {
        POSITIVE: { color: "text-emerald-400", icon: "sentiment_satisfied", emoji: "😊" },
        NEGATIVE: { color: "text-red-400", icon: "sentiment_dissatisfied", emoji: "😟" },
        NEUTRAL: { color: "text-slate-400", icon: "sentiment_neutral", emoji: "😐" },
    };
    const config = sentimentConfig[data.sentiment] || sentimentConfig.NEUTRAL;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-center gap-4">
                    <span className="text-4xl">{config.emoji}</span>
                    <div>
                        <div className={`font-bold text-xl ${config.color}`}>{data.sentiment}</div>
                        <span className="text-xs text-slate-500">Dominant emotional tone detected</span>
                    </div>
                </div>
                <ConfidenceGauge value={data.confidence} color={data.sentiment === "POSITIVE" ? "emerald" : "red"} />
            </div>

            {/* Score Bars */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">equalizer</span>
                    Sentiment Distribution
                </h4>
                {Object.entries(data.scores || {}).map(([label, score]: [string, any]) => (
                    <div key={label} className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-20 font-mono">{label}</span>
                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${label === "POSITIVE" ? "bg-gradient-to-r from-emerald-500 to-green-400" : "bg-gradient-to-r from-red-500 to-rose-400"}`}
                                style={{ width: `${Math.round(score * 100)}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-mono text-slate-500 w-12 text-right">{Math.round(score * 100)}%</span>
                    </div>
                ))}
            </div>

            <ProcessingTime ms={data.processing_time_ms} model="distilbert-sst-2" />
        </div>
    );
}

function SummarizeResult({ data }: { data: any }) {
    return (
        <div className="space-y-6">
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">article</span>
                    Summary
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">{data.summary}</p>
            </div>

            {data.bullet_points?.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
                        Key Points
                    </h4>
                    <div className="space-y-2">
                        {data.bullet_points.map((point: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                                <span className="text-cyan-500 font-bold font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                                <span className="text-sm text-slate-300">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Original</div>
                    <div className="text-lg font-bold text-white font-mono">{data.original_length?.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-600">characters</div>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Summary</div>
                    <div className="text-lg font-bold text-cyan-400 font-mono">{data.summary_length?.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-600">characters</div>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Compression</div>
                    <div className="text-lg font-bold text-indigo-400 font-mono">{Math.round((data.compression_ratio || 0) * 100)}%</div>
                    <div className="text-[9px] text-slate-600">ratio</div>
                </div>
            </div>

            <ProcessingTime ms={data.processing_time_ms} model="facebook/bart-large-cnn" />
        </div>
    );
}

function ClaimsResult({ data }: { data: any }) {
    return (
        <div className="space-y-6">
            {/* Entities */}
            {data.entities?.length > 0 && (
                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">label</span>
                        Named Entities ({data.entity_count})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {data.entities.map((entity: any, i: number) => {
                            const typeColors: Record<string, string> = {
                                PER: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                                ORG: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                                LOC: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                MISC: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                            };
                            return (
                                <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${typeColors[entity.type] || typeColors.MISC}`}>
                                    {entity.text}
                                    <span className="ml-1.5 opacity-60 text-[9px] font-mono">{entity.type}</span>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Claims */}
            {data.claims?.length > 0 && (
                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">fact_check</span>
                        Extracted Claims ({data.claims.length})
                    </h4>
                    <div className="space-y-2">
                        {data.claims.map((claim: any, i: number) => (
                            <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <span className="text-purple-500 font-bold font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-300 mb-2">{claim.text}</p>
                                        {claim.entities?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {claim.entities.map((e: string, j: number) => (
                                                    <span key={j} className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md font-mono">
                                                        {e}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(!data.claims?.length && !data.entities?.length) && (
                <div className="text-center py-8 text-slate-500 text-sm">
                    No claims or entities were extracted from this text.
                </div>
            )}

            <ProcessingTime ms={data.processing_time_ms} model="dslim/bert-base-NER" />
        </div>
    );
}

function CredibilityResult({ data }: { data: any }) {
    const tierConfig: Record<string, { color: string; icon: string; bg: string }> = {
        TRUSTED: { color: "text-emerald-400", icon: "verified", bg: "bg-emerald-500/10 border-emerald-500/20" },
        QUESTIONABLE: { color: "text-amber-400", icon: "help", bg: "bg-amber-500/10 border-amber-500/20" },
        DISINFO: { color: "text-red-400", icon: "gpp_bad", bg: "bg-red-500/10 border-red-500/20" },
    };
    const config = tierConfig[data.tier] || tierConfig.QUESTIONABLE;

    return (
        <div className="space-y-6">
            {/* Score Banner */}
            <div className={`flex items-center gap-4 p-5 rounded-xl border ${config.bg}`}>
                <span className={`material-symbols-outlined text-3xl ${config.color}`}>{config.icon}</span>
                <div className="flex-1">
                    <div className="text-xs text-slate-500 font-mono mb-1">{data.domain}</div>
                    <div className={`font-bold text-xl ${config.color}`}>{data.tier}</div>
                </div>
                <div className="text-center">
                    <div className={`text-4xl font-bold font-mono ${config.color}`}>{Math.round(data.score)}</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest">Score</div>
                </div>
            </div>

            {/* Factors */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">tune</span>
                    Credibility Factors
                </h4>
                {data.factors?.map((factor: any, i: number) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-white">{factor.name}</span>
                            <span className={`text-xs font-mono font-bold ${factor.score >= 70 ? "text-emerald-400" : factor.score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                                {Math.round(factor.score)}/100
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{factor.description}</p>
                        <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${factor.score >= 70 ? "bg-emerald-500" : factor.score >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${factor.score}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <ProcessingTime ms={data.processing_time_ms} model="Rule-based engine" />
        </div>
    );
}

function ProcessingTime({ ms, model }: { ms: number; model: string }) {
    return (
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] text-slate-600">
                <span className="material-symbols-outlined text-sm">timer</span>
                <span className="font-mono">{ms}ms</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-600">
                <span className="material-symbols-outlined text-sm">model_training</span>
                <span className="font-mono">{model}</span>
            </div>
        </div>
    );
}
