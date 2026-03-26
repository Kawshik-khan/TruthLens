import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative">
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 hero-gradient -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] -z-10 pointer-events-none">
            <div className="absolute inset-0 rotate-45 border-2 border-blue-500/20 lens-glow animate-pulse"></div>
            <div className="absolute inset-10 -rotate-12 border border-blue-400/10"></div>
            <div className="absolute inset-24 rotate-[60deg] border-2 border-blue-600/30"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full"></div>
          </div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-white/10 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Next-Gen AI Verification Engine</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[0.9] mb-8">
              DECODE THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">DIGITAL TRUTH.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-light mb-12 leading-relaxed">
              Advanced AI-driven forensic analysis for the modern information landscape.
              Neutralize misinformation and safeguard your perception with precision-engineered intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/submit" className="px-10 py-5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-all btn-glow flex items-center gap-3">
                Unlock the truth
                <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
              </Link>
              <Link href="/register" className="px-10 py-5 glass-panel text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all border-white/20">
                Try it free
              </Link>
            </div>
          </div>
          <div className="absolute top-[20%] left-[10%] hidden lg:block animate-bounce" style={{ animationDuration: "4s" }}>
            <div className="glass-panel p-4 rounded-2xl border-blue-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Source Verified</span>
              </div>
              <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-green-500"></div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[20%] right-[12%] hidden lg:block animate-bounce" style={{ animationDuration: "5.5s" }}>
            <div className="glass-panel p-4 rounded-2xl border-red-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Bias Detected</span>
              </div>
              <div className="text-[10px] text-slate-400 italic">"Sentimental Manipulation High"</div>
            </div>
          </div>
        </section>

        <section className="py-12 border-y border-white/5 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-8">Trusted by Global Intelligence & Media Authorities</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-xl font-bold text-white tracking-widest uppercase">NEXUS</div>
              <div className="text-xl font-bold text-white tracking-widest uppercase italic">VERTEX</div>
              <div className="text-xl font-bold text-white tracking-widest uppercase">SYNERGY</div>
              <div className="text-xl font-bold text-white tracking-widest uppercase italic">AETHER</div>
              <div className="text-xl font-bold text-white tracking-widest uppercase">QUANTUM</div>
            </div>
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="glass-panel p-10 rounded-3xl border-white/5 group hover:border-blue-500/50 transition-all duration-500">
                <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-blue-500 text-3xl">psychology</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Neural Linguistics</h3>
                <p className="text-slate-400 font-light leading-relaxed">Sophisticated NLP models decode subtext, sentiment, and structural patterns common in coordinated misinformation campaigns.</p>
              </div>
              <div className="glass-panel p-10 rounded-3xl border-white/5 group hover:border-blue-500/50 transition-all duration-500">
                <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-blue-500 text-3xl">fingerprint</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Source DNA Analysis</h3>
                <p className="text-slate-400 font-light leading-relaxed">Trace the architectural origin of claims back to their first appearance, mapping the propagation across decentralized networks.</p>
              </div>
              <div className="glass-panel p-10 rounded-3xl border-white/5 group hover:border-blue-500/50 transition-all duration-500">
                <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-blue-500 text-3xl">encrypted</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Encrypted Verification</h3>
                <p className="text-slate-400 font-light leading-relaxed">Enterprise-grade security ensures your analysis requests remain private, anonymous, and cryptographically secure.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <div className="max-w-4xl mx-auto glass-panel p-12 md:p-20 rounded-[3rem] border-white/10 text-center relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-blue-600 rounded-full blur-[60px] opacity-30"></div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to secure <br />your perception?</h2>
            <p className="text-slate-400 mb-12 text-lg font-light">Join 50k+ professionals using TruthLens to navigate the information age with absolute clarity.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input className="px-8 py-5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-blue-500 min-w-[300px]" placeholder="Enter corporate email" type="email" />
              <Link href="/register" className="px-8 py-5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all btn-glow uppercase text-sm tracking-widest">Get Started</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
