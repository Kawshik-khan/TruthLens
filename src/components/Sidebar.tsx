"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
        { name: "History", href: "/dashboard#history", icon: "history" },
        { name: "Notifications", href: "/notifications", icon: "notifications", badge: true },
        { name: "Sources", href: "/sources", icon: "insights" },
    ];

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <aside className="w-64 border-r border-white/10 flex flex-col fixed h-full glass-panel z-50">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-lg shadow-indigo-500/20 overflow-hidden">
                        <img src="/logo.png" alt="TruthLens Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight text-white uppercase italic">TruthLens</h1>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all group ${pathname === item.href
                            ? "bg-indigo-600/10 text-indigo-400"
                            : "text-slate-500 hover:text-indigo-400 hover:bg-indigo-600/5"
                            }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        {item.name}
                        {item.badge && (
                            <span className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></span>
                        )}
                    </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-white/10">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-indigo-400 hover:bg-indigo-600/5 rounded-lg font-medium transition-all group"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        Settings
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-lg font-medium transition-all group mt-1"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-6">
                <Link
                    href="/submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 btn-glow transition-all"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Analysis
                </Link>
            </div>
        </aside>
    );
}
