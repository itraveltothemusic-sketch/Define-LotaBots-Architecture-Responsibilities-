/**
 * Landing Page
 * 
 * The public-facing page for Equity Builders.
 * Designed to communicate trust, precision, and authority.
 * This is the first impression for property owners, insurers, and investors.
 */
import Link from "next/link";
import {
  BarChart3,
  Shield,
  Search,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  FileCheck,
  HardHat,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Equity Builders
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg transition-colors shadow-lg shadow-brand-900/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl">
            {/* Trust indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Powered by ATOS Forensic Intelligence</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Storm Damage Into{" "}
              <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                Verified Equity
              </span>
            </h1>

            <p className="mt-6 text-xl text-slate-400 leading-relaxed max-w-2xl">
              The forensic property intelligence platform that transforms commercial 
              storm-damaged properties into documented equity gains — through precision 
              inspections, insurance intelligence, and AI-guided execution.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-500 transition-all shadow-xl shadow-brand-900/30 text-base"
              >
                Start Your Assessment
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-700 text-slate-300 font-medium hover:bg-slate-800/50 hover:text-white transition-all text-base"
              >
                View Demo Dashboard
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex flex-wrap gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Forensic-Grade Documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Insurance Intelligence</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Equity Outcomes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              From Damage to Documented Equity
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Every step is guided by forensic precision and AI intelligence. 
              Nothing is left to chance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Search className="w-6 h-6" />,
                title: "Forensic Inspection",
                description:
                  "Comprehensive, evidence-based property assessment with photo documentation and damage classification.",
                step: "01",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Insurance Intelligence",
                description:
                  "Strategic claim filing with scope comparison, discrepancy detection, and carrier interaction tracking.",
                step: "02",
              },
              {
                icon: <HardHat className="w-6 h-6" />,
                title: "Managed Execution",
                description:
                  "Verified contractor assignments with progress tracking, compliance checks, and quality verification.",
                step: "03",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Equity Verification",
                description:
                  "Before-and-after valuation with documented equity gain narratives and ROI analysis.",
                step: "04",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative p-6 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-brand-500/30 hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 text-5xl font-bold text-slate-800/50 group-hover:text-brand-500/10 transition-colors">
                  {item.step}
                </div>
                <div className="p-3 w-fit rounded-lg bg-brand-500/10 text-brand-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATOS Section */}
      <section className="py-24 px-6 border-t border-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span>ATOS Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Your Forensic Expert Is Always Present
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                ATOS isn&apos;t a chatbot. It&apos;s a forensic guide that proactively 
                surfaces risks, identifies gaps, and translates complexity into 
                confidence at every step of the process.
              </p>
              <div className="space-y-4">
                {[
                  "Proactive risk identification before you ask",
                  "Scope comparison intelligence for claim optimization",
                  "Plain-language explanations of complex insurance processes",
                  "Data-driven recommendations — never speculation",
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ATOS Preview Panel */}
            <div className="relative">
              <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden shadow-2xl">
                {/* ATOS Header */}
                <div className="px-5 py-3 border-b border-slate-700/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-600/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">ATOS</p>
                    <p className="text-[10px] text-slate-500">Forensic Intelligence Assistant</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-400">Active</span>
                  </div>
                </div>

                {/* ATOS Messages Preview */}
                <div className="p-5 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    </div>
                    <div className="flex-1 bg-slate-700/30 rounded-lg rounded-tl-none p-3">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        I&apos;ve analyzed the inspection for <span className="text-brand-300 font-medium">450 Commerce Blvd</span>. 
                        Three areas need attention:
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          <span className="text-red-300">Roof membrane damage not yet documented</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-amber-300">HVAC scope $12K below forensic estimate</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-emerald-300">Facade repairs on track — 78% complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Property Damage Into Equity?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join property owners and contractors who trust Equity Builders 
            for forensic-grade intelligence and verified outcomes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-500 transition-all shadow-xl shadow-brand-900/30 text-lg"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Equity Builders</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Equity Builders. Forensic Property Intelligence Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
