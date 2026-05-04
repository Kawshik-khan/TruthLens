"use client";

import AuthLayout from "@/components/AuthLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertTriangle, Info, X, Settings, Search, Filter } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: "analysis" | "quiz" | "system" | "security" | "update";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Cookie is automatically sent by browser
      const response = await fetch("/api/user/notifications", {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        // API error - show empty state
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/user/notifications/${notificationId}/read`, {
        method: "PUT",
        credentials: "include"
      });

      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/user/notifications/mark-all-read", {
        method: "PUT",
        credentials: "include"
      });

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/user/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Filter by read status
    if (filter === "unread") {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter === "read") {
      filtered = filtered.filter(n => n.isRead);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(n => n.category === categoryFilter);
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return CheckCircle;
      case "warning": return AlertTriangle;
      case "error": return X;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "warning": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "error": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "analysis": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "quiz": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "system": return "text-slate-400 bg-slate-500/10 border-slate-500/20";
      case "security": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "update": return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <AuthLayout title="Notifications" description="Stay updated with your analysis results and system updates">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading notifications...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Notifications" 
      description={
        unreadCount > 0 
          ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
          : "All caught up!"
      }
    >
      <div>
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "all" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "unread" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "read" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Read
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="analysis">Analysis</option>
              <option value="quiz">Quiz</option>
              <option value="system">System</option>
              <option value="security">Security</option>
              <option value="update">Update</option>
            </select>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="ml-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg font-medium transition-all"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {getFilteredNotifications().length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">notifications_none</span>
              <p className="text-slate-400 text-lg">No notifications found</p>
              <p className="text-slate-500 text-sm mt-2">
                {filter === "unread" ? "You have no unread notifications" : "No notifications match your filters"}
              </p>
            </div>
          ) : (
            getFilteredNotifications().map((notification) => (
              <div
                key={notification.id}
                className={`glass-panel rounded-2xl p-6 border transition-all ${
                  !notification.isRead 
                    ? "border-indigo-500/20 bg-indigo-500/5" 
                    : "border-white/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                    {(() => {
                      const IconComponent = getNotificationIcon(notification.type);
                      return <IconComponent className="w-5 h-5" />;
                    })()}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-grow">
                        <h3 className={`font-semibold text-white mb-1 ${!notification.isRead ? "font-bold" : ""}`}>
                          {notification.title}
                        </h3>
                        <p className="text-slate-300 mb-3">{notification.message}</p>
                      </div>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="ml-4 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(notification.category)}`}>
                          {notification.category}
                        </span>
                        <span className="text-slate-500 text-sm">
                          {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <button
                            onClick={() => router.push(notification.actionUrl!)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all"
                          >
                            {notification.actionText || "View"}
                          </button>
                        )}
                        
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </AuthLayout>
  );
}
