"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Receipt, BarChart3, Filter } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden text-slate-100 font-sans selection:bg-emerald-500/30">

      {/* Mouse Follow Gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.06), transparent 40%)`,
          opacity: mounted ? 1 : 0
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full px-6 py-4 flex items-center justify-between z-50 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center backdrop-blur-md">
            <Receipt className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">PennyTracer</span>
        </div>
        <Link href="/login">
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
            Sign In
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 z-10 flex flex-col items-center text-center">
        <div className={`transition-all duration-1000 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            Simple expense tracking for everyone
          </span>
        </div>

        <h1 className={`max-w-4xl text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Master your money <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-600">without the mess.</span>
        </h1>

        <p className={`text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Stop guessing where your money goes. Gain total clarity over your finances with intuitive tracking, powerful insights, and a beautiful interface.
        </p>

        <div className={`transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link href="/login">
            <Button className="group relative bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-8 py-6 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-105">
              Start Tracking Free
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:-rotate-[25deg]" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-slate-500">No credit card required • Free forever plan</p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Receipt,
              title: "Smart Logging",
              desc: "Add expenses in seconds. Categorize with ease and keep your records spotless."
            },
            {
              icon: BarChart3,
              title: "Instant Insights",
              desc: "Visualise your spending patterns with beautiful, automatically generated charts."
            },
            {
              icon: Filter,
              title: "Deep Filtering",
              desc: "Drill down into your data by date, category, or amount to find exactly what you need."
            }
          ].map((feature, i) => (
            <div
              key={i}
              className={`group relative p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-500 hover:border-emerald-500/30 backdrop-blur-sm ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              style={{ transitionDelay: `${700 + (i * 100)}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-900 rounded-xl border border-slate-700/50 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-slate-800/50 z-10 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-500/50" />
            <span className="text-sm font-semibold text-slate-400">PennyTracer</span>
          </div>
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} PennyTracer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
