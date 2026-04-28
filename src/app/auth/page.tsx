"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { config } from "@/lib/config";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerRole, setRegisterRole] = useState(config.auth.defaultUserRole);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (registerPassword !== registerConfirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the Terms & Privacy Policy");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: registerName, 
          email: registerEmail, 
          password: registerPassword, 
          role: registerRole 
        }),
      });

      if (res.ok) {
        setActiveTab("login");
        setError("");
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
        setAgreeToTerms(false);
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden lg:flex-row flex-col">
      {/* Left Panel - 40% on desktop, full on mobile */}
      <div className="lg:w-[40%] w-full lg:min-h-screen min-h-[40vh] relative bg-gradient-to-br from-[#0A0F1F] via-[#1a2332] to-[#0d1929] flex items-center justify-center p-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#4F7CFF]/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4F7CFF]/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content - Image with 25% blur at bottom */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {/* Hero Image - Fills entire left panel */}
          <div className="relative w-full h-full">
            <Image
              src="/Avater_auth.png"
              alt="TruthLens Hero"
              fill
              className="object-cover"
            />
            
            {/* 15% smooth progressive blur effect at bottom - single continuous gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-white/35 via-white/15 via-white/5 to-transparent backdrop-blur-lg"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - 60% on desktop, full on mobile */}
      <div className="lg:w-[60%] w-full lg:min-h-screen min-h-[60vh] bg-[#111827] flex items-center justify-center p-8 lg:p-12 lg:rounded-r-3xl relative overflow-hidden">
        {/* Magic Glow Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary glow from top-right */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-[#4F7CFF]/20 via-[#6B8FFF]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          {/* Secondary glow from bottom-left */}
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-tr from-[#8B5CF6]/15 via-[#A78BFA]/10 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          {/* Tertiary glow from center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#06B6D4]/10 via-[#0891B2]/5 to-transparent rounded-full blur-3xl" style={{animationDelay: '2s'}}></div>
          {/* Animated particles */}
          <div className="absolute top-20 right-20 w-2 h-2 bg-[#4F7CFF]/60 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
          <div className="absolute bottom-20 left-20 w-1 h-1 bg-[#8B5CF6]/60 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-[#06B6D4]/60 rounded-full animate-ping" style={{animationDuration: '3.5s', animationDelay: '2s'}}></div>
        </div>
        <div className="w-full max-w-md lg:max-w-lg space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#F8FAFC] drop-shadow-lg">
              Welcome to {config.app.name}
            </h2>
            <p className="text-sm lg:text-base text-[#94A3B8]">
              AI-powered fake news detection platform
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#0A0F1F]/50 backdrop-blur-sm rounded-xl p-1 border border-white/10 shadow-lg">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-[#4F7CFF] to-[#6B8FFF] text-white shadow-lg shadow-[#4F7CFF]/25 border border-[#4F7CFF]/30"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "register"
                  ? "bg-gradient-to-r from-[#4F7CFF] to-[#6B8FFF] text-white shadow-lg shadow-[#4F7CFF]/25 border border-[#4F7CFF]/30"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0F1F]/50 backdrop-blur-sm border border-white/20 rounded-xl text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 transition-all focus:shadow-lg focus:shadow-[#4F7CFF]/20"
                    placeholder="username@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0F1F]/50 backdrop-blur-sm border border-white/20 rounded-xl text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 transition-all focus:shadow-lg focus:shadow-[#4F7CFF]/20"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#4F7CFF] to-[#6B8FFF] text-white font-semibold rounded-xl shadow-lg shadow-[#4F7CFF]/25 hover:shadow-[#4F7CFF]/40 hover:shadow-xl hover:shadow-[#4F7CFF]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-[#4F7CFF]/30 hover:border-[#4F7CFF]/50 hover:scale-[1.02]"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="text-center">
                <Link
                  href={`/register`}
                  className="text-[#4F7CFF] hover:text-[#6B8FFF] text-sm font-medium transition-colors"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0F1F] border border-[#1e293b] rounded-xl text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#4F7CFF] focus:ring-1 focus:ring-[#4F7CFF]/20 transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0F1F] border border-[#1e293b] rounded-xl text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#4F7CFF] focus:ring-1 focus:ring-[#4F7CFF]/20 transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0F1F] border border-[#1e293b] rounded-xl text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#4F7CFF] focus:ring-1 focus:ring-[#4F7CFF]/20 transition-all"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0F1F] border border-[#1e293b] rounded-xl text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#4F7CFF] focus:ring-1 focus:ring-[#4F7CFF]/20 transition-all"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 bg-[#0A0F1F] border-[#1e293b] rounded focus:ring-[#4F7CFF] focus:border-[#4F7CFF] text-[#4F7CFF]"
                />
                <label htmlFor="terms" className="text-sm text-[#94A3B8]">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#4F7CFF] hover:text-[#6B8FFF] transition-colors">
                    Terms & Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#4F7CFF] to-[#6B8FFF] text-white font-semibold rounded-xl shadow-lg shadow-[#4F7CFF]/25 hover:shadow-[#4F7CFF]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Get Started"}
              </button>

              <div className="text-center">
                <Link
                  href={`/login`}
                  className="text-[#4F7CFF] hover:text-[#6B8FFF] text-sm font-medium transition-colors"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
