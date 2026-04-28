"use client";

import Navbar from "@/components/Footer";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    theme: "light" | "dark" | "system";
    language: string;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    role: "",
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      theme: "dark",
      language: "en"
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        // Show success message
        alert("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (response.ok) {
        alert("Password changed successfully!");
      } else {
        throw new Error("Failed to change password");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Failed to change password");
    }
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: "person" },
    { id: "preferences", name: "Preferences", icon: "settings" },
    { id: "security", name: "Security", icon: "security" },
    { id: "notifications", name: "Notifications", icon: "notifications" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-400 uppercase tracking-[0.3em] font-mono text-xs">Loading Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-2xl p-6 border border-white/5">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-500 hover:text-indigo-400 hover:bg-indigo-600/5"
                    }`}
                  >
                    <span className="material-symbols-outlined">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="glass-panel rounded-2xl p-8 border border-white/5">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center border border-indigo-500/30">
                        <span className="material-symbols-outlined text-3xl text-indigo-400">person</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                        <p className="text-slate-400">{profile.email}</p>
                        <span className="inline-block px-3 py-1 bg-indigo-600/10 text-indigo-400 rounded-lg text-xs font-medium mt-2">
                          {profile.role}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                      <textarea
                        value={profile.bio || ""}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Theme</label>
                      <select
                        value={profile.preferences.theme}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, theme: e.target.value as "light" | "dark" | "system" }
                        })}
                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Language</label>
                      <select
                        value={profile.preferences.language}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, language: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Display Options</h3>
                      
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.preferences.emailNotifications}
                          onChange={(e) => setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, emailNotifications: e.target.checked }
                          })}
                          className="w-4 h-4 text-indigo-600 bg-slate-800 border-white/10 rounded focus:ring-indigo-500"
                        />
                        <span className="text-slate-300">Show detailed analysis results</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.preferences.weeklyReports}
                          onChange={(e) => setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, weeklyReports: e.target.checked }
                          })}
                          className="w-4 h-4 text-indigo-600 bg-slate-800 border-white/10 rounded focus:ring-indigo-500"
                        />
                        <span className="text-slate-300">Enable animations and transitions</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-800/50 rounded-lg border border-white/5">
                      <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                      <PasswordChangeForm onSubmit={handlePasswordChange} />
                    </div>

                    <div className="p-6 bg-slate-800/50 rounded-lg border border-white/5">
                      <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
                      <p className="text-slate-400 mb-4">Add an extra layer of security to your account</p>
                      <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="p-6 bg-slate-800/50 rounded-lg border border-white/5">
                      <h3 className="text-lg font-medium text-white mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div>
                            <p className="text-white font-medium">Current Session</p>
                            <p className="text-slate-400 text-sm">Chrome on Windows • Active now</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded">Current</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <p className="text-white font-medium">Analysis Results</p>
                            <p className="text-slate-400 text-sm">Get notified when your analysis is complete</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profile.preferences.emailNotifications}
                            onChange={(e) => setProfile({
                              ...profile,
                              preferences: { ...profile.preferences, emailNotifications: e.target.checked }
                            })}
                            className="w-4 h-4 text-indigo-600 bg-slate-800 border-white/10 rounded focus:ring-indigo-500"
                          />
                        </label>

                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <p className="text-white font-medium">Weekly Reports</p>
                            <p className="text-slate-400 text-sm">Receive weekly summary of your activity</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profile.preferences.weeklyReports}
                            onChange={(e) => setProfile({
                              ...profile,
                              preferences: { ...profile.preferences, weeklyReports: e.target.checked }
                            })}
                            className="w-4 h-4 text-indigo-600 bg-slate-800 border-white/10 rounded focus:ring-indigo-500"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Push Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <p className="text-white font-medium">Browser Notifications</p>
                            <p className="text-slate-400 text-sm">Get notified in your browser</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profile.preferences.pushNotifications}
                            onChange={(e) => setProfile({
                              ...profile,
                              preferences: { ...profile.preferences, pushNotifications: e.target.checked }
                            })}
                            className="w-4 h-4 text-indigo-600 bg-slate-800 border-white/10 rounded focus:ring-indigo-500"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex justify-end gap-4">
                <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function PasswordChangeForm({ onSubmit }: { onSubmit: (current: string, newPassword: string) => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}
