/**
 * Landing Page — The first impression of Equity Builders.
 * 
 * This page communicates authority, precision, and trust.
 * It must convince property owners, insurers, and investors
 * that this platform is operated by forensic experts.
 */

import Link from "next/link";
import {
  Zap,
  Building2,
  Shield,
  TrendingUp,
  Brain,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  BarChart3,
  FileSearch,
  HardHat,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950">
      {/* Navigation */}
      <nav className="border-b border-navy-800/40 bg-navy-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-600/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">
                Equity Builders
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-navy-300 hover:text-white transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-brand-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-forensic-600/6 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full mb-8">
              <Brain className="w-4 h-4 text-brand-400" />
              <span className="text-sm text-brand-300 font-medium">
                Powered by ATOS — Forensic AI Intelligence
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Transform Storm Damage
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-forensic-400 bg-clip-text text-transparent">
                Into Verified Equity
              </span>
            </h1>

            <p className="text-lg md:text-xl text-navy-300 max-w-2xl mx-auto leading-relaxed mb-10">
              The forensic property intelligence platform that turns commercial
              storm-damaged properties into documented equity gains through
              precision inspections, insurance intelligence, and AI-guided execution.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all shadow-xl shadow-brand-600/25 hover:shadow-brand-500/30"
              >
                Enter Platform
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 hover:bg-navy-700 text-navy-100 font-medium rounded-xl border border-navy-600 transition-all"
              >
                How It Works
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {[
              { value: "$472K", label: "Verified Equity Gained", sublabel: "Current Portfolio" },
              { value: "94.2%", label: "Claim Approval Rate", sublabel: "Industry avg: 67%" },
              { value: "142d", label: "Avg Claim Cycle", sublabel: "45% faster" },
              { value: "6", label: "Active Properties", sublabel: "$40M+ under management" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-4 bg-navy-900/40 border border-navy-700/30 rounded-xl backdrop-blur-sm"
              >
                <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-navy-300 mt-1 font-medium">{stat.label}</p>
                <p className="text-[10px] text-navy-500 mt-0.5">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 border-t border-navy-800/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Forensic Precision at Every Step
            </h2>
            <p className="text-lg text-navy-300 max-w-2xl mx-auto">
              Every property follows a documented, AI-guided process from storm
              damage to verified equity gain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FileSearch className="w-6 h-6" />,
                title: "Forensic Inspection",
                description:
                  "Certified inspectors document every instance of damage with photographic evidence, severity classification, and repair specifications.",
                step: "01",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Insurance Intelligence",
                description:
                  "AI-powered scope analysis identifies discrepancies, tracks carrier interactions, and ensures maximum claim recovery.",
                step: "02",
              },
              {
                icon: <HardHat className="w-6 h-6" />,
                title: "Verified Execution",
                description:
                  "Vetted contractors execute repairs under compliance monitoring with progress verification at every milestone.",
                step: "03",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Equity Verification",
                description:
                  "Before-and-after valuation documents the equity gain, creating a verified narrative of property value recovery.",
                step: "04",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative p-6 bg-navy-900/40 border border-navy-700/30 rounded-xl group hover:border-brand-500/30 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 text-5xl font-black text-navy-800/50">
                  {item.step}
                </div>
                <div className="p-2.5 bg-brand-500/10 rounded-lg border border-brand-500/20 text-brand-400 w-fit mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-navy-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATOS Feature Section */}
      <section className="py-24 border-t border-navy-800/40 bg-navy-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full mb-6">
                <Brain className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-xs text-brand-300 font-medium uppercase tracking-wider">
                  AI Intelligence Layer
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                ATOS: Your Forensic
                <br />
                Intelligence Guide
              </h2>
              <p className="text-lg text-navy-300 leading-relaxed mb-8">
                ATOS is not a chatbot. It&apos;s a forensic strategist that proactively
                identifies risks, surfaces opportunities, and guides every decision
                with data-backed intelligence.
              </p>
              <div className="space-y-4">
                {[
                  "Proactively flags claim discrepancies before they become problems",
                  "Identifies code-upgrade opportunities to maximize scope",
                  "Tracks documentation gaps that could weaken your position",
                  "Monitors carrier behavior patterns across all claims",
                  "Never speculates — reasons only from verified evidence",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-forensic-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-navy-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock ATOS Panel */}
            <div className="bg-navy-900/60 border border-navy-700/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-brand-500/15 rounded-lg">
                  <Brain className="w-4 h-4 text-brand-400 animate-pulse-subtle" />
                </div>
                <span className="text-sm font-semibold text-white">ATOS Intelligence</span>
              </div>

              <div className="space-y-3">
                {/* Insight 1 */}
                <div className="p-3 bg-danger-400/10 border border-danger-400/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-danger-300 bg-danger-500/20 px-1.5 py-0.5 rounded">
                      CRITICAL
                    </span>
                    <span className="text-xs text-navy-400">Action Required</span>
                  </div>
                  <p className="text-sm text-white font-medium">
                    HVAC Scope Discrepancy — $240K at Risk
                  </p>
                  <p className="text-xs text-navy-300 mt-1 leading-relaxed">
                    Hartford is classifying HVAC damage as cosmetic. Trane bulletin
                    TB-2024-003 directly contradicts this position.
                  </p>
                </div>

                {/* Insight 2 */}
                <div className="p-3 bg-forensic-400/10 border border-forensic-400/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-forensic-300 bg-forensic-500/20 px-1.5 py-0.5 rounded">
                      OPPORTUNITY
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium">
                    Code Upgrade — Roof Ventilation
                  </p>
                  <p className="text-xs text-navy-300 mt-1 leading-relaxed">
                    Could add $35K-$45K to approved scope via required code upgrades.
                  </p>
                </div>

                {/* Insight 3 */}
                <div className="p-3 bg-alert-400/10 border border-alert-400/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-alert-300 bg-alert-500/20 px-1.5 py-0.5 rounded">
                      GAP
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium">
                    Floors 1-7 Not Yet Assessed
                  </p>
                  <p className="text-xs text-navy-300 mt-1 leading-relaxed">
                    Concealed water damage likely in wall cavities and electrical systems.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-navy-700/50">
                <div className="flex items-center gap-2 px-3 py-2 bg-navy-800/60 border border-navy-700/50 rounded-lg">
                  <span className="text-xs text-navy-500">Ask ATOS about this property...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-navy-800/40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Equity?
          </h2>
          <p className="text-lg text-navy-300 mb-8 max-w-2xl mx-auto">
            Join property owners who are transforming storm damage into verified
            equity gains with forensic precision.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all shadow-xl shadow-brand-600/25 text-lg"
          >
            Enter the Platform
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-800/40 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-500" />
            <span className="text-sm text-navy-400">
              Equity Builders &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-navy-500">
            Forensic Property Intelligence Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
