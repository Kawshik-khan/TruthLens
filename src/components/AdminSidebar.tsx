"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function AdminSidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        fetchUser();
    }, []);

    const navItems = [
        { name: "Live Overview", href: "/admin", icon: "dashboard" },
        { name: "Submission Review", href: "/admin/review", icon: "fact_check" },
        { name: "Source Audits", href: "/admin/sources", icon: "database" },
        { name: "User Feedback", href: "/admin/cms", icon: "chat_bubble" },
    ];

    const analyticsItems = [
        { name: "Neural Health", href: "/admin/health", icon: "biotech" },
        { name: "Traffic Matrix", href: "/admin/traffic", icon: "hub" },
    ];

    const initials = user?.name
        ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "..";

    return (
        <aside className="w-72 glass-panel border-r border-white/5 flex flex-col fixed h-full z-50">
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500/20 border border-sky-500/50 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                    <span className="material-symbols-outlined text-sky-400">monitoring</span>
                </div>
                <div>
                    <span className="text-xl font-bold tracking-tight text-white block leading-none">TRUTHLENS</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-sky-500 font-bold">Command Center</span>
                </div>
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-8">
                <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">Core Systems</div>
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${pathname === item.href
                                    ? "bg-sky-500/10 border-l-2 border-sky-500 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <span className={`material-symbols-outlined ${pathname === item.href ? "text-sky-400" : "text-slate-500 group-hover:text-sky-400"}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-semibold">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">Neural Analytics</div>
                    <div className="space-y-1">
                        {analyticsItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
                            >
                                <span className="material-symbols-outlined text-slate-500 group-hover:text-sky-400">{item.icon}</span>
                                <span className="text-sm font-semibold">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="p-6 border-t border-white/5">
                <div className="flex items-center gap-4 px-4 py-4 rounded-xl glass-panel bg-white/5 border-white/10">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400 font-bold text-xs">
                            {initials}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full"></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-white truncate uppercase">{user?.name || "Loading..."}</p>
                        <p className="text-[10px] text-sky-400/70 font-mono truncate">ROLE: {user?.role || "..."}</p>
                    </div>
                    <Link href="/login" className="text-slate-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">logout</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}

