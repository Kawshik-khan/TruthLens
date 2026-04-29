"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  History, 
  Bell, 
  Settings, 
  LogOut, 
  Plus,
  Sparkles,
  Search
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    description: "Overview and analytics"
  },
  { 
    name: "History", 
    href: "/history", 
    icon: History,
    description: "Past analyses"
  },
  { 
    name: "Notifications", 
    href: "/notifications", 
    icon: Bell,
    description: "Updates and alerts",
    badge: true
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    description: "Account preferences"
  },
];

export default function MagicSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#020617]"></div>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">TruthLens</h1>
            <p className="text-xs text-slate-400">AI Verification</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <div
              key={item.href}
              className="relative group cursor-pointer"
              onClick={() => {
                console.log("Navigating to:", item.href);
                router.push(item.href);
              }}
            >
              <motion.div
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/10 text-blue-300 border border-blue-500/20 shadow-lg shadow-blue-500/10" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }
                `}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active State Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-full"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-lg transition-all
                  ${isActive 
                    ? "bg-blue-500/20 text-blue-300" 
                    : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.description}</div>
                </div>

                {item.badge && (
                  <div className="relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  </div>
                )}

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </motion.div>
            </div>
          );
        })}

        {/* Divider */}
        <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-medium transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-slate-400 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">Logout</div>
              <div className="text-xs text-slate-500">Sign out of account</div>
            </div>
          </button>
        </div>
      </nav>

      {/* New Analysis Button */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/submit"
          className="group relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Plus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">New Analysis</span>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-[#020617]/80 backdrop-blur-xl border-r border-white/10 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute left-0 top-0 h-full w-72 bg-[#020617]/95 backdrop-blur-xl border-r border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
            
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 rotate-90" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
