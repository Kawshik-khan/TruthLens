"use client";

import Navbar from "@/components/Footer";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/user/notifications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        // Mock data for demo
        setNotifications(getMockNotifications());
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Mock data for demo
      setNotifications(getMockNotifications());
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/user/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
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
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/user/notifications/mark-all-read", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
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
      case "success": return "check_circle";
      case "warning": return "warning";
      case "error": return "error";
      default: return "info";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "warning": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "error": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-sky-400 bg-sky-500/10 border-sky-500/20";
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
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-400 uppercase tracking-[0.3em] font-mono text-xs">Loading Notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Notifications</h1>
          <p className="text-slate-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "All caught up!"}
          </p>
        </div>

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
                    <span className="material-symbols-outlined text-xl">
                      {getNotificationIcon(notification.type)}
                    </span>
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

      <Footer />
    </div>
  );
}

// Mock data for demo purposes
function getMockNotifications(): Notification[] {
  return [
    {
      id: "1",
      title: "Analysis Complete",
      message: "Your analysis of 'Climate Change Article' has been completed with a trust score of 85%",
      type: "success",
      category: "analysis",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      actionUrl: "/dashboard",
      actionText: "View Results"
    },
    {
      id: "2",
      title: "Quiz Available",
      message: "New quiz 'Media Literacy Basics' is now available in the Education module",
      type: "info",
      category: "quiz",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      actionUrl: "/learn/quizzes",
      actionText: "Take Quiz"
    },
    {
      id: "3",
      title: "System Update",
      message: "TruthLens has been updated with new features and improvements",
      type: "info",
      category: "update",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      actionUrl: "/methodology",
      actionText: "Learn More"
    },
    {
      id: "4",
      title: "Security Alert",
      message: "New login detected from Chrome on Windows",
      type: "warning",
      category: "security",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      actionUrl: "/settings",
      actionText: "Review"
    },
    {
      id: "5",
      title: "Weekly Report Ready",
      message: "Your weekly analysis report is ready with insights on your fact-checking activity",
      type: "info",
      category: "system",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      actionUrl: "/dashboard",
      actionText: "View Report"
    }
  ];
}
