"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
        credentials: "include", // Important: includes cookies
      });

      if (res.ok) {
        // Cookie is automatically set by browser
        // Redirect to dashboard
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
        // Auto-login after successful registration
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: registerEmail, password: registerPassword }),
          credentials: "include", // Important: includes cookies
        });

        if (loginRes.ok) {
          // Cookie is automatically set by browser
          // Redirect to dashboard
          router.push("/dashboard");
        } else {
          // If auto-login fails, switch to login tab
          setActiveTab("login");
          setError("");
          setRegisterName("");
          setRegisterEmail("");
          setRegisterPassword("");
          setRegisterConfirmPassword("");
          setAgreeToTerms(false);
        }
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
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(rgba(79, 124, 255, 0.18) 1px, transparent 1px)", backgroundSize: "28px 28px" }}></div>
          <div className="absolute top-20 left-16 w-40 h-40 bg-[#4F7CFF]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-12 right-12 w-52 h-52 bg-[#06B6D4]/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#4F7CFF]/10 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-start gap-8 pt-8 lg:pt-14">
          <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-[#4F7CFF]/10 p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#94A3B8] mb-3">TruthLens Platform</p>
                <h1 className="text-3xl lg:text-4xl font-black text-[#F8FAFC] leading-tight">
                  Verify what matters.
                </h1>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F7CFF] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-[#4F7CFF]/30">
                <span className="material-icons text-white text-3xl">center_focus_strong</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-[#0A0F1F]/60 p-4">
                <p className="text-xs uppercase tracking-widest text-[#94A3B8]">Signal</p>
                <p className="mt-2 text-xl font-bold text-white">Clarity</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0A0F1F]/60 p-4">
                <p className="text-xs uppercase tracking-widest text-[#94A3B8]">Trust</p>
                <p className="mt-2 text-xl font-bold text-white">Evidence</p>
              </div>
            </div>
          </div>

          <div className="text-center max-w-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-[#6B8FFF] font-semibold mb-3">{config.app.tagline}</p>
            <p className="text-[#94A3B8] text-sm lg:text-base leading-relaxed">
              A secure workspace for checking claims, tracking sources, and making every decision easier to audit.
            </p>
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
