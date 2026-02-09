import Link from "next/link";
import {
  ArrowRight,
  Search,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

/**
 * Landing Hero Section
 *
 * The single most important section on the page.
 * Must communicate the value proposition in under 5 seconds.
 *
 * Strategy: Lead with the outcome (equity gains), not the process.
 * Then quickly establish credibility (forensic, verified, AI-guided).
 */
export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Subtle grid background — forensic precision aesthetic */}
      <div className="absolute inset-0 forensic-grid" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-emerald-50/80 to-transparent rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-8">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Forensic-Grade Property Intelligence
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Transform Storm Damage Into{" "}
            <span className="gradient-text">Verified Equity</span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            The intelligence platform that turns forensic inspections, insurance
            claims, and restoration execution into documented, defensible equity
            gains for commercial properties.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              Access the Platform
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 px-8 py-3.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              See How It Works
            </Link>
          </div>

          {/* Process preview — three pillars */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 mb-4">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Forensic Inspection
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Document every damage point with photographic evidence,
                measurements, and classifications that hold up to scrutiny.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 mb-4">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Insurance Intelligence
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Track claims, detect discrepancies, and navigate carrier
                interactions with data-driven strategy.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Verified Equity
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Generate defensible equity gain reports backed by forensic
                evidence, insurance records, and restoration verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
