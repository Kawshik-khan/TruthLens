"use client";

import AuthLayout from "@/components/AuthLayout";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Filter, Calendar, TrendingUp, Eye, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  content: string;
  trustScore: number;
  status: "VERIFIED" | "RELIABLE" | "FLAGGED" | "FAKE";
  createdAt: string;
  url?: string;
  citations?: string;
}

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      // Cookie is automatically sent by browser
      const response = await fetch("/api/submissions", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setHistoryItems(data);
      } else {
        // API error - show empty state
        setHistoryItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setHistoryItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED": return CheckCircle;
      case "RELIABLE": return CheckCircle;
      case "FLAGGED": return AlertTriangle;
      case "FAKE": return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "RELIABLE": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "FLAGGED": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "FAKE": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  const getFilteredAndSortedItems = () => {
    let filtered = historyItems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.trustScore - a.trustScore;
      }
    });
  };

  const getSourceDisplay = (url?: string) => {
    if (!url) return "Text Claim";
    try {
      return new URL(url).hostname;
    } catch {
      return "Unknown Source";
    }
  };

  if (isLoading) {
    return (
      <AuthLayout title="Analysis History" description="View your past claim verifications and insights">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading history...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const filteredItems = getFilteredAndSortedItems();

  return (
    <AuthLayout title="Analysis History" description="View your past claim verifications and insights">
      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#06111f] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#06111f] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">All Status</option>
              <option value="VERIFIED">Verified</option>
              <option value="RELIABLE">Reliable</option>
              <option value="FLAGGED">Flagged</option>
              <option value="FAKE">Fake</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "score")}
              className="px-3 py-2 bg-[#06111f] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
            >
              <option value="date">Date</option>
              <option value="score">Trust Score</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-slate-400">
            {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* History Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[#06111f] border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No history found</h3>
          <p className="text-slate-400 mb-6">
            {searchTerm || statusFilter !== "all" 
              ? "No items match your filters" 
              : "You haven't analyzed any claims yet"}
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
          >
            Start Your First Analysis
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div className="relative bg-[#06111f]/50 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg border ${getStatusColor(item.status)} flex items-center justify-center`}>
                      <StatusIcon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                            {item.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-4">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(item.trustScore)}`}>
                              {item.trustScore}%
                            </div>
                            <div className="text-xs text-slate-500">Trust Score</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {getSourceDisplay(item.url)}
                          </span>
                        </div>

                        <Link
                          href={`/report?id=${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-sm font-medium transition-colors"
                        >
                          View Report
                          <TrendingUp className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </AuthLayout>
  );
}
