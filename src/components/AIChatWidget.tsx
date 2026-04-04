"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
    role: "USER" | "ASSISTANT";
    content: string;
}

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "ASSISTANT", content: "Hi! I'm TruthLens AI Assistant. Ask me anything about fact-checking, media literacy, or misinformation detection." },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "USER", content: userMessage }]);
        setIsLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role,
                content: m.content,
            }));

            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, history }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: "ASSISTANT", content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: "ASSISTANT", content: "Sorry, I'm having trouble connecting to the AI service. Please try again later." }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: "ASSISTANT", content: "Connection error. Please check your network and try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                    ${isOpen
                        ? "bg-slate-800 border border-white/10 rotate-0"
                        : "bg-gradient-to-br from-indigo-600 to-purple-600 border border-indigo-400/30 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-110"
                    }`}
                id="ai-chat-toggle"
            >
                <span className="material-symbols-outlined text-white text-2xl transition-transform duration-300">
                    {isOpen ? "close" : "smart_toy"}
                </span>
            </button>

            {/* Chat Panel */}
            <div className={`fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-300 flex flex-col overflow-hidden
                ${isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"}`}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-indigo-400 text-lg">neurology</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">TruthLens AI</h4>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[300px] max-h-[350px] scrollbar-thin">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                                ${msg.role === "USER"
                                    ? "bg-indigo-600/20 text-indigo-100 border border-indigo-500/20 rounded-br-md"
                                    : "bg-white/5 text-slate-300 border border-white/5 rounded-bl-md"
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask about fact-checking..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 hover:bg-indigo-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-lg">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
