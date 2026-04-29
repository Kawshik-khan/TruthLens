"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Eye,
  Globe2,
  LineChart,
  Play,
  Radar,
  Shield,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TruthLensRadarCore from "@/components/TruthLensRadarCore";

const heroCards = [
  {
    title: "Trust Score",
    value: "94%",
    note: "High",
    icon: Shield,
    accent: "from-emerald-400 to-cyan-300",
  },
  {
    title: "Source Network",
    value: "Verified",
    note: "312 / 320 sources verified",
    icon: BadgeCheck,
    accent: "from-blue-400 to-sky-300",
  },
  {
    title: "Bias Detection",
    value: "Low Bias",
    note: "Left · Center · Right",
    icon: BarChart3,
    accent: "from-blue-500 to-cyan-300",
  },
  {
    title: "Live Scan",
    value: "Scanning...",
    note: "Analyzing content in real time",
    icon: Radar,
    accent: "from-sky-400 to-blue-500",
  },
  {
    title: "Citation Sources",
    value: "28",
    note: "Sources found",
    icon: Database,
    accent: "from-cyan-400 to-blue-400",
  },
  {
    title: "AI Confidence",
    value: "97%",
    note: "Very High",
    icon: Sparkles,
    accent: "from-emerald-400 to-blue-300",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Submit",
    description: "Paste a claim, article, or post to begin a precision truth analysis.",
    icon: Play,
  },
  {
    step: "02",
    title: "Analyze",
    description: "TruthLens evaluates sources, bias, structure, and verification signals.",
    icon: Activity,
  },
  {
    step: "03",
    title: "Reveal",
    description: "Get a trust score, evidence trail, and concise decision-ready insight.",
    icon: Eye,
  },
];

const trustMetrics = [
  { value: "1.2M+", label: "Analyses Performed" },
  { value: "98.7%", label: "Accuracy Rate" },
  { value: "320K+", label: "Verified Sources" },
  { value: "150+", label: "Countries Served" },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.14),_transparent_34%),radial-gradient(circle_at_70%_20%,_rgba(59,130,246,0.08),_transparent_28%),radial-gradient(circle_at_50%_100%,_rgba(16,185,129,0.05),_transparent_30%)]" />

        <section className="relative w-full px-6 pb-16 pt-32 md:px-10 xl:px-16 2xl:px-24">
          <div className="mx-auto grid w-full max-w-none grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="relative z-10 lg:col-span-6 md:col-span-3 2xl:pt-10">
              <motion.div
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-200 shadow-[0_0_28px_rgba(37,99,235,0.08)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.9)]" />
                AI-Powered Truth Verification
              </motion.div>

              <motion.h1
                className="max-w-xl text-5xl font-black leading-[0.9] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                SEE THROUGH
                <br />
                THE NOISE.
              </motion.h1>

              <motion.p
                className="mt-8 max-w-xl text-base leading-8 text-slate-300 sm:text-lg"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16 }}
              >
                TruthLens uses AI to analyze claims, verify sources, detect bias, and reveal trustworthy information in real time.
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.24 }}
              >
                <Link href="/submit" className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-4 text-base font-semibold text-white shadow-[0_0_34px_rgba(37,99,235,0.35)] transition-all duration-300 hover:from-blue-500 hover:to-sky-400 hover:shadow-[0_0_44px_rgba(37,99,235,0.52)]">
                  Start Analysis
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="#demo" className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/[0.03] px-7 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/10 hover:shadow-[0_0_30px_rgba(37,99,235,0.16)]">
                  View Demo
                  <Play className="h-4 w-4 fill-current transition-transform duration-300 group-hover:scale-110" />
                </Link>
              </motion.div>

              <motion.div
                className="mt-10 flex items-center gap-4"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32 }}
              >
                <div className="flex -space-x-2">
                  {[
                    { initials: "JR", tint: "from-blue-500 to-sky-300" },
                    { initials: "AM", tint: "from-cyan-500 to-blue-400" },
                    { initials: "LK", tint: "from-slate-700 to-blue-500" },
                    { initials: "TS", tint: "from-emerald-500 to-cyan-300" },
                  ].map((avatar) => (
                    <div
                      key={avatar.initials}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br ${avatar.tint} text-[11px] font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.22)]`}
                    >
                      {avatar.initials}
                    </div>
                  ))}
                </div>
                <p className="max-w-sm text-sm text-slate-400">
                  Trusted by journalists, researchers, students.
                </p>
              </motion.div>
            </div>

            <div className="relative z-10 lg:col-span-5 md:col-span-2 2xl:pt-10">
              <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {heroCards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.title}
                      className="min-h-[210px] rounded-[24px] border border-white/8 bg-[rgba(10,14,27,0.82)] p-6 shadow-[0_0_18px_rgba(37,99,235,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/24 hover:shadow-[0_0_26px_rgba(37,99,235,0.12)]"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.16 + index * 0.04 }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">{card.title}</p>
                          <div className="mt-2 flex items-end gap-2">
                            <span className="text-2xl font-bold text-white">{card.value}</span>
                            {card.note && <span className="pb-1 text-xs text-slate-400">{card.note}</span>}
                          </div>
                        </div>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${card.accent} text-black shadow-[0_0_22px_rgba(59,130,246,0.26)]`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      
                      {/* Card-specific visual elements */}
                      {card.title === "Trust Score" && (
                        <div className="mt-4 h-12 rounded-2xl border border-white/5 bg-white/[0.02] p-2">
                          <div className="flex h-full items-end gap-1">
                            {[18, 26, 34, 28, 42, 36, 50, 44, 58].map((height, barIndex) => (
                              <span key={barIndex} className="flex-1 rounded-full bg-gradient-to-t from-blue-500 via-sky-400 to-cyan-200" style={{ height: `${height}%` }} />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {card.title === "Source Network" && (
                        <div className="mt-4 h-12 rounded-2xl border border-white/5 bg-white/[0.02] p-2">
                          <div className="flex h-full items-end gap-1">
                            {[18, 26, 34, 28, 42, 36, 50, 44, 58].map((height, barIndex) => (
                              <span key={barIndex} className="flex-1 rounded-full bg-gradient-to-t from-blue-500 via-sky-400 to-cyan-200" style={{ height: `${height}%` }} />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {card.title === "Bias Detection" && (
                        <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
                          <div className="flex items-end gap-1">
                            {[10, 18, 28, 40, 54, 46, 33, 22, 12].map((height, barIndex) => (
                              <span key={barIndex} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-300" style={{ height: `${height}px` }} />
                            ))}
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                            <span>Left</span>
                            <span>Center</span>
                            <span>Right</span>
                          </div>
                        </div>
                      )}
                      
                      {card.title === "Live Scan" && (
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10">
                            <div className="h-8 w-8 rounded-full border border-blue-300/40 border-t-transparent border-r-transparent animate-spin" />
                          </div>
                          <div className="text-xs leading-6 text-slate-400">
                            <span className="block text-sm font-semibold text-blue-300">Analyzing content in real time</span>
                            Live claim trace, source match, and bias scan active.
                          </div>
                        </div>
                      )}
                      
                      {card.title === "Citation Sources" && (
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                          <span>View all</span>
                          <ArrowUpRight className="h-4 w-4 text-blue-300" />
                        </div>
                      )}
                      
                      {card.title === "AI Confidence" && (
                        <div className="mt-4 flex items-center gap-4">
                          <div className="relative h-16 w-16 rounded-full border border-emerald-400/30 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.3),_transparent_65%)]">
                            <div className="absolute inset-2 rounded-full border border-emerald-300/40" />
                            <div className="absolute bottom-2 left-1/2 h-8 w-0.5 -translate-x-1/2 origin-bottom rotate-45 rounded-full bg-emerald-300" />
                          </div>
                          <div>
                            <p className="text-sm text-emerald-300">Very High</p>
                            <p className="text-xs text-slate-400">Decision confidence score</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center background radar placed in the large middle area (marked) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden md:block -translate-x-1/2 -translate-y-1/2 z-0 transform scale-125">
            <TruthLensRadarCore />
          </div>
        </section>

        <section id="demo" className="w-full px-6 py-12 md:px-10 xl:px-16 2xl:px-24">
          <div className="mx-auto grid w-full max-w-none grid-cols-1 gap-6 xl:grid-cols-12">
            <motion.div
              className="rounded-3xl border border-white/10 bg-[rgba(8,12,24,0.84)] p-6 shadow-[0_0_40px_rgba(37,99,235,0.06)] backdrop-blur-xl xl:col-span-5 xl:p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-300">How It Works</div>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {howItWorks.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.step} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/25 hover:bg-blue-500/8">
                      {index < howItWorks.length - 1 ? <div className="absolute right-4 top-1/2 hidden h-px w-10 bg-white/10 xl:block" /> : null}
                      <div className="mb-8 flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300">{item.step}</span>
                        <Icon className="h-5 w-5 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl border border-white/10 bg-[rgba(8,12,24,0.84)] p-4 shadow-[0_0_40px_rgba(37,99,235,0.06)] backdrop-blur-xl xl:col-span-7 xl:p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="rounded-2xl border border-white/10 bg-[#050816] p-5">
                <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-blue-300">Real-Time Verification Dashboard</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Climate change is a hoax.</h2>
                  </div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">Completed</span>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-12">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 xl:col-span-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Trust Score</p>
                    <div className="mt-4 flex items-end gap-3">
                      <span className="text-4xl font-bold text-white">94%</span>
                      <span className="pb-2 text-sm text-emerald-300">High Trust</span>
                    </div>
                    <div className="mt-4 h-20 rounded-2xl border border-white/5 bg-[#08111f] p-3">
                      <div className="flex h-full items-end gap-1">
                        {[16, 20, 28, 24, 34, 32, 46, 40, 54, 50].map((height, barIndex) => (
                          <span key={barIndex} className="flex-1 rounded-full bg-gradient-to-t from-blue-600 via-sky-400 to-cyan-200" style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 xl:col-span-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Bias Detection</p>
                    <div className="mt-4 text-2xl font-semibold text-blue-300">Low Bias</div>
                    <div className="mt-4 rounded-2xl border border-white/5 bg-[#08111f] p-3">
                      <div className="flex items-end gap-1">
                        {[12, 18, 22, 30, 38, 44, 36, 28, 18, 12].map((height, barIndex) => (
                          <span key={barIndex} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-300" style={{ height: `${height}px` }} />
                        ))}
                      </div>
                      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                        <span>Left</span>
                        <span>Center</span>
                        <span>Right</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 xl:col-span-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Key Insight</p>
                    <div className="mt-4 rounded-2xl border border-white/5 bg-[#08111f] p-4 text-sm leading-7 text-slate-300">
                      Multiple independent sources confirm the scientific consensus on climate change.
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>Top sources</span>
                      <span>28</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["NASA", "IPCC", "nature", "nih", "more"].map((source) => (
                        <span key={source} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-300">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 xl:col-span-12">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/5 bg-[#08111f] p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Result Status</p>
                        <div className="mt-3 flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <span className="text-sm text-slate-300">Verified with high confidence</span>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-[#08111f] p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Verification Trail</p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                          <LineChart className="h-4 w-4 text-blue-300" />
                          Source match, claim trace, and bias score aligned.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full px-6 py-12 md:px-10 xl:px-16 2xl:px-24">
          <div className="mx-auto grid w-full max-w-none grid-cols-1 gap-6 xl:grid-cols-12">
            <motion.div
              className="rounded-3xl border border-white/10 bg-[rgba(8,12,24,0.84)] p-6 backdrop-blur-xl xl:col-span-6 xl:p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-300">Trusted Metrics</div>
              <div className="grid grid-cols-2 gap-4">
                {trustMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-blue-500/8">
                    <div className="text-3xl font-bold text-white">{metric.value}</div>
                    <div className="mt-2 text-sm text-slate-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl border border-white/10 bg-[rgba(8,12,24,0.84)] p-6 backdrop-blur-xl xl:col-span-6 xl:p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <div className="mb-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-300">
                <span>What People Are Saying</span>
                <div className="flex items-center gap-2 text-slate-500">
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_0_35px_rgba(37,99,235,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500 to-cyan-300 text-sm font-semibold text-black shadow-[0_0_20px_rgba(37,99,235,0.22)]">
                    ER
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg leading-8 text-white sm:text-xl">
                      “TruthLens has become an essential part of our editorial workflow. It’s fast, accurate, and incredibly reliable.”
                    </p>
                    <div className="mt-5">
                      <p className="font-semibold text-white">Elena Rodriguez</p>
                      <p className="text-sm text-slate-400">Investigative Journalist, The Global Ledger</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="h-1.5 w-8 rounded-full bg-blue-400" />
                <span className="h-1.5 w-3 rounded-full bg-white/20" />
                <span className="h-1.5 w-3 rounded-full bg-white/20" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full px-6 py-12 md:px-10 xl:px-16 2xl:px-24">
          <motion.div
            className="mx-auto grid w-full max-w-none overflow-hidden rounded-[2rem] border border-blue-400/25 bg-[radial-gradient(circle_at_15%_50%,rgba(37,99,235,0.18),transparent_30%),linear-gradient(135deg,rgba(8,12,24,0.96),rgba(3,7,18,0.98))] xl:grid-cols-12"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <div className="relative flex items-center justify-center border-b border-white/8 p-10 xl:col-span-4 xl:border-b-0 xl:border-r">
              <div className="lens-orb relative h-48 w-48 rounded-full border border-blue-400/30 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.8),_rgba(8,15,31,0.22)_35%,_transparent_68%)] shadow-[0_0_90px_rgba(37,99,235,0.25)] sm:h-56 sm:w-56 2xl:h-64 2xl:w-64">
                <div className="absolute inset-6 rounded-full border border-white/10" />
                <div className="absolute inset-14 rounded-full border border-blue-300/20" />
                <motion.div
                  className="absolute inset-1/2 h-[72%] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-blue-300 to-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
            <div className="p-8 xl:col-span-8 xl:p-10 2xl:p-12">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-300">Final CTA</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">Ready to see the truth?</h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">
                  Join thousands who trust TruthLens for accurate, unbiased information.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/submit" className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-4 text-base font-semibold text-white shadow-[0_0_34px_rgba(37,99,235,0.35)] transition-all duration-300 hover:from-blue-500 hover:to-sky-400">
                    Start Analysis
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link href="#demo" className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/[0.03] px-7 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/10">
                    View Demo
                    <Play className="h-4 w-4 fill-current transition-transform duration-300 group-hover:scale-110" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
